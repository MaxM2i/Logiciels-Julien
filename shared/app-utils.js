window.AppUtils = {
    uid(prefix = 'id') { return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8) },
    esc(v = '') { return String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])) },
    toast(msg) { let e = document.createElement('div'); e.className = 'toast'; e.textContent = msg; document.body.appendChild(e); setTimeout(() => e.remove(), 2200) },
    save(key, obj) { localStorage.setItem(key, JSON.stringify(obj)) },
    load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } },
    download(name, text, type = 'application/json') { let a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href) },
    print() { window.print() },
    csv(name, rows) { let s = rows.map(r => r.map(x => '"' + String(x ?? '').replaceAll('"', '""') + '"').join(';')).join('\n'); this.download(name, s, 'text/csv;charset=utf-8') },
    date(v) { return v ? new Date(v).toLocaleDateString('fr-FR') : '' }
};
