// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile hamburger (a11y: aria-expanded + aria-label) ──
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');
if (hamburger) {
  hamburger.setAttribute('aria-label', 'Menüyü aç');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'navMobile');
}
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('active');
  mobileMenu?.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  hamburger.setAttribute('aria-label', isOpen ? 'Menüyü aç' : 'Menüyü kapat');
  const spans = hamburger.querySelectorAll('span');
  if (!isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Menüyü aç');
  }
}));

// ── Scroll animations ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in, .slide-left, .slide-right, .slide-up').forEach(el => obs.observe(el));

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1600;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));

// ── Active nav ──
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ── FAQ accordion (a11y: aria-expanded) ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling || btn.closest('.faq-item')?.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      const a = b.nextElementSibling || b.closest('.faq-item')?.querySelector('.faq-a');
      a?.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer?.classList.add('open');
    }
  });
});

// ── Lightbox (a11y: focus trap + focus restore) ──
let _lbPrevFocus = null;

function openLb(src, caption) {
  const lb = document.getElementById('lb');
  if (!lb) return;
  _lbPrevFocus = document.activeElement;
  lb.querySelector('img').src = src;
  lb.querySelector('img').alt = caption || '';
  const cap = lb.querySelector('.lb-caption');
  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lb.setAttribute('aria-hidden', 'false');
  // Focus the close button
  const closeBtn = lb.querySelector('.lb-x');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeLb() {
  const lb = document.getElementById('lb');
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Restore focus
  if (_lbPrevFocus) { _lbPrevFocus.focus(); _lbPrevFocus = null; }
}

// Focus trap inside lightbox
document.getElementById('lb')?.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    const focusable = this.querySelectorAll('button, [tabindex="0"]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first)?.focus();
    }
  }
});

document.getElementById('lb')?.addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('lb-x')) closeLb();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// ── i18n: TR/EN Language Toggle ──
const i18n = {
  tr: {
    'nav.home':'Ana Sayfa','nav.about':'Hakkımızda','nav.services':'Hizmetler','nav.gallery':'Galeri','nav.contact':'İletişim','nav.cta':'İletişime Geçin',
    'hero.badge':'Dudullu OSB — Ümraniye / İstanbul',
    'hero.h1':'Hassas <span class="hl">CNC</span> İşleme<br><span class="hl2">Kalıp İmalatı</span>',
    'hero.sub':'1999\'dan bu yana Dudullu OSB\'de. Modern tezgah altyapımız ve deneyimli ekibimizle toleransınıza uygun, zamanında teslimat.',
    'hero.btn1':'Bize Ulaşın','hero.btn2':'Hizmetlerimiz','hero.scroll':'Keşfet',
    'stat.years':'Yıl Deneyim','stat.projects':'Tamamlanan Proje','stat.machines':'CNC Tezgah','stat.satisfaction':'Müşteri Memnuniyeti',
    'about.tag':'Hakkımızda','about.h2':'Üretimde <em>Hassasiyet</em>,<br>Teslimatta Güvenilirlik',
    'about.desc':'1999 yılından bu yana Dudullu Organize Sanayi Bölgesi\'nde faaliyet gösteren MEBA KALIP, CNC işleme ve kalıp imalatında sektörün güvenilir ismi olmuştur. Modern tezgah parkurumuz ve uzman kadromuzla müşterilerimize özel çözümler sunuyoruz.',
    'about.fact1':'0.01 mm tolerans kabiliyeti','about.fact2':'ISO 9001:2015 kalite yönetim sistemi',
    'about.fact3':'Otomotiv, savunma ve makine sektörleri','about.fact4':'Prototipten seri üretime tam hizmet',
    'about.btn':'Daha Fazla Bilgi',
    'svc.label':'Hizmetlerimiz','svc.h2':'Geniş <span>Çözüm</span> Yelpazesi',
    'svc1.title':'CNC Freze İşleme','svc1.desc':'3–4 eksen CNC freze tezgahlarımızla karmaşık geometrileri yüksek hassasiyetle işliyoruz.',
    'svc2.title':'CNC Torna','svc2.desc':'Silindirik ve asimetrik parçalar için hassas tornalama, dişli ve vida işleme hizmetleri.',
    'svc3.title':'Kalıp İmalatı','svc3.desc':'Plastik enjeksiyon, sıkıştırma ve döküm kalıpları tasarım ve imalatı.',
    'svc4.title':'Prototip Üretim','svc4.desc':'Tasarımdan üretime geçiş sürecini hızlandıran prototip ve numune çözümleri.',
    'svc5.title':'Takım & Aparat','svc5.desc':'Üretim hattınızı optimize eden özel takım, jig ve aparat imalatı.',
    'svc6.title':'Kalite Kontrol','svc6.desc':'CMM ve optik ölçüm sistemleriyle her parça kalite onayından geçirilir.',
    'svc.btn':'Tüm Hizmetleri Gör',
    'gal.label':'Çalışmalarımızdan','gal.h2':'Galeri <span>Kesimleri</span>','gal.btn':'Tüm Galeriyi Gör',
    'gal.item1':'CNC İşleme','gal.item2':'Kalıp İmalatı','gal.item3':'Torna İşleme','gal.item4':'Freze İşleme','gal.item5':'Üretim',
    'sec.label':'Sektörlerimiz','sec.h2':'Hizmet Verdiğimiz <span>Sektörler</span>',
    'sec.desc':'Metal ve plastik işleme deneyimimizle Türkiye\'nin önde gelen sanayi sektörlerine üretim hizmetleri veriyoruz.',
    'sec1.title':'Otomotiv Yan Sanayii','sec1.desc':'Motor, şasi ve gövde parçaları için hassas toleranslı prototip ve seri imalat.',
    'sec2.title':'Savunma Sanayii','sec2.desc':'Yüksek mukavemetli malzemelerde kritik tolerans gerektiren savunma parçaları için üretim.',
    'sec3.title':'Beyaz Eşya','sec3.desc':'Plastik enjeksiyon ve sac şekillendirme kalıpları, sürekli üretim hattına uygun teslimat.',
    'sec4.title':'Plastik Enj. Kalıpları','sec4.desc':'Soğutma kanalı dizaynından nihai yüzey işlemine kadar komple kalıp tasarım ve imalatı.',
    'sec5.title':'Medikal Cihaz','sec5.desc':'Paslanmaz çelik ve tıbbi sınıf alüminyumda yüksek hassasiyetli medikal parça imalatı.',
    'sec6.title':'Elektrik & Elektronik','sec6.desc':'Konnektör, muhafaza ve soğutucu gövdeler için hassas işleme ve seri fason üretim.',
    'faq.label':'SSS','faq.h2':'Sıkça Sorulan <span>Sorular</span>','faq.desc':'Kalıp imalatı ve CNC işleme hakkında en çok merak edilenler.',
    'faq1.q':'Minimum sipariş adedi nedir?','faq1.a':'Minimum sipariş adedimiz yoktur. Tek parça prototip siparişlerinden binlerce adetlik seri üretime kadar her hacimde hizmet veriyoruz. Küçük partilerde birim maliyet farklılık gösterebilir; fiyat teklifi için bizimle iletişime geçin.',
    'faq2.q':'Teslim süreniz ne kadar?','faq2.a':'Teslim süresi parça karmaşıklığına ve miktarına göre değişir. Prototip ve tekil parçalarda genellikle 3–7 iş günü, seri üretimde 2–4 hafta hedefliyoruz. Acil siparişler için öncelikli üretim imkânımız mevcuttur.',
    'faq3.q':'Hangi malzemelerde çalışıyorsunuz?','faq3.a':'Başta çelik (C45, 1.2343, 1.2379), paslanmaz çelik (304, 316L), alüminyum alaşımları (6061, 7075) ve çeşitli plastikler (POM, PA66, PEEK) olmak üzere geniş bir malzeme yelpazesinde işleme yapabiliyoruz.',
    'faq4.q':'Teknik çizim olmadan teklif alabilir miyim?','faq4.a':'Evet. Numune, eskiz veya sözlü tanımlama ile de fiyat teklifi hazırlayabiliriz. Teknik resim isterseniz tasarım danışmanlığı da sunuyoruz. WhatsApp üzerinden fotoğraf veya taslak göndererek başlayabilirsiniz.',
    'faq5.q':'Ne kadar hassasiyet sağlıyorsunuz?','faq5.a':'CNC freze tezgâhlarımızda ±0,01 mm, hassas taşlama işlemlerinde ±0,005 mm tolerans sağlayabiliyoruz. Özel hassasiyet gerektiren uygulamalar için kalite kontrol süreci ve ölçüm raporu da sunulabilir.',
    'faq6.q':'Kargo veya teslimat hizmetiniz var mı?','faq6.a':'Türkiye genelinde kargo ile teslimat yapıyoruz. İstanbul içi büyük hacimli veya hassas parçalar için araçlı teslimat da organize edebiliyoruz. Fabrikamızdan elden teslim de mümkündür.',
    'cta.tag':'Hemen Başlayalım','cta.h2':'Projenizi Hayata Geçirelim',
    'cta.sub':'Teknik çizimlerinizi gönderin, fiyat teklifi alın. 24 saat içinde size dönüyoruz.',
    'cta.btn1':'Teklif Al',
    'footer.desc':'Dudullu OSB\'de hassas CNC işleme ve kalıp imalatı.',
    'footer.links':'Hızlı Bağlantılar','footer.services':'Hizmetlerimiz','footer.contact':'İletişim',
    'pg.about.h1':'Hakkımızda','pg.about.sub':'1999\'dan bu yana Dudullu Organize Sanayi Bölgesi\'nde kalıp imalatı ve CNC işleme alanında hizmet veriyoruz. Otomotiv ve savunma sanayii başta olmak üzere pek çok sektördeki firmaya çözüm üretiyoruz.',
    'pg.svc.h1':'Hizmetlerimiz','pg.svc.sub':'Kalıp imalatından CNC frezelemeye, talaşlı imalattan fason üretime kapsamlı çözümler.',
    'pg.gal.h1':'Galeri','pg.gal.sub':'Üretimlerimizden gerçek fotoğraflar — Instagram @meba_kalip_cnc',
    'pg.con.h1':'İletişim','pg.con.sub':'Bize ulaşın, teknik sorularınızı yanıtlayalım ve fiyat teklifi hazırlayalım.',
  },
  en: {
    'nav.home':'Home','nav.about':'About','nav.services':'Services','nav.gallery':'Gallery','nav.contact':'Contact','nav.cta':'Contact Us',
    'hero.badge':'Dudullu OSB — Ümraniye / Istanbul',
    'hero.h1':'Precision <span class="hl">CNC</span> Machining<br><span class="hl2">Mold Manufacturing</span>',
    'hero.sub':'Serving from Dudullu OSB since 1999. With our modern machine infrastructure and experienced team — precision to your tolerances, on-time delivery.',
    'hero.btn1':'Contact Us','hero.btn2':'Our Services','hero.scroll':'Scroll',
    'stat.years':'Years Experience','stat.projects':'Projects Completed','stat.machines':'CNC Machines','stat.satisfaction':'Customer Satisfaction',
    'about.tag':'About Us','about.h2':'<em>Precision</em> in Production,<br>Reliability in Delivery',
    'about.desc':'Operating in Dudullu Organized Industrial Zone since 1999, MEBA KALIP has become the industry\'s trusted name in CNC machining and mold manufacturing. We offer custom solutions with our modern machine park and expert team.',
    'about.fact1':'0.01 mm tolerance capability','about.fact2':'ISO 9001:2015 quality management system',
    'about.fact3':'Automotive, defense and machinery sectors','about.fact4':'Full service from prototype to serial production',
    'about.btn':'Learn More',
    'svc.label':'Our Services','svc.h2':'Wide Range of <span>Solutions</span>',
    'svc1.title':'CNC Milling','svc1.desc':'We machine complex geometries with high precision using our 3–4 axis CNC milling centers.',
    'svc2.title':'CNC Turning','svc2.desc':'Precision turning for cylindrical and asymmetric parts, including gear and thread machining.',
    'svc3.title':'Mold Manufacturing','svc3.desc':'Design and manufacture of plastic injection, compression, and casting molds.',
    'svc4.title':'Prototype Production','svc4.desc':'Prototype and sample solutions that accelerate the transition from design to production.',
    'svc5.title':'Tooling & Fixtures','svc5.desc':'Custom tooling, jig and fixture manufacturing to optimize your production line.',
    'svc6.title':'Quality Control','svc6.desc':'Every part passes quality approval with CMM and optical measurement systems.',
    'svc.btn':'View All Services',
    'gal.label':'Our Work','gal.h2':'Gallery <span>Highlights</span>','gal.btn':'View Full Gallery',
    'gal.item1':'CNC Machining','gal.item2':'Mold Manufacturing','gal.item3':'Turning','gal.item4':'Milling','gal.item5':'Production',
    'sec.label':'Industries','sec.h2':'Industries We <span>Serve</span>',
    'sec.desc':'With our metal and plastic machining expertise, we provide manufacturing services to Turkey\'s leading industrial sectors.',
    'sec1.title':'Automotive Supply','sec1.desc':'Precision prototype and series production for engine, chassis, and body components.',
    'sec2.title':'Defense Industry','sec2.desc':'Production of defense parts requiring critical tolerances in high-strength materials.',
    'sec3.title':'White Goods','sec3.desc':'Plastic injection and sheet metal forming molds with delivery suited to continuous production lines.',
    'sec4.title':'Plastic Injection Molds','sec4.desc':'Complete mold design and manufacturing from cooling channel design to final surface finishing.',
    'sec5.title':'Medical Devices','sec5.desc':'High-precision medical part manufacturing in stainless steel and medical-grade aluminum.',
    'sec6.title':'Electrical & Electronics','sec6.desc':'Precision machining and series contract manufacturing for connectors, enclosures, and heat sinks.',
    'faq.label':'FAQ','faq.h2':'Frequently Asked <span>Questions</span>','faq.desc':'Most common questions about mold manufacturing and CNC machining.',
    'faq1.q':'Is there a minimum order quantity?','faq1.a':'There is no minimum order quantity. We serve all volumes, from single-piece prototypes to thousands of units in serial production. Unit cost may vary for small batches; contact us for a quote.',
    'faq2.q':'What are your lead times?','faq2.a':'Lead times vary by part complexity and quantity. For prototypes and single pieces we typically target 3–7 business days; for serial production, 2–4 weeks. Priority production is available for urgent orders.',
    'faq3.q':'What materials do you work with?','faq3.a':'We work with a wide range of materials including steel (C45, 1.2343, 1.2379), stainless steel (304, 316L), aluminum alloys (6061, 7075), and various plastics (POM, PA66, PEEK).',
    'faq4.q':'Can I get a quote without technical drawings?','faq4.a':'Yes. We can prepare quotes based on samples, sketches, or verbal descriptions. We also offer design consulting. Start by sending photos or sketches via WhatsApp.',
    'faq5.q':'What precision tolerances can you achieve?','faq5.a':'We achieve ±0.01 mm on our CNC milling centers and ±0.005 mm in precision grinding. Measurement certificates are available for applications requiring special precision.',
    'faq6.q':'Do you offer shipping or delivery?','faq6.a':'We ship anywhere in Turkey. For large or delicate parts within Istanbul, we can arrange vehicle delivery. Pick-up from our facility is also available.',
    'cta.tag':'Get Started','cta.h2':'Let\'s Bring Your Project to Life',
    'cta.sub':'Send us your technical drawings and get a quote. We respond within 24 hours.',
    'cta.btn1':'Get a Quote',
    'footer.desc':'Precision CNC machining and mold manufacturing in Dudullu OSB.',
    'footer.links':'Quick Links','footer.services':'Services','footer.contact':'Contact',
    'pg.about.h1':'About Us','pg.about.sub':'Providing uninterrupted mold manufacturing and CNC machining services at Dudullu OIZ since 1999. We serve companies across many sectors — primarily automotive and defense.',
    'pg.svc.h1':'Our Services','pg.svc.sub':'Comprehensive solutions from mold manufacturing and CNC milling to precision machining and contract production.',
    'pg.gal.h1':'Gallery','pg.gal.sub':'Real photos from our production floor — Instagram @meba_kalip_cnc',
    'pg.con.h1':'Contact','pg.con.sub':'Reach out to us — we\'ll answer your technical questions and prepare a quote.',
  }
};

function setLang(lang) {
  localStorage.setItem('meba_lang', lang);
  applyLang(lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
}

function applyLang(lang) {
  const t = i18n[lang] || i18n.tr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });
}

(function initLang() {
  const lang = localStorage.getItem('meba_lang') || 'tr';
  applyLang(lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
})();
