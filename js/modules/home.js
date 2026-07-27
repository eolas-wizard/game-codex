import { getState, addNote, deleteNote } from "../core/state.js";
import { getRegion } from "../core/regions.js";

export const homeModule = {
  render() {
    const state = getState();
    const region = getRegion(state.activeRegion);
    const recent = state.notes.slice(0,4);
    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">${region.name}</p>
          <h1 class="page-title">What are you doing next?</h1>
          <p class="page-description">Open the part of the companion you need and get back to the game.</p>
        </header>

        <div class="quick-grid">
          ${quick("regions","Region guide","Routes, bosses, resources")}
          ${quick("paldex","Find a Pal","Search starter records")}
          ${quick("bases","Plan a base","Save locations and purpose")}
          ${quick("settings","Change theme","Mode and region")}
        </div>

        <div class="split">
          <section class="section">
            <div class="section-heading"><h2>Quick note</h2><small>Available everywhere</small></div>
            <form id="note-form" class="editor">
              <label>Title<input name="title" maxlength="80" placeholder="What should I remember?" required></label>
              <label>Details<textarea name="body" maxlength="500" placeholder="Location, route, capture plan, material count…" required></textarea></label>
              <button class="button button-primary" type="submit">Save note</button>
            </form>
          </section>

          <section class="section">
            <div class="section-heading"><h2>Recent notes</h2><small>${state.notes.length}</small></div>
            <div class="cards">
              ${recent.length ? recent.map(noteCard).join("") : `<div class="empty">No notes yet.</div>`}
            </div>
          </section>
        </div>
      </section>
    `;
  },
  mount({navigate,refresh}) {
    document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click",()=>navigate(el.dataset.go)));
    document.querySelector("#note-form")?.addEventListener("submit",event=>{
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      addNote({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title:String(data.get("title")).trim(),
        body:String(data.get("body")).trim(),
        region:getState().activeRegion,
        contextType:"general",
        contextId:"general",
        createdAt:new Date().toISOString()
      });
      refresh();
    });
    document.querySelectorAll("[data-delete-note]").forEach(el=>el.addEventListener("click",()=>{
      deleteNote(el.dataset.deleteNote); refresh();
    }));
  }
};
function quick(route,title,detail){return `<button class="quick-link" type="button" data-go="${route}"><strong>${title}</strong><span>${detail}</span></button>`}
function noteCard(note){
  return `<article class="note-card"><h3>${esc(note.title)}</h3><p>${esc(note.body)}</p><div class="meta-row"><span class="tag">${getRegion(note.region).name}</span></div><div class="toolbar"><button class="button button-danger" data-delete-note="${note.id}">Delete</button></div></article>`;
}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
