import { getState, addBookmark, deleteBookmark, addNote, deleteNote } from "../core/state.js";

export const basesModule = {
  render(){
    const state=getState();
    const bases=state.bookmarks.filter(x=>x.type==="Base");
    return `<section class="page">
      <header class="page-header"><p class="page-kicker">Base planner</p><h1 class="page-title">Save the locations worth testing.</h1><p class="page-description">Keep the planner lightweight: location, purpose, resources, and your own notes.</p></header>
      <form id="base-form" class="editor">
        <label>Name<input name="title" placeholder="Ore base" required></label>
        <label>Location and purpose<textarea name="detail" placeholder="Coordinates, nearby resources, transport role…" required></textarea></label>
        <button class="button button-primary">Save base</button>
      </form>
      <div class="cards two">
        ${bases.length?bases.map(base=>baseCard(base,state)).join(""):`<div class="empty">No base locations saved.</div>`}
      </div>
    </section>`;
  },
  mount({refresh}){
    document.querySelector("#base-form")?.addEventListener("submit",event=>{
      event.preventDefault(); const d=new FormData(event.currentTarget);
      addBookmark({id:crypto.randomUUID?.()??String(Date.now()),title:String(d.get("title")).trim(),detail:String(d.get("detail")).trim(),type:"Base"});
      refresh();
    });
    document.querySelectorAll(".base-note-form").forEach(form=>form.addEventListener("submit",event=>{
      event.preventDefault(); const d=new FormData(form);
      addNote({id:crypto.randomUUID?.()??String(Date.now()),title:String(d.get("title")).trim(),body:String(d.get("body")).trim(),region:getState().activeRegion,contextType:"base",contextId:form.dataset.base,createdAt:new Date().toISOString()});
      refresh();
    }));
    document.querySelectorAll("[data-delete-base]").forEach(el=>el.addEventListener("click",()=>{deleteBookmark(el.dataset.deleteBase);refresh()}));
    document.querySelectorAll("[data-delete-note]").forEach(el=>el.addEventListener("click",()=>{deleteNote(el.dataset.deleteNote);refresh()}));
  }
};
function baseCard(base,state){
 const notes=state.notes.filter(n=>n.contextType==="base"&&n.contextId===base.id);
 return `<article class="base-card"><h3>${esc(base.title)}</h3><p>${esc(base.detail)}</p>
 <details><summary>My notes (${notes.length})</summary>
 <form class="editor base-note-form" data-base="${base.id}"><label>Title<input name="title" required></label><label>Details<textarea name="body" required></textarea></label><button class="button button-primary">Save note</button></form>
 <div class="cards">${notes.map(n=>`<article class="note-card"><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><button class="button button-danger" data-delete-note="${n.id}">Delete</button></article>`).join("")}</div>
 </details><button class="button button-danger" data-delete-base="${base.id}">Remove base</button></article>`;
}
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
