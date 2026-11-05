/* ---------- shared mockup kit (inlined in every game so each file stands alone) ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const G = { lang: 'en', sound: true, voice: false, bedtime: false, hooks: [], narr: null, pauseCur: null, endCur: null, sel: null, tier: false };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }

const wait = ms => new Promise(r => setTimeout(r, ms));
/* animation-only waits shrink when the user asked for less motion */
const anim = ms => wait(RM ? Math.min(ms, 120) : (G.bedtime ? ms * 1.25 : ms));
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const num = n => (G.lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const onLang = f => G.hooks.push(f);
const isRTL = () => G.lang === 'ar';

function applyLang() {
  const ar = G.lang === 'ar';
  document.documentElement.lang = G.lang;
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  $$('[data-ar]').forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = ar ? el.dataset.ar : el.dataset.en;
  });
  $$('[data-ar-label]').forEach(el => {
    if (el.dataset.enLabel === undefined) el.dataset.enLabel = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', ar ? el.dataset.arLabel : el.dataset.enLabel);
  });
  const lb = $('#langBtn');
  if (lb) { lb.textContent = ar ? 'English' : 'عربي'; lb.lang = ar ? 'en' : 'ar'; lb.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية'); }
  if (G.narr) $('#narrText').textContent = t(G.narr);
  if (G.pauseCur) { $('#pauseQ').textContent = t(G.pauseCur.q); $('#pauseHint').textContent = t(G.pauseCur.hint); }
  if (G.endCur) renderEnding();
  G.hooks.forEach(f => f());
}

/* ---- narration: the strip under the scene, optionally spoken (never scripture) ---- */
function say(o) { G.narr = o; const el = $('#narrText'); el.textContent = t(o); el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); if (G.voice) speakText(t(o)); }
function speakText(txt) {
  if (!('speechSynthesis' in window) || !txt) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt.replace(/\p{Extended_Pictographic}|️/gu, ''));
  u.lang = G.lang === 'ar' ? 'ar-SA' : 'en-GB'; u.rate = G.bedtime ? 0.8 : 0.9;
  speechSynthesis.speak(u);
}

/* ---- soft Web Audio chimes (sine bells; no music). Scholar ruling 2026-11-03: until the owner decides on
   instruments, every cue is one soft tone or a two-note chime; no arpeggios or melodic runs. ---- */
let AC = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(a, f, at, dur, vol) {
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(a.destination); o.start(at); o.stop(at + dur + 0.05);
}
function chime(kind) {
  if (!G.sound) return; const a = ac(); if (!a) return;
  const n = a.currentTime, v = G.bedtime ? 0.04 : 0.08;
  if (kind === 'tap') tone(a, 880, n, 0.12, v * 0.45);
  else if (kind === 'good') { tone(a, 659, n, 0.4, v); tone(a, 988, n + 0.09, 0.5, v * 0.8); }
  else if (kind === 'soft') tone(a, 392, n, 0.45, v * 0.6);
  else if (kind === 'thud') tone(a, 220, n, 0.16, v * 0.9);
  else if (kind === 'done') { tone(a, 523, n, 0.9, v * 0.7); tone(a, 784, n + 0.2, 1.1, v * 0.6); }
}

/* ---- sparse, soft sparkles ---- */
function sparkle(el, n = 8) {
  if (RM || G.bedtime || !el) return;
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.className = 'spark';
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4, d = 30 + Math.random() * 30;
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.setProperty('--dx', Math.cos(ang) * d + 'px'); s.style.setProperty('--dy', Math.sin(ang) * d + 'px');
    document.body.appendChild(s); setTimeout(() => s.remove(), 800);
  }
}
function fx(el, cls) { if (!el) return; el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 600); }

/* ---- parent pause point (a question to talk about, never graded) ---- */
function pausePoint(q, hint) {
  return new Promise(res => {
    G.pauseCur = { q, hint };
    $('#pauseQ').textContent = t(q); $('#pauseHint').textContent = t(hint);
    $('#pause').hidden = false; chime('soft');
    const b = $('#pauseGo'); setTimeout(() => b.focus(), 50);
    if (G.voice) speakText(t(q));
    b.onclick = () => { $('#pause').hidden = true; G.pauseCur = null; chime('tap'); res(); };
  });
}

/* ---- calm ending ---- */
function showEnding(o) { G.endCur = o; renderEnding(); $('#ending').hidden = false; chime('done'); setTimeout(() => $('#againBtn').focus(), 60); }
function renderEnding() {
  const o = G.endCur; if (!o) return;
  $('#endArt').textContent = o.art || '🌙';
  $('#endTitle').textContent = t(o.title); $('#endBody').textContent = t(o.body);
  $('#endExtra').innerHTML = o.extra ? o.extra() : '';
  const tw = $('#tierWrap');
  if (o.tier) { tw.hidden = false; $('#tierLabel').textContent = t(o.tier); $('#tierBox').checked = G.tier; } else tw.hidden = true;
}
function wireEnding(restart) {
  $('#againBtn').onclick = () => { G.tier = $('#tierBox').checked; $('#ending').hidden = true; G.endCur = null; chime('tap'); restart(); };
}

/* ---- drag with generous snap zones; tap-to-select + tap-target as the keyboard / no-drag path ---- */
function rectHit(x, y, el, pad) { const r = el.getBoundingClientRect(); return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; }
function findTarget(x, y, targets, pad = 28) {
  let best = null, bd = 1e9;
  targets.forEach(tg => { if (!rectHit(x, y, tg, pad)) return; const r = tg.getBoundingClientRect(); const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (d < bd) { bd = d; best = tg; } });
  return best;
}
function clearSel() { if (G.sel) { G.sel.el.classList.remove('selected'); G.sel.el.setAttribute('aria-pressed', 'false'); G.sel.opts.targets().forEach(x => x.classList.remove('drop-hint')); } G.sel = null; }
function draggable(el, opts) {
  el.classList.add('drag'); el.setAttribute('role', 'button'); el.tabIndex = 0; el.setAttribute('aria-pressed', 'false');
  let sx = 0, sy = 0, pid = null, dragging = false, hot = null;
  const reset = () => { el.classList.remove('dragging'); el.style.transform = ''; if (hot) hot.classList.remove('drop-hot'); hot = null; };
  el.addEventListener('pointerdown', e => {
    if (el.dataset.locked) return; pid = e.pointerId; sx = e.clientX; sy = e.clientY; dragging = false;
    try { el.setPointerCapture(pid); } catch (_) {}
    ac();
  });
  el.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!dragging && Math.hypot(dx, dy) > 8) { dragging = true; clearSel(); el.classList.add('dragging'); chime('tap'); opts.onPick && opts.onPick(el); }
    if (dragging) {
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`;
      const tg = findTarget(e.clientX, e.clientY, opts.targets());
      if (tg !== hot) { if (hot) hot.classList.remove('drop-hot'); hot = tg; if (hot) hot.classList.add('drop-hot'); }
    }
  });
  const up = e => {
    if (e.pointerId !== pid) return; pid = null;
    if (!dragging) { reset(); select(); return; }
    const tg = e.type === 'pointerup' ? findTarget(e.clientX, e.clientY, opts.targets()) : null;
    reset();
    if (tg) opts.onDrop(el, tg); else { el.classList.add('back-home'); setTimeout(() => el.classList.remove('back-home'), 400); opts.onMiss && opts.onMiss(el); }
  };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  function select() {
    if (el.dataset.locked) return;
    if (G.sel && G.sel.el === el) { clearSel(); return; }
    clearSel(); G.sel = { el, opts }; el.classList.add('selected'); el.setAttribute('aria-pressed', 'true'); chime('tap');
    opts.targets().forEach(x => x.classList.add('drop-hint'));
    opts.onSelect && opts.onSelect(el);
  }
}
/* a drop target: click / Enter places the selected item there */
function dropTarget(tg) {
  if (!tg.matches('button')) { tg.tabIndex = 0; tg.setAttribute('role', 'button'); tg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg.click(); } }); }
  tg.addEventListener('click', () => {
    if (!G.sel || !G.sel.opts.targets().includes(tg)) return;
    const { el, opts } = G.sel; clearSel(); opts.onDrop(el, tg);
  });
}

/* ---- press-and-hold (patience as a mechanic: progress keeps if you let go) ---- */
function holdButton(btn, ms, onTick, onDone) {
  let p = 0, timer = null, last = 0;
  const set = v => { p = v; btn.style.setProperty('--p', p); };
  const step = now => { if (!timer) return; const dt = now - last; last = now; set(Math.min(1, p + dt / ms)); onTick && onTick(p); if (p >= 1) { stop(); onDone(); return; } timer = requestAnimationFrame(step); };
  const start = e => { if (btn.disabled || p >= 1) return; e && e.preventDefault(); ac(); last = performance.now(); timer = requestAnimationFrame(step); btn.classList.add('holding'); };
  const stop = () => { if (timer) cancelAnimationFrame(timer); timer = null; btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(e); });
  btn.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') stop(); });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  return { reset: () => { stop(); set(0); }, get: () => p };
}

/* ---- choice helper: show buttons, resolve with the chosen id ---- */
function ask(container, options) {
  return new Promise(res => {
    container.innerHTML = ''; container.hidden = false;
    const btns = shuffle(options).map(o => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'choice'; b.__o = o;
      b.addEventListener('click', () => { chime('tap'); container.hidden = true; G.hooks = G.hooks.filter(h => h !== hk); res(o.id); });
      container.appendChild(b); return b;
    });
    const hk = () => btns.forEach(b => { const o = b.__o; b.innerHTML = (o.ic ? `<span class="ic" aria-hidden="true">${o.ic}</span>` : '') + t(o.label); });
    hk(); G.hooks.push(hk);
    setTimeout(() => btns[0] && btns[0].focus({ preventScroll: true }), 30);
  });
}

/* ---- toolbar ---- */
function initShell() {
  $('#langBtn').addEventListener('click', () => { G.lang = G.lang === 'ar' ? 'en' : 'ar'; if ('speechSynthesis' in window) speechSynthesis.cancel(); applyLang(); chime('tap'); });
  const tog = (id, key, after) => $(id).addEventListener('click', e => { G[key] = !G[key]; e.currentTarget.setAttribute('aria-pressed', String(G[key])); after && after(); chime('tap'); });
  tog('#soundBtn', 'sound');
  tog('#voiceBtn', 'voice', () => { if (G.voice && G.narr) speakText(t(G.narr)); if (!G.voice && 'speechSynthesis' in window) speechSynthesis.cancel(); });
  tog('#bedBtn', 'bedtime', () => document.body.classList.toggle('bedtime', G.bedtime));
  if (!('speechSynthesis' in window)) { $('#voiceBtn').hidden = true; $('#speakBtn').hidden = true; }
  $('#speakBtn').addEventListener('click', () => speakText(t(G.narr)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') clearSel(); });
  applyLang();
}
const times = n => (G.lang === 'ar' ? (n === 1 ? 'مرة واحدة' : n === 2 ? 'مرتين' : `${num(n)} مرات`) : (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`));
