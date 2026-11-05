
window.AppUtils={
 esc:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])),
 load:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??structuredClone(d)}catch{return structuredClone(d)}},
 save:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
 date:s=>s?new Date(s+'T00:00:00').toLocaleDateString('fr-FR'): '—',
 toast:m=>{let x=document.createElement('div');x.className='toast';x.textContent=m;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)},
 print:()=>window.print(),
 download:(name,text,type='application/json')=>{const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)},
 saveFileDialog:async(name,text,type='application/json')=>{
  // Chrome + Live Server : ouvrir le véritable sélecteur système dès le clic utilisateur.
  try{
   if(typeof window.showSaveFilePicker==='function'){
    const ext='.'+(String(name).split('.').pop()||'json');
    const mime=String(type).split(';')[0]||'application/json';
    const handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'Fichier à exporter',accept:{[mime]:[ext]}}]});
    const writable=await handle.createWritable();
    await writable.write(new Blob([text],{type}));
    await writable.close();
    AppUtils.toast('Fichier enregistré : '+name);
    return true;
   }
  }catch(e){
   if(e&&e.name==='AbortError'){AppUtils.toast('Exportation annulée');return false;}
   console.error('Échec de la boîte Enregistrer sous :',e);
   alert('Chrome n’a pas pu ouvrir la boîte « Enregistrer sous ». Le fichier va être téléchargé. Détail : '+(e&&e.message?e.message:'erreur inconnue'));
  }
  // Repli : téléchargement standard Chrome (dossier défini dans les paramètres de téléchargements).
  AppUtils.download(name,text,type);
  AppUtils.toast('Téléchargement lancé : '+name);
  return true;
 },
 emailFile:(name,text,type='application/json',subject='Projet Logiciels Julien')=>{
  // Le navigateur ne peut pas joindre automatiquement un fichier à un e-mail.
  // On déclenche le téléchargement puis ouvre le client de messagerie.
  AppUtils.download(name,text,type);
  const body='Bonjour,\n\nVeuillez trouver le projet Logiciels Julien en pièce jointe.\n\nLe fichier « '+name+' » vient d’être téléchargé : ajoutez-le en pièce jointe avant l’envoi.\n';
  const mailto='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  try{window.location.href=mailto;}catch(e){console.error('Ouverture du courriel impossible',e);}
  AppUtils.toast('Projet téléchargé. Joignez le fichier au courriel qui s’ouvre.');
  return true;
 },
 csv:(name,rows)=>{let s=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n');AppUtils.download(name,s,'text/csv;charset=utf-8')},
 num:v=>{let n=parseFloat(String(v).replace(',','.'));return Number.isFinite(n)?n:null}
};
