/* Portfolio Labs public Supabase client configuration.
   Publishable keys are intended for browser use. Never place a secret/service-role key here. */
(function(){
  'use strict';
  const URL = 'https://rjlfdqlgtqlswhjxnaik.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_N73A02BhdoAMF1f3XvPJOA_nTnLGdju';
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase JS library did not load.');
    return;
  }
  window.portfolioSupabase = window.supabase.createClient(URL, PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
})();