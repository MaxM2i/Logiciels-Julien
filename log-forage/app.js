
const U=AppUtils, KEY='julien_log_forage_v2', LIBKEY='julien_log_forage_library_v1';
const defaults={
 project:{name:'',site:'',address:'',company:'',service:'',start:'',end:'',logo:'',work:'',diameter:'',depth:'',water:'',cap:'',soil:'',curb:'Non',curbThickness:'',driller:'',technique:''},
 lithology:[],
 tubage:[],
 complements:[],
 development:{before:'',during:'',after:'',flow:'',duration:'',comments:''},
 admin:{lithologies:['Sable','Argile','Limon','Grave','Calcaire','Craie','Marne'],equipment:['Tube plein','Crépine','Bouchon'],complements:['Cimentation','Massif filtrant','Bouchon d’argile','Protection de tête']}
};
let state=normalize(U.load(KEY,JSON.parse(JSON.stringify(defaults)))), view='dashboard';
let projectLibrary=U.load(LIBKEY,[]);if(!Array.isArray(projectLibrary))projectLibrary=[];

function normalize(s){
 s=s&&typeof s==='object'?s:JSON.parse(JSON.stringify(defaults));
 s.project={...defaults.project,...(s.project||{})};
 s.lithology=Array.isArray(s.lithology)?s.lithology:[];
 s.tubage=Array.isArray(s.tubage)?s.tubage:[];
 s.complements=Array.isArray(s.complements)?s.complements:[];
 s.development={...defaults.development,...(s.development||{})};
 s.admin={...defaults.admin,...(s.admin||{})};
 for(const k of ['lithologies','equipment','complements']) if(!Array.isArray(s.admin[k])||!s.admin[k].length) s.admin[k]=[...defaults.admin[k]];
 return s;
}
function save(){U.save(KEY,state)}
function render(){
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 const pages={dashboard,projet,lithology,tubage,developpement,synthese,fiche,admin};
 const page=pages[view]||dashboard;
 const root=document.querySelector('#app');
 if(root) root.innerHTML=page();
 bind();
}
function setView(v){view=v;render()}
function shell(title,sub,body,actions=''){return `<div class="topbar"><div class="title"><h1>${title}</h1><p>${sub}</p></div><div class="actions">${actions}</div></div>${body}`}
function field(label,key,val,type='text',extra=''){return `<div class="field"><label>${label}</label><input type="${type}" data-field="${key}" value="${U.esc(val)}" ${extra}></div>`}

function dashboard(){
 const p=state.project;
 const libraryCards=projectLibrary.slice().reverse().map((x,i)=>`<div class="card project-tile"><div class="project-thumb">${x.project?.logo?`<img src="${U.esc(x.project.logo)}" alt="Logo">`:'🪨'}</div><div class="project-info"><b>${U.esc(x.project?.name||'Projet sans nom')}</b><p>${U.esc(x.project?.site||'Site non renseigné')}</p><small>${U.esc(x.updated||'—')} · ${(x.lithology||[]).length} couche(s)</small></div><div class="actions"><button class="btn primary small" data-open-library="${i}">Ouvrir</button><button class="btn danger small" data-delete-library="${i}">Supprimer</button></div></div>`).join('');
 return shell('Log de forage','Création et édition d’une coupe de forage / sondage',`<div class="kpis"><div class="kpi"><strong>${state.lithology.length}</strong><span>couches lithologiques</span></div><div class="kpi"><strong>${state.tubage.length}</strong><span>éléments de tubage</span></div><div class="kpi"><strong>${U.esc(p.depth||'—')}</strong><span>profondeur finale</span></div><div class="kpi"><strong>${projectLibrary.length}</strong><span>projets enregistrés</span></div></div><div class="grid grid-2" style="margin-top:18px"><div class="card"><h2>Projet courant</h2><div class="project-hero">${p.logo?`<img src="${U.esc(p.logo)}" alt="Logo entreprise">`:'🪨'}<div><b>${U.esc(p.name||'Aucun projet courant')}</b><p>${U.esc(p.site||'Site non renseigné')}</p><small>${U.esc(p.work||'Travaux non renseignés')}</small></div></div><div class="actions"><button class="btn primary" data-action="new">Nouveau projet</button><button class="btn" data-action="project">Ouvrir le projet</button><button class="btn" data-action="save-library">Enregistrer dans mes projets</button></div></div><div class="card"><h2>Partager un projet</h2><p>Exportez un fichier JSON pour l'envoyer à un collègue ou ouvrez un fichier reçu.</p><div class="actions"><button class="btn primary" data-action="export">Exporter le projet (.json)</button><button class="btn" data-action="export-email">Envoyer par e-mail</button><button class="btn" data-action="import">Ouvrir un projet reçu</button><input id="file-import" type="file" accept=".json,application/json" class="hidden"></div><div class="actions" style="margin-top:10px"><button class="btn" data-action="synth">Voir la coupe</button><button class="btn" data-action="print">Imprimer / PDF</button></div></div></div><div class="card" style="margin-top:18px"><h2>Mes projets enregistrés</h2><div class="project-list">${libraryCards||'<div class="empty">Aucun projet enregistré sur cet appareil pour le moment.</div>'}</div></div>`);
}
function projet(){
 const p=state.project;
 return shell('Projet','Informations générales et données de forage',`
 <div class="card section"><h2>Informations du chantier</h2><div class="project-logo-preview">${p.logo?`<img src="${U.esc(p.logo)}" alt="Logo entreprise">`:'<span>🏢</span>'}<div><b>Logo / image de l’entreprise</b><p>Importer une image (2 Mo max)</p><input type="file" id="logo-file" accept="image/*"></div></div><div class="grid grid-3">${field('Nom du projet','name',p.name)}${field('Site','site',p.site)}${field('Adresse','address',p.address)}${field('Entreprise','company',p.company)}${field('Service','service',p.service)}${field('Nom du travail','work',p.work)}${field('Date début','start',p.start,'date')}${field('Date fin','end',p.end,'date')}${field('Logo (URL ou chemin)','logo',p.logo)}</div></div>
 <div class="card section"><h2>Forage</h2><div class="grid grid-3">${field('Diamètre','diameter',p.diameter)}${field('Profondeur','depth',p.depth)}${field('Niveau d’eau','water',p.water)}${field('Cap / sol','cap',p.cap)}${field('Épaisseur de sol / cap','soil',p.soil)}<div class="field"><label>Présence de couronne</label><select data-field="curb"><option ${p.curb==='Non'?'selected':''}>Non</option><option ${p.curb==='Oui'?'selected':''}>Oui</option></select></div>${field('Épaisseur couronne','curbThickness',p.curbThickness)}${field('Foreur','driller',p.driller)}${field('Technique de forage','technique',p.technique)}</div></div>
 <div class="actions project-actions" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><button type="button" class="btn primary" data-action="new">Nouveau projet</button><button type="button" class="btn success" data-action="save">Enregistrer</button><button type="button" class="btn" data-action="save-library">Enregistrer dans mes projets</button></div>`);
}
function lithology(){
 const rows=state.lithology.map((r,i)=>`<tr><td>${i+1}</td><td><input type="number" step="0.01" data-row="lithology" data-i="${i}" data-k="from" value="${U.esc(r.from)}"></td><td><input type="number" step="0.01" data-row="lithology" data-i="${i}" data-k="to" value="${U.esc(r.to)}"></td><td><select data-row="lithology" data-i="${i}" data-k="lithology">${state.admin.lithologies.map(x=>`<option ${r.lithology===x?'selected':''}>${U.esc(x)}</option>`).join('')}</select></td><td><select data-row="lithology" data-i="${i}" data-k="water"><option ${r.water==='Non'?'selected':''}>Non</option><option ${r.water==='Oui'?'selected':''}>Oui</option></select></td><td><input data-row="lithology" data-i="${i}" data-k="cov" value="${U.esc(r.cov)}"></td><td><input data-row="lithology" data-i="${i}" data-k="comment" value="${U.esc(r.comment)}"></td><td><button class="btn danger small" data-del="lithology" data-i="${i}">×</button></td></tr>`).join('');
 return shell('Lithologie','Profondeurs, nature des terrains, eau, COV et commentaires',`<div class="card"><div class="toolbar"><b>Coupe lithologique</b><button class="btn primary" data-add="lithology">+ Ajouter une couche</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>De</th><th>À</th><th>Lithologie</th><th>Eau</th><th>COV</th><th>Commentaire</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">Aucune couche. Ajoutez une ligne.</td></tr>'}</tbody></table></div></div>`);
}
function tubage(){
 const rows=state.tubage.map((r,i)=>`<tr><td>${i+1}</td><td><input type="number" step="0.01" data-row="tubage" data-i="${i}" data-k="from" value="${U.esc(r.from)}"></td><td><input type="number" step="0.01" data-row="tubage" data-i="${i}" data-k="to" value="${U.esc(r.to)}"></td><td><select data-row="tubage" data-i="${i}" data-k="nature">${state.admin.equipment.map(x=>`<option ${r.nature===x?'selected':''}>${U.esc(x)}</option>`).join('')}</select></td><td><input data-row="tubage" data-i="${i}" data-k="id" value="${U.esc(r.id)}"></td><td><input data-row="tubage" data-i="${i}" data-k="od" value="${U.esc(r.od)}"></td><td><input data-row="tubage" data-i="${i}" data-k="annular" value="${U.esc(r.annular)}"></td><td><input data-row="tubage" data-i="${i}" data-k="comment" value="${U.esc(r.comment)}"></td><td><button class="btn danger small" data-del="tubage" data-i="${i}">×</button></td></tr>`).join('');
 return shell('Équipements / tubage','Tubage plein, crépine et éléments complémentaires',`<div class="card"><div class="toolbar"><b>Éléments</b><button class="btn primary" data-add="tubage">+ Ajouter</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>De</th><th>À</th><th>Nature</th><th>Ø intérieur</th><th>Ø extérieur</th><th>Espace annulaire</th><th>Commentaire</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="9" class="empty">Aucun élément.</td></tr>'}</tbody></table></div></div>
 <div class="card section" style="margin-top:16px"><h2>Compléments prévus</h2><div class="grid grid-2">${state.admin.complements.map((x,i)=>`<label><input type="checkbox" data-comp="${i}" ${state.complements.includes(x)?'checked':''}> ${U.esc(x)}</label>`).join('')}</div></div>`);
}
function developpement(){
 const d=state.development;
 return shell('Développement','Niveaux d’eau, débit, durée et commentaires',`<div class="card"><div class="grid grid-3">${field('Niveau avant','before',d.before)}${field('Niveau pendant','during',d.during)}${field('Niveau après','after',d.after)}${field('Débit','flow',d.flow)}${field('Durée','duration',d.duration)}</div><div class="field" style="margin-top:14px"><label>Commentaires</label><textarea data-dev="comments">${U.esc(d.comments)}</textarea></div><div class="actions" style="margin-top:14px"><button class="btn success" data-action="save">Enregistrer</button></div></div>`);
}

function depthMax(){
 const vals=[U.num(state.project.depth),...state.lithology.flatMap(r=>[U.num(r.from),U.num(r.to)]),...state.tubage.flatMap(r=>[U.num(r.from),U.num(r.to)])].filter(v=>v!==null&&v>=0);
 return Math.max(1,...vals);
}
function hatchFor(name){
 const map={Sable:'#ead8ad',Argile:'#a98f72',Limon:'#c8b38f',Grave:'#b7b7b7',Calcaire:'#d8d2c4',Craie:'#f1eee7',Marne:'#b7a79b'};
 return map[name]||'#d7dde5';
}
function buildBoreholeSvg(){
 const max=depthMax(), top=70, H=Math.max(650,Math.min(1200,top+max*55)), scale=(H-top)/max;
 const xDepth=70,xLith=180,wLith=220,xTube=470,wTube=110,xWater=625,xInfo=675;
 const y=d=>top+d*scale;
 let s=`<svg class="borehole-svg" viewBox="0 0 980 ${H+70}" xmlns="http://www.w3.org/2000/svg">
 <defs><pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#777"/><circle cx="6" cy="6" r="1" fill="#777"/></pattern><pattern id="sand" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.7" fill="#8d7445"/><circle cx="9" cy="8" r="1.7" fill="#8d7445"/></pattern></defs>
 <rect x="0" y="0" width="980" height="${H+70}" fill="#fff"/><text x="20" y="28" font-size="20" font-weight="700">${U.esc(state.project.name||'Coupe de forage')}</text>
 <text x="20" y="49" font-size="12" fill="#667085">${U.esc(state.project.site||'Site non renseigné')} — profondeur finale ${U.esc(state.project.depth||max)} m</text>
 <line x1="${xDepth+45}" y1="${top}" x2="${xDepth+45}" y2="${H}" stroke="#344054" stroke-width="2"/>
 <line x1="${xLith}" y1="${top}" x2="${xLith}" y2="${H}" stroke="#344054"/><line x1="${xLith+wLith}" y1="${top}" x2="${xLith+wLith}" y2="${H}" stroke="#344054"/>
 <line x1="${xTube}" y1="${top}" x2="${xTube}" y2="${H}" stroke="#344054"/><line x1="${xTube+wTube}" y1="${top}" x2="${xTube+wTube}" y2="${H}" stroke="#344054"/>
 <text x="${xDepth}" y="62" font-size="12" font-weight="700">PROF.</text><text x="${xLith+8}" y="62" font-size="12" font-weight="700">LITHOLOGIE</text><text x="${xTube+8}" y="62" font-size="12" font-weight="700">TUBAGE</text><text x="${xInfo}" y="62" font-size="12" font-weight="700">INFORMATIONS</text>`;
 for(let d=0;d<=max;d+=1){let yy=y(d);s+=`<line x1="${xDepth+40}" y1="${yy}" x2="${xLith}" y2="${yy}" stroke="#dbe2ea"/><text x="${xDepth+4}" y="${yy+4}" font-size="10" fill="#667085">${d.toFixed(0)} m</text>`}
 for(const r of state.lithology){let a=U.num(r.from),b=U.num(r.to);if(a===null||b===null||b<=a)continue;let yy=y(a),hh=(b-a)*scale; s+=`<rect x="${xLith}" y="${yy}" width="${wLith}" height="${hh}" fill="${hatchFor(r.lithology)}" stroke="#667085"/><text x="${xLith+8}" y="${yy+16}" font-size="11" font-weight="600">${U.esc(r.lithology)}</text><text x="${xLith+8}" y="${yy+31}" font-size="9">${U.esc(r.cov||'')}</text>`}
 for(const r of state.tubage){let a=U.num(r.from),b=U.num(r.to);if(a===null||b===null||b<=a)continue;let yy=y(a),hh=(b-a)*scale;let fill=r.nature==='Crépine'?'url(#dots)':r.nature==='Massif filtrant'?'url(#sand)':'#e9edf2';s+=`<rect x="${xTube+12}" y="${yy}" width="${wTube-24}" height="${hh}" fill="${fill}" stroke="#334155" stroke-width="2"/>`;if(hh>22)s+=`<text x="${xTube+18}" y="${yy+16}" font-size="9">${U.esc(r.nature)}</text>`}
 const water=U.num(state.project.water); if(water!==null){let yy=y(water);s+=`<line x1="${xTube+wTube+10}" y1="${yy}" x2="${xInfo-12}" y2="${yy}" stroke="#1677c8" stroke-width="3"/><text x="${xInfo}" y="${yy-5}" font-size="10" fill="#1677c8">Niveau d’eau ${water} m</text>`}
 s+=`<text x="${xInfo}" y="${top+18}" font-size="11">Diamètre : ${U.esc(state.project.diameter||'—')}</text><text x="${xInfo}" y="${top+36}" font-size="11">Foreur : ${U.esc(state.project.driller||'—')}</text><text x="${xInfo}" y="${top+54}" font-size="11">Technique : ${U.esc(state.project.technique||'—')}</text>`;
 s+='</svg>';return s;
}
function synthese(){
 const p=state.project;
 const rows=state.lithology.map(r=>{let t=findTubage(r);return `<tr><td>${U.esc(r.from)}–${U.esc(r.to)}</td><td>${U.esc(r.lithology)}</td><td>${U.esc(r.cov)}</td><td>${U.esc(r.water)}</td><td>${U.esc(t.nature||'')}</td><td>${U.esc(t.id||'')} / ${U.esc(t.od||'')}</td><td>${U.esc(t.annular||'')}</td><td>${U.esc(r.comment)}</td></tr>`}).join('');
 return shell('Synthèse','Tableau de sortie et coupe graphique',`
 <div class="card section"><div class="grid grid-4"><div><b>Site</b><br>${U.esc(p.site||'—')}</div><div><b>Projet</b><br>${U.esc(p.name||'—')}</div><div><b>Profondeur</b><br>${U.esc(p.depth||'—')}</div><div><b>Niveau d’eau</b><br>${U.esc(p.water||'—')}</div></div></div>
 <div class="card section"><h2>Coupe graphique</h2><div class="borehole-wrap">${buildBoreholeSvg()}</div><div class="legend"><span>■ Lithologie</span><span>▥ Crépine</span><span>— Niveau d’eau</span></div></div>
 <div class="card"><div class="toolbar"><b>Tableau de synthèse</b><button class="btn" data-action="csv">Exporter CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Profondeur</th><th>Lithologie</th><th>COV</th><th>Eau</th><th>Nature tubage</th><th>Ø intérieur / extérieur</th><th>Espace annulaire</th><th>Commentaire</th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">Aucune donnée.</td></tr>'}</tbody></table></div></div>`);
}
function findTubage(r){
 const a=U.num(r.from),b=U.num(r.to);
 return state.tubage.find(x=>{let c=U.num(x.from),d=U.num(x.to);return c!==null&&d!==null&&a!==null&&b!==null&&c<=a&&d>=b})||
 state.tubage.find(x=>{let c=U.num(x.from),d=U.num(x.to);return c!==null&&d!==null&&a!==null&&b!==null&&c<b&&d>a})||{};
}
function fiche(){
 const p=state.project;
 return shell('Fiche de poste','Présentation imprimable des informations de l’intervention',`
 <div class="card"><div class="grid grid-3"><div><b>Site</b><p>${U.esc(p.site)}</p></div><div><b>Adresse</b><p>${U.esc(p.address)}</p></div><div><b>Entreprise</b><p>${U.esc(p.company)}</p></div><div><b>Service</b><p>${U.esc(p.service)}</p></div><div><b>Foreur</b><p>${U.esc(p.driller)}</p></div><div><b>Technique</b><p>${U.esc(p.technique)}</p></div><div><b>Dates</b><p>${U.date(p.start)} — ${U.date(p.end)}</p></div><div><b>Travail</b><p>${U.esc(p.work)}</p></div><div><b>Diamètre / profondeur</b><p>${U.esc(p.diameter)} / ${U.esc(p.depth)}</p></div></div><hr><h2>Coupe</h2><div class="borehole-wrap">${buildBoreholeSvg()}</div></div>
 <div class="actions" style="margin-top:14px"><button class="btn primary" data-action="print">Imprimer / PDF</button></div>`);
}
function adminList(title,key){return `<div class="card"><h2>${title}</h2><div class="actions"><input id="new-${key}" placeholder="Nouvel élément" style="flex:1;padding:9px;border:1px solid var(--border);border-radius:8px"><button class="btn primary" data-admin-add="${key}">+</button></div><ul>${state.admin[key].map((x,i)=>`<li style="display:flex;justify-content:space-between;gap:8px;margin:9px 0"><span>${U.esc(x)}</span><button class="btn danger small" data-admin-del="${key}" data-i="${i}">×</button></li>`).join('')}</ul></div>`}
function admin(){return shell('Administration','Listes utilisées dans les formulaires',`<div class="grid grid-3">${adminList('Lithologies','lithologies')}${adminList('Équipements','equipment')}${adminList('Compléments','complements')}</div><div class="card" style="margin-top:16px"><h2>Sauvegarde</h2><div class="actions"><button class="btn" data-action="export">Exporter le projet JSON</button><button class="btn" data-action="import">Importer un projet JSON</button><button class="btn danger" data-action="reset">Réinitialiser toutes les données</button><input id="file-import" type="file" accept=".json" class="hidden"></div></div>`)}

function bind(){
 document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 document.querySelectorAll('[data-field]').forEach(e=>e.oninput=()=>{state.project[e.dataset.field]=e.value;save()});
 document.querySelectorAll('[data-row]').forEach(e=>e.oninput=()=>{state[e.dataset.row][+e.dataset.i][e.dataset.k]=e.value;save()});
 document.querySelectorAll('[data-dev]').forEach(e=>e.oninput=()=>{state.development[e.dataset.dev]=e.value;save()});
 document.querySelectorAll('[data-comp]').forEach(e=>e.onchange=()=>{let x=state.admin.complements[+e.dataset.comp];if(e.checked&&!state.complements.includes(x))state.complements.push(x);if(!e.checked)state.complements=state.complements.filter(v=>v!==x);save()});
 document.querySelectorAll('[data-add]').forEach(e=>e.onclick=()=>{let k=e.dataset.add;state[k].push(k==='lithology'?{from:'',to:'',lithology:state.admin.lithologies[0],water:'Non',cov:'',comment:''}:{from:'',to:'',nature:state.admin.equipment[0],id:'',od:'',annular:'',comment:''});save();render()});
 document.querySelectorAll('[data-del]').forEach(e=>e.onclick=()=>{state[e.dataset.del].splice(+e.dataset.i,1);save();render()});
 document.querySelectorAll('[data-action]').forEach(e=>e.onclick=()=>action(e.dataset.action));
document.querySelectorAll('[data-delete-library]').forEach(e=>e.onclick=()=>{const idx=projectLibrary.length-1-(+e.dataset.deleteLibrary);const item=projectLibrary[idx];if(!item)return;const label=item.project?.name||item.project?.site||'ce projet';if(!confirm(`Supprimer « ${label} » de mes projets enregistrés ?`))return;projectLibrary.splice(idx,1);U.save(LIBKEY,projectLibrary);render();U.toast('Projet supprimé')});
 document.querySelectorAll('[data-open-library]').forEach(e=>e.onclick=()=>{const item=projectLibrary.slice().reverse()[+e.dataset.openLibrary];if(item){state=normalize(item);save();setView('dashboard');U.toast('Projet ouvert')}});
document.querySelectorAll('[data-action="save-library"]').forEach(e=>e.onclick=()=>saveToLibrary());
document.querySelectorAll('#logo-file').forEach(e=>e.onchange=()=>{const f=e.files&&e.files[0];if(!f)return;if(!f.type.startsWith('image/'))return alert('Choisissez une image.');if(f.size>2*1024*1024)return alert('Image trop volumineuse (maximum 2 Mo).');const r=new FileReader();r.onload=()=>{state.project.logo=r.result;save();render()};r.readAsDataURL(f)});

 document.querySelectorAll('[data-admin-add]').forEach(e=>e.onclick=()=>{let k=e.dataset.adminAdd,input=document.querySelector('#new-'+k);if(input.value.trim()){state.admin[k].push(input.value.trim());save();render()}});
 document.querySelectorAll('[data-admin-del]').forEach(e=>e.onclick=()=>{state.admin[e.dataset.adminDel].splice(+e.dataset.i,1);save();render()});
}
function action(a){
 if(a==='project')setView('projet');
 if(a==='synth')setView('synthese');
 if(a==='print'){if(view==='dashboard')setView('synthese');setTimeout(()=>U.print(),80)}
 if(a==='save'){save();U.toast('Projet enregistré')}
 if(a==='new'&&confirm('Créer un nouveau projet ? Les listes d’administration seront conservées.')){let admin=state.admin;state=normalize({project:{...defaults.project},lithology:[],tubage:[],complements:[],development:{...defaults.development},admin});save();setView('projet')}
 if(a==='csv'){U.csv('synthese-log-forage.csv',[['Profondeur','Lithologie','COV','Eau','Tubage','Diamètres','Annulaire','Commentaire'],...state.lithology.map(r=>{let t=findTubage(r);return [`${r.from}-${r.to}`,r.lithology,r.cov,r.water,t.nature||'',`${t.id||''} / ${t.od||''}`,t.annular||'',r.comment]})])}
 if(a==='export')exportProject('save');
 if(a==='export-email')exportProject('email');
 if(a==='import')document.querySelector('#file-import')?.click();
 if(a==='import')document.querySelector('#file-import')?.click();
 if(a==='reset'&&confirm('Tout réinitialiser ? Les projets et les listes personnalisées seront supprimés.')){state=JSON.parse(JSON.stringify(defaults));save();render()}
}
document.addEventListener('change',e=>{
 if(e.target.id==='file-import'&&e.target.files[0]){let f=e.target.files[0],r=new FileReader();r.onload=()=>{try{state=normalize(JSON.parse(r.result));save();render();U.toast('Projet importé')}catch{alert('Fichier JSON invalide')}};r.readAsText(f)}
});
window.addEventListener('error',e=>{const app=document.querySelector('#app');if(app&&app.innerHTML.trim()==='')app.innerHTML=`<div class="card"><h2>Erreur de démarrage</h2><p>${U.esc(e.message)}</p></div>`});

function safeFileName(s){return (s||'log-forage-projet').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-_]+/gi,'_')||'log-forage-projet'}
async function exportProject(mode='save'){const payload={format:'logiciels-julien-log-forage',version:1,exportedAt:new Date().toISOString(),...JSON.parse(JSON.stringify(state))};const name=safeFileName(state.project.name)+'.json',content=JSON.stringify(payload,null,2);if(mode==='folder'||mode==='save')return U.saveFileDialog(name,content,'application/json');if(mode==='email')return U.emailFile(name,content,'application/json','Projet - '+(state.project.name||'Log de forage'));}
function saveToLibrary(){const snapshot=JSON.parse(JSON.stringify(state));snapshot.updated=new Date().toLocaleString('fr-FR');const key=snapshot.project.name||snapshot.project.site||'Projet sans nom';const ix=projectLibrary.findIndex(x=>(x.project?.name||x.project?.site||'Projet sans nom')===key);if(ix>=0)projectLibrary[ix]=snapshot;else projectLibrary.push(snapshot);U.save(LIBKEY,projectLibrary);U.toast('Projet ajouté à la bibliothèque');if(view==='dashboard')render()}
render();
