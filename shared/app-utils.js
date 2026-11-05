
window.AppUtils = {
    esc: s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])),
    load: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? structuredClone(d) } catch { return structuredClone(d) } },
    save: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    date: s => s ? new Date(s + 'T00:00:00').toLocaleDateString('fr-FR') : '—',
    toast: m => { let x = document.createElement('div'); x.className = 'toast'; x.textContent = m; document.body.appendChild(x); setTimeout(() => x.remove(), 2200) },
    print: () => window.print(),
    download: (name, text, type = 'application/json') => { const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000) },
    saveToFolder: async (name, text, type = 'application/json') => { if (!window.showDirectoryPicker) { AppUtils.download(name, text, type); AppUtils.toast('Sélection de dossier non disponible ici : fichier téléchargé dans Téléchargements'); return false } try { const dir = await window.showDirectoryPicker({ mode: 'readwrite' }); const file = await dir.getFileHandle(name, { create: true }); const writable = await file.createWritable(); await writable.write(new Blob([text], { type })); await writable.close(); AppUtils.toast('Fichier enregistré dans le dossier choisi'); return true } catch (e) { if (e.name !== 'AbortError') alert('Enregistrement dans le dossier impossible : ' + e.message); return false } },
    emailFile: (name, text, type = 'application/json', subject = 'Projet Logiciels Julien') => { AppUtils.download(name, text, type); const body = encodeURIComponent('Bonjour,\n\nVeuillez trouver le projet Logiciels Julien en pièce jointe.\n\nPensez à joindre le fichier téléchargé : ' + name); window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + body; AppUtils.toast('Fichier téléchargé. Ajoutez-le en pièce jointe au brouillon de courriel.') },
    csv: (name, rows) => { let s = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\n'); AppUtils.download(name, s, 'text/csv;charset=utf-8') },
    num: v => { let n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null }
};
