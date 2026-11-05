
window.AppUtils={
 esc:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])),
 load:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??structuredClone(d)}catch{return structuredClone(d)}},
 save:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
 date:s=>s?new Date(s+'T00:00:00').toLocaleDateString('fr-FR'): '—',
 toast:m=>{let x=document.createElement('div');x.className='toast';x.textContent=m;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)},
 print:()=>window.print(),
 download:(name,text,type='application/json')=>{const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)},
 saveFileDialog:async(name,text,type='application/json')=>{
  // Boîte de dialogue système « Enregistrer sous » sur les navigateurs compatibles.
  if(window.showSaveFilePicker){
   try{const handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'Fichier à exporter',accept:{[type.split(';')[0]]:[name.includes('.')?'.'+name.split('.').pop():' .json'.trim()]}}]});const writable=await handle.createWritable();await writable.write(new Blob([text],{type}));await writable.close();AppUtils.toast('Projet enregistré à l’emplacement choisi');return true}
   catch(e){if(e.name==='AbortError')return false;console.warn('Boîte Enregistrer sous indisponible',e)}
  }
  // Safari et certains contextes file:// n’exposent pas le sélecteur de sauvegarde.
  // On déclenche alors le téléchargement standard du navigateur.
  AppUtils.download(name,text,type);AppUtils.toast('Le navigateur ne permet pas de choisir un emplacement ici : vérifiez ses réglages de téléchargement.');return true
 },
 saveToFolder:async(name,text,type='application/json')=>AppUtils.saveFileDialog(name,text,type),
 emailFile:async(name,text,type='application/json',subject='Projet Logiciels Julien')=>{const saved=await AppUtils.saveFileDialog(name,text,type);if(!saved)return false;const body=encodeURIComponent('Bonjour,\n\nVeuillez trouver le projet Logiciels Julien en pièce jointe.\n\nJoignez le fichier enregistré : '+name);window.location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+body;AppUtils.toast('Ajoutez le fichier enregistré à la pièce jointe du courriel.');return true},
 csv:(name,rows)=>{let s=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n');AppUtils.download(name,s,'text/csv;charset=utf-8')},
 num:v=>{let n=parseFloat(String(v).replace(',','.'));return Number.isFinite(n)?n:null}
};
