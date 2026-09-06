const state = {
  messages: [],
  tracker: JSON.parse(localStorage.getItem('beray_health_tracker') || '[]'),
  settings: JSON.parse(localStorage.getItem('beray_ai_settings') || '{}')
};

const $ = (s) => document.querySelector(s);
const chat = $('#chat');
const composer = $('#composer');
const input = $('#message');
const model = $('#model');
const apiUrl = $('#apiUrl');
const apiKey = $('#apiKey');
const trackerForm = $('#trackerForm');
const trackerRows = $('#trackerRows');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function nowLabel() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function safetyNote() {
  return "⚠️ Bu yapay zekâ yalnızca yardımcı olmak ve genel sağlık bilgisi sunmak içindir. Tanı veya tedavi yerine geçmez. Gerçek ve kişisel sağlık bilgileri için bir sağlık kuruluşuna başvurun. Acil bir durum varsa 112'yi arayın.";
}

function hasEmergencyLanguage(text) {
  const t = text.toLocaleLowerCase('tr-TR');
  return EMERGENCY_SIGNALS.some(s => t.includes(s));
}

function addMessage(role, text, meta='') {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.innerHTML = `
    <div class="bubble">${escapeHtml(text).replace(/\n/g,'<br>')}</div>
    <div class="meta">${escapeHtml(meta || nowLabel())}</div>
  `;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

function addTyping() {
  const el = document.createElement('div');
  el.className = 'msg assistant typing';
  el.id = 'typing';
  el.innerHTML = '<div class="bubble">Sağlık bilgilerini değerlendiriyorum<span class="dots">...</span></div>';
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}
function removeTyping(){ $('#typing')?.remove(); }

function localGreeting(text) {
  const t = text.toLocaleLowerCase('tr-TR').trim();
  for (const [key, value] of Object.entries(GREETINGS)) if (t === key) return value;
  return null;
}

function localEmergency(text) {
  if (!hasEmergencyLanguage(text)) return null;
  return `🚨 Yazdığın belirtiler acil değerlendirme gerektirebilecek bir duruma işaret ediyor olabilir. Buradan güvenli bir tanı koyamam. Şu anda ciddi göğüs ağrısı, belirgin nefes darlığı, bilinç değişikliği, kontrol edilemeyen kanama veya benzeri ağır bir durum varsa 112'yi ara ve yanında güvendiğin bir yetişkin/sağlık görevlisi bulunsun.\n\n${safetyNote()}`;
}

async function askAI(userText) {
  const base = apiUrl.value.trim() || state.settings.apiUrl || '';
  const key = apiKey.value.trim() || state.settings.apiKey || '';
  const selectedModel = model.value.trim() || state.settings.model || 'gemini-3.7-flash';

  if (!base || !key) {
    return `Şu anda yapay zekâ bağlantısı yapılandırılmamış. “⚙ Ayarlar” bölümüne Gemini API URL'sini, API anahtarını ve model adını ekle.\n\n${safetyNote()}`;
  }

  const isGemini = /generativelanguage\.googleapis\.com/i.test(base) || /^gemini/i.test(selectedModel);

  if (!isGemini) {
    // OpenAI uyumlu uç noktalar için eski davranışı koru.
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...state.messages.slice(-12),
      { role: 'user', content: userText }
    ];

    const response = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ model: selectedModel, messages, temperature: 0.2 })
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`AI API ${response.status}: ${txt.slice(0, 500)}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('AI cevabı alınamadı.');
    return answer.includes('Bu yapay zekâ yalnızca') ? answer : `${answer}\n\n${safetyNote()}`;
  }

  // Gemini generateContent biçimi.
  let geminiUrl = base.trim();
  const cleanModel = selectedModel.replace(/^models\//, '').trim();

  if (!/generativelanguage\.googleapis\.com/i.test(geminiUrl)) {
    geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent`;
  } else if (!/:generateContent(?:\?|$)/.test(geminiUrl)) {
    // Kullanıcı yalnızca kök Gemini adresini yazdıysa model endpoint'ini oluştur.
    geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent`;
  }

  // Çok turlu sohbeti Gemini'nin user/model rollerine dönüştür.
  const contents = state.messages
    .slice(-12)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));
  contents.push({ role: 'user', parts: [{ text: userText }] });

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Gemini API ${response.status}: ${txt.slice(0, 500)}`);
  }

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts
    ?.map(part => part?.text || '')
    .join('')
    .trim();

  if (!answer) {
    const blockReason = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason;
    throw new Error(blockReason ? `Gemini yanıt üretmedi: ${blockReason}` : 'Gemini cevabı alınamadı.');
  }

  return answer.includes('Bu yapay zekâ yalnızca') ? answer : `${answer}\n\n${safetyNote()}`;
}

async function send(textOverride='') {
  const text = (textOverride || input.value).trim();
  if (!text) return;
  input.value = '';
  $('#suggestions').classList.add('hidden');
  addMessage('user', text);
  state.messages.push({ role: 'user', content: text });

  const emergency = localEmergency(text);
  if (emergency) {
    addMessage('assistant', emergency, 'Acil güvenlik kontrolü');
    state.messages.push({ role: 'assistant', content: emergency });
    return;
  }

  const greeting = localGreeting(text);
  if (greeting) {
    const answer = `${greeting}\n\n${safetyNote()}`;
    addMessage('assistant', answer);
    state.messages.push({ role: 'assistant', content: answer });
    return;
  }

  addTyping();
  try {
    const answer = await askAI(text);
    removeTyping();
    addMessage('assistant', answer);
    state.messages.push({ role: 'assistant', content: answer });
  } catch (err) {
    removeTyping();
    const fallback = `AI bağlantısında bir sorun oluştu. Hata: ${err.message}\n\n${safetyNote()}`;
    addMessage('assistant', fallback, 'Bağlantı hatası');
  }
}

function renderTracker(){
  if (!state.tracker.length) {
    trackerRows.innerHTML = '<div class="empty">Henüz kayıt yok.</div>';
    return;
  }
  trackerRows.innerHTML = state.tracker.slice().reverse().map((r, i) => `
    <div class="track-row">
      <div><b>${escapeHtml(r.date)}</b><span>${escapeHtml(r.note || 'Not yok')}</span></div>
      <div>${r.temperature ? `🌡 ${r.temperature}°C` : '—'}</div>
      <div>${r.systolic && r.diastolic ? `🩺 ${r.systolic}/${r.diastolic}` : '—'}</div>
      <div>${r.pulse ? `❤️ ${r.pulse}` : '—'}</div>
      <button data-delete="${state.tracker.length - 1 - i}" title="Sil">Sil</button>
    </div>`).join('');
}

trackerForm.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(trackerForm);
  const record = Object.fromEntries(fd.entries());
  state.tracker.push(record);
  localStorage.setItem('beray_health_tracker', JSON.stringify(state.tracker));
  trackerForm.reset();
  $('#date').valueAsDate = new Date();
  renderTracker();
});

trackerRows.addEventListener('click', e => {
  const idx = e.target.dataset.delete;
  if (idx === undefined) return;
  state.tracker.splice(Number(idx), 1);
  localStorage.setItem('beray_health_tracker', JSON.stringify(state.tracker));
  renderTracker();
});

composer.addEventListener('submit', e => { e.preventDefault(); send(); });
document.querySelectorAll('[data-send]').forEach(b => b.addEventListener('click', () => send(b.dataset.send)));

$('#saveSettings').addEventListener('click', () => {
  state.settings = { apiUrl: apiUrl.value.trim(), apiKey: apiKey.value.trim(), model: model.value.trim() };
  localStorage.setItem('beray_ai_settings', JSON.stringify(state.settings));
  $('#settings').classList.add('hidden');
});
$('#settingsBtn').addEventListener('click', () => $('#settings').classList.toggle('hidden'));
$('#clearChat').addEventListener('click', () => {
  state.messages = [];
  chat.innerHTML = '';
  addMessage('assistant', `Merhaba 👋 Ben Beray Sağlık AI. Belirtilerini, sağlık takip bilgilerini veya sağlıklı yaşam hedeflerini anlatabilirsin.\n\n${safetyNote()}`);
});
$('#trackerBtn').addEventListener('click', () => $('#tracker').scrollIntoView({ behavior: 'smooth' }));

apiUrl.value = state.settings.apiUrl || '';
apiKey.value = state.settings.apiKey || '';
model.value = state.settings.model || 'gemini-3.7-flash';
$('#date').valueAsDate = new Date();
renderTracker();
addMessage('assistant', `Merhaba 👋 Ben Beray Sağlık AI. Sağlıkla ilgili normal bir sohbet başlatabilirsin; örneğin “Son iki gündür başım ağrıyor” veya “Bugünkü sağlık durumumu konuşalım.”\n\n${safetyNote()}`);
