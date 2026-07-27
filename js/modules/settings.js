import { REGIONS } from "../core/regions.js";
import { getState,setMode,setActiveRegion } from "../core/state.js";

export const settingsModule={
 render(){
  const s=getState();
  return `<section class="page"><header class="page-header"><p class="page-kicker">Settings</p><h1 class="page-title">Keep it simple.</h1></header>
  <div class="cards">
   <article class="panel"><h2>Reading mode</h2><div class="toolbar">
    <button class="button ${s.mode==="dark"?"button-primary":""}" data-mode="dark">Dark</button>
    <button class="button ${s.mode==="light"?"button-primary":""}" data-mode="light">Light</button>
   </div></article>
   <article class="panel"><h2>Regional theme</h2><select id="region-select">${REGIONS.map(r=>`<option value="${r.id}" ${r.id===s.activeRegion?"selected":""}>${r.name}</option>`).join("")}</select></article>
   <div class="notice">Theme changes apply immediately and are saved on this device.</div>
  </div></section>`;
 },
 mount({refresh}){
  document.querySelectorAll("[data-mode]").forEach(el=>el.addEventListener("click",()=>{
   setMode(el.dataset.mode);document.documentElement.dataset.mode=el.dataset.mode;refresh();
  }));
  document.querySelector("#region-select")?.addEventListener("change",event=>{
   setActiveRegion(event.target.value);document.documentElement.dataset.region=event.target.value;refresh();
  });
 }
};
