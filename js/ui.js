// Shared UI snippets used by the edit forms
const cancel='<button class="b s" onclick="ed=null;render()">Cancel</button>';
const edb=(k,d)=>`<button class="x" style="color:var(--ac)" onclick="ed='${k}';render()">Edit</button><button class="x" onclick="${d}">Delete</button>`;
