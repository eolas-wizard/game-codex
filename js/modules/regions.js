import { REGIONS, getRegion } from "../core/regions.js";
import { getState, setActiveRegion, addNote, deleteNote, toggleCompleted } from "../core/state.js";

const GUIDE = {
  "windswept-hills": {
    summary:"Starter region for early captures, basic materials, and first base decisions.",
    tasks:["Activate nearby fast travel","Mark an ore route","Capture an early mount","Choose a starter base location"],
    resources:["Wood","Stone","Paldium fragments","Ore"],
    encounters:["Lamball","Cattiva","Chikipi","Foxparks","Lifmunk","Pengullet"]
  },
  "bamboo-groves": {
    summary:"Use this page to track your route, local materials, and Pal targets.",
    tasks:["Scout the region","Mark fast travel","Record a resource loop","Save a Pal target"],
    resources:["Wood","Stone","Ore"],
    encounters:["Add your own targets in notes"]
  }
};

export const regionsModule = {
  render() {
    const state=getState();
    const region=getRegion(state.activeRegion);
    const guide=GUIDE[region.id] || {
      summary:"Prototype region page. Use contextual notes and checklist while exploring.",
      tasks:["Scout the region","Mark fast travel","Record a resource loop","Save a Pal target"],
      resources:["Add resource notes"],
      encounters:["Add encounter notes"]
    };
    const notes=state.notes.filter(n=>n.contextType==="region" && n.contextId===region.id);

    return `<section class="page">
      <header class="page-header">
        <p class="page-kicker">Region guide</p>
        <h1 class="page-title">${region.name}</h1>
        <p class="page-description">${guide.summary}</p>
      </header>

      <div class="split">
        <section class="section">
          <div class="section-heading"><h2>Choose region</h2></div>
          <div class="compact-list">
            ${REGIONS.map(r=>`<button class="list-button" type="button" data-region="${r.id}" aria-pressed="${r.id===region.id}">
              <span><strong>${r.name}</strong><small>${r.description}</small></span><span>${r.mark}</span>
            </button>`).join("")}
          </div>
        </section>

        <section class="section">
          <div class="section-heading"><h2>Exploration checklist</h2><small>Saved locally</small></div>
          <div class="checklist">
            ${guide.tasks.map((task,i)=>{
              const id=`region:${region.id}:${i}`;
              return `<label class="check-row"><input type="checkbox" data-check="${id}" ${state.completed[id]?"checked":""}><span>${task}</span></label>`
            }).join("")}
          </div>

          <div class="panel">
            <strong>Resources</strong>
            <div class="tag-row">${guide.resources.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
          </div>
          <div class="panel">
            <strong>Pal targets</strong>
            <div class="tag-row">${guide.encounters.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
          </div>
        </section>
      </div>

      <section class="section">
        <div class="section-heading"><h2>${region.name} notes</h2><small>${notes.length}</small></div>
        <form id="region-note-form" class="editor">
          <label>Title<input name="title" maxlength="80" placeholder="Ore cluster west of…" required></label>
          <label>Details<textarea name="body" maxlength="500" required></textarea></label>
          <button class="button button-primary">Save region note</button>
        </form>
        <div class="cards two">${notes.length?notes.map(noteCard).join(""):`<div class="empty">No notes for this region yet.</div>`}</div>
      </section>
    </section>`;
  },
  mount({refresh}) {
    document.querySelectorAll("[data-region]").forEach(el=>el.addEventListener("click",()=>{
      setActiveRegion(el.dataset.region);
      document.documentElement.dataset.region=el.dataset.region;
      refresh();
    }));
    document.querySelectorAll("[data-check]").forEach(el=>el.addEventListener("change",()=>toggleCompleted(el.dataset.check)));
    document.querySelector("#region-note-form")?.addEventListener("submit",event=>{
      event.preventDefault();
      const data=new FormData(event.currentTarget);
      const region=getState().activeRegion;
      addNote({
        id:crypto.randomUUID?.()??String(Date.now()),
        title:String(data.get("title")).trim(),
        body:String(data.get("body")).trim(),
        region,contextType:"region",contextId:region,createdAt:new Date().toISOString()
      });
      refresh();
    });
    document.querySelectorAll("[data-delete-note]").forEach(el=>el.addEventListener("click",()=>{deleteNote(el.dataset.deleteNote);refresh()}));
  }
};
function noteCard(n){return `<article class="note-card"><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><div class="toolbar"><button class="button button-danger" data-delete-note="${n.id}">Delete</button></div></article>`}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
