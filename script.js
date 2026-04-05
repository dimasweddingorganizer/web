let state = {
  guests: 200,
  menuPrice: 55000,
  venuePrice: 5000000,
  decoPrice: 8000000,
  addons: { doc: 5000000, ent: 4000000 }
};

/* ─── NAVIGATION ─── */
function openPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
  document.getElementById(p).classList.add('active');
  document.getElementById('nav-' + p).classList.add('active');
  window.scrollTo(0, 0);
}

/* ─── GUEST SLIDER ─── */
function syncFromSlider() {
  const v = parseInt(document.getElementById('guestSlider').value);
  state.guests = v;
  document.getElementById('guestNumber').value = v;
  document.getElementById('guestDisplay').textContent = v;
  document.getElementById('guestValHeader').textContent = v;
  updateSlider();
  updateLive();
}

function syncFromNumber() {
  let v = parseInt(document.getElementById('guestNumber').value) || 50;
  v = Math.min(2000, Math.max(50, v));
  state.guests = v;
  document.getElementById('guestSlider').value = v;
  document.getElementById('guestDisplay').textContent = v;
  document.getElementById('guestValHeader').textContent = v;
  updateSlider();
  updateLive();
}

function updateSlider() {
  const pct = ((state.guests - 50) / 1950) * 100;
  document.getElementById('guestSlider').style.setProperty('--pct', pct + '%');
}

/* ─── SELECTIONS ─── */
function selectPkg(el, price, label) {
  document.querySelectorAll('.opt-grid-3 .opt-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  state.menuPrice = price;
  document.getElementById('menuValHeader').textContent = label;
  updateLive();
}

function selectVenue(el, price) {
  document.querySelectorAll('.venue-opt').forEach(v => v.classList.remove('active'));
  el.classList.add('active');
  state.venuePrice = price;
  updateLive();
}

function selectDeco(el, price, label) {
  document.querySelectorAll('.opt-grid-4 .opt-pill').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
  state.decoPrice = price;
  document.getElementById('decoValHeader').textContent = label;
  updateLive();
}

function toggleAddon(el, key, price) {
  const tog = el.querySelector('.tog');
  if (state.addons[key] !== undefined) {
    delete state.addons[key];
    tog.classList.remove('on');
  } else {
    state.addons[key] = price;
    tog.classList.add('on');
  }
  updateLive();
}

/* ─── FORMATTING ─── */
function fmt(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1).replace('.0', '') + ' jt';
  return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtFull(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

/* ─── TOTALS ─── */
function getTotal() {
  return state.guests * state.menuPrice
    + state.decoPrice
    + state.venuePrice
    + Object.values(state.addons).reduce((a, b) => a + b, 0);
}

function updateLive() {
  document.getElementById('liveTotal').textContent = fmt(getTotal());
  const n = Object.keys(state.addons).length;
  document.getElementById('liveSub').innerHTML = state.guests + ' tamu<br>' + n + ' tambahan aktif';
}

/* ─── CALCULATE ─── */
function calculate() {
  const catering = state.guests * state.menuPrice;
  const addSum = Object.values(state.addons).reduce((a, b) => a + b, 0);
  const total = catering + state.decoPrice + state.venuePrice + addSum;

  document.getElementById('rTotal').textContent = fmtFull(total);
  const pkgName = { 55000: 'Silver', 75000: 'Gold', 95000: 'Platinum' }[state.menuPrice];
  document.getElementById('rSub').textContent = state.guests + ' tamu · Paket ' + pkgName;

  const decoName = { 0: '—', 8000000: 'Standar', 18000000: 'Elegan', 35000000: 'Mewah' }[state.decoPrice];
  const addonMeta = {
    doc: '📷 Dokumentasi',
    ent: '🎵 Entertainment',
    photo: '🖼️ Photo Booth',
    souvenir: '🎁 Souvenir'
  };

  const items = [
    { name: '🍽️ Catering', amt: catering },
    { name: '🌿 Venue',    amt: state.venuePrice }
  ];
  if (state.decoPrice > 0) items.push({ name: '🌸 Dekorasi ' + decoName, amt: state.decoPrice });
  Object.entries(state.addons).forEach(([k, v]) => items.push({ name: addonMeta[k] || k, amt: v }));

  let html = '';
  items.forEach(item => {
    const pct = Math.round((item.amt / total) * 100);
    html += `<div class="bk-item">
      <div class="bk-top">
        <span class="bk-name">${item.name}</span>
        <span class="bk-pct">${pct}%</span>
        <span class="bk-amt">${fmtFull(item.amt)}</span>
      </div>
      <div class="bar-bg"><div class="bar-fg" style="width:0%" data-w="${pct}%"></div></div>
    </div>`;
  });

  document.getElementById('breakdownList').innerHTML = html;
  const rc = document.getElementById('resultCard');
  rc.classList.add('show');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fg').forEach(b => { b.style.width = b.dataset.w; });
  }));
  rc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─── SELECT MENU & GO TO ANALYZER ─── */
function selectAndGo(price, label) {
  document.querySelectorAll('.opt-grid-3 .opt-pill').forEach((p, i) => {
    p.classList.toggle('active', [55000, 75000, 95000][i] === price);
  });
  state.menuPrice = price;
  document.getElementById('menuValHeader').textContent = label;
  updateLive();
  openPage('analyzer');
}

/* ─── WA FAB ─── */
function toggleWA() {
  const c = document.getElementById('waContacts');
  c.classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.wa-fab-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('waContacts').classList.remove('open');
  }
});

/* ─── INIT ─── */
updateSlider();
updateLive();
