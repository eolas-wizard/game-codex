import { getState, addNote, deleteNote } from "../core/state.js";

let pals=[];

export const paldexModule = {
  async render() {
    if(!pals.length){
      try{ pals=await fetch("./data/games/palworld/pals.json").then(r=>r.json()); }catch{ pals=[]; }
    }
    return shell("");
  },
  async mount({refresh}) {
    if(!pals.length){
      try{ pals=await fetch("./data/games/palworld/pals.json").then(r=>r.json()); }catch{}
      document.querySelector("#app").innerHTML=shell("");
    }
    bind(refresh);
  }
};

function shell(query){
  const state=getState();
  const filtered=pals.filter(p=>`${p.name} ${p.type} ${p.where} ${p.use}`.toLowerCase().includes(query.toLowerCase()));
  return `<section class="page">
    <header class="page-header">
      <p class="page-kicker">Paldex</p>
      <h1 class="page-title">Find the Pal you need.</h1>
      <p class="page-description">A small prototype dataset, built for quick lookups and personal notes.</p>
    </header>
    <label class="panel">Search<input id="pal-search" value="${esc(query)}" placeholder="Name, type, location, use"></label>
    <div class="cards two" id="pal-results">
      ${filtered.map(p=>palCard(p,state)).join("") || `<div class="empty">No matching Pal.</div>`}
    </div>
  </section>`;
}

function palCard(p,state){
  const notes=state.notes.filter(n=>n.contextType==="pal"&&n.contextId===p.id);
  return `<article class="record-card">
    <div class="section-heading"><h3>#${p.number} ${p.name}</h3><span class="badge">${p.type}</span></div>
    <p><strong>Where:</strong> ${p.where}</p>
    <p><strong>Useful for:</strong> ${p.use}</p>
    <p><strong>Drops:</strong> ${p.drops}</p>
    <details>
      <summary>My notes (${notes.length})</summary>
      <form class="editor pal-note-form" data-pal="${p.id}">
        <label>Note<input name="title" placeholder="Capture target, breeding idea…" required></label>
        <label>Details<textarea name="body" required></textarea></label>
        <button class="button button-primary">Save note</button>
      </form>
      <div class="cards">${notes.map(n=>`<article class="note-card"><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><button class="button button-danger" data-delete-note="${n.id}">Delete</button></article>`).join("")}</div>
    </details>
  </article>`;
}

function bind(refresh){
  document.querySelector("#pal-search")?.addEventListener("input",event=>{
    document.querySelector("#app").innerHTML=shell(event.target.value);
    bind(refresh);
    document.querySelector("#pal-search")?.focus();
  });
  document.querySelectorAll(".pal-note-form").forEach(form=>form.addEventListener("submit",event=>{
    event.preventDefault();
    const data=new FormData(form);
    const id=form.dataset.pal;
    addNote({
      id:crypto.randomUUID?.()??String(Date.now()),
      title:String(data.get("title")).trim(),
      body:String(data.get("body")).trim(),
      region:getState().activeRegion,contextType:"pal",contextId:id,createdAt:new Date().toISOString()
    });
    refresh();
  }));
  document.querySelectorAll("[data-delete-note]").forEach(el=>el.addEventListener("click",()=>{deleteNote(el.dataset.deleteNote);refresh()}));
}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
