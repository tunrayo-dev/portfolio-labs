/* FlowState multi-device sync.
   Each device owns a separate cloud row. Snapshots merge by record identity;
   deletion tombstones prevent removed tasks/habits from reappearing. */
(function () {
  'use strict';
  const cloud = window.PortfolioCloud;
  const product = 'flowstate';
  const dataKeys = {
    tasks: 'flowstate-labs-v2',
    habits: 'flowstate-routine-habits-v1',
    focus: 'flowstate-focus-log-v1',
    moods: 'flowstate-mood-v1'
  };
  const tombstoneKey = 'flowstate-cloud-tombstones-v1';
  const deviceKey = 'flowstate-cloud-device-v1';
  const status = document.getElementById('storageNote');
  let ready = false, syncing = false, queued = false, timer = null;
  const originalSet = Storage.prototype.setItem;
  const parse = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value == null ? fallback : value; } catch (_) { return fallback; } };
  const clone = value => JSON.parse(JSON.stringify(value));
  const deviceId = (() => {
    let id = localStorage.getItem(deviceKey);
    if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2)); originalSet.call(localStorage, deviceKey, id); }
    return id;
  })();
  const recordKey = 'flowstate-device-' + deviceId;
  const keys = Object.values(dataKeys);
  function snapshot() {
    return { schema: 1, device_id: deviceId, saved_at: new Date().toISOString(),
      tasks: parse(dataKeys.tasks, []), habits: parse(dataKeys.habits, []),
      focus: parse(dataKeys.focus, []), moods: parse(dataKeys.moods, {}),
      tombstones: parse(tombstoneKey, []) };
  }
  function stampChanges(key, oldValue, newValue) {
    if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return newValue;
    const old = new Map(oldValue.filter(x => x && x.id != null).map(x => [String(x.id), JSON.stringify(x)]));
    const nextIds = new Set(newValue.filter(x => x && x.id != null).map(x => String(x.id)));
    const tombstones = new Set(parse(tombstoneKey, []));
    const type = key === dataKeys.tasks ? 'tasks' : key === dataKeys.habits ? 'habits' : '';
    if (type) oldValue.forEach(item => {
      if (item && item.id != null && !nextIds.has(String(item.id))) tombstones.add(type + ':' + item.id);
    });
    const stamped = newValue.map(item => {
      if (!item || item.id == null) return item;
      const prior = old.get(String(item.id));
      if (!prior || prior !== JSON.stringify(item)) return { ...item, updatedAt: new Date().toISOString() };
      return item;
    });
    if (type) originalSet.call(localStorage, tombstoneKey, JSON.stringify([...tombstones]));
    return stamped;
  }
  function mergeSnapshots(list) {
    const tombstones = new Set(list.flatMap(s => Array.isArray(s.tombstones) ? s.tombstones : []));
    const mergeArray = (field, type, identity) => {
      const map = new Map();
      list.forEach(s => (Array.isArray(s[field]) ? s[field] : []).forEach(item => {
        if (!item) return;
        const id = identity(item);
        if (id == null || (type && tombstones.has(type + ':' + id))) return;
        const previous = map.get(String(id));
        const time = Date.parse(item.updatedAt || item.createdAt || 0) || 0;
        const previousTime = previous ? (Date.parse(previous.updatedAt || previous.createdAt || 0) || 0) : -1;
        if (!previous || time >= previousTime) map.set(String(id), item);
      }));
      return [...map.values()];
    };
    const moods = {};
    list.forEach(s => Object.entries(s.moods && typeof s.moods === 'object' ? s.moods : {}).forEach(([day, entry]) => {
      const old = moods[day];
      if (!old || (Date.parse(entry.updatedAt || 0) || 0) >= (Date.parse(old.updatedAt || 0) || 0)) moods[day] = entry;
    }));
    return {
      tasks: mergeArray('tasks', 'tasks', x => x.id),
      habits: mergeArray('habits', 'habits', x => x.id),
      focus: mergeArray('focus', '', x => [x.date, x.hour, x.minutes, x.distractions].join('|')),
      moods, tombstones: [...tombstones]
    };
  }
  function applyMerged(data) {
    originalSet.call(localStorage, dataKeys.tasks, JSON.stringify(data.tasks));
    originalSet.call(localStorage, dataKeys.habits, JSON.stringify(data.habits));
    originalSet.call(localStorage, dataKeys.focus, JSON.stringify(data.focus));
    originalSet.call(localStorage, dataKeys.moods, JSON.stringify(data.moods));
    originalSet.call(localStorage, tombstoneKey, JSON.stringify(data.tombstones));
    location.reload();
  }
  async function sync() {
    if (!cloud || !cloud.available || !cloud.available()) {
      if (status) status.textContent = 'Cloud sync is unavailable. Your data remains saved on this device.';
      return;
    }
    if (syncing) { queued = true; return; }
    syncing = true;
    try {
      const rows = await cloud.loadAll(product);
      const own = rows.find(row => row.record_key === recordKey);
      const local = snapshot();
      const remoteSnapshots = rows.map(row => row.payload).filter(p => p && p.schema === 1);
      const merged = mergeSnapshots([...remoteSnapshots, local]);
      const result = { schema: 1, device_id: deviceId, saved_at: new Date().toISOString(), ...merged };
      await cloud.save(product, recordKey, result);
      const localBefore = JSON.stringify(snapshot());
      const mergedBefore = JSON.stringify({ ...merged, device_id: deviceId, schema: 1, saved_at: local.saved_at });
      const hasRemoteData = remoteSnapshots.length > 0;
      const differs = hasRemoteData && (
        JSON.stringify(local.tasks) !== JSON.stringify(merged.tasks) ||
        JSON.stringify(local.habits) !== JSON.stringify(merged.habits) ||
        JSON.stringify(local.focus) !== JSON.stringify(merged.focus) ||
        JSON.stringify(local.moods) !== JSON.stringify(merged.moods) ||
        JSON.stringify(local.tombstones) !== JSON.stringify(merged.tombstones)
      );
      if (differs) applyMerged(merged);
      if (status) status.textContent = 'Synced securely · ' + new Date().toLocaleTimeString();
    } catch (error) {
      console.error('FlowState cloud sync failed:', error);
      if (status) status.textContent = 'Cloud sync paused: ' + (error.message || 'Please check your connection. Your local data is preserved.');
    } finally {
      syncing = false;
      if (queued) { queued = false; sync(); }
    }
  }
  function schedule() {
    if (!ready) return;
    clearTimeout(timer);
    timer = setTimeout(sync, 900);
  }
  Storage.prototype.setItem = function (key, value) {
    if (keys.includes(String(key)) && ready) {
      try {
        const before = parse(key, Array.isArray(JSON.parse(value)) ? [] : {});
        let next = JSON.parse(value);
        next = stampChanges(String(key), before, next);
        value = JSON.stringify(next);
      } catch (_) {}
    }
    originalSet.call(this, key, value);
    if (keys.includes(String(key))) schedule();
  };
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  window.addEventListener('pagehide', () => { if (ready) sync(); });
  (async () => {
    if (!cloud || !cloud.available || !cloud.available()) {
      if (status) status.textContent = 'Cloud sync is not connected. Your data remains on this device.';
      return;
    }
    try {
      const rows = await cloud.loadAll(product);
      const remote = rows.map(row => row.payload).filter(p => p && p.schema === 1);
      if (remote.length) {
        const merged = mergeSnapshots([...remote, snapshot()]);
        const local = snapshot();
        const changed = JSON.stringify(local.tasks) !== JSON.stringify(merged.tasks) ||
          JSON.stringify(local.habits) !== JSON.stringify(merged.habits) ||
          JSON.stringify(local.focus) !== JSON.stringify(merged.focus) ||
          JSON.stringify(local.moods) !== JSON.stringify(merged.moods) ||
          JSON.stringify(local.tombstones) !== JSON.stringify(merged.tombstones);
        if (changed) {
          originalSet.call(localStorage, dataKeys.tasks, JSON.stringify(merged.tasks));
          originalSet.call(localStorage, dataKeys.habits, JSON.stringify(merged.habits));
          originalSet.call(localStorage, dataKeys.focus, JSON.stringify(merged.focus));
          originalSet.call(localStorage, dataKeys.moods, JSON.stringify(merged.moods));
          originalSet.call(localStorage, tombstoneKey, JSON.stringify(merged.tombstones));
          location.reload();
          return;
        }
      }
      ready = true;
      await sync();
    } catch (error) {
      console.error('FlowState initial sync failed:', error);
      if (status) status.textContent = 'Could not sync yet. Your local data is safe; retry when online.';
    }
  })();
})();
