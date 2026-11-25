/* RoboRoute traffic-aware directions. Mapbox public token is intentionally browser-visible; restrict it by allowed URL and minimum scopes. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const map = window.roboRouteMap;
  const lookup = window.roboRouteLookup;
  const token = document.querySelector('meta[name="mapbox-public-token"]')?.content?.trim();
  const results = $('roboJourneyResults');
  const status = $('routeStatus');
  const searchButton = $('routeSearch');
  const clearButton = $('routeClear');
  if (!map || !lookup || !results || !searchButton) return;

  let routeLayers = [];
  let markers = [];
  let selected = 0;
  let routeData = [];

  const formatDuration = seconds => {
    const mins = Math.max(1, Math.round(seconds / 60));
    return mins >= 60 ? Math.floor(mins / 60) + ' hr ' + (mins % 60) + ' min' : mins + ' min';
  };
  const arrivalTime = seconds => new Date(Date.now() + seconds * 1000).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  const congestionSummary = annotations => {
    const values = (annotations || []).filter(Boolean);
    if (!values.length) return {label:'Traffic data unavailable', level:'unknown'};
    const counts = values.reduce((a,v) => (a[v]=(a[v]||0)+1,a), {});
    const total = values.length;
    const severe = (counts.severe||0) + (counts.heavy||0);
    const moderate = counts.moderate||0;
    const ratio = severe / total;
    if (ratio >= .35) return {label:'Heavy congestion',level:'heavy'};
    if ((moderate + severe) / total >= .35) return {label:'Moderate congestion',level:'moderate'};
    return {label:'Mostly flowing',level:'low'};
  };
  const colour = value => ({low:'#16a36a',moderate:'#e4a11b',heavy:'#d94841',severe:'#a51f2b'}[value] || '#718096');
  const clearLayers = () => {
    routeLayers.forEach(layer => map.removeLayer(layer));
    markers.forEach(marker => map.removeLayer(marker));
    routeLayers = []; markers = [];
  };
  const drawRoute = (route, index, active) => {
    const coords = route.geometry?.coordinates || [];
    const congestion = route.legs?.flatMap(leg => leg.annotation?.congestion || []) || [];
    const group = L.layerGroup();
    if (coords.length > 1) {
      for (let i=0; i<coords.length-1; i++) {
        const c = congestion[i] || 'unknown';
        L.polyline([[coords[i][1],coords[i][0]],[coords[i+1][1],coords[i+1][0]]], {
          color: colour(c), weight: active ? 7 : 5, opacity: active ? .95 : .55
        }).addTo(group);
      }
    }
    group.addTo(map);
    routeLayers[index] = group;
  };
  const renderDirections = route => {
    const steps = route.legs?.flatMap(leg => leg.steps || []) || [];
    const items = steps.filter(step => step.distance > 0).slice(0,40);
    const wrap = document.createElement('div');
    const heading = document.createElement('h4'); heading.textContent = 'Directions'; wrap.append(heading);
    if (!items.length) {
      const p=document.createElement('p');p.className='muted';p.textContent='No turn-by-turn steps were returned.';wrap.append(p);
    }
    items.forEach((step,i) => {
      const row=document.createElement('div');row.className='tool-item';
      const title=document.createElement('b');
      title.textContent=(i+1)+'. '+(step.maneuver?.instruction || step.name || 'Continue');
      const detail=document.createElement('small');
      detail.textContent=(step.name || 'Unnamed road')+' · '+(step.distance>=1000?(step.distance/1000).toFixed(1)+' km':Math.round(step.distance)+' m')+' · '+formatDuration(step.duration);
      row.append(title,detail);wrap.append(row);
    });
    results.append(wrap);
  };
  const selectRoute = index => {
    selected=index;
    routeLayers.forEach((layer,i)=>{ if(layer) map.removeLayer(layer); });
    routeLayers=[];
    routeData.forEach((route,i)=>drawRoute(route,i,i===index));
    const route=routeData[index];
    if(route) renderDirections(route);
    const cards=results.querySelectorAll('[data-route-index]');
    cards.forEach((card,i)=>{card.style.borderColor=i===index?'#315f82':'#d9e1e7';card.setAttribute('aria-pressed',String(i===index));});
  };
  const buildCards = () => {
    results.replaceChildren();
    const heading=document.createElement('h3');heading.textContent='Journey options';results.append(heading);
    const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px';
    routeData.forEach((route,i)=>{
      const traffic=congestionSummary(route.legs?.flatMap(leg=>leg.annotation?.congestion||[])||[]);
      const card=document.createElement('button');card.type='button';card.dataset.routeIndex=String(i);card.setAttribute('aria-pressed',String(i===selected));
      card.style.cssText='text-align:left;background:var(--panel,#fff);border:2px solid '+(i===selected?'#315f82':'#d9e1e7')+';border-radius:10px;padding:13px;cursor:pointer;color:inherit';
      const name=document.createElement('b');name.textContent=i===0?'Recommended route':'Alternative '+i;
      const time=document.createElement('div');time.style.cssText='font-size:25px;font-weight:700;margin:7px 0';time.textContent=formatDuration(route.duration);
      const meta=document.createElement('div');meta.textContent=(route.distance/1000).toFixed(1)+' km · Arrive '+arrivalTime(route.duration);
      const trafficLine=document.createElement('div');trafficLine.style.cssText='margin-top:7px;font-weight:600;color:'+colour(traffic.level);trafficLine.textContent=traffic.label;
      card.append(name,time,meta,trafficLine);card.addEventListener('click',()=>selectRoute(i));grid.append(card);
    });
    results.append(grid);
    const note=document.createElement('p');note.className='muted';note.style.marginTop='10px';note.textContent='Traffic-aware estimates use recent observations where available and typical historical conditions elsewhere. Times are estimates, not guarantees.';results.append(note);
    renderDirections(routeData[selected]);
  };
  const runSearch = async () => {
    const from=$('routeFrom').value.trim(),to=$('routeTo').value.trim();
    if(!from||!to){status.textContent='Enter both a starting point and destination.';return;}
    if(!token){status.textContent='Mapbox is not configured yet. Add a restricted Mapbox public token to the mapbox-public-token setting before using traffic routing.';return;}
    searchButton.disabled=true;status.textContent='Finding places and checking traffic-aware routes…';
    results.replaceChildren();clearLayers();
    try {
      const [a,b]=await Promise.all([lookup(from),lookup(to)]);
      const url='https://api.mapbox.com/directions/v5/mapbox/driving-traffic/'+a.lon+','+a.lat+';'+b.lon+','+b.lat+
        '?alternatives=true&steps=true&geometries=geojson&overview=full&annotations=congestion,duration,distance&language=en&access_token='+encodeURIComponent(token);
      const response=await fetch(url);
      const data=await response.json();
      if(!response.ok||data.code!=='Ok'||!data.routes?.length)throw new Error(data.message||'No traffic-aware route was returned.');
      routeData=data.routes;selected=0;
      markers=[L.marker([a.lat,a.lon]).addTo(map).bindPopup('Start: '+a.label),L.marker([b.lat,b.lon]).addTo(map).bindPopup('Destination: '+b.label)];
      routeData.forEach((route,i)=>drawRoute(route,i,i===0));
      const bounds=L.featureGroup(routeLayers).getBounds();
      if(bounds.isValid())map.fitBounds(bounds,{padding:[30,30]});
      buildCards();
      const traffic=congestionSummary(routeData[0].legs?.flatMap(leg=>leg.annotation?.congestion||[])||[]);
      status.textContent='Traffic-aware route found · '+traffic.label+'. Updated '+new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+'.';
      const label=$('roboTrafficStatus');if(label)label.textContent='Traffic-aware routing connected · estimates may use typical traffic where live observations are unavailable';
    } catch(error) {
      status.textContent=(error.message||'Route search failed.')+' Check the place names and try again.';
      routeData=[];
    } finally {searchButton.disabled=false;}
  };
  searchButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();runSearch();},true);
  clearButton?.addEventListener('click',event=>{
    event.preventDefault();event.stopImmediatePropagation();clearLayers();routeData=[];results.replaceChildren();
    const h=document.createElement('h3');h.textContent='Journey options';const p=document.createElement('p');p.className='muted';p.textContent='Choose your start and destination to compare traffic-aware routes.';results.append(h,p);
    status.textContent='Route cleared. The map remains centred on Nigeria.';
  },true);
  const initialLabel=$('roboTrafficStatus');if(initialLabel)initialLabel.textContent='Traffic-aware routing: awaiting Mapbox configuration';
})();
