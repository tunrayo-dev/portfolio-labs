/* Portfolio Labs cloud workspace adapter.
   Uses the user's Supabase session and row-level security. Never add a service-role key here.
   A matching workspace_records table migration must be applied before cloud saves can work. */
(function (root) {
  'use strict';

  const client = root.portfolioSupabase;
  const allowedProducts = new Set([
    'readwell', 'studykit', 'promptlab', 'flowstate', 'habittrack',
    'datalens', 'sellsmart', 'budgetboard', 'cvstudio', 'roboroute'
  ]);
  const table = 'workspace_records';

  function validate(product, recordKey) {
    if (!allowedProducts.has(product)) throw new Error('Unknown Portfolio Labs product.');
    if (typeof recordKey !== 'string' || !recordKey.trim() || recordKey.length > 120) {
      throw new Error('A valid workspace record key is required.');
    }
  }

  async function getUser() {
    if (!client) throw new Error('Supabase is not available. Check your connection.');
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    if (!data.user) throw new Error('Sign in to sync this workspace.');
    return data.user;
  }

  async function load(product, recordKey) {
    validate(product, recordKey);
    const user = await getUser();
    const { data, error } = await client.from(table)
      .select('payload, updated_at')
      .eq('owner_id', user.id)
      .eq('product_key', product)
      .eq('record_key', recordKey)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }

  async function save(product, recordKey, payload) {
    validate(product, recordKey);
    const user = await getUser();
    const { data, error } = await client.from(table).upsert({
      owner_id: user.id,
      product_key: product,
      record_key: recordKey,
      payload,
      updated_at: new Date().toISOString()
    }, { onConflict: 'owner_id,product_key,record_key' })
      .select('updated_at')
      .single();
    if (error) throw error;
    return data;
  }

  async function remove(product, recordKey) {
    validate(product, recordKey);
    const user = await getUser();
    const { error } = await client.from(table).delete()
      .eq('owner_id', user.id)
      .eq('product_key', product)
      .eq('record_key', recordKey);
    if (error) throw error;
  }

  root.PortfolioCloud = Object.freeze({
    available: () => !!client,
    load,
    save,
    remove
  });
})(window);
