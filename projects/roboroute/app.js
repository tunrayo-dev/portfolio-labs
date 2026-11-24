const R=14,C=14,S= {
  r:0,c:0
}
,G= {
  r:13,c:13
}
let walls=new Set(),path=new Set(),visited=new Set();
const board=document.getElementById('board'),id=(r,c)=>r*C+c,key=(r,c)=>`${r},${c}`;
function draw() {
  board.innerHTML='';
  for(let r=0;r<R;r++)for(let c=0;c<C;c++) {
    let k=key(r,c),el=document.createElement('button');
    el.className='cell';
    el.setAttribute('aria-label',`row ${r+1}, column ${c+1}`);
    el.title=`${r+1}, ${c+1}`;
    if(r===S.r&&c===S.c)el.classList.add('start');
    else if(r===G.r&&c===G.c)el.classList.add('end');
    else if(walls.has(k))el.classList.add('wall');
    else if(path.has(k))el.classList.add('path');
    else if(visited.has(k))el.classList.add('visited');
    el.onclick=()=> {
      if((r===S.r&&c===S.c)||(r===G.r&&c===G.c))return;
      walls.has(k)?walls.delete(k):walls.add(k);
      path.clear();
      visited.clear();
      document.getElementById('length').textContent='—';
      document.getElementById('visited').textContent='—';
      document.getElementById('status').textContent='Board changed. Find a new route.';
      draw()
    }
    board.appendChild(el)
  }
}
function bfs() {
  let q=[[S.r,S.c]],prev=new Map(),seen=new Set([key(S.r,S.c)]),dirs=[[1,0],[-1,0],[0,1],[0,-1]],target=key(G.r,G.c);
  while(q.length) {
    let [r,c]=q.shift(),k=key(r,c);
    if(k===target)break;
    for(let [dr,dc] of dirs) {
      let nr=r+dr,nc=c+dc,nk=key(nr,nc);
      if(nr<0||nc<0||nr>=R||nc>=C||walls.has(nk)||seen.has(nk))continue;
      seen.add(nk);
      prev.set(nk,k);
      q.push([nr,nc])
    }
  }
  visited=seen;
  if(!seen.has(target)) {
    path.clear();
    return false
  }
  path=new Set();
  let cur=target;
  while(cur!==key(S.r,S.c)) {
    path.add(cur);
    cur=prev.get(cur)
  }
  return true
}
document.getElementById('solve').onclick=()=> {
  let found=bfs();
  draw();
  document.getElementById('length').textContent=found?path.size:'0';
  document.getElementById('visited').textContent=visited.size;
  document.getElementById('status').textContent=found?'Route found! The highlighted path is a shortest route.':'No route available. Try removing a few obstacles.'
}
document.getElementById('random').onclick=()=> {
  walls.clear();
  path.clear();
  visited.clear();
  for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(!(r===0&&c===0)&&!(r===13&&c===13)&&Math.random()<.19)walls.add(key(r,c));
  draw();
  document.getElementById('length').textContent='—';
  document.getElementById('visited').textContent='—';
  document.getElementById('status').textContent='Random obstacles added.'
}
document.getElementById('clear').onclick=()=> {
  walls.clear();
  path.clear();
  visited.clear();
  draw();
  document.getElementById('length').textContent='—';
  document.getElementById('visited').textContent='—';
  document.getElementById('status').textContent='Board cleared.'
}
draw();
