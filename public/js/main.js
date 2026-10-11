const PHONE = '3404862761';
// Pagina Facebook: incollare qui l'indirizzo completo quando è pronta (finché è vuoto, l'icona mostra "in arrivo")
const FACEBOOK = 'https://www.facebook.com/profile.php?id=61595127752139';
const WA = 'https://wa.me/39' + PHONE;
const $ = (s, c = document) => c.querySelector(s);
const esc = s => { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; };

/* barra: piena dopo la cover; menu mobile */
const rapido = $('#rapido');
const topbar = $('#topbar'), nav = $('#nav'), menuBtn = $('.menu-btn'), hero = $('#top');
function onScroll() {
  const h = hero.offsetHeight;
  const y = window.scrollY;
  document.documentElement.style.setProperty('--svanisci', Math.min(1, Math.max(0, y / (h * .9))).toFixed(3));
  topbar.classList.toggle('is-pieno', y > h * .82);
  rapido.classList.toggle('is-on', y > h * .4);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  topbar.classList.toggle('menu-aperto', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); topbar.classList.remove('menu-aperto');
}));

/* rivelazione */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
function osserva(el) { io ? io.observe(el) : el.classList.add('in'); }
document.querySelectorAll('.intestazione,.servizi li,.azienda>*,.contatti>*').forEach(el => { el.classList.add('rivela'); osserva(el); });

/* galleria da data/*.json */
let FOTO = [], corrente = [];
const grid = $('#galleria-griglia'), filtri = $('#filtri');
Promise.all([fetch('data/categories.json').then(r => r.json()), fetch('data/gallery.json').then(r => r.json())])
  .then(([c, g]) => {
    FOTO = g.items || [];
    c.forEach(cat => filtri.insertAdjacentHTML('beforeend', `<button class="filtro" type="button" data-filter="${esc(cat.slug)}">${esc(cat.label)}</button>`));
    mostra('all');
  })
  .catch(() => { grid.innerHTML = '<p class="vuoto">Impossibile caricare la galleria al momento.</p>'; });

const src = p => p.replace(/^\//, '');
const miniatura = p => src(p).replace(/\/([^\/]+)$/, '/m/$1');
function mostra(f) {
  filtri.querySelectorAll('.filtro').forEach(b => b.classList.toggle('is-on', b.dataset.filter === f));
  corrente = f === 'all' ? FOTO : FOTO.filter(x => x.category === f);
  if (!corrente.length) { grid.innerHTML = '<p class="vuoto">Nessuna foto in questa categoria per ora.</p>'; return; }
  grid.innerHTML = corrente.map((x, i) => `<figure class="scheda" data-i="${i}"><img src="${esc(miniatura(x.file))}" alt="${esc(x.title)}" loading="lazy" data-full="${esc(src(x.file))}"><figcaption>${esc(x.title)}</figcaption></figure>`).join('');
  grid.querySelectorAll('.scheda img').forEach(im => im.addEventListener('error', () => { if (im.src.indexOf(im.dataset.full) === -1) im.src = im.dataset.full; }, { once: true }));
  grid.querySelectorAll('.scheda').forEach(el => { osserva(el); el.addEventListener('click', () => apri(+el.dataset.i)); });
}
filtri.addEventListener('click', e => { const b = e.target.closest('.filtro'); if (b) mostra(b.dataset.filter); });
document.querySelectorAll('.servizio').forEach(b => b.addEventListener('click', () => {
  $('#galleria').scrollIntoView({ behavior: 'smooth' });
  const f = b.dataset.cat;
  const t = () => FOTO.length ? mostra(f) : setTimeout(t, 150);
  setTimeout(t, 200);
}));

/* lightbox */
let lb, idx = 0;
function apri(i) {
  if (!lb) {
    lb = document.createElement('div'); lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-btn lb-x" aria-label="Chiudi">×</button><button class="lb-btn lb-p" aria-label="Precedente">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-btn lb-n" aria-label="Successiva">›</button>';
    document.body.appendChild(lb);
    lb.addEventListener('click', e => { if (e.target === lb) chiudi(); });
    $('.lb-x', lb).onclick = chiudi; $('.lb-p', lb).onclick = () => vai(-1); $('.lb-n', lb).onclick = () => vai(1);
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') chiudi();
      if (e.key === 'ArrowLeft') vai(-1);
      if (e.key === 'ArrowRight') vai(1);
    });
  }
  idx = i; agg(); lb.classList.add('open');
}
function chiudi() { lb.classList.remove('open'); }
function vai(d) { idx = (idx + d + corrente.length) % corrente.length; agg(); }
function agg() { const x = corrente[idx]; $('img', lb).src = src(x.file); $('img', lb).alt = x.title; $('figcaption', lb).textContent = x.title; }

/* contatti */
const waTesto = WA + '?text=' + encodeURIComponent('Ciao, vorrei richiedere un preventivo per...');
$('#wa-link').href = waTesto;
$('#wa-rapido').href = waTesto;
$('#anno').textContent = new Date().getFullYear();
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const t = `Ciao, sono ${d.get('nome')}.\nTelefono: ${d.get('telefono')}\n${d.get('email') ? 'Email: ' + d.get('email') + '\n' : ''}Messaggio: ${d.get('messaggio')}`;
  window.open(WA + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
  const b = $('#invia'), o = b.textContent;
  b.textContent = 'Richiesta pronta ✓'; b.disabled = true;
  setTimeout(() => { b.textContent = o; b.disabled = false; e.target.reset(); }, 2500);
});

/* Facebook: collegamento (o avviso "in arrivo" finché manca l'indirizzo) */
let avviso, avvisoTimer;
document.querySelectorAll('[data-facebook]').forEach(a => {
  if (FACEBOOK) { a.href = FACEBOOK; return; }
  a.addEventListener('click', e => {
    e.preventDefault();
    if (!avviso) { avviso = document.createElement('div'); avviso.className = 'avviso'; avviso.setAttribute('role', 'status'); avviso.textContent = 'Pagina Facebook in arrivo'; document.body.appendChild(avviso); }
    avviso.classList.add('is-on'); clearTimeout(avvisoTimer);
    avvisoTimer = setTimeout(() => avviso.classList.remove('is-on'), 2600);
  });
});
