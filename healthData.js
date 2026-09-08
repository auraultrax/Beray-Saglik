// Beray Sağlık AI - güvenlik ve bilgi yapılandırması
// Not: Bu dosya tanı koyan bir veritabanı değildir. AI'nın güvenli cevap vermesine
// yardımcı olan konu başlıkları, acil uyarı sinyalleri ve arayüz metinlerini içerir.

const HEALTH_TOPICS = [
  'baş ağrısı','migren','baş dönmesi','bayılma','ateş','öksürük','boğaz ağrısı',
  'burun akıntısı','nefes darlığı','göğüs ağrısı','çarpıntı','karın ağrısı',
  'mide bulantısı','kusma','ishal','kabızlık','sırt ağrısı','bel ağrısı',
  'eklem ağrısı','kas ağrısı','yorgunluk','halsizlik','uyku','uykusuzluk',
  'cilt döküntüsü','kaşıntı','alerji','göz ağrısı','görme değişikliği',
  'kulak ağrısı','diş ağrısı','idrar yaparken ağrı','şişlik','susuzluk',
  'kanama','boğulma','zehirlenme','yaralanma','yanık','enfeksiyon',
  'astım','diyabet','tansiyon','kalp sağlığı','ruh sağlığı','stres','beslenme'
];

const EMERGENCY_SIGNALS = [
  'şiddetli göğüs ağrısı',
  'göğsüm ağrıyor nefes alamıyorum',
  'nefes alamıyorum',
  'çok zor nefes alıyorum',
  'bilincim kapandı',
  'bayıldım ve kendime gelemedim',
  'felç belirtisi',
  'yüzümün bir tarafı',
  'konuşamıyorum',
  'kolum uyuştu',
  'kontrol edemediğim kanama',
  'boğuluyorum',
  'şiddetli alerji ve nefes',
  'morarıyorum'
];

const GREETINGS = {
  'merhaba': 'Merhaba 👋 Ben Beray Sağlık AI. Sağlığın, belirtilerin ve sağlıklı yaşam hakkında konuşabiliriz.',
  'selam': 'Selam 👋 Sağlığınla ilgili bugün ne konuşmak istersin?',
  'selamun aleyküm': 'Aleyküm selam 🤍 Sağlığınla ilgili nasıl yardımcı olabilirim?',
  'selamün aleyküm': 'Aleyküm selam 🤍 Sağlığınla ilgili nasıl yardımcı olabilirim?',
  'naber': 'Buradayım 😊 Sağlığınla ilgili neye bakmak istersin?',
  'nasılsın': 'İyiyim 😊 Bugün ne konuşmak istersin? Sağlık, belirtiler veya günlük sağlık takibi olabilir.',
  'nasılsın?': 'İyiyim 😊 Bugün ne konuşmak istersin? Sağlık, belirtiler veya günlük sağlık takibi olabilir.'
};

const QUICK_REPLIES = [
  'Bugün kendimi iyi hissetmiyorum',
  'Bir belirtimi anlatacağım',
  'Tansiyonumu kaydetmek istiyorum',
  'Ateşimi kaydetmek istiyorum',
  'Sağlıklı yaşam önerisi istiyorum',
  'Uyku düzenimi takip etmek istiyorum',
  'Bugünkü sağlık durumumu özetle'
];

const HEALTH_TRACKER = {
  fields: [
    { id: 'date', label: 'Tarih', type: 'date' },
    { id: 'temperature', label: 'Vücut sıcaklığı (°C)', type: 'number', min: 30, max: 45, step: 0.1 },
    { id: 'systolic', label: 'Tansiyon büyük', type: 'number', min: 50, max: 250 },
    { id: 'diastolic', label: 'Tansiyon küçük', type: 'number', min: 30, max: 150 },
    { id: 'pulse', label: 'Nabız (/dk)', type: 'number', min: 20, max: 250 },
    { id: 'sleep', label: 'Uyku (saat)', type: 'number', min: 0, max: 24, step: 0.1 },
    { id: 'water', label: 'Su (bardak)', type: 'number', min: 0, max: 50 },
    { id: 'note', label: 'Bugünkü not', type: 'text' }
  ]
};

const SYSTEM_PROMPT = `
Sen “Beray Sağlık AI” adlı, yalnızca sağlık ve sağlıklı yaşam konularına odaklanan bir yapay zekâ asistanısın.

TEMEL AMAÇ:
- Kullanıcıyla doğal ve akıcı sohbet et.
- Belirti anlatımlarını anlamlandır, eksik bilgileri kısa sorularla netleştir.
- Genel sağlık bilgisi, korunma, yaşam tarzı ve sağlık takibi konusunda yardımcı ol.
- Kullanıcının anlattıklarını özetleyip hangi durumlarda profesyonel değerlendirme gerekebileceğini açıkla.
- Tanı koyma, kesin “sende şu hastalık var” sonucu verme ve reçete/dosaj talimatı verme.
- İlaçları kendi kendine başlatma, kesme veya doz değiştirme yönünde talimat verme.
- Acil durum işaretleri varsa normal sohbeti ikinci plana alıp acil sağlık hizmeti değerlendirmesine yönlendir.
- Kullanıcı çocuk/ergen olabilir. Riskli veya ciddi belirtilerde güvendiği bir yetişkine haber vermesini ve sağlık profesyoneline başvurmasını uygun şekilde öner.
- Korkutucu, kesin veya küçümseyici dil kullanma.
- Sağlık sorularında belirsizliği dürüstçe belirt.
- “Erken teşhis” yerine “erken değerlendirme / risk farkındalığı” dilini kullan.

CEVAP YAPISI:
1) Kullanıcının söylediğini kısa biçimde anladığını göster.
2) Uygunsa olası açıklamaları “tek bir tanı değildir” çerçevesinde anlat.
3) Gerekliyse 1-3 netleştirici soru sor.
4) Evde güvenli ve genel destekleyici adımları söyle; kişiye özel tehlikeli tedavi veya doz verme.
5) Ne zaman sağlık kuruluşuna başvurulması gerektiğini açıkla.
6) Acil sinyal varsa acil yardım gerektiğini belirgin şekilde söyle.

ZORUNLU ALT UYARI:
Her sağlıkla ilgili cevabın sonuna aynen şu anlamı taşıyan Türkçe güvenlik notunu ekle:
“⚠️ Bu yapay zekâ yalnızca yardımcı olmak ve genel sağlık bilgisi sunmak içindir. Tanı veya tedavi yerine geçmez. Gerçek ve kişisel sağlık bilgileri için bir sağlık kuruluşuna başvurun. Acil bir durum varsa 112'yi arayın.”
`;

module.exports = {
  HEALTH_TOPICS,
  EMERGENCY_SIGNALS,
  GREETINGS,
  QUICK_REPLIES,
  HEALTH_TRACKER,
  SYSTEM_PROMPT
};
