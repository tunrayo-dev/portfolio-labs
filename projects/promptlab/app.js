const ids=['role','context','task','format'];
const fields=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
const out=document.getElementById('output'),saved=document.getElementById('saved'),note=document.getElementById('note');
const KEY='promptlab-saved-v1';
let versions=JSON.parse(localStorage.getItem(KEY)||'[]');
function makePrompt() {
  let lines=[];
  if(fields.role.value.trim())lines.push('ROLE\n'+fields.role.value.trim());
  if(fields.context.value.trim())lines.push('CONTEXT\n'+fields.context.value.trim());
  if(fields.task.value.trim())lines.push('TASK\n'+fields.task.value.trim());
  if(fields.format.value.trim())lines.push('OUTPUT FORMAT & CONSTRAINTS\n'+fields.format.value.trim());
  return lines.join('\n\n')||'Your structured prompt will appear here as you fill in the fields.'
}
function refresh() {
  out.textContent=makePrompt();
  note.textContent='';
  render()
}
ids.forEach(id=>fields[id].addEventListener('input',refresh));
function render() {
  saved.innerHTML=versions.map((v,i)=>`<div class="saved-card"><div><b>${escapeHtml(v.label||'Untitled version')}</b><br><small>${new Date(v.created).toLocaleDateString()} · ${v.prompt.length} characters</small></div><div class="btnrow"><button class="btn alt" onclick="loadVersion(${i})">Load</button><button class="btn alt" onclick="deleteVersion(${i})">×</button></div></div>`).join('')||'<div class="empty">No saved prompt versions yet.</div>'
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}document.getElementById('save').onclick=()=>{let p=makePrompt();if(p.startsWith('Your structured')){note.textContent='Add some prompt content first.';return}versions.unshift({label:document.getElementById('label').value.trim()||'Untitled version',prompt:p,created:Date.now()});localStorage.setItem(KEY,JSON.stringify(versions));document.getElementById('label').value='';note.textContent='Saved locally.';render()};document.getElementById('clear').onclick=()=>{ids.forEach(id=>fields[id].value='');document.getElementById('label').value='';refresh()};document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(makePrompt());note.textContent='Copied.'}catch{note.textContent='Clipboard permission unavailable.'}};window.loadVersion=i=>{out.textContent=versions[i].prompt;note.textContent='Loaded saved version into preview. Edit fields to build a new one.'};window.deleteVersion=i=>{versions.splice(i,1);localStorage.setItem(KEY,JSON.stringify(versions));render()};refresh();
