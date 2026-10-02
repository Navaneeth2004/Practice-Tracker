// Backup screen
V.data=function(){const d=db.lastExport?Math.floor((Date.now()-db.lastExport)/864e5)+' days ago':'never';
 return `<h2>Backup</h2>
 <div class="card"><h3 style="margin-top:0">Export</h3><div class="mu">Last export: ${d}</div>
 <div class="form" style="margin:14px 0"><button class="b" onclick="exp('json')">Export backup (JSON)</button><button class="b s" onclick="exp('txt')">Export notes as text</button></div>
 <textarea id="ex" readonly placeholder="Your export appears here. Copy it and save it to a file, or send it to your other device." style="min-height:120px"></textarea>
 <button class="b s full" style="margin-top:0" onclick="copyEx(this)">Copy to clipboard</button></div>
 <div class="card"><h3 style="margin-top:0">Import</h3><div class="mu">Choose a backup file, or paste its contents below.</div>
 <div style="margin:14px 0"><input type="file" id="if" accept=".json,.txt" onchange="readF(this)"></div>
 <textarea id="im" placeholder="Paste backup JSON here" style="min-height:120px"></textarea>
 <div class="form"><button class="b" onclick="imp(0)">Replace everything</button><button class="b s" onclick="imp(1)">Merge with this device</button></div>
 ${msg?`<div class="mu" style="margin-top:12px">${E(msg)}</div>`:''}</div>`};
