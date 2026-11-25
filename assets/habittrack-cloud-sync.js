/* HabitTrack cloud sync with per-device records and merged check-in dates. */
(function(){
'use strict';
const cloud=window.PortfolioCloud, product='habittrack', key='pl.habits.v1', tombKey='pl.habits.cloud.deleted.v1', devKey='pl.habits.cloud.device.v1';
const status=document.getElementById('status');
const originalSet=Storage.prototype.setItem;
let ready=false,active=false,pending=false,tm;
const parse=(k,d)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x==null?d:x}catch{return d}};
let device=localStorage.getItem(devKey);
if(!device){device=crypto.randomUUID?crypto.randomUUID():'dev-'+Date.now();originalSet.call(localStorage,devKey,device)}
const rec='habittrack-device-'+device;
function snapshot(){return {schema:1,device,updatedAt:new Date().toISOString(),habits:parse(key,[]),deleted:parse(tombKey,[])}}
function merge(rows){
 const deleted=new Set(rows.flatMap(x=>Array.isArray(x.deleted)?x.deleted:[])), map=new Map();
 rows.forEach(x=>(Array.isArray(x.habits)?x.habits:[]).forEach(h=>{
  if(!h||h.id==null||deleted.has(String(h.id)))return;
  const prev=map.get(String(h.id));
  const mergedDays=[...new Set([...(h.days||[]),...(prev?.days||[])])];
  const newer=!prev||(Date.parse(h.updatedAt||0)||0)>=(Date.parse(prev.updatedAt||0)||0);
  map.set(String(h.id),{...(newer?h:prev),days:mergedDays});
 }));
 return {habits:[...map.values()],deleted:[...deleted]};
}
function schedule(){if(!ready)return;clearTimeout(tm);tm=setTimeout(sync,1000)}
async function sync(){
 if(!cloud?.available?.()){if(status)status.textContent='Saved locally. Cloud sync is unavailable.';return}
 if(active){pending=true;return}active=true;
 try{
  const rows=await cloud.loadAll(product), remote=rows.map(x=>x.payload).filter(x=>x?.schema===1);
  const local=snapshot(),merged=merge([...remote,local]);
  const changed=JSON.stringify(local.habits)!==JSON.stringify(merged.habits)||JSON.stringify(local.deleted)!==JSON.stringify(merged.deleted);
  const payload={schema:1,device,updatedAt:new Date().toISOString(),...merged};
  await cloud.save(product,rec,payload);
  if(remote.length&&changed){originalSet.call(localStorage,key,JSON.stringify(merged.habits));originalSet.call(localStorage,tombKey,JSON.stringify(merged.deleted));location.reload();return}
  if(status)status.textContent='Cloud sync active · '+new Date().toLocaleTimeString();
 }catch(e){if(status)status.textContent='Sync paused; local data is preserved. '+(e.message||'')}
 finally{active=false;if(pending){pending=false;sync()}}
}
Storage.prototype.setItem=function(k,v){
 if(String(k)===key&&ready){
  try{const old=parse(key,[]),next=JSON.parse(v),ids=new Set(next.map(h=>String(h.id))),del=new Set(parse(tombKey,[]));
   old.forEach(h=>{if(h.id!=null&&!ids.has(String(h.id)))del.add(String(h.id)});
   next.forEach(h=>{const oldh=old.find(x=>String(x.id)===String(h.id));if(!oldh||JSON.stringify(oldh)!==JSON.stringify(h))h.updatedAt=new Date().toISOString()});
   originalSet.call(localStorage,tombKey,JSON.stringify([...del]));v=JSON.stringify(next)
  }catch{}
 }
 originalSet.call(this,k,v);if(String(k)===key)schedule()
};
window.addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
(async()=>{if(!cloud?.available?.())return;try{const rows=await cloud.loadAll(product),remote=rows.map(x=>x.payload).filter(x=>x?.schema===1);
 if(remote.length){const m=merge([...remote,snapshot()]),local=parse(key,[]);if(JSON.stringify(local)!==JSON.stringify(m.habits)){originalSet.call(localStorage,key,JSON.stringify(m.habits));originalSet.call(localStorage,tombKey,JSON.stringify(m.deleted));location.reload();return}}
 ready=true;await sync()
 }catch(e){if(status)status.textContent='Cloud sync not available yet; local data remains safe.'}})();
})();