
window.AppUtils={
 esc:s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])),
 load:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??structuredClone(d)}catch{return structuredClone(d)}},
 save:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
 date:s=>s?new Date(s+'T00:00:00').toLocaleDateString('fr-FR'): '—',
 toast:m=>{let x=document.createElement('div');x.className='toast';x.textContent=m;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)},
 print:()=>window.print(),
 download:(name,text,type='application/json')=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},
 csv:(name,rows)=>{let s=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n');AppUtils.download(name,s,'text/csv;charset=utf-8')},
 num:v=>{let n=parseFloat(String(v).replace(',','.'));return Number.isFinite(n)?n:null}
};
