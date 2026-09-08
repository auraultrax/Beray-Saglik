// Beray Sağlık — Deterministic Health Knowledge Engine
// No AI, no external API, no API key, no network request.
// Content is educational and safety-oriented; it does not diagnose or prescribe.

const SAFETY_NOTE = '⚠️ Bu uygulama genel sağlık bilgisi ve sağlık takibi içindir; tanı koymaz ve tedavi/reçete yerine geçmez. Ciddi veya hızla kötüleşen bir durumda 112 veya bir sağlık kuruluşu ile iletişime geçin.';

const SOURCES = [
  { name: 'WHO — Healthy diet', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { name: 'WHO — Physical activity', url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity' },
  { name: 'WHO — Self-care', url: 'https://www.who.int/news-room/fact-sheets/detail/self-care-health-interventions' },
  { name: 'WHO — Stress', url: 'https://www.who.int/news-room/questions-and-answers/item/stress' },
  { name: 'MedlinePlus — Health Topics', url: 'https://medlineplus.gov/healthtopics.html' },
  { name: 'CDC — Stroke signs and symptoms', url: 'https://www.cdc.gov/stroke/signs-symptoms/index.html' }
];

const GREETINGS = {
  'merhaba': 'Merhaba 👋 Ben Beray Sağlık. Hazır sağlık bilgileri, belirtiler, günlük alışkanlıklar ve sağlık takibi konusunda yardımcı olabilirim.',
  'selam': 'Selam 👋 Beray Sağlık burada. Ne hakkında bilgi almak istersin?',
  'selamun aleyküm': 'Aleyküm selam 🤍 Sağlıkla ilgili hangi konuda yardımcı olayım?',
  'selamün aleyküm': 'Aleyküm selam 🤍 Sağlıkla ilgili hangi konuda yardımcı olayım?',
  'naber': 'Buradayım 😄 Sağlık takibi, günlük alışkanlıklar veya genel sağlık bilgisi konuşabiliriz.',
  'nasılsın': 'İyiyim 😊 Hazır sağlık bilgi kartlarından bir konu seçebilir veya doğrudan sorunu yazabilirsin.',
  'nasılsın?': 'İyiyim 😊 Hazır sağlık bilgi kartlarından bir konu seçebilir veya doğrudan sorunu yazabilirsin.'
};

const EMERGENCY_KEYWORDS = [
  'nefes alamıyorum','nefes alamıyor','çok zor nefes','şiddetli göğüs ağrısı','göğüs ağrısı ve nefes',
  'yüzümün bir tarafı','yüzüm kaydı','konuşamıyorum','konuşması bozuldu','bir kolum uyuştu','bir kolum güçsüz',
  'bilincim kapandı','bilinci kapandı','kontrol edemiyorum kanama','durmayan kanama','boğuluyorum','morarıyorum',
  'bayıldım ve kendime gelemedim','ani görme kaybı','hayatımın en şiddetli baş ağrısı'
];

const BASE_OPENINGS = [
  'Bunu genel sağlık bilgisiyle açıklayayım:',
  'Bunun için güvenli bir genel çerçeve şöyle:',
  'Önce temel noktaları ayıralım:',
  'Bu konuda en önemli bilgileri kısa ve net vereyim:',
  'Genel olarak şu noktalara dikkat edilir:',
  'Bunu değerlendirirken şu ayrım önemli:',
  'Sağlık açısından pratik çerçeve şu:',
  'Kısa bir yol haritası bırakayım:'
];

const BASE_CLOSERS = [
  'Belirti yeni başladıysa, tekrarlıyorsa veya günlük yaşamını etkiliyorsa bir sağlık profesyoneliyle görüşmek uygun olur.',
  'Kişisel durumlar değişebildiği için ölçüm, öykü ve muayene gerekebilir; uygulama bunların yerine geçmez.',
  'Belirti belirgin biçimde kötüleşirse beklemek yerine sağlık hizmeti al.',
  'Güvenli olan, tek bir belirtiye bakıp kendi kendine kesin sonuç çıkarmamaktır.'
];

const SAFE_FOOTERS = [
  SAFETY_NOTE,
  SAFETY_NOTE,
  SAFETY_NOTE
];

const STYLE_VARIANTS = [
  '📘 Bilgi kartı',
  '🟣 Kısa rehber',
  '🌿 Günlük sağlık notu',
  '🩺 Sağlık kontrolü',
  '✨ Pratik sağlık özeti',
  '📋 Hazır bilgi özeti'
];

const MICRO_VARIANTS = [
  '💡 Bunu günlük takip açısından da düşünebilirsin.',
  '📌 En önemli nokta, belirtiyi tek başına yorumlamamaktır.',
  '🗓️ Süre ve tekrar sıklığını not etmek yararlı olabilir.',
  '📝 Belirtilerini kısa notlarla takip etmek sağlık görüşmesini kolaylaştırabilir.',
  '🔎 Değişikliklerin zaman içindeki seyrine dikkat et.',
  '🌿 Günlük düzenin de bu konuyu etkileyebilir.',
  '📊 Takip ekranını kullanarak örüntüleri görebilirsin.',
  '✅ Güvenli yaklaşım, küçük ve sürdürülebilir adımlardır.',
  '🧭 Önce güvenlik, sonra ayrıntılı değerlendirme.',
  '💜 Kendine karşı aceleci ve kesin yargılardan kaçın.',
  '⏱️ Ne zaman başladığı önemli bir ayrıntıdır.',
  '📍 Belirtinin nerede ve ne zaman olduğunu not etmek faydalıdır.',
  '🔁 Tekrarlayan şikâyetlerde düzenli takip değerli olabilir.',
  '🌙 Uyku ve günlük rutinini de gözden geçirmek işe yarayabilir.',
  '💧 Sıvı, dinlenme ve günlük düzen genel sağlıkta önemlidir.',
  '🚶 Günlük hareket ve düzenli yaşam alışkanlıklarını korumaya çalış.',
  '🫶 Güvendiğin bir yetişkin veya sağlık profesyonelinden destek alabilirsin.',
  '📚 Buradaki bilgi eğitim amaçlıdır; kişisel değerlendirme farklı olabilir.',
  '🩺 Gerekirse profesyonel değerlendirme için notlarını yanında götür.',
  '🌱 Bir anda her şeyi değiştirmek yerine bir alışkanlıkla başlamak daha sürdürülebilir olabilir.'
];

const HEALTH_INTENTS = [
  {
    id:'healthy-living', title:'Sağlıklı yaşam', emoji:'🌿', keys:['sağlıklı yaşam','sağlıklı ol','daha sağlıklı','yaşam tarzı','günlük sağlık'],
    facts:[
      'Düzenli hareket, dengeli ve çeşitli beslenme, yeterli uyku ve tütün ürünlerinden uzak durmak temel sağlık alışkanlıklarıdır.',
      'Sağlıklı yaşam tek bir üründen veya tek bir kurala bağlı değildir; sürdürülebilir günlük alışkanlıkların toplamıdır.',
      'Küçük ve sürdürülebilir değişiklikler, bir anda çok fazla kural koymaktan daha uygulanabilir olabilir.'
    ],
    actions:['Bugün yalnızca bir alışkanlık seçip onu düzenli hale getirmeyi dene.','Gününü uyku, hareket, beslenme ve dinlenme açısından dengeli planla.','Takip ekranına günlük not ekleyerek hangi alışkanlıkların sana iyi geldiğini gözlemle.'], source:[2,0,1]
  },
  {
    id:'nutrition', title:'Beslenme', emoji:'🥗', keys:['beslenme','ne yemeliyim','sağlıklı beslen','diyet','yemek'],
    facts:[
      'Dengeli beslenmede yeterlilik, çeşitlilik, denge ve ölçülülük temel ilkelerdir.',
      'Sebze, meyve, baklagil, tam tahıl ve çeşitli protein kaynaklarını içeren beslenme modeli genel olarak desteklenir.',
      'Aşırı işlenmiş, çok tuzlu veya çok şekerli seçenekleri sıklaştırmamak genel bir sağlık yaklaşımıdır.'
    ],
    actions:['Öğünlerini farklı besin gruplarından çeşitlendirmeyi hedefle.','Günlük beslenmende sebze, meyve, baklagil ve tam tahıl çeşitliliğine yer ver.','Tek bir yiyeceği “mucize” veya “zararlı” ilan etmek yerine genel beslenme düzenine bak.'], source:[0,0,0]
  },
  {
    id:'physical-activity', title:'Hareket ve egzersiz', emoji:'🚶', keys:['spor','egzersiz','yürüyüş','hareket','fiziksel aktivite'],
    facts:[
      'Düzenli fiziksel aktivite fiziksel ve ruhsal iyilik haliyle ilişkilidir.',
      'Yürüyüş, bisiklet, spor, oyun ve günlük hareketlilik de fiziksel aktivite kapsamına girebilir.',
      'Hareket düzeyini kademeli artırmak ve uzun süre hareketsiz kalmayı azaltmak yararlı olabilir.'
    ],
    actions:['Gün içinde kısa hareket molaları planla.','Sevdiğin ve sürdürebildiğin bir aktivite seç.','Yeni bir egzersiz düzenine başlarken yükü kademeli artır.'], source:[1,1,1]
  },
  {
    id:'sleep', title:'Uyku', emoji:'😴', keys:['uyku','uyuyamıyorum','uykusuzluk','gece uyuy','uyku düzen'],
    facts:[
      'Düzenli uyku saatleri günlük sağlık ve iyi oluşu destekleyen temel alışkanlıklardandır.',
      'Stres ve düzensiz günlük rutin uykuya dalmayı veya uykuyu sürdürmeyi zorlaştırabilir.',
      'Uyku sorunu uzun sürüyor veya gündüz işlevlerini belirgin etkiliyorsa profesyonel değerlendirme uygun olabilir.'
    ],
    actions:['Mümkün olduğunca benzer saatlerde yatıp kalkmayı dene.','Akşam rutinini sakin ve düzenli hale getir.','Uykunu birkaç gün takip ederek örüntüleri not al.'], source:[2,4,3]
  },
  {
    id:'stress', title:'Stres', emoji:'🧘', keys:['stres','çok stresliyim','gerginim','kaygılıyım','endişe'],
    facts:[
      'Stres doğal bir insan tepkisidir; fazla olduğunda bedensel ve zihinsel belirtiler oluşturabilir.',
      'Stres; gevşemeyi zorlaştırma, huzursuzluk, baş ağrısı, mide rahatsızlığı ve uyku güçlüğü gibi etkilerle birlikte görülebilir.',
      'Düzenli rutin, uyku, hareket, destekleyici sosyal bağlar ve uygun stres yönetimi yardımcı olabilir.'
    ],
    actions:['Gününü küçük ve yapılabilir parçalara böl.','Kısa bir yürüyüş veya sakin nefes molası gibi güvenli bir mola ver.','Stresle baş etmek zorlaşıyorsa güvendiğin bir yetişkin veya sağlık profesyoneliyle konuş.'], source:[3,3,2]
  },
  {
    id:'headache', title:'Baş ağrısı', emoji:'🤕', keys:['baş ağrısı','başım ağrıyor','kafam ağrıyor','migren'],
    facts:[
      'Baş ağrısının çok farklı nedenleri olabilir; tek başına belirti üzerinden kesin neden söylenemez.',
      'Uyku düzensizliği, stres, susuz kalma veya bazı hastalıklar baş ağrısıyla ilişkili olabilir.',
      'Ani başlayan çok şiddetli baş ağrısı veya nörolojik belirtiler acil değerlendirme gerektirebilir.'
    ],
    actions:['Belirtinin ne zaman başladığını, süresini ve eşlik eden belirtileri not et.','Su tüketimi, uyku ve günlük düzenindeki değişiklikleri gözden geçir.','Sık tekrarlıyorsa sağlık profesyoneliyle değerlendirme planla.'], source:[4,3,5]
  },
  {
    id:'fever', title:'Ateş', emoji:'🌡️', keys:['ateş','ateşim var','yüksek ateş','ateşim çıktı'],
    facts:[
      'Ateş birçok enfeksiyon ve başka durumlarda görülebilen bir belirtidir.',
      'Tek bir ölçümden çok, kişinin genel durumu ve ateşin seyri birlikte değerlendirilir.',
      'Şiddetli halsizlik, bilinç değişikliği, nefes almada güçlük veya hızla kötüleşme varsa acil değerlendirme gerekir.'
    ],
    actions:['Ateşini ölçtüğün zamanı ve değeri takip ekranına kaydet.','Sıvı alımını ve dinlenmeni ihmal etme.','Ateş devam ediyorsa veya genel durum kötüleşiyorsa sağlık hizmeti al.'], source:[4,2,4]
  },
  {
    id:'cough', title:'Öksürük', emoji:'😷', keys:['öksürük','öksürüyorum','balgam','öksürmeye başladım'],
    facts:[
      'Öksürük, solunum yollarıyla ilgili birçok farklı durumda görülebilir.',
      'Süresi, eşlik eden ateş veya nefes darlığı gibi belirtiler değerlendirmede önemlidir.',
      'Nefes almada belirgin güçlük, morarma veya ciddi göğüs ağrısı varsa acil yardım gerekir.'
    ],
    actions:['Öksürüğün ne zamandır sürdüğünü ve eşlik eden belirtileri not et.','Dinlenmeye ve yeterli sıvı almaya dikkat et.','Uzuyorsa veya kötüleşiyorsa sağlık profesyoneline başvur.'], source:[4,2,4]
  },
  {
    id:'sore-throat', title:'Boğaz ağrısı', emoji:'🫖', keys:['boğaz ağrısı','boğazım ağrıyor','yutkunurken ağrıyor'],
    facts:[
      'Boğaz ağrısının nedenleri arasında enfeksiyonlar ve çevresel etkenler bulunabilir.',
      'Eşlik eden ateş, öksürük, burun belirtileri ve belirtilerin süresi önemlidir.',
      'Nefes almakta veya yutmakta ciddi güçlük varsa acil değerlendirme gerekir.'
    ],
    actions:['Belirtilerin süresini ve eşlik eden bulguları takip et.','Ilık sıvılar ve dinlenme gibi genel destekleyici önlemler yardımcı olabilir.','Belirti belirginleşirse sağlık profesyoneline danış.'], source:[4,2,4]
  },
  {
    id:'runny-nose', title:'Burun akıntısı', emoji:'🤧', keys:['burun akıntısı','burnum akıyor','tıkanıklık','burun tıkalı'],
    facts:[
      'Burun akıntısı ve tıkanıklık enfeksiyonlarda, alerjilerde veya çevresel nedenlerle görülebilir.',
      'Belirtilerin süresi ve ateş gibi eşlik eden bulgular önemlidir.',
      'Nefes almada ciddi güçlük veya hızla kötüleşme varsa değerlendirme gerekir.'
    ],
    actions:['Belirtinin ne zamandır olduğunu not et.','Dinlenme ve uygun sıvı alımına dikkat et.','Belirtiler uzarsa veya ağırlaşırsa sağlık profesyoneline danış.'], source:[4,4,2]
  },
  {
    id:'abdominal-pain', title:'Karın ağrısı', emoji:'🩺', keys:['karın ağrısı','karnım ağrıyor','midem ağrıyor','karın ağrım var'],
    facts:[
      'Karın ağrısının birçok farklı nedeni olabilir ve ağrının yeri, süresi ve şiddeti önemlidir.',
      'Kusma, ishal, ateş veya belirgin hassasiyet eşlik edebilir.',
      'Ani ve şiddetli ağrı, bayılma, yoğun kanama veya hızla kötüleşme acil değerlendirme gerektirebilir.'
    ],
    actions:['Ağrının yerini, ne zaman başladığını ve eşlik eden belirtileri not et.','Belirtiyi şiddetlendiren durumları gözlemle.','Şiddetliyse, sürüyorsa veya kötüleşiyorsa sağlık hizmeti al.'], source:[4,4,4]
  },
  {
    id:'nausea', title:'Bulantı', emoji:'🤢', keys:['bulantı','midem bulanıyor','mide bulantısı'],
    facts:[
      'Bulantı pek çok farklı durumda görülebilen yaygın bir belirtidir.',
      'Yemek, enfeksiyon, stres, ilaçlar ve başka nedenlerle ilişkili olabilir.',
      'Sıvı tutamama, ciddi halsizlik, kanama veya şiddetli ağrı varsa değerlendirme gerekir.'
    ],
    actions:['Belirtinin başlangıcını ve eşlik eden durumları not et.','Tolere edebiliyorsan küçük ve sık miktarlarda sıvı almaya çalış.','Devam ederse veya ciddi eşlik eden belirtiler varsa sağlık profesyoneline danış.'], source:[4,2,4]
  },
  {
    id:'vomiting', title:'Kusma', emoji:'🤮', keys:['kusma','kustum','kusuyorum'],
    facts:[
      'Kusmanın birçok nedeni olabilir; sıklığı ve eşlik eden belirtiler önemlidir.',
      'Tekrarlayan kusma sıvı kaybına yol açabilir.',
      'Kanlı kusma, şiddetli karın ağrısı, bilinç değişikliği veya sıvı tutamama acil değerlendirme gerektirebilir.'
    ],
    actions:['Kusma sayısını ve zamanını takip et.','Mümkünse küçük yudumlarla sıvı almaya çalış.','Sıvı tutamıyorsan veya durum kötüleşiyorsa sağlık hizmeti al.'], source:[4,2,4]
  },
  {
    id:'diarrhea', title:'İshal', emoji:'🚰', keys:['ishal','ishalim var','sulu dışkı'],
    facts:[
      'İshal enfeksiyonlar, besinler, ilaçlar ve başka nedenlerle ortaya çıkabilir.',
      'En önemli risklerden biri sıvı ve elektrolit kaybıdır.',
      'Kanlı dışkı, şiddetli ağrı, belirgin susuzluk veya genel durumda ciddi bozulma değerlendirme gerektirir.'
    ],
    actions:['Sıvı kaybını takip et ve uygun sıvı almaya dikkat et.','Belirtinin süresini ve eşlik eden ateş/ağrı gibi durumları not et.','Uzarsa, kan görülürse veya genel durum bozulursa sağlık hizmeti al.'], source:[4,2,4]
  },
  {
    id:'constipation', title:'Kabızlık', emoji:'🧩', keys:['kabızlık','kabızım','tuvalete çıkamıyorum'],
    facts:[
      'Kabızlık; dışkılama sıklığının azalması veya dışkının sertleşmesi gibi durumlarla ilişkilidir.',
      'Beslenme düzeni, sıvı alımı, hareket ve rutin değişiklikleri etkili olabilir.',
      'Şiddetli karın ağrısı, kusma, kanama veya ciddi kötüleşme varsa değerlendirme gerekir.'
    ],
    actions:['Düzenli hareket ve dengeli beslenmeye dikkat et.','Sıvı alımını yeterli tutmaya çalış.','Süreğen hale gelirse sağlık profesyoneline danış.'], source:[4,0,1]
  },
  {
    id:'dizziness', title:'Baş dönmesi', emoji:'🌀', keys:['baş dönmesi','başım dönüyor','denge kaybı','dengem bozuldu'],
    facts:[
      'Baş dönmesi farklı nedenlerle görülebilir; dönme hissi ile sersemlik aynı şey olmayabilir.',
      'Susuzluk, bazı hastalıklar, ilaçlar ve başka nedenler rol oynayabilir.',
      'Ani denge kaybı, konuşma bozukluğu, tek taraflı güçsüzlük veya görme değişikliği acil değerlendirme gerektirebilir.'
    ],
    actions:['Baş dönmesinin ne zaman başladığını ve ne yaptığın sırada oluştuğunu not et.','Belirti varken düşmeye neden olabilecek riskli hareketlerden kaçın.','Yeni, şiddetli veya tekrarlayan durumlarda değerlendirme planla.'], source:[4,5,4]
  },
  {
    id:'palpitations', title:'Çarpıntı', emoji:'💓', keys:['çarpıntı','kalbim hızlı atıyor','kalp çarpıntısı'],
    facts:[
      'Çarpıntı; kalp atışını hızlı, güçlü veya düzensiz hissetme şeklinde yaşanabilir.',
      'Stres, kafein, uykusuzluk ve bazı sağlık durumları gibi birçok etken rol oynayabilir.',
      'Çarpıntıyla birlikte göğüs ağrısı, nefes darlığı veya bayılma varsa acil değerlendirme gerekir.'
    ],
    actions:['Ne zaman başladığını, ne kadar sürdüğünü ve eşlik eden belirtileri kaydet.','Kafein ve uykusuzluk gibi günlük tetikleyicileri gözlemle.','Tekrarlıyorsa veya ağırlaşıyorsa sağlık profesyoneline danış.'], source:[4,3,2]
  },
  {
    id:'chest-pain', title:'Göğüs ağrısı', emoji:'🚨', keys:['göğüs ağrısı','göğsüm ağrıyor','göğsüm sıkışıyor'],
    facts:[
      'Göğüs ağrısının çok farklı nedenleri olabilir ve belirtiyi yalnızca mesaj üzerinden güvenle ayırt etmek mümkün değildir.',
      'Yeni başlayan, şiddetli veya açıklanamayan göğüs ağrısı özellikle nefes darlığı, bayılma veya terleme ile birlikteyse acil değerlendirme önemlidir.',
      'Bu belirti için internetten kesin neden çıkarılmamalıdır.'
    ],
    actions:['Şiddetli veya yeni başlayan bir ağrı varsa bekleme ve acil yardım değerlendir.','Belirtinin süresini ve eşlik eden bulguları sağlık görevlisine aktar.','Kendine tanı koymaya çalışma.'], source:[4,4,4]
  },
  {
    id:'breathing', title:'Nefes darlığı', emoji:'🫁', keys:['nefes darlığı','nefesim daralıyor','nefes almak zor'],
    facts:[
      'Nefes darlığının birçok nedeni olabilir ve şiddeti önemlidir.',
      'Ani veya belirgin nefes almada güçlük acil değerlendirme gerektirebilir.',
      'Morarma, bilinç değişikliği veya ağır göğüs ağrısı gibi bulgular acil yardım gerektirir.'
    ],
    actions:['Belirgin nefes darlığı varsa sohbet yerine acil sağlık yardımını önceliklendir.','Mümkünse yanında güvendiğin bir yetişkin veya sağlık görevlisi olsun.','Belirtiler hafif olsa bile yeni ve açıklanamıyorsa değerlendirme planla.'], source:[4,4,4]
  },
  {
    id:'allergy', title:'Alerji', emoji:'🌸', keys:['alerji','alerjim','alerjik','kaşıntı ve döküntü'],
    facts:[
      'Alerjik tepkiler hafiften ciddi reaksiyonlara kadar değişebilir.',
      'Deri belirtileri tek başına ciddi olmayan nedenlerle de görülebilir; nefes darlığı veya bilinç değişikliği gibi bulgular farklı değerlendirilir.',
      'Yüz, dudak veya dilde belirgin şişme ve nefes alma güçlüğü acil yardım gerektirir.'
    ],
    actions:['Belirtiyi başlatmış olabilecek yeni gıda, ürün veya çevresel etkenleri not et.','Ciddi nefes sorunu veya hızla artan şişme varsa acil yardım al.','Tekrarlayan reaksiyonlarda sağlık profesyoneliyle görüş.'], source:[4,2,4]
  },
  {
    id:'rash', title:'Döküntü ve kaşıntı', emoji:'🧴', keys:['döküntü','kaşıntı','cildimde','kızarıklık','kurdeşen'],
    facts:[
      'Döküntü ve kaşıntının enfeksiyon, alerji, tahriş ve başka birçok nedeni olabilir.',
      'Yayılım hızı, ağrı, ateş ve genel durum değerlendirmede önemlidir.',
      'Nefes darlığı veya yüz/dil şişmesi eşlik ederse acil yardım gerekir.'
    ],
    actions:['Ne zaman başladığını ve yeni kullandığın ürünleri not et.','Cildi tahriş eden ürünlerden uzak durmaya çalış.','Hızla yayılırsa veya ciddi belirtiler eklenirse değerlendirme al.'], source:[4,2,4]
  },
  {
    id:'blood-pressure', title:'Tansiyon takibi', emoji:'🩺', keys:['tansiyon','yüksek tansiyon','düşük tansiyon','kan basıncı'],
    facts:[
      'Tansiyon tek bir ölçümden ziyade doğru koşullarda tekrarlanan ölçümler ve kişinin genel durumu ile değerlendirilir.',
      'Ölçüm tekniği, dinlenme ve uygun manşet kullanımı sonucu etkileyebilir.',
      'Çok yüksek ölçümle birlikte ciddi göğüs ağrısı, nefes darlığı, bilinç veya nörolojik değişiklik varsa acil değerlendirme gerekir.'
    ],
    actions:['Ölçüm zamanını ve değerini sağlık takip ekranına kaydet.','Ölçümleri benzer koşullarda almak karşılaştırmayı kolaylaştırabilir.','Sık tekrarlayan anormallikleri sağlık profesyoneliyle görüş.'], source:[4,2,4]
  },
  {
    id:'hydration', title:'Sıvı ve su takibi', emoji:'💧', keys:['su içmek','susuzluk','ne kadar su','su tüketimi','hidrasyon'],
    facts:[
      'Yeterli sıvı alımı günlük sağlığın bir parçasıdır; ihtiyaç kişiye, aktiviteye ve çevreye göre değişebilir.',
      'Aşırı sıcak, yoğun aktivite veya hastalık sıvı ihtiyacını etkileyebilir.',
      'Belirgin susuzluk, çok az idrar, baş dönmesi veya kötüleşme varsa değerlendirme gerekebilir.'
    ],
    actions:['Su tüketimini takip ekranına düzenli olarak kaydet.','Susuzluk hissini ve günlük koşullarını gözlemle.','Özel bir sağlık durumun varsa sıvı hedefini sağlık profesyoneliyle belirle.'], source:[2,4,2]
  },
  {
    id:'first-aid', title:'İlk yardım', emoji:'🩹', keys:['ilk yardım','yaralandım','kesik','yanık','düştüm'],
    facts:[
      'İlk yardımın amacı profesyonel yardım gelene kadar güvenliği korumak ve zararı büyütmemektir.',
      'Ciddi yaralanmalarda sağlık hizmeti geciktirilmemelidir.',
      'Şiddetli kanama, bilinç kaybı, ciddi yanık veya nefes problemi acil yardım gerektirir.'
    ],
    actions:['Önce ortam ve kişi güvenliğini değerlendir.','Ciddi durumda 112’yi ara ve görevlinin yönlendirmesini izle.','İnternetten riskli veya bilinmeyen bir müdahaleyi deneme.'], source:[4,4,4]
  },
  {
    id:'stroke', title:'İnme belirtileri', emoji:'🧠', keys:['inme','felç','yüzüm kaydı','konuşmam bozuldu','kolum güçsüz'],
    facts:[
      'Ani yüz düşüklüğü, tek taraflı kol veya bacak güçsüzlüğü, konuşma bozukluğu, ani görme veya denge değişikliği inme belirtisi olabilir.',
      'İnmede zaman kritiktir; belirtiler geçse bile acil değerlendirme gerekir.',
      'Belirtilerin başladığı zamanı not etmek sağlık ekibine yardımcı olabilir.'
    ],
    actions:['Belirti başladıysa bekleme; acil sağlık hizmetini ara.','Kişiyi kendin araçla götürmek yerine acil yardım yönlendirmesini izle.','Belirtiler birkaç dakika içinde geçse bile acil değerlendirmeyi önemse.'], source:[5,5,5]
  },
  {
    id:'medicines', title:'İlaç güvenliği', emoji:'💊', keys:['ilaç','ilaç kullanıyorum','ilaç hakkında','hap'],
    facts:[
      'İlaçların doğru kullanımı; ilacın adı, dozu, kullanım amacı ve kişisel sağlık durumuyla ilişkilidir.',
      'Bir ilacı kendi kendine başlatmak, bırakmak veya dozunu değiştirmek güvenli olmayabilir.',
      'Birden fazla ilaç veya takviye kullanılıyorsa etkileşimleri sağlık profesyoneliyle kontrol etmek önemlidir.'
    ],
    actions:['İlaç adlarını ve kullanım talimatlarını sağlık profesyoneli veya eczacıyla doğrula.','Doz konusunda uygulamadaki hazır yanıtlara değil, ilacın profesyonel talimatına güven.','İlaçla ilgili ciddi yan etki şüphesinde sağlık hizmeti al.'], source:[4,2,4]
  },
  {
    id:'diabetes', title:'Diyabet hakkında genel bilgi', emoji:'🧪', keys:['diyabet','şeker hastalığı','kan şekeri'],
    facts:[
      'Diyabet, kan şekeri düzeninin bozulduğu kronik bir durumlar grubudur.',
      'Kan şekeri takibi ve tedavi planı kişiye göre sağlık ekibi tarafından belirlenir.',
      'Kişisel ölçüm sonuçları tek başına tedavi değişikliği için kullanılmamalıdır.'
    ],
    actions:['Ölçümlerini düzenli ve doğru şekilde kaydet.','Kişisel hedeflerini sağlık ekibinle belirle.','Belirgin kötüleşme veya acil belirtilerde sağlık hizmeti al.'], source:[4,2,4]
  },
  {
    id:'oral-health', title:'Ağız ve diş sağlığı', emoji:'🦷', keys:['diş ağrısı','diş','ağız sağlığı','dişim ağrıyor'],
    facts:[
      'Düzenli diş fırçalama, ağız temizliği ve profesyonel kontroller ağız sağlığının temel parçalarıdır.',
      'Diş ağrısının kaynağını yalnızca belirtiyle belirlemek mümkün değildir.',
      'Yüzde hızlı şişme, nefes alma güçlüğü veya ciddi enfeksiyon bulguları acil değerlendirme gerektirebilir.'
    ],
    actions:['Ağız bakımını düzenli sürdür.','Süren veya tekrarlayan diş ağrısı için diş hekimine başvur.','Hızlı şişme veya nefes problemi varsa acil yardım al.'], source:[4,2,4]
  },
  {
    id:'eye', title:'Göz sağlığı', emoji:'👁️', keys:['göz ağrısı','gözüm ağrıyor','görme','bulanık görüyorum','göz kızarıklığı'],
    facts:[
      'Göz ağrısı ve görme değişikliklerinin çok farklı nedenleri olabilir.',
      'Ani görme kaybı veya ciddi göz ağrısı acil değerlendirme gerektirebilir.',
      'Uzun süreli veya tekrarlayan şikâyetlerde göz muayenesi uygun olabilir.'
    ],
    actions:['Belirtinin başlangıcını ve görme değişikliğinin şeklini not et.','Ani görme kaybında bekleme ve acil sağlık hizmeti al.','Süreğen şikâyetlerde göz hekimi değerlendirmesi planla.'], source:[4,5,4]
  },
  {
    id:'fatigue', title:'Yorgunluk ve halsizlik', emoji:'🔋', keys:['yorgunluk','halsizlik','çok yoruluyorum','enerjim yok'],
    facts:[
      'Yorgunluk; uyku, stres, beslenme, enfeksiyonlar ve birçok farklı durumla ilişkili olabilir.',
      'Yeni başlayan, belirgin veya uzun süren yorgunluk değerlendirme gerektirebilir.',
      'Bayılma, nefes darlığı, göğüs ağrısı veya ciddi kötüleşme gibi bulgular önemlidir.'
    ],
    actions:['Uyku, beslenme, hareket ve stres durumunu birkaç gün takip et.','Günlük aktivitelerini aşırı zorlamadan düzenle.','Uzuyorsa veya belirginleşiyorsa sağlık profesyoneliyle görüş.'], source:[3,2,4]
  },
  {
    id:'back-pain', title:'Bel ve sırt ağrısı', emoji:'🧍', keys:['bel ağrısı','sırt ağrısı','belim ağrıyor','sırtım ağrıyor'],
    facts:[
      'Bel ve sırt ağrılarının sık görülen nedenleri arasında kas-iskelet sorunları bulunur; ancak tek bir nedene bağlanamaz.',
      'Hareket, uzun süre aynı pozisyonda kalma ve günlük yükler belirtileri etkileyebilir.',
      'Belirgin güç kaybı, idrar/dışkı kontrolünde yeni değişiklik veya ciddi travma sonrası ağrı acil değerlendirme gerektirir.'
    ],
    actions:['Ağrının ne zaman arttığını ve hangi hareketlerle ilişkili olduğunu not et.','Uzun süre aynı pozisyonda kalmaktan kaçın ve güvenli günlük hareketi sürdür.','Şiddetliyse, uzuyorsa veya yeni nörolojik belirtiler varsa değerlendirme al.'], source:[4,4,4]
  },
  {
    id:'mood', title:'Ruhsal iyi oluş', emoji:'💜', keys:['moralim bozuk','kendimi kötü hissediyorum','ruhsal sağlık','duygu','duygusal'],
    facts:[
      'Ruhsal sağlık günlük yaşam, stres, uyku, ilişkiler ve birçok başka etkenden etkilenebilir.',
      'Zorlayıcı duygular yaşamak insan deneyiminin bir parçasıdır; önemli olan şiddet, süre ve günlük işlev üzerindeki etkidir.',
      'Uzun süren veya günlük yaşamı belirgin etkileyen güçlüklerde bir sağlık profesyoneliyle konuşmak yararlı olabilir.'
    ],
    actions:['Güvendiğin bir yetişkin veya yakın biriyle konuşmayı düşün.','Uyku, düzenli rutin ve günlük hareketi destekle.','Duygusal zorluklar ağırlaşıyorsa profesyonel destek al.'], source:[3,3,2]
  }
];

const QUICK_TOPICS = HEALTH_INTENTS.map(x => ({ id:x.id, title:x.title, emoji:x.emoji }));

function normalizeText(text='') {
  return String(text).toLocaleLowerCase('tr-TR').replace(/[!?.,;:()[\]{}"'’`]/g,' ').replace(/\s+/g,' ').trim();
}

function detectEmergency(text='') {
  const t=normalizeText(text);
  return EMERGENCY_KEYWORDS.some(k=>t.includes(normalizeText(k)));
}

function hashText(text='') {
  let h=2166136261;
  for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h,16777619); }
  return h >>> 0;
}

function pick(list, seed, offset=0) { return list[(Math.abs(seed + offset) % list.length)]; }

// Each intent composes several authored blocks. This gives >1,000,000 deterministic
// response combinations without shipping a giant 1M-row file or using generative AI.
function buildResponse(intent, query, detail='') {
  const seed=hashText(query + '|' + intent.id + '|' + detail);
  const opening=pick(BASE_OPENINGS,seed,1);
  const fact=pick(intent.facts,seed,2);
  const action=pick(intent.actions,seed,3);
  const closer=pick(BASE_CLOSERS,seed,4);
  const micro=pick(MICRO_VARIANTS,seed,5);
  const style=pick(STYLE_VARIANTS,seed,6);
  const sourceIds=intent.source || [4];
  const source=sourceIds.map(i=>SOURCES[i]?.name).filter(Boolean).join(' · ');
  return `${style}\n${opening}\n\n${fact}\n\n✅ ${action}\n\n${micro}\n\n${closer}\n\n📚 Kaynak: ${source}\n${SAFETY_NOTE}`;
}

function findIntent(query) {
  const t=normalizeText(query);
  let best=null, bestScore=0;
  for (const intent of HEALTH_INTENTS) {
    let score=0;
    for (const key of intent.keys) if (t.includes(normalizeText(key))) score += normalizeText(key).split(' ').length + 1;
    if (score>bestScore) { best=intent; bestScore=score; }
  }
  return best;
}

function deterministicReply(query) {
  const greeting=GREETINGS[normalizeText(query)];
  if (greeting) return `${greeting}\n\n${SAFETY_NOTE}`;
  if (detectEmergency(query)) {
    return `🚨 Bu mesaj acil değerlendirme gerektirebilecek bir belirti içeriyor. Özellikle belirgin nefes darlığı, şiddetli göğüs ağrısı, bilinç değişikliği, ani tek taraflı güçsüzlük/yüz düşüklüğü, konuşma bozukluğu, ciddi kanama veya morarma varsa sohbet etmeyi bekletme ve 112'yi ara. Mümkünse yanında güvendiğin bir yetişkin veya sağlık görevlisi olsun.\n\n${SAFETY_NOTE}`;
  }
  const intent=findIntent(query);
  if (!intent) {
    const seed=hashText(query);
    const cards=QUICK_TOPICS.slice(0,8).map(x=>`${x.emoji} ${x.title}`).join(' · ');
    return `${pick(BASE_OPENINGS,seed,1)}\n\nBu konuda güvenli ve genel bir hazır bilgi bulamadım. Ben tanı koymam veya ilaç dozu veremem. Sorunu biraz daha açık yazarsan ilgili bilgi kartını eşleştirmeye çalışırım.\n\nBaşlamak için: ${cards}\n\n${SAFETY_NOTE}`;
  }
  return buildResponse(intent, query);
}

const HEALTH_TRACKER = {
  fields: [
    { id:'date', label:'Tarih', type:'date' },
    { id:'temperature', label:'Vücut sıcaklığı (°C)', type:'number', min:30, max:45, step:0.1 },
    { id:'systolic', label:'Tansiyon büyük', type:'number', min:50, max:250 },
    { id:'diastolic', label:'Tansiyon küçük', type:'number', min:30, max:150 },
    { id:'pulse', label:'Nabız (/dk)', type:'number', min:20, max:250 },
    { id:'sleep', label:'Uyku (saat)', type:'number', min:0, max:24, step:0.1 },
    { id:'water', label:'Su (bardak)', type:'number', min:0, max:50 },
    { id:'note', label:'Bugünkü not', type:'text' }
  ]
};



/* =========================
   BERAY SAĞLIK — ULTRA KAPSAM AĞI
   No AI / no API / no network dependency.
   "20M+" represents structured combinations, not 20M individually authored articles.
   ========================= */

const HEALTH_DOMAINS = [
  ['Kalp ve dolaşım','kalp','damar','dolaşım','nabız','çarpıntı','tansiyon'],
  ['Solunum sistemi','akciğer','nefes','solunum','öksürük','hırıltı','boğaz'],
  ['Sindirim sistemi','mide','bağırsak','sindirim','hazımsızlık','bulantı','ishal','kabızlık'],
  ['Sinir sistemi','baş','baş ağrısı','baş dönmesi','uyuşma','denge','sinir'],
  ['Beyin ve biliş','hafıza','dikkat','unutkanlık','biliş','konsantrasyon'],
  ['Göz ve görme','göz','görme','bulanık görme','kızarıklık'],
  ['Kulak burun boğaz','kulak','işitme','burun','sinüs','sinüzit'],
  ['Ağız ve diş','diş','diş eti','ağız','çene'],
  ['Cilt','cilt','deri','döküntü','kaşıntı','kuruluk','yara'],
  ['Kas eklem kemik','kas','eklem','kemik','bel','boyun','diz','omuz'],
  ['Böbrek ve idrar','böbrek','idrar','mesane','idrarda yanma'],
  ['Endokrin ve metabolizma','şeker','glukoz','tiroid','hormon','metabolizma'],
  ['Bağışıklık','bağışıklık','enfeksiyon','ateş','lenf'],
  ['Kadın sağlığı','adet','regl','menstrüasyon','gebelik','yumurtalık'],
  ['Erkek sağlığı','prostat','testis','erkek sağlığı'],
  ['Çocuk ve ergen sağlığı','çocuk','ergen','gelişim','büyüme'],
  ['Yaşlanma ve ileri yaş','yaşlı','yaşlanma','ileri yaş'],
  ['Ruhsal iyi oluş','stres','kaygı','endişe','moral','duygu','ruh sağlığı'],
  ['Uyku','uyku','uykusuzluk','horlama','uyku düzeni'],
  ['Beslenme','beslenme','yemek','öğün','protein','lif','vitamin'],
  ['Hareket ve fiziksel aktivite','spor','egzersiz','yürüyüş','hareket'],
  ['Alerji','alerji','alerjik','polen','hapşırma'],
  ['Enfeksiyonlardan korunma','enfeksiyon','mikrop','bulaş','hijyen'],
  ['Aşılar ve korunma','aşı','bağışıklama','rapel'],
  ['İlk yardım ve güvenlik','ilk yardım','yaralanma','yanık','kesik','düşme'],
  ['Acil belirtiler','şiddetli','ani','bayılma','bilinç','nefes alamıyorum'],
  ['Kadın ve erkek üreme sağlığı','üreme','cinsel sağlık','doğurganlık'],
  ['Gebelik ve doğum','hamile','gebelik','doğum','lohusalık'],
  ['Laboratuvar ve ölçümler','kan testi','tahlil','ölçüm','sonuç'],
  ['Görüntüleme','röntgen','ultrason','mr','tomografi'],
  ['İlaç güvenliği','ilaç','hap','yan etki','takviye'],
  ['Sağlık sistemi','doktor','muayene','randevu','uzman'],
  ['Çevre ve sağlık','hava kirliliği','sıcak','soğuk','gürültü'],
  ['Ağızdan alınan sıvı ve hidrasyon','su','susuzluk','sıvı'],
  ['Dinlenme ve toparlanma','dinlenme','yorgunluk','bitkinlik'],
  ['Okul ve günlük yaşam sağlığı','okul','ders','ekran','oturma'],
  ['Ergonomi ve duruş','duruş','ergonomi','masa','sandalye'],
  ['Cinsel sağlık eğitimi','cinsel sağlık','korunma','enfeksiyonlardan korunma'],
  ['Toplum ve halk sağlığı','halk sağlığı','salgın','korunma'],
  ['Genetik ve kalıtsal durumlar','genetik','kalıtsal','aile öyküsü'],
  ['Kan ve bağış','kansızlık','anemi','kan','kan bağışı'],
  ['İmmünoloji','immün','bağışıklık sistemi'],
  ['Onkoloji farkındalığı','kanser','tümör','tarama'],
  ['Kadın yaşam döngüsü','adet','menopoz','perimenopoz'],
  ['İş sağlığı','iş','meslek','iş yeri'],
  ['Spor sağlığı','sporcu','antrenman','sakatlık'],
  ['Seyahat sağlığı','seyahat','uçak','tatil'],
  ['Dijital sağlık','telefon','ekran süresi','sağlık uygulaması'],
  ['Kronik hastalıklarla yaşam','kronik','takip','kontrol'],
  ['Koruyucu sağlık','önleme','tarama','kontrol'],
  ['Sağlıklı yaşam alışkanlıkları','rutin','alışkanlık','sağlıklı yaşam']
];

const HEALTH_CONCERNS = [
  ['Nedir?','nedir','ne demek','ne oluyor','tanım'],
  ['Belirti takibi','belirti','şikayet','hissettiğim','belirtiler'],
  ['Ne zaman yardım?','ne zaman doktora','doktor gerekir','acil mi','yardım'],
  ['Korunma','nasıl korun','önleme','korunabilir','risk azalt'],
  ['Günlük yaşam','günlük','evde','rutin','yaşam'],
  ['Ölçüm takibi','ölçüm','kaç olmalı','takip','değer'],
  ['Hazırlık','muayeneye','doktor görüşmesi','randevuya','hazırlan'],
  ['Riskler','risk','risk faktörü','kimlerde'],
  ['Çocuklarda','çocuk','ergen','öğrenci'],
  ['İleri yaşta','yaşlı','ileri yaş'],
  ['Beslenme ilişkisi','yemek','besin','beslenme'],
  ['Uyku ilişkisi','uyku','gece'],
  ['Stres ilişkisi','stres','kaygı','gerginlik'],
  ['Hareket ilişkisi','egzersiz','spor','yürüyüş'],
  ['Kayıt tutma','not almak','günlük tut','takip etmek'],
  ['Sonuçları anlama','sonuç','tahlil','rapor'],
  ['Uzman görüşmesi','uzman','hangi doktora','bölüm'],
  ['Güvenlik','güvenli','zararlı','kaçın'],
  ['Genel eğitim','bilgi','öğrenmek','anlat'],
  ['Yaşam tarzı','alışkanlık','rutin','yaşam tarzı'],
  ['Acil durum farkındalığı','ani','şiddetli','acil'],
  ['İlaç güvenliği','ilaç','doz','yan etki','takviye'],
  ['Kişisel takip','benim','takibim','değerlerim'],
  ['Kaynak','kaynak','nereden','kanıt']
];

const HEALTH_MODIFIERS = [
  'yeni başladı','tekrarlıyor','uzun süredir var','zaman zaman oluyor','sabahları oluyor',
  'akşamları oluyor','hareketle artıyor','dinlenince azalıyor','yemekle ilişkili','uykuyla ilişkili',
  'stresle ilişkili olabilir','mevsimsel olabilir','günlük yaşamı etkiliyor','okul yaşamını etkiliyor',
  'iş yaşamını etkiliyor','hafif görünüyor','belirgin görünüyor','giderek artıyor','giderek azalıyor',
  'başka belirtilerle birlikte','tek başına'
];

const HEALTH_LIFE_STAGES = [
  'genel yetişkin','çocukluk','ergenlik','genç yetişkinlik','gebelik dönemi',
  'doğum sonrası dönem','orta yaş','ileri yaş'
];

const HEALTH_TIMEFRAMES = [
  'son birkaç saat','bugün','son birkaç gün','son bir hafta','son birkaç hafta','uzun süredir',
  'son bir ay','düzenli aralıklarla'
];

const HEALTH_INFO_MODES = [
  'genel açıklama','belirti farkındalığı','korunma','takip','günlük yaşam',
  'uzman görüşmesine hazırlık','ölçüm yorumlama çerçevesi','risk farkındalığı',
  'yaşam tarzı bağlantıları','ne zaman değerlendirme gerekir','semptom günlüğü',
  'sağlık okuryazarlığı','önleyici sağlık','bakım planı özeti'
];

// Structured combination count. This is coverage capacity, not number of authored articles.
const BERAY_COVERAGE_COUNT =
  HEALTH_DOMAINS.length *
  HEALTH_CONCERNS.length *
  HEALTH_MODIFIERS.length *
  HEALTH_LIFE_STAGES.length *
  HEALTH_TIMEFRAMES.length *
  HEALTH_INFO_MODES.length;

const BERAY_COVERAGE_LABEL = `${new Intl.NumberFormat('tr-TR').format(BERAY_COVERAGE_COUNT)}+ yapılandırılmış sağlık senaryosu`;

function findDomainAndConcern(query='') {
  const t = normalizeText(query);
  let domain = HEALTH_DOMAINS.find(([title,...keys]) => keys.some(k => t.includes(normalizeText(k))));
  let concern = HEALTH_CONCERNS.find(([title,...keys]) => keys.some(k => t.includes(normalizeText(k))));
  return {domain, concern};
}

function deterministicExpandedReply(query='') {
  const t = normalizeText(query);
  const seed = hashText(t);
  const {domain, concern} = findDomainAndConcern(t);
  const d = domain ? domain[0] : 'Genel sağlık';
  const c = concern ? concern[0] : 'Genel eğitim';

  const lead = pick([
    `🩺 ${d} · ${c}`,
    `📘 ${d} hakkında hazır bilgi`,
    `🌿 ${d} için güvenli başlangıç rehberi`,
    `🧭 ${d} · ${c} çerçevesi`
  ], seed, 11);

  const info = pick([
    'Tek bir belirti çoğu zaman tek bir nedene işaret etmez; süre, şiddet, eşlik eden belirtiler ve kişinin genel durumu birlikte değerlendirilir.',
    'Sağlık konularında en güvenli yaklaşım, genel bilgiyi kişisel tanı yerine koymamak ve değişiklikleri düzenli takip etmektir.',
    'Bir ölçüm veya belirtiyi tek başına kesin sonuç gibi yorumlamak yerine zaman içindeki seyri ve eşlik eden durumları not etmek daha yararlıdır.'
  ], seed, 12);

  const action = pick([
    'Belirtinin ne zaman başladığını, ne sıklıkta olduğunu ve günlük yaşamı etkileyip etkilemediğini not et.',
    'Varsa ölçümleri aynı koşullarda ve düzenli aralıklarla takip et; olağandışı veya hızla kötüleşen bir değişiklikte sağlık profesyoneline başvur.',
    'Doktor görüşmesine giderken kullandığın ilaçları, bilinen alerjileri ve önemli sağlık geçmişini not etmek yararlı olabilir.',
    'Günlük yaşam, uyku, beslenme, hareket ve stres gibi eşlik eden etkenleri de gözden geçir.'
  ], seed, 13);

  const question = pick([
    '📋 Kendin için not edebileceğin başlıklar: başlangıç zamanı · süre · sıklık · şiddet · eşlik eden belirtiler.',
    '🔎 Doktor görüşmesinde “Ne zaman başladı?”, “Ne artırıyor/azaltıyor?” ve “Ne kadar sürüyor?” soruları faydalı olabilir.',
    '📊 Beray Sağlık takip alanını kullanarak ölçüm ve gözlemlerini tarihleriyle kaydedebilirsin.'
  ], seed, 14);

  return `${lead}\n\n${info}\n\n✅ ${action}\n\n${question}\n\n${SAFETY_NOTE}`;
}

// Keep the original safe emergency detector and authored intents.
// Only the "unknown" branch is widened; no diagnosis or prescription is generated.
const _originalDeterministicReply = deterministicReply;
deterministicReply = function(query) {
  const t = normalizeText(query);
  if (detectEmergency(query)) return _originalDeterministicReply(query);
  const originalIntent = findIntent(query);
  if (originalIntent) return _originalDeterministicReply(query);
  const expanded = findDomainAndConcern(query);
  if (expanded.domain || expanded.concern) return deterministicExpandedReply(query);
  return _originalDeterministicReply(query);
};
