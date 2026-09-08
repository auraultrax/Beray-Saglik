const state = {
  messages: [],
  tracker: JSON.parse(localStorage.getItem('beray_health_tracker') || '[]')
};

const $ = (s) => document.querySelector(s);
const chat = $('#chat');
const composer = $('#composer');
const input = $('#message');
const trackerForm = $('#trackerForm');
const trackerRows = $('#trackerRows');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function nowLabel() { return new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}); }
function addMessage(role,text,meta='') {
  const el=document.createElement('div');
  el.className=`msg ${role}`;
  el.innerHTML=`<div class="bubble">${escapeHtml(text).replace(/\n/g,'<br>')}</div><div class="meta">${escapeHtml(meta||nowLabel())}</div>`;
  chat.appendChild(el); chat.scrollTop=chat.scrollHeight;
}
function addTyping(){
  const el=document.createElement('div'); el.className='msg assistant typing'; el.id='typing';
  el.innerHTML='<div class="bubble">Hazır sağlık bilgisi hazırlanıyor<span class="dots">...</span></div>';
  chat.appendChild(el); chat.scrollTop=chat.scrollHeight;
}
function removeTyping(){ $('#typing')?.remove(); }
window.send = function send(textOverride='') {
  const text=(textOverride||input.value).trim(); if(!text) return;
  input.value=''; $('#suggestions').classList.add('hidden'); addMessage('user',text); state.messages.push({role:'user',content:text});
  addTyping();
  window.setTimeout(()=>{ removeTyping(); const answer=deterministicReply(text); addMessage('assistant',answer,'Beray Sağlık • Hazır Bilgi'); state.messages.push({role:'assistant',content:answer}); }, 180);
}
function renderTracker(){
  if(!state.tracker.length){ trackerRows.innerHTML='<div class="empty">Henüz kayıt yok.</div>'; return; }
  trackerRows.innerHTML=state.tracker.slice().reverse().map((r,i)=>`<div class="track-row"><div><b>${escapeHtml(r.date)}</b><span>${escapeHtml(r.note||'Not yok')}</span></div><div>${r.temperature?`🌡 ${escapeHtml(r.temperature)}°C`:'—'}</div><div>${r.systolic&&r.diastolic?`🩺 ${escapeHtml(r.systolic)}/${escapeHtml(r.diastolic)}`:'—'}</div><div>${r.pulse?`❤️ ${escapeHtml(r.pulse)}`:'—'}</div><button data-delete="${state.tracker.length-1-i}" title="Sil">Sil</button></div>`).join('');
}
trackerForm.addEventListener('submit',e=>{e.preventDefault(); const fd=new FormData(trackerForm); const r=Object.fromEntries(fd.entries()); state.tracker.push(r); localStorage.setItem('beray_health_tracker',JSON.stringify(state.tracker)); trackerForm.reset(); $('#date').valueAsDate=new Date(); renderTracker();});
trackerRows.addEventListener('click',e=>{ const idx=e.target.dataset.delete; if(idx===undefined)return; state.tracker.splice(Number(idx),1); localStorage.setItem('beray_health_tracker',JSON.stringify(state.tracker)); renderTracker(); });
composer.addEventListener('submit',e=>{e.preventDefault();send();});
document.querySelectorAll('[data-send]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.send)));
$('#clearChat').addEventListener('click',()=>{state.messages=[];chat.innerHTML='';addMessage('assistant',`Merhaba 👋 Ben Beray Sağlık.\n\nYapay zekâ ve harici API kullanmıyorum; yanıtlar yerleşik sağlık bilgi kartlarından deterministik olarak hazırlanır.\n\n${SAFETY_NOTE}`,'Beray Sağlık • Hazır Bilgi');});
$('#trackerBtn').addEventListener('click',()=>$('#tracker').scrollIntoView({behavior:'smooth'}));
$('#sourcesBtn').addEventListener('click',()=>$('#sources').classList.toggle('hidden'));
$('#installBtn').addEventListener('click',async()=>{ if(window.__berayInstallPrompt){window.__berayInstallPrompt.prompt(); const r=await window.__berayInstallPrompt.userChoice; if(r.outcome==='accepted') $('#installBtn').classList.add('hidden'); window.__berayInstallPrompt=null; } else { $('#installHelp').classList.toggle('hidden'); }});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.__berayInstallPrompt=e;$('#installBtn').classList.remove('hidden');});
window.addEventListener('appinstalled',()=>$('#installBtn').classList.add('hidden'));
if(window.matchMedia('(display-mode: standalone)').matches) $('#installBtn').classList.add('hidden');
$('#date').valueAsDate=new Date(); renderTracker();
addMessage('assistant',`Merhaba 👋 Ben Beray Sağlık.\n\nBuradaki yanıtlar tamamen yerleşik, hazır sağlık bilgi kartlarından hazırlanır. İnternet bağlantısı veya yapay zekâ API'si gerekmez.\n\nBir konu yazabilir ya da aşağıdaki hazır başlıklardan birini seçebilirsin.\n\n${SAFETY_NOTE}`,'Beray Sağlık • Hazır Bilgi');

// PWA service worker registration. This is local/offline functionality only.
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
