// Backup screen
V.data=function(){const d=db.lastExport?Math.floor((Date.now()-db.lastExport)/864e5)+' days ago':'never';
 return `<h2>Backup</h2><div class="card"><div class="mu">Last export: ${d}</div><div class="row" style="margin-top:8px"><button class="b" onclick="exp('json')">Export backup (JSON)</button><button class="b s" onclick="exp('txt')">Export notes as text</button></div>
 <textarea id="ex" readonly placeholder="Export appears here. Copy it and save it to a file or send it to your other device."></textarea><button class="b s" onclick="$('#ex').select();document.execCommand('copy')">Copy</button></div>
 <div class="card"><b>Import</b><div style="margin:10px 0"><input type="file" id="if" accept=".json,.txt" onchange="readF(this)"></div><textarea id="im" placeholder="Or paste backup JSON here"></textarea>
 <div class="row" style="margin-top:8px"><button class="b" onclick="imp(0)">Replace everything</button><button class="b s" onclick="imp(1)">Merge</button></div><div class="mu" style="margin-top:6px">${E(msg)}</div></div>`};
