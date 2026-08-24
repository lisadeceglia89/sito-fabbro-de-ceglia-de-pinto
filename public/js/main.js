// ====== Config contatti ======
const PHONE_1 = '3404862761';
const PHONE_2 = '3409642092';
const WHATSAPP_NUMBER = '39' + PHONE_1; // formato internazionale senza + per wa.me

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupContacts();
  setupServiziLinks();
  loadGalleryAndCategories();
  setupContactForm();
  setupReveal();
  setupHeroBuild();
  setupHeroScrollFx();
  setupParallaxImages();
  document.getElementById('year').textContent = new Date().getFullYear();
});

function setupHeroScrollFx(){
  const hero = document.getElementById('top');
  const bg = document.getElementById('heroBg');
  if (!hero || !bg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    // sale leggermente e si ingrandisce mentre si scorre, come se ci si affacciasse dentro la veranda
    const scale = 1.05 + progress * 0.22;
    const shiftY = progress * 34;
    bg.style.transform = `scale(${scale}) translateY(${shiftY}px)`;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

function setupHeroBuild(){
  const grid = document.getElementById('buildGrid');
  const heroContent = document.getElementById('heroContent');
  const scrim = document.querySelector('.hero-text-scrim');
  if (!grid || !heroContent) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    heroContent.classList.add('is-revealed');
    if (scrim) scrim.classList.add('is-visible');
    return;
  }

  const compact = window.innerWidth < 640;
  const cols = compact ? 6 : 10;
  const rows = compact ? 5 : 6;
  const tileDuration = 550;
  let maxDelay = 0;

  const frag = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.left = (c / cols * 100) + '%';
      tile.style.top = (r / rows * 100) + '%';
      tile.style.width = (100 / cols) + '%';
      tile.style.height = (100 / rows) + '%';
      const rowFromBottom = rows - 1 - r;
      const delay = rowFromBottom * 190 + c * 22 + Math.random() * 60;
      tile.style.animationDelay = delay + 'ms';
      maxDelay = Math.max(maxDelay, delay);
      frag.appendChild(tile);
    }
  }
  grid.appendChild(frag);

  setTimeout(() => {
    heroContent.classList.add('is-revealed');
    if (scrim) scrim.classList.add('is-visible');
  }, maxDelay + tileDuration + 150);
}

let revealObserver = null;

function setupReveal(){
  const items = document.querySelectorAll('.reveal, .reveal-io');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => revealObserver.observe(el));
}

function observeReveal(el){
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add('in-view');
}

/* Parallax: shifts images inside [data-parallax] frames as the page scrolls, for extra depth */
let parallaxEls = [];

function refreshParallaxEls(){
  parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
}

function setupParallaxImages(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 860) return;
  refreshParallaxEls();

  let ticking = false;
  function update(){
    ticking = false;
    const vh = window.innerHeight;
    parallaxEls.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh;
      img.style.transform = `translateY(calc(-9% + ${(offset * 40).toFixed(1)}px))`;
    });
  }
  function onScroll(){
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

function setupHeader(){
  const header = document.getElementById('header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');

  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

function formatPhoneHref(num){
  return '+39' + num;
}

function setupContacts(){
  document.querySelectorAll('#phone-1, #header-phone').forEach(el => {
    el.href = 'tel:' + formatPhoneHref(PHONE_1);
  });
  const p2 = document.getElementById('phone-2');
  if (p2) p2.href = 'tel:' + formatPhoneHref(PHONE_2);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Ciao, vorrei richiedere un preventivo per...')}`;
  const wa1 = document.getElementById('whatsapp-link');
  const wa2 = document.getElementById('whatsapp-float');
  if (wa1) wa1.href = waHref;
  if (wa2) wa2.href = waHref;
}

function setupServiziLinks(){
  document.querySelectorAll('.servizio-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      document.getElementById('galleria').scrollIntoView({ behavior: 'smooth' });
      // aspetta che la galleria sia pronta, poi applica il filtro
      const tryFilter = () => {
        const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
        if (btn) btn.click();
        else setTimeout(tryFilter, 150);
      };
      setTimeout(tryFilter, 300);
    });
  });
}

let CATEGORIES = [];
let GALLERY = [];

async function loadGalleryAndCategories(){
  const grid = document.getElementById('gallery-grid');
  try {
    const [catRes, galRes] = await Promise.all([
      fetch('data/categories.json'),
      fetch('data/gallery.json')
    ]);
    CATEGORIES = await catRes.json();
    const galleryData = await galRes.json();
    GALLERY = galleryData.items || [];
    renderFilters();
    renderGallery('all');
  } catch (e) {
    grid.innerHTML = '<p class="gallery-loading">Impossibile caricare la galleria al momento.</p>';
  }
}

function renderFilters(){
  const wrap = document.getElementById('gallery-filters');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat.slug;
    btn.textContent = cat.label;
    wrap.appendChild(btn);
  });

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    wrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });
}

function renderGallery(filter){
  const grid = document.getElementById('gallery-grid');
  const items = filter === 'all' ? GALLERY : GALLERY.filter(g => g.category === filter);

  if (items.length === 0) {
    grid.innerHTML = '<p class="gallery-loading">Nessuna foto in questa categoria per ora.</p>';
    return;
  }

  grid.innerHTML = items.map((item, i) => `
    <div class="gallery-item reveal" data-index="${i}">
      <img src="${item.file}" alt="${escapeHtml(item.title)}" loading="lazy">
      <div class="gallery-caption">${escapeHtml(item.title)}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(items, parseInt(el.dataset.index, 10)));
    observeReveal(el);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ====== Lightbox ======
let lightboxItems = [];
let lightboxIndex = 0;

function ensureLightbox(){
  if (document.querySelector('.lightbox')) return;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Chiudi"><i class="fa-solid fa-xmark"></i></button>
    <button class="lightbox-prev" aria-label="Precedente"><i class="fa-solid fa-chevron-left"></i></button>
    <div>
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    </div>
    <button class="lightbox-next" aria-label="Successiva"><i class="fa-solid fa-chevron-right"></i></button>
  `;
  document.body.appendChild(lb);

  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  lb.querySelector('.lightbox-prev').addEventListener('click', () => moveLightbox(-1));
  lb.querySelector('.lightbox-next').addEventListener('click', () => moveLightbox(1));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') moveLightbox(-1);
    if (e.key === 'ArrowRight') moveLightbox(1);
  });
}

function openLightbox(items, index){
  ensureLightbox();
  lightboxItems = items;
  lightboxIndex = index;
  updateLightbox();
  document.querySelector('.lightbox').classList.add('open');
}

function closeLightbox(){
  const lb = document.querySelector('.lightbox');
  if (lb) lb.classList.remove('open');
}

function moveLightbox(dir){
  lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
  updateLightbox();
}

function updateLightbox(){
  const item = lightboxItems[lightboxIndex];
  const lb = document.querySelector('.lightbox');
  lb.querySelector('img').src = item.file;
  lb.querySelector('img').alt = item.title;
  lb.querySelector('.lightbox-caption').textContent = item.title;
}

// ====== Form contatti -> WhatsApp ======
function setupContactForm(){
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = data.get('nome') || '';
    const telefono = data.get('telefono') || '';
    const email = data.get('email') || '';
    const messaggio = data.get('messaggio') || '';

    const testo = `Ciao, sono ${nome}.%0ATelefono: ${telefono}%0A${email ? 'Email: ' + email + '%0A' : ''}Messaggio: ${messaggio}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${testo}`, '_blank');

    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Richiesta inviata ✓';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 2500);
    }
  });
}
