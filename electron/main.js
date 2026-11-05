
const {app,BrowserWindow}=require('electron');const path=require('path');
function create(){const w=new BrowserWindow({width:1500,height:950,webPreferences:{contextIsolation:true}});w.loadFile(path.join(__dirname,'launcher.html'))}
app.whenReady().then(()=>{create();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create()})});app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
