(function(){
  'use strict';
  function addAccountLink(){
    if(document.querySelector('[data-pl-account-link]')) return;
    const anchor=document.createElement('a');
    anchor.href=(document.body.dataset.accountPath || (location.pathname.includes('/projects/') ? '../../account.html' : 'account.html'));
    anchor.textContent='Account ↗';
    anchor.setAttribute('data-pl-account-link','');
    anchor.style.cssText='display:inline-flex;align-items:center;justify-content:center;margin-left:10px;padding:9px 13px;border:1px solid currentColor;border-radius:9px;color:inherit;text-decoration:none;font:600 12px system-ui;white-space:nowrap;position:relative;z-index:35';
    const host=document.querySelector('.ps-bottom, .appbar, .top, header');
    if(host) host.append(anchor);
    else {anchor.style.position='fixed';anchor.style.right='16px';anchor.style.top='16px';anchor.style.background='#fff';anchor.style.color='#17212b';document.body.append(anchor);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addAccountLink);
  else addAccountLink();
})();