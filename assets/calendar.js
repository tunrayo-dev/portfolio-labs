(()=>{'use strict';
const $=id=>document.getElementById(id),client=window.portfolioSupabase;
const state={user:null,events:[],reminders:[],notifications:[],month:new Date(new Date().getFullYear(),new Date().getMonth(),1),selected:new Date(),view:'month'};
const productKeys=new Set(['readwell','studykit','promptlab','flowstate','habittrack','datalens','sellsmart','budgetboard','cvstudio','roboroute']);
const localDate=d=>{const x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const setStatus=(id,msg)=>$(id).textContent=msg;
function localIso(date,time){return new Date(date+'T'+time+':00').toISOString()}
function fmtDate(d,opts={weekday:'short',day:'numeric',month:'short'}){return new Intl.DateTimeFormat('en-GB',{...opts,timeZone:'Africa/Lagos'}).format(new Date(d))}
function fmtTime(d){return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'}).format(new Date(d))}
function dayKey(d){return localDate(new Date(d))}
async function loadAll(){
 const [e,r,n]=await Promise.all([
  client.from('calendar_events').select('*').order('starts_at',{ascending:true}),
  client.from('workspace_reminders').select('*').in('status',['pending','sent']).order('due_at',{ascending:true}),
  client.from('workspace_notifications').select('*').order('created_at',{ascending:false}).limit(100)
 ]);
 for(const x of [e,r,n])if(x.error)throw x.error;
 state.events=e.data||[];state.reminders=r.data||[];state.notifications=n.data||[];
 renderAll();
}
function renderAll(){
 const now=Date.now(),next=now+30*86400000;
 $('eventCount').textContent=state.events.filter(x=>new Date(x.starts_at).getTime()>=now&&new Date(x.starts_at).getTime()<=next).length;
 $('reminderCount').textContent=state.reminders.filter(x=>x.status==='pending').length;
 const unread=state.notifications.filter(x=>!x.read_at).length;
 $('notificationCount').textContent=unread;$('unreadCount').textContent=unread;
 renderCalendar();renderReminders();renderNotifications();
}
function renderCalendar(){
 const y=state.month.getFullYear(),m=state.month.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()),grid=$('calendarGrid');
 $('monthLabel').textContent=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric'}).format(first);
 grid.innerHTML='';grid.classList.toggle('agenda-mode',state.view==='agenda');
 for(let i=0;i<42;i++){
  const d=new Date(start);d.setDate(start.getDate()+i);const key=localDate(d),dayEvents=state.events.filter(e=>dayKey(e.starts_at)===key);
  const b=document.createElement('button');b.type='button';b.className='calendar-day'+(d.getMonth()!==m?' outside':'')+(key===localDate(new Date())?' today':'')+(key===localDate(state.selected)?' selected':'');
  b.setAttribute('aria-label',fmtDate(d,{weekday:'long',day:'numeric',month:'long'})+', '+dayEvents.length+' events');
  b.innerHTML='<span class="day-number">'+d.getDate()+'</span>'+dayEvents.slice(0,2).map(e=>'<span class="day-event '+esc(e.category)+'">'+esc(e.title)+'</span>').join('')+(dayEvents.length>2?'<span class="day-event">+'+(dayEvents.length-2)+' more</span>':'');
  b.addEventListener('click',()=>{state.selected=d;renderCalendar()});grid.append(b);
 }
 if(state.view==='agenda'){grid.innerHTML='';const future=state.events.filter(e=>new Date(e.starts_at)>=new Date(localDate(new Date())+'T00:00:00')).slice(0,30);$('dayEvents').innerHTML=future.length?future.map(eventMarkup).join(''):'<div class="record-empty">No upcoming events yet.</div>';$('selectedDateLabel').textContent='Upcoming events';}
 else{ $('selectedDateLabel').textContent=fmtDate(state.selected,{weekday:'long',day:'numeric',month:'long',year:'numeric'});const dayEvents=state.events.filter(e=>dayKey(e.starts_at)===localDate(state.selected));$('dayEvents').innerHTML=dayEvents.length?dayEvents.map(eventMarkup).join(''):'<div class="record-empty">Nothing scheduled for this day. Add an event above when you are ready.</div>'; }
}
function eventMarkup(e){return '<div class="event-row"><div><strong>'+esc(e.title)+'</strong><p>'+fmtTime(e.starts_at)+(e.ends_at?' – '+fmtTime(e.ends_at):'')+' · '+esc(e.category||'personal')+(e.description?' · '+esc(e.description):'')+'</p></div><div class="event-actions"><button class="small-action" data-delete-event="'+e.id+'" type="button">Delete</button></div></div>'}
function renderReminders(){
 const root=$('reminderList');if(!state.reminders.length){root.innerHTML='<div class="record-empty">No reminders yet. Create one above.</div>';return}
 root.innerHTML=state.reminders.map(r=>'<div class="record-item"><div><strong>'+esc(r.title)+'</strong><p>'+fmtDate(r.due_at,{weekday:'short',day:'numeric',month:'short',year:'numeric'})+' · '+fmtTime(r.due_at)+' · '+esc(r.repeat_rule||'none')+'</p>'+(r.body?'<p>'+esc(r.body)+'</p>':'')+'</div><div class="event-actions">'+(r.status==='pending'?'<button class="small-action" data-complete-reminder="'+r.id+'" type="button">Complete</button>':'<span class="connection-status">Sent</span>')+'<button class="small-action" data-delete-reminder="'+r.id+'" type="button">Delete</button></div></div>').join('');
}
function renderNotifications(){
 const root=$('notificationList');if(!state.notifications.length){root.innerHTML='<div class="record-empty">Your notification inbox is clear.</div>';return}
 root.innerHTML=state.notifications.map(n=>'<div class="record-item '+(!n.read_at?'unread':'')+'"><div><strong>'+esc(n.title)+'</strong><p>'+esc(n.body||'')+' · '+fmtDate(n.created_at,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</p></div><div class="event-actions">'+(!n.read_at?'<button class="small-action" data-read-notification="'+n.id+'" type="button">Mark read</button>':'<span class="connection-status">Read</span>')+'</div></div>').join('');
}
async function createEvent(data){
 const start=localIso(data.date,data.start),end=localIso(data.date,data.end);if(new Date(end)<=new Date(start))throw new Error('The end time must be after the start time.');
 const {data:event,error}=await client.from('calendar_events').insert({owner_id:state.user.id,title:data.title.trim(),description:data.description.trim(),starts_at:start,ends_at:end,timezone:'Africa/Lagos',category:data.category,source_product:'calendar'}).select().single();if(error)throw error;
 const minutes=Number(data.reminder||0);if(minutes){const due=new Date(new Date(start).getTime()-minutes*60000);const {error:re}=await client.from('workspace_reminders').insert({owner_id:state.user.id,event_id:event.id,title:event.title,body:'Upcoming calendar event',due_at:due.toISOString(),timezone:'Africa/Lagos',repeat_rule:'none',status:'pending',source_product:'calendar'});if(re)throw re;}
}
async function createReminder(data){const due=localIso(data.date,data.time);const {error}=await client.from('workspace_reminders').insert({owner_id:state.user.id,title:data.title.trim(),body:data.body.trim(),due_at:due,timezone:'Africa/Lagos',repeat_rule:data.repeat,status:'pending',source_product:'calendar'});if(error)throw error}
function download(name,type,content){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function icsEscape(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function toIcsDate(v){return new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function exportIcs(){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Portfolio Labs//Calendar//EN','CALSCALE:GREGORIAN'];state.events.forEach(e=>lines.push('BEGIN:VEVENT','UID:'+e.id+'@portfolio-labs','DTSTAMP:'+toIcsDate(e.created_at||new Date()),'DTSTART:'+toIcsDate(e.starts_at),'DTEND:'+toIcsDate(e.ends_at||e.starts_at),'SUMMARY:'+icsEscape(e.title),'DESCRIPTION:'+icsEscape(e.description),'END:VEVENT'));lines.push('END:VCALENDAR');download('portfolio-labs-calendar.ics','text/calendar;charset=utf-8',lines.join('\r\n'))}
function parseIcs(text){const unfolded=text.replace(/\r?\n[ \t]/g,'').split(/\r?\n/),items=[];let cur=null;for(const line of unfolded){if(line==='BEGIN:VEVENT')cur={};else if(line==='END:VEVENT'&&cur){if(cur.DTSTART&&cur.SUMMARY)items.push(cur);cur=null}else if(cur){const i=line.indexOf(':');if(i<0)continue;const k=line.slice(0,i).split(';')[0],v=line.slice(i+1);cur[k]=v}}return items}
function parseIcsDate(v){if(/^\d{8}$/.test(v))return new Date(v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6,8)+'T09:00:00').toISOString();if(/^\d{8}T\d{6}Z$/.test(v))return new Date(v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6,8)+'T'+v.slice(9,11)+':'+v.slice(11,13)+':'+v.slice(13,15)+'Z').toISOString();if(/^\d{8}T\d{6}$/.test(v))return new Date(v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6,8)+'T'+v.slice(9,11)+':'+v.slice(11,13)+':'+v.slice(13,15)).toISOString();throw new Error('Unsupported date format in the .ics file.')}
async function importIcs(file){const text=await file.text(),items=parseIcs(text);if(!items.length)throw new Error('No supported events were found in this .ics file.');for(const item of items){const start=parseIcsDate(item.DTSTART),end=item.DTEND?parseIcsDate(item.DTEND):start;const {error}=await client.from('calendar_events').insert({owner_id:state.user.id,title:(item.SUMMARY||'Imported event').replace(/\\,/g,',').replace(/\\n/g,' '),description:(item.DESCRIPTION||'').replace(/\\n/g,' '),starts_at:start,ends_at:end,timezone:'Africa/Lagos',category:'personal',source_product:'calendar'});if(error)throw error}return items.length}
async function boot(){
 if(!client){$('authNotice').hidden=false;return}
 const {data,error}=await client.auth.getUser();if(error||!data.user){$('authNotice').hidden=false;return}
 state.user=data.user;$('app').hidden=false;
 const today=localDate(new Date());$('eventDate').value=today;$('eventForm').elements.date.value=today;$('reminderForm').elements.date.value=today;
 await loadAll();
}
$('eventForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget;const d=Object.fromEntries(new FormData(f));try{setStatus('eventStatus','Saving…');await createEvent(d);f.reset();f.elements.date.value=localDate(new Date());f.elements.start.value='09:00';f.elements.end.value='10:00';f.elements.reminder.value='15';setStatus('eventStatus','Event saved.');await loadAll()}catch(err){setStatus('eventStatus',err.message||'Could not save event.')}});
$('reminderForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget;try{setStatus('reminderStatus','Saving…');await createReminder(Object.fromEntries(new FormData(f)));f.reset();f.elements.date.value=localDate(new Date());f.elements.time.value='09:00';setStatus('reminderStatus','Reminder created.');await loadAll()}catch(err){setStatus('reminderStatus',err.message||'Could not create reminder.')}});
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;try{if(b.dataset.deleteEvent){const {error}=await client.from('calendar_events').delete().eq('id',b.dataset.deleteEvent);if(error)throw error;await loadAll()}if(b.dataset.completeReminder){const {error}=await client.from('workspace_reminders').update({status:'completed'}).eq('id',b.dataset.completeReminder);if(error)throw error;await loadAll()}if(b.dataset.deleteReminder){const {error}=await client.from('workspace_reminders').delete().eq('id',b.dataset.deleteReminder);if(error)throw error;await loadAll()}if(b.dataset.readNotification){const {error}=await client.from('workspace_notifications').update({read_at:new Date().toISOString()}).eq('id',b.dataset.readNotification);if(error)throw error;await loadAll()}}catch(err){setStatus('globalStatus',err.message||'That action could not be completed.')}});
$('markAllRead').addEventListener('click',async()=>{const {error}=await client.from('workspace_notifications').update({read_at:new Date().toISOString()}).is('read_at',null);if(error){setStatus('globalStatus',error.message);return}await loadAll()});
$('prevMonth').onclick=()=>{state.month.setMonth(state.month.getMonth()-1);renderCalendar()};$('nextMonth').onclick=()=>{state.month.setMonth(state.month.getMonth()+1);renderCalendar()};$('todayBtn').onclick=()=>{state.month=new Date(new Date().getFullYear(),new Date().getMonth(),1);state.selected=new Date();renderCalendar()};$('calendarView').onchange=e=>{state.view=e.target.value;renderCalendar()};
$('newEventTop').onclick=()=>{$('eventFormPanel').scrollIntoView({behavior:'smooth'});$('eventForm').elements.title.focus()};
document.querySelectorAll('[data-view]').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===a));const target=$(a.dataset.view+'Panel');if(target)target.scrollIntoView({behavior:'smooth'})}));
$('exportIcs').onclick=exportIcs;$('importIcs').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const count=await importIcs(file);setStatus('globalStatus',count+' event(s) imported.');await loadAll()}catch(err){setStatus('globalStatus',err.message||'Import failed.')}finally{e.target.value=''}});
window.addEventListener('focus',()=>loadAll().catch(()=>{}));boot().catch(err=>{setStatus('globalStatus',err.message||'Could not load your calendar.')});
})();