const STORE='flowstate-labs-v1';
let tasks=JSON.parse(localStorage.getItem(STORE)||'[]');
const $=id=>document.getElementById(id);
function save() {
  localStorage.setItem(STORE,JSON.stringify(tasks));
  render()
}
function render() {
  $('total').textContent=tasks.length;
  let done=tasks.filter(t=>t.done).length;
  $('completed').textContent=done;
  $('percent').textContent=tasks.length?Math.round(done/tasks.length*100)+'%':'0%';
  $('remaining').textContent=(tasks.length-done)+' left';
  $('empty').style.display=tasks.length?'none':'block';
  $('tasks').innerHTML=tasks.map(t=>`<div class="task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask('${t.id}')"><div><div class="task-title">${esc(t.title)}</div><div class="task-info">${t.priority.toUpperCase()}${t.due?' · '+t.due:''}</div></div><div class="task-actions"><button onclick="removeTask('${t.id}')" title="Delete">×</button></div></div>`).join('')||''
}
function esc(s) {
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}window.toggleTask=id=>{tasks=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);save()};window.removeTask=id=>{tasks=tasks.filter(t=>t.id!==id);save()};$('form').onsubmit=e=>{e.preventDefault();tasks.unshift({id:Date.now().toString(),title:$('title').value.trim(),priority:$('priority').value,due:$('due').value,done:false});$('title').value='';save()};$('clearDone').onclick=()=>{tasks=tasks.filter(t=>!t.done);save()};render();let seconds=1500,timer=null;function updateClock(){let m=Math.floor(seconds/60),s=seconds%60;$('clock').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('progress').style.width=(1-seconds/1500)*100+'%'}$('start').onclick=()=>{if(timer){clearInterval(timer);timer=null;$('start').textContent='Resume focus';$('timerNote').textContent='Paused.'}else{timer=setInterval(()=>{if(seconds>0){seconds--;updateClock()}else{clearInterval(timer);timer=null;$('start').textContent='Start focus';$('timerNote').textContent='Session complete. Nice work.'}},1000);$('start').textContent='Pause'}};$('resetTimer').onclick=()=>{clearInterval(timer);timer=null;seconds=1500;updateClock();$('start').textContent='Start focus';$('timerNote').textContent='Ready when you are.'};updateClock();
