const activities=['Intro to Python','Peer workshop','Digital literacy','Project showcase','Community check-in','Robotics practice','Data storytelling','Study group','Design sprint','Wellness session'];
const categories=['Learning','Community','Technology','Wellbeing'];
const data=Array.from( {
  length:72
}
,(_,i)=>( {
  date:new Date(2026, i%6, (i*3)%27+1),category:categories[(i*7+i%3)%4],activity:activities[(i*5+i%2)%10],score:55+((i*13)%46)
}
));
const cat=document.getElementById('category'),month=document.getElementById('month');
function filtered() {
  return data.filter(d=>(cat.value==='all'||d.category===cat.value)&&(month.value==='all'||d.date.toLocaleString('en', {
    month:'short'
  }
  )===month.value))
}
function render() {
  const list=filtered();
  document.getElementById('total').textContent=list.length;
  document.getElementById('avg').textContent=list.length?Math.round(list.reduce((s,d)=>s+d.score,0)/list.length)+'%':'—';
  let count=Object.fromEntries(categories.map(c=>[c,list.filter(d=>d.category===c).length]));
  document.getElementById('top').textContent=list.length?categories.reduce((a,b)=>count[a]>=count[b]?a:b):'—';
  let max=Math.max(1,...Object.values(count));
  document.getElementById('bars').innerHTML=categories.map(c=>`<div class="bar" style="height:${Math.max(4,count[c]/max*100)}%" title="${c}: ${count[c]}"><span>${c.slice(0,3)}</span></div>`).join('');
  let months=['Jan','Feb','Mar','Apr','May','Jun'];
  let mcount=months.map(m=>list.filter(d=>d.date.toLocaleString('en', {
    month:'short'
  }
  )===m).length);
  let mm=Math.max(1,...mcount);
  document.getElementById('trend').innerHTML=mcount.map((n,i)=>`<i style="height:${Math.max(3,n/mm*100)}%" title="${months[i]}: ${n}"></i>`).join('');
  document.getElementById('rows').innerHTML=list.slice(0,18).map(d=>`<tr><td>${d.date.toLocaleDateString('en',{month:'short',day:'2-digit'})}</td><td>${d.category}</td><td>${d.activity}</td><td>${d.score}%</td></tr>`).join('')||'<tr><td colspan="4" class="empty">No records match those filters.</td></tr>'
}
cat.onchange=month.onchange=render;
document.getElementById('reset').onclick=()=> {
  cat.value='all';
  month.value='all';
  render()
}
render();
