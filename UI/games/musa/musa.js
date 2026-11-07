/* Game 03, The Path Through the Sea (Musa): the second painted game (2026-11-06).
   Painted DOM planes + DOM HUD; one PixiJS canvas (decoration only) for water shimmer, stars, fish, footprints and
   motes. All words live in the DOM (Arabic shaping, RTL). No browser TTS: the only voice is Baba's recorded story
   narration (Musa slides 10 and 11, which hold no ayah), played in sentence-aligned parts. No music: one- or
   two-note chimes and natural sounds. Systems reused from games/nuh/nuh.js. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const IMG = '../images/games/musa/';
const AUDIO = '../audio/prophet-musa/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const G = { lang: 'en', sound: true, bed: false, tier: false, orient: null, s: 1, ox: 0, oy: 0, sel: null, clip: null, gesture: false };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }
const anim = ms => wait(RM ? Math.min(ms, 200) : G.bed ? ms * 1.25 : ms);
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const rtl = () => G.lang === 'ar';
const lerp = (a, b, k) => a + (b - a) * k;

/* ======================= layout: logical world coordinates, one table per composition =======================
   Measured against the painted plates (plate pixels). path: the dry path from the water's edge (t = 0) to the far
   shore (t = 1), as [x, y, depth] points; depth scales the lantern, lights and prints. walls/sea: polygons for the
   water shimmer and the fish. */
const LAYOUT = {
  land: {
    // measured on plate-split-land (crop 54 px, x1.003): the path runs from the water's edge at the beach
    // (631, 578) to the vanishing point on the horizon (634, 272); its painted width gives the depth
    w: 1240, h: 781,
    path: [[631, 580, 1], [632, 468, 0.68], [633, 380, 0.45], [634, 302, 0.3]],
    campStart: [330, 626, 1],
    wait: [545, 664, 1],   // on the beach among the lights, away from the water where the sea opens (gate 3.3)
    tents: [[175, 630, 230, false], [1070, 634, 210, true]], bundle: [900, 634, 70],
    campLights: [[110, 600], [240, 612], [300, 596], [1000, 604], [1120, 612], [870, 610], [420, 628], [800, 630], [1180, 620]],
    beach: [[585, 612], [680, 614], [540, 640], [725, 640], [632, 632], [500, 668], [765, 668], [590, 676], [680, 680]],
    far: [[612, 296], [622, 292], [632, 290], [642, 292], [652, 296], [617, 302], [627, 300], [637, 300], [647, 302]],
    walls: [[[-6, 268], [507, 247], [624, 275], [507, 580], [-6, 523]], [[1246, 268], [763, 247], [642, 275], [763, 584], [1246, 553]]],
    sea: [[0, 272], [1240, 272], [1240, 553], [620, 568], [0, 523]],
    sky: [40, 20, 1200, 215],
    lanternW: 70,
    fg: { r1: [40, 781, 300, false], r2: [1200, 781, 270, true] }
  },
  port: {
    // phone, measured on plate-split-port (crop at 33, 38; x0.987). The narration ribbon sits in the night sky at
    // the top; the choices come up from the bottom over the beach. The path runs from the water's edge (352, 910)
    // to the far hills (354, 426).
    w: 690, h: 1305,
    path: [[352, 910, 1], [352, 752, 0.6], [354, 604, 0.32], [354, 430, 0.24]],
    campStart: [225, 990, 1],
    wait: [275, 1040, 1],
    tents: [[115, 1000, 210, false], [585, 1004, 190, true]], bundle: [480, 1008, 64],
    campLights: [[80, 960], [170, 972], [260, 952], [540, 962], [630, 972], [450, 978], [300, 1010], [420, 1016], [360, 1040]],
    beach: [[315, 940], [390, 942], [285, 975], [420, 975], [352, 965], [260, 1010], [445, 1010], [315, 1030], [390, 1034]],
    far: [[330, 426], [342, 422], [354, 420], [366, 422], [378, 426], [336, 434], [348, 432], [360, 432], [372, 434]],
    walls: [[[0, 515], [318, 436], [318, 604], [130, 915], [0, 915]], [[691, 515], [392, 436], [392, 604], [569, 915], [691, 915]]],
    sea: [[0, 403], [690, 403], [690, 873], [0, 873]],
    sky: [50, 30, 640, 380],
    lanternW: 92,
    fg: { r1: [50, 1305, 240, false], r2: [640, 1305, 220, true] }
  }
};
let MANIFEST = { aspects: {} };

/* ======================= words (gate-1 approved text kept as approved) ======================= */
const W = {
  camp: { en: 'Allah told Prophet Musa to lead the believers out of Egypt at night. Carry a lantern and walk with them down to the sea: drag it to the glowing spot by the water.',
    ar: 'أمر الله النبيَّ موسى عليه السلام أن يقود المؤمنين خارج مصر ليلاً. احمل فانوساً وامشِ معهم إلى البحر: اسحبه إلى البقعة المضيئة عند الماء.' },
  selLantern: { en: 'Now tap the glowing spot.', ar: 'والآن المس البقعة المضيئة.' },
  missShore: { en: 'Bring the lantern to the glowing spot by the water.', ar: 'ضع الفانوس على البقعة المضيئة عند الماء.' },
  shore: { en: "Now there is a huge sea in front of them, and Pharaoh's army is coming behind. The people are frightened. What is the best answer to fear like this?",
    ar: 'والآن أمامهم بحر ضخم، وجيش فرعون قادم من خلفهم. الناس خائفون. ما أفضل جواب لخوف كهذا؟' },
  optTrust: { en: 'Allah is with us, He will guide us', ar: 'الله معنا، وسيهدينا' },
  optRun: { en: 'Run back the way we came', ar: 'نركض عائدين من حيث جئنا' },
  run: { en: 'Running back would lead straight to the army. There is a better answer, the one Musa gave. Let us choose again.', ar: 'الرجوع يقودنا مباشرة إلى الجيش. هناك جواب أفضل، وهو جواب موسى. لنختر مرة أخرى.' },
  trust: { en: "Yes! Musa said: 'My Lord is with me, He will guide me.' Trusting Allah is the brave answer.", ar: 'نعم! قال موسى إن ربه معه وسيهديه. الثقة بالله هي الجواب الشجاع.' },
  strike: { en: 'Then Allah told Musa to strike the sea with his staff. Press the button to hear what happened.', ar: 'ثم أمر الله موسى أن يضرب البحر بعصاه. اضغط الزر لتسمع ما حدث.' },
  hearBtn: { en: 'Hear what happened', ar: 'استمع لما حدث' },
  parted: { en: "Musa obeyed Allah and struck the sea with his staff, and by Allah's command the sea split into two mighty walls with a dry path in the middle!",
    ar: 'أطاع موسى ربه وضرب البحر بعصاه، فانشق البحر بأمر الله إلى جدارين عظيمين وبينهما طريق يابس!' },
  walkIn: { en: 'Carry your lantern and walk with the believers, following the path Allah opened. Tap the next glowing step, or drag the lantern.',
    ar: 'احمل فانوسك وامشِ مع المؤمنين على الطريق الذي فتحه الله. المس الخطوة المضيئة التالية، أو اسحب الفانوس.' },
  onward: { en: 'We walk on together, along the path Allah opened. Keep going.', ar: 'نمشي معاً على الطريق الذي فتحه الله. واصل السير.' },
  dragNext: { en: 'Move the lantern to the next glowing step.', ar: 'حرّك الفانوس إلى الخطوة المضيئة التالية.' },
  selStep: { en: 'Now tap the glowing step.', ar: 'والآن المس الخطوة المضيئة.' },
  stepBtn: { en: 'Step forward', ar: 'خطوة إلى الأمام' },
  dawn: { en: 'Look: the first light of morning over the far shore. We walk on together.', ar: 'انظر: أول ضوء الصباح فوق الشاطئ البعيد. نمشي معاً.' },
  wall: { en: "The walls of water stand still by Allah's command, and the path stays dry.", ar: 'تقف جدران الماء ثابتة بأمر الله، ويبقى الطريق يابساً.' },
  safe: { en: 'The believers walked safely across! Then the walls of water came back down. Allah had saved the believers, just as He promised.', ar: 'عبر المؤمنون بأمان! ثم عادت جدران الماء. لقد أنقذ الله المؤمنين كما وعد.' },
  pauseQ: { en: 'When have you felt scared? What can you say to yourself to remember that Allah is with you?', ar: 'متى شعرت بالخوف؟ ماذا يمكنك أن تقول لنفسك لتتذكر أن الله معك؟' },
  pauseH: { en: 'Idea: say "Allah is with me", take a slow breath, then do the next brave step.', ar: 'فكرة: قل "الله معي"، وتنفّس ببطء، ثم اخطُ الخطوة الشجاعة التالية.' },
  endB: { en: 'You walked with the believers along the dry path Allah opened, and answered every fear with trust. When you feel trapped, remember: Allah is with you.', ar: 'مشيت مع المؤمنين على الطريق اليابس الذي فتحه الله، وأجبت كل خوف بالثقة. حين تشعر أنك محاصر، تذكّر: الله معك.' },
  beadsLabel: { en: 'The path', ar: 'الطريق' },
  stepAt: (i, n) => ({ en: i >= n ? 'The far shore' : `The next step on the path`, ar: i >= n ? 'الشاطئ البعيد' : 'الخطوة التالية على الطريق' }),
  shoreSpot: { en: 'The water\'s edge', ar: 'حافة الماء' }
};
/* the moments of fear on the path (gate-1 approved wording); "at" is the step, tier: only on the longer path */
const FEARS = [
  { at: 3, react: 'jostle',
    q: { en: 'The walls of water are SO tall! Some people feel scared. What shall we do?', ar: 'جدران الماء عالية جداً! بعض الناس خائفون. ماذا نفعل؟' },
    good: { en: 'Walk on calmly, Allah made this path safe', ar: 'نمشي بهدوء، فالله جعل هذا الطريق آمناً' },
    bad: { en: 'Push and run past everyone', ar: 'ندفع الناس ونركض' },
    why: { en: 'Pushing could hurt someone. Allah made the path safe and dry, so we can walk calmly and help each other. Let us choose again.', ar: 'الدفع قد يؤذي أحداً. جعل الله الطريق آمناً يابساً، فنستطيع أن نمشي بهدوء ويساعد بعضنا بعضاً. لنختر مرة أخرى.' },
    yes: { en: 'Yes. We walk calmly, side by side, and the lantern shines warmer. Tap the next glowing step.', ar: 'نعم. نمشي بهدوء جنباً إلى جنب، ويضيء الفانوس أكثر. المس الخطوة المضيئة التالية.' } },
  { at: 6, react: 'turn',
    q: { en: 'The sound of chariots behind us! Someone shouts, "Go back!" What shall we do?', ar: 'صوت العربات خلفنا! أحدهم يصيح: "ارجعوا!" ماذا نفعل؟' },
    good: { en: 'Keep going forward, Allah is with us', ar: 'نتقدم إلى الأمام، الله معنا' },
    bad: { en: 'Turn back to Egypt', ar: 'نعود إلى مصر' },
    why: { en: 'Going back means walking towards the army. Allah opened this path for the believers. Let us keep trusting Him and choose again.', ar: 'الرجوع يعني السير نحو الجيش. فتح الله هذا الطريق للمؤمنين. لنستمر في الثقة به ونختر مرة أخرى.' },
    yes: { en: 'Yes. We keep going forward, trusting Allah, and the lantern shines warmer still. Tap the next glowing step.', ar: 'نعم. نتقدم إلى الأمام واثقين بالله، ويزداد الفانوس دفئاً. المس الخطوة المضيئة التالية.' } },
  { at: 9, tier: true, react: 'lag',
    q: { en: 'A little child is tired and has slowed down. What shall we do?', ar: 'طفل صغير تعب وأبطأ في سيره. ماذا نفعل؟' },
    good: { en: 'Help them along, nobody is left behind', ar: 'نساعده، فلا أحد يبقى وحده' },
    bad: { en: 'Hurry ahead without them', ar: 'نسرع ونتركه' },
    why: { en: 'Brave people are kind too. Allah is with all of us, so we help the tired ones across. Let us choose again.', ar: 'الشجعان رحماء أيضاً. الله معنا جميعاً، فنساعد المتعبين على العبور. لنختر مرة أخرى.' },
    yes: { en: 'Yes. We slow down and walk together; nobody is left behind. Tap the next glowing step.', ar: 'نعم. نبطئ ونمشي معاً، فلا أحد يبقى وحده. المس الخطوة المضيئة التالية.' } }
];
/* Baba's recorded story narration, in sentence-aligned parts (seconds, cut at the recorded pauses; ffmpeg
   silencedetect, 2026-11-06). Slides 10 and 11 hold no ayah (verify-no-recitation passes on them); slide 13 (the dua)
   is never used. The end of slide 11 (the army) is not played: the game keeps the emphasis on the believers' safety. */
const CLIPS = {
  camp: { slide: 10, en: [0, 16.45], ar: [0, 17.05] },          // ... the people cried "They have caught us!"
  reply: { slide: 10, en: [16.45, 22.2], ar: [17.05, 24.2] },    // But Musa said calmly ...
  parted: { slide: 11, en: [0, 12.6], ar: [0, 10.8] },           // ... a dry path in the middle
  safe: { slide: 11, en: [13.0, 15.5], ar: [10.85, 12.6] }      // The believers walked safely across.
};

/* ======================= sound: Web Audio, no music ======================= */
let AC = null, master = null, surfNode = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); master = AC.createGain(); master.gain.value = G.sound && !G.quiet ? 1 : 0; master.connect(AC.destination); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

/* scholar 3.1 (2026-11-07): silence goes through the master gain. A looping bed's gain or LFO can leave a floor
   (-55 to -80 dBFS) when only its own target is lowered, so "Sounds off" (and, in Yusuf, the 12:92 screen) ramps the
   master to exactly 0 in 0.15 s; nothing reaches the speakers until it is restored. */
function masterGate() {
  if (!AC || !master) return;
  const on = G.sound && !G.quiet, t = AC.currentTime, g = master.gain;
  g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(on ? 1 : 0, t + 0.15);
}
const vol = () => (G.sound ? (G.bed ? 0.45 : 1) * (G.clip && !G.clip.paused ? 0.4 : 1) : 0);
let noiseBuf = null;
function noise(a) { if (noiseBuf) return noiseBuf; const b = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5 + w * 0.15; } return (noiseBuf = b); }
function bell(a, f, at, dur, v) {
  [[1, 1], [2.76, 0.28], [5.4, 0.08]].forEach(([m, g]) => {
    const o = a.createOscillator(), e = a.createGain(); o.type = 'sine'; o.frequency.value = f * m;
    e.gain.setValueAtTime(0.0001, at); e.gain.exponentialRampToValueAtTime(v * g, at + 0.012); e.gain.exponentialRampToValueAtTime(0.0001, at + dur / m ** 0.3);
    o.connect(e).connect(master); o.start(at); o.stop(at + dur + 0.1);
  });
}
function hush(a, n, lpF, d, peak) { // a soft swell of filtered noise: sand underfoot, water lapping, a far rumble
  const s = a.createBufferSource(); s.buffer = noise(a); const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = lpF;
  const g = a.createGain(); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(peak, n + d * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, n + d);
  s.connect(lp).connect(g).connect(master); s.start(n, Math.random()); s.stop(n + d + 0.05);
}
function sfx(kind) {
  const v = vol(); if (!v) return; const a = ac(); if (!a) return; const n = a.currentTime;
  if (kind === 'good') { bell(a, 659, n, 1.4, 0.07 * v); bell(a, 988, n + 0.12, 1.6, 0.05 * v); }
  else if (kind === 'done') { bell(a, 523, n, 2.4, 0.07 * v); bell(a, 784, n + 0.35, 2.8, 0.055 * v); }
  else if (kind === 'soft') bell(a, 392, n, 1.1, 0.045 * v);
  else if (kind === 'tap') bell(a, 1320, n, 0.25, 0.018 * v);
  else if (kind === 'step') { hush(a, n, 420, 0.16, 0.3 * v); hush(a, n + 0.28, 400, 0.16, 0.26 * v); }
  else if (kind === 'lap') hush(a, n, 650, 0.6, 0.3 * v);
  else if (kind === 'rumble') hush(a, n, 110, 3.2, 0.5 * v);   // far behind, low and soft: never a crash
}
function surf(level) { // the sea breathing on the shore: a slow, very low noise swell (no melody)
  const a = ac(); if (!a) return;
  if (!surfNode) {
    const s = a.createBufferSource(); s.buffer = noise(a); s.loop = true;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    const g = a.createGain(); g.gain.value = 0.0001;
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.11; lg.gain.value = 0.012; lfo.connect(lg).connect(g.gain); lfo.start();
    s.connect(lp).connect(g).connect(master); s.start(); surfNode = { s, g, lfo };
  }
  surfNode.g.gain.cancelScheduledValues(a.currentTime);
  surfNode.g.gain.setTargetAtTime(Math.max(0.0001, level * 0.035 * vol()), a.currentTime, 1.4);
}

/* Baba's voice: the recorded story clip for this beat (never TTS, never scripture), one sentence-aligned part */
let clipBeat = null, clipTimer = 0;
function stopClip() { if (G.clip) { G.clip.pause(); G.clip = null; } clearInterval(clipTimer); $('#listenBtn').classList.remove('playing'); }
function setClip(beat) { clipBeat = beat; $('#listenBtn').hidden = !(beat in CLIPS); stopClip(); }
function playClip() {
  if (!(clipBeat in CLIPS)) return;
  const b = $('#listenBtn');
  if (G.clip && !G.clip.paused) { stopClip(); return; }
  const c = CLIPS[clipBeat], [from, to] = c[G.lang];
  const au = new Audio(`${AUDIO}${G.lang}/slide-${c.slide}.mp3`); G.clip = au;
  const start = () => { try { au.currentTime = from; } catch (e) { /* not seekable yet */ } au.play().then(() => b.classList.add('playing')).catch(() => {}); };
  if (au.readyState >= 1) start(); else au.addEventListener('loadedmetadata', start, { once: true });
  clearInterval(clipTimer);
  clipTimer = setInterval(() => { // stop at the sentence boundary, with a short fade so nothing of the next sentence is heard
    if (G.clip !== au) { clearInterval(clipTimer); return; }
    if (au.currentTime >= to - 0.18) au.volume = Math.max(0, au.volume - 0.34);
    if (au.currentTime >= to || au.ended) { au.pause(); clearInterval(clipTimer); b.classList.remove('playing'); }
  }, 40);
  au.addEventListener('ended', () => b.classList.remove('playing'));
}

/* ======================= world fit, RTL mirror ======================= */
const world = $('#world'), app = $('#app');
let L = LAYOUT.land;
function fit() {
  const vw = innerWidth, vh = innerHeight;
  const orient = vw / vh < 0.8 ? 'port' : 'land';
  const changed = orient !== G.orient; G.orient = orient; L = LAYOUT[orient];
  const s = Math.max(vw / L.w, vh / L.h);
  G.s = s; G.ox = (vw - L.w * s) / 2; G.oy = Math.min(0, (vh - L.h * s) * 0.5);
  world.style.width = L.w + 'px'; world.style.height = L.h + 'px';
  world.style.transform = rtl() ? `translate(${G.ox + L.w * s}px,${G.oy}px) scale(${-s},${s})` : `translate(${G.ox}px,${G.oy}px) scale(${s})`;
  world.classList.toggle('rtl', rtl());
  const f = $('.frame'); f.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  [['.f1', 10], ['.f2', 17]].forEach(([c, m]) => { const r = $(c, f); r.setAttribute('x', m); r.setAttribute('y', m); r.setAttribute('width', Math.max(0, vw - 2 * m)); r.setAttribute('height', Math.max(0, vh - 2 * m)); });
  if (changed) { loadPlates(); buildMarks(); Atmos.resize(); }
  place();
}
const toWorld = (cx, cy) => { let x = (cx - G.ox) / G.s; const y = (cy - G.oy) / G.s; if (rtl()) x = L.w - (cx - G.ox) / G.s; return [x, y]; };
function loadPlates() {
  $$('.plates img').forEach(im => { const src = `${IMG}plate-${im.dataset.state}-${G.orient}.webp`; if (!im.src.endsWith(src.replace(/^(\.\.\/)+/, ''))) im.src = src; });
}
function box(el, x, y, w, h) { Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - h) + 'px', width: w + 'px', height: h + 'px' }); }
const asp = (n, d = 1) => MANIFEST.aspects[n] || d;

/* the path: arc-length interpolation along the measured polyline; returns [x, y, depth] */
function pathAt(tt) {
  const P = L.path; tt = Math.max(0, Math.min(1, tt));
  const seg = []; let tot = 0;
  for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); tot += d; }
  let need = tt * tot;
  for (let i = 1; i < P.length; i++) {
    if (need <= seg[i - 1] || i === P.length - 1) { const k = seg[i - 1] ? Math.min(1, need / seg[i - 1]) : 0; return [lerp(P[i - 1][0], P[i][0], k), lerp(P[i - 1][1], P[i][1], k), lerp(P[i - 1][2], P[i][2], k)]; }
    need -= seg[i - 1];
  }
  return P[P.length - 1].slice();
}
const stepT = i => i / S.n;

/* ======================= state ======================= */
const S = {};
const lantern = $('#lantern'), target = $('#stepTarget');
function lanternAt() { // where the lantern stands now: [x, y, depth]
  if (S.phase === 'camp') return L.campStart;
  if (S.phase === 'end' || S.phase === 'safe') { const f = L.far[5]; return [f[0], f[1] + 4, pathAt(1)[2]]; }
  // scholar gate 3.3: once the choice at the shore is made, the lantern goes back onto the beach among the lights,
  // so the sea never opens from where the child's lantern stands (a miracle is never the child's power)
  if (S.onBeach && (S.phase === 'shore' || S.phase === 'parting')) return L.wait;
  // the lantern is carried at the side of the path, so the next glowing step ahead is never hidden behind it
  const [x, y, d] = pathAt(stepT(S.pos)); return [x - L.lanternW * 0.62 * d, y, d];
}
function place() {
  const [x, y, d] = lanternAt(), lw = L.lanternW * d, la = asp('lantern', 0.62);
  lantern.style.setProperty('--la', la);
  const lh = lw / la, bw = Math.max(lw, 64 / G.s), bh = Math.max(lh, 64 / G.s);   // the box never drops under 64 screen px
  box(lantern, x, y, bw, bh); lantern.style.setProperty('--iw', lw + 'px'); lantern.style.setProperty('--ih', lh + 'px'); lantern.style.zIndex = '12'; target.style.zIndex = '13';
  placeTarget(); placeCamp(); placeTrail(); placeWalls();
  const fg = L.fg;
  [['.reeds.r1', fg.r1, 'reeds'], ['.reeds.r2', fg.r2, 'reeds']].forEach(([sel, v, n]) => {
    const el = $(sel); if (!v) { el.hidden = true; return; } el.hidden = false;
    const [fx, fy, fh, flip] = v; box(el, fx, fy + 10, fh * asp(n, 0.6), fh); el.style.scale = flip ? '-1 1' : '';
  });
}
function placeTarget() {
  let p = null;
  if (S.phase === 'camp') p = L.path[0];
  else if (S.phase === 'walk' && S.pos < S.n) p = pathAt(stepT(S.pos + 1));
  target.hidden = !p || S.asking || S.moving;
  if (!p) return;
  target.style.left = p[0] + 'px'; target.style.top = p[1] + 'px';
  const sz = Math.max(76, 104 * (p[2] || 1)) / 1; target.style.width = target.style.height = sz + 'px'; target.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`;
  target.setAttribute('aria-label', t(S.phase === 'camp' ? W.shoreSpot : W.stepAt(S.pos + 1, S.n)));
}
function placeCamp() {
  const c = $('.camp');
  L.tents.forEach(([x, y, w, flip], i) => { const el = $('.tent.t' + (i + 1), c), h = w / asp('tent', 1.5); box(el, x, y, w, h); el.style.scale = flip ? '-1 1' : ''; });
  const bw = L.bundle[2];
  box($('.bundle', c), L.bundle[0], L.bundle[1], bw, bw / asp('bundle', 1.2));
}
function buildMarks() {
  const m = $('#marks'); m.innerHTML = '';
  for (let i = 1; i <= (S.n || 8); i++) { const p = pathAt(i / (S.n || 8)), d = document.createElement('span'); d.className = 'mark' + (i <= (S.pos || 0) ? ' done' : ''); d.style.left = p[0] + 'px'; d.style.top = p[1] + 'px'; d.style.setProperty('--d', p[2]); m.appendChild(d); }
}

/* the believers: small lantern-lights, never figures. They follow behind; nobody leads but the path. */
const NLIGHTS = 9, AHEAD = 4;
function buildTrail() { const tr = $('#trail'); tr.innerHTML = ''; for (let i = 0; i < NLIGHTS; i++) { const l = document.createElement('span'); l.className = 'light'; tr.appendChild(l); } }
function placeTrail() {
  const lights = $$('#trail .light'), gap = 0.05;
  lights.forEach((l, i) => {
    let x, y, d = 1;
    if (S.phase === 'camp') [x, y] = L.campLights[i];
    else if (S.phase === 'safe' || S.phase === 'end') { [x, y] = L.far[i]; d = pathAt(1)[2]; }
    else if (S.phase === 'walk') {
      // scholar gate 3.1 (MUST): the child walks AMONG the believers, never at the head of them. The first
      // AHEAD lights walk in front of the lantern, on the far side of the path (the next glowing step stays
      // clear); the rest follow behind. At the far end the ones ahead wait at the far shore.
      if (i < AHEAD) {
        const tt = Math.min(1, stepT(S.pos) + (AHEAD - i) * gap * 1.7);   // spaced out, so they read as ahead, not beside
        [x, y, d] = pathAt(tt); x += L.lanternW * 0.55 * d;
      } else {
        const back = (i - AHEAD + 1) * gap + (S.lagging && i === NLIGHTS - 1 ? 0.12 : 0);
        const tt = stepT(S.pos) - back;
        if (tt >= 0) [x, y, d] = pathAt(tt);
        else { const k = Math.min(L.beach.length - 1, Math.round(-tt / gap)); [x, y] = L.beach[(i + k) % L.beach.length]; }
      }
    } else [x, y] = L.beach[i];
    l.style.left = x + 'px'; l.style.top = y + 'px'; l.style.setProperty('--d', Math.max(0.45, d));
    l.classList.toggle('lag', !!(S.lagging && i === NLIGHTS - 1));
  });
}
function placeWalls() {
  $$('.wall').forEach((w, i) => {
    const P = L.walls[i]; const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    Object.assign(w.style, { left: Math.min(...xs) + 'px', top: Math.min(...ys) + 'px', width: (Math.max(...xs) - Math.min(...xs)) + 'px', height: (Math.max(...ys) - Math.min(...ys)) + 'px' });
  });
}

/* ======================= beads (progress along the path, no numbers) ======================= */
function beads(total, done) {
  const b = $('#beads'); b.hidden = !total; b.innerHTML = '';
  for (let i = 0; i < total; i++) { const d = document.createElement('span'); d.className = 'bead' + (i < done ? ' full' : i === done ? ' now' : ''); b.appendChild(d); }
  b.setAttribute('aria-label', t(W.beadsLabel));
}

/* ======================= narration ribbon ======================= */
let sayCur = null;
function say(o) { sayCur = o; const p = $('#say'); p.textContent = t(o); p.classList.remove('in'); void p.offsetWidth; p.classList.add('in'); }

/* ======================= language ======================= */
function applyLang() {
  const ar = rtl();
  document.documentElement.lang = G.lang; document.documentElement.dir = ar ? 'rtl' : 'ltr';
  $$('[data-ar]').forEach(el => { if (el.dataset.en === undefined) el.dataset.en = el.innerHTML; el.innerHTML = ar ? el.dataset.ar : el.dataset.en; });
  $$('[data-ar-label]').forEach(el => { if (el.dataset.enLabel === undefined) el.dataset.enLabel = el.getAttribute('aria-label') || ''; el.setAttribute('aria-label', ar ? el.dataset.arLabel : el.dataset.enLabel); });
  const lb = $('#langBtn'); lb.textContent = ar ? 'English' : 'عربي'; lb.lang = ar ? 'en' : 'ar'; lb.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
  if (sayCur) $('#say').textContent = t(sayCur);
  $$('[data-tx]').forEach(el => (el.textContent = t(el.__tx)));
  if (S.pauseQ) { $('#pauseQ').textContent = t(S.pauseQ.q); $('#pauseHint').textContent = t(S.pauseQ.h); }
  if (S.ended) $('#endBody').textContent = t(W.endB);
  $('#beads').setAttribute('aria-label', t(W.beadsLabel));
  stopClip();
  fit();
}

/* ======================= drag, tap-to-select, keyboard ======================= */
function makeDraggable(el, opts) {
  let st = null;
  el.addEventListener('pointerdown', e => {
    if (!opts.enabled()) return; e.preventDefault(); gesture();
    st = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; el.setPointerCapture(e.pointerId);
    sfx('tap');
  });
  el.addEventListener('pointermove', e => {
    if (!st || e.pointerId !== st.id) return;
    const dx = (e.clientX - st.x) / G.s * (rtl() ? -1 : 1), dy = (e.clientY - st.y) / G.s;
    if (!st.moved && Math.hypot(dx, dy) * G.s < 8) return;
    if (!st.moved) { st.moved = true; el.classList.add('dragging'); el.classList.remove('idle'); clearSel(); opts.targets().forEach(tg => tg.classList.add('target-on')); }
    el.style.translate = `${dx}px ${dy}px`;
    const hot = hit(e.clientX, e.clientY, opts.targets()); opts.targets().forEach(tg => tg.classList.toggle('hot', tg === hot));
  });
  const end = e => {
    if (!st || e.pointerId !== st.id) return; const moved = st.moved; st = null;
    el.classList.remove('dragging'); opts.targets().forEach(tg => tg.classList.remove('target-on', 'hot'));
    if (!moved) { el.style.translate = ''; return select(el, opts); }
    const tg = hit(e.clientX, e.clientY, opts.targets());
    if (tg) opts.onDrop(el, tg); else { springBack(el); opts.onMiss && opts.onMiss(el); }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  // keyboard: Enter or Space on the lantern walks it to the glowing spot (no hidden second step)
  el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && opts.enabled()) { e.preventDefault(); gesture(); opts.onDrop(el, opts.targets()[0]); } });
}
function hit(cx, cy, targets, pad = 50) {
  let best = null, bd = 1e9;
  targets.forEach(tg => { if (tg.hidden) return; const r = tg.getBoundingClientRect(); if (cx < r.left - pad || cx > r.right + pad || cy < r.top - pad || cy > r.bottom + pad) return; const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2)); if (d < bd) { bd = d; best = tg; } });
  return best;
}
function springBack(el) {
  const from = el.style.translate || '0px 0px';
  el.style.translate = '';
  if (!RM) el.animate([{ translate: from }, { translate: '0px 0px' }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
}
function select(el, opts) {
  if (G.sel && G.sel.el === el) { clearSel(); return; }
  clearSel(); G.sel = { el, opts }; el.classList.add('selected'); el.setAttribute('aria-pressed', 'true');
  opts.onSelect && opts.onSelect(el);
}
function clearSel() { if (!G.sel) return; const { el } = G.sel; el.classList.remove('selected'); el.setAttribute('aria-pressed', 'false'); G.sel = null; }
function gesture() { if (!G.gesture) { G.gesture = true; ac(); surf(S.phase === 'walk' ? 0.4 : 1); maybeAutoClip(); } }
let pendingClip = null;
function maybeAutoClip() { if (pendingClip && G.sound) { const b = pendingClip; pendingClip = null; if (clipBeat === b) playClip(); } }
function beatClip(beat) { setClip(beat); if (G.gesture && G.sound) playClip(); else pendingClip = beat; }

/* ======================= moving the lantern ======================= */
const canMove = () => !S.asking && !S.moving && (S.phase === 'camp' || (S.phase === 'walk' && S.pos < S.n));
makeDraggable(lantern, {
  enabled: canMove,
  targets: () => [target],
  onSelect: () => say(S.phase === 'camp' ? W.selLantern : W.selStep),
  onDrop: () => moveOn(),
  onMiss: () => say(S.phase === 'camp' ? W.missShore : W.dragNext)
});
// tapping the glowing step walks the lantern there: the simplest gesture for a five-year-old
target.addEventListener('click', () => { gesture(); clearSel(); if (canMove()) moveOn(); });
$('#actBtn').addEventListener('click', () => { gesture(); const f = S.act; if (f) f(); });
function setAct(label, fn) { const b = $('#actBtn'); S.act = fn; if (!label) { $('#actRow').hidden = true; return; } b.innerHTML = ''; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = label; sp.textContent = t(label); b.appendChild(sp); $('#actRow').hidden = false; }

async function moveOn() {
  if (!canMove()) return;
  clearSel(); S.moving = true; lantern.classList.remove('idle');
  // the lantern glides from where it was dropped to the spot (no jump)
  const from = lantern.style.translate; lantern.classList.add('snap'); lantern.style.translate = '';
  if (S.phase === 'camp') { S.phase = 'shore'; app.className = app.className.replace(/phase-\w+/, 'phase-shore'); }
  else { S.pos++; Atmos.prints(stepT(S.pos - 1), stepT(S.pos)); beads(S.n, S.pos); $$('#marks .mark')[S.pos - 1]?.classList.add('done'); }
  if (from && !RM) { const r = lantern.getBoundingClientRect(); void r; }
  lantern.classList.remove('snap');
  place(); sfx('step'); target.hidden = true;
  await anim(1350);
  lantern.classList.add('land'); setTimeout(() => lantern.classList.remove('land'), 450);
  S.moving = false;
  if (S.phase === 'shore') return atTheSea();
  if (S.pos >= S.n) return arrive();
  const fear = FEARS.find(f => f.at === S.pos && (!f.tier || G.tier));
  if (S.pos === S.dawnAt) { setPlate('dawn'); Atmos.water('dawn'); Atmos.stars(false); say(W.dawn); }
  else if (!fear) say(W.onward);
  if (fear) await fearMoment(fear);
  readyStep();
}
function readyStep() {
  if (S.phase !== 'walk' || S.pos >= S.n) return;
  place(); if (!RM) lantern.classList.add('idle');
  setAct(W.stepBtn, () => moveOn());
  // keyboard: after a choice closes, focus comes back to the lantern (never left on the page body)
  const a = document.activeElement; if (!a || a === document.body || a.closest('[hidden]')) lantern.focus({ preventScroll: true });
}

/* ======================= choices ======================= */
const ICON = {
  lantern: () => `<img src="${IMG}lantern.webp" alt="">`,
  back: '<svg class="ic flip" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  rush: '<svg class="ic flip" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6l6 6-6 6M13 6l6 6-6 6"/></svg>'
};
function choose(opts) {
  return new Promise(res => {
    const bx = $('#choices'); bx.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (o.primary ? 'gold' : 'soft');
      b.innerHTML = typeof o.icon === 'function' ? o.icon() : o.icon; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = o.label; sp.textContent = t(o.label); b.appendChild(sp);
      b.addEventListener('click', () => { gesture(); bx.hidden = true; res(o.id); });
      bx.appendChild(b);
    });
    // the trusting answer is not always first, so the choice is a real one
    if (Math.random() < 0.5) bx.appendChild(bx.firstChild);
    bx.style.bottom = G.orient === 'land' ? (innerHeight - $('.ribbon').getBoundingClientRect().top + 14) + 'px' : '';   // always just above the narration
    bx.hidden = false; setTimeout(() => bx.querySelector('button').focus({ preventScroll: true }), 80);
  });
}
function warm(k) { S.warm = Math.min(1, (S.warm || 0) + k); lantern.style.setProperty('--warm', S.warm); }
function dim(on) { lantern.classList.toggle('dimmed', on); }

/* ======================= 1. at the sea: the fear, the trust, and Allah's command ======================= */
async function atTheSea() {
  S.asking = true; setAct(null);
  sfx('rumble'); surf(1);
  say(W.shore); $('#qCry').hidden = false;
  await anim(900);
  for (;;) {
    const c = await choose([{ id: 'trust', primary: true, label: W.optTrust, icon: ICON.lantern }, { id: 'run', label: W.optRun, icon: ICON.back }]);
    if (c === 'trust') break;
    sfx('soft'); dim(true); lantern.classList.remove('wob'); void lantern.offsetWidth; lantern.classList.add('wob');
    say(W.run); await wait(2600); dim(false);
  }
  sfx('good'); warm(0.25); Atmos.motes(lanternAt(), 4);
  $('#qCry').hidden = true; $('#qReply').hidden = false; say(W.trust); beatClip('reply');
  S.onBeach = true; place();
  await anim(3400);
  say(W.strike); setClip(null);
  setAct(W.hearBtn, hear);
  $('#actBtn').focus({ preventScroll: true });
}
/* the button only starts the narration (scholar ruling, section 5): Allah split the sea; the child watches */
async function hear() {
  if (S.phase !== 'shore') return;
  S.phase = 'parting'; app.className = app.className.replace(/phase-\w+/, 'phase-parting');
  setAct(null); $('#qReply').hidden = true; sfx('soft');
  say(W.parted); beatClip('parted');
  await openCue();                                // the water opens as the narration reaches "by Allah's command"
  Atmos.water(null); surf(0.5);
  setPlate('split'); Atmos.stars(true);
  await anim(5600);
  Atmos.water('split');
  await anim(1800);
  startWalk();
}

/* scholar gate 3.2: the split starts when Baba's clip reaches "and by Allah's command" (EN 5.8 s, AR 4.45 s, measured
   pauses 5.35-5.77 and 4.20-4.45). The fixed 3.6 s timer is only the fallback: sound off, or the clip fails or stalls. */
const OPEN_AT = { en: 5.8, ar: 4.45 };
function openCue() {
  const au = G.clip;
  if (!G.sound || !au) return anim(3600);
  return new Promise(res => {
    const t0 = performance.now(); let done = false;
    const finish = () => { if (!done) { done = true; clearInterval(iv); res(); } };
    const iv = setInterval(() => {
      if (G.clip !== au || au.currentTime >= OPEN_AT[G.lang] || au.ended) finish();
      else if ((au.paused || au.error) && performance.now() - t0 > 2500) finish();   // blocked or failed: fall back
      else if (performance.now() - t0 > 9000) finish();
    }, 50);
  });
}

/* ======================= 2. the walk ======================= */
function startWalk() {
  S.phase = 'walk'; app.className = app.className.replace(/phase-\w+/, 'phase-walk'); S.asking = false;
  S.pos = 0; S.dawnAt = Math.ceil(S.n * 0.55);
  buildMarks(); beads(S.n, 0); place();
  say(W.walkIn); setClip(null);
  readyStep(); setTimeout(() => lantern.focus({ preventScroll: true }), 120);
}
async function fearMoment(f) {
  S.asking = true; place(); setAct(null);
  if (f.react === 'turn') sfx('rumble');
  if (f.react === 'lag') { S.lagging = true; placeTrail(); }
  say(f.q);
  await anim(700);
  for (;;) {
    const c = await choose([{ id: 'good', primary: true, label: f.good, icon: ICON.lantern }, { id: 'bad', label: f.bad, icon: f.react === 'turn' ? ICON.back : ICON.rush }]);
    if (c === 'good') break;
    sfx('soft'); dim(true);
    if (f.react === 'jostle') $$('#trail .light').forEach(l => { l.classList.remove('jostle'); void l.offsetWidth; l.classList.add('jostle'); });
    else { lantern.classList.remove('wob'); void lantern.offsetWidth; lantern.classList.add('wob'); }
    say(f.why); await wait(2600); dim(false);
  }
  if (f.react === 'lag') { S.lagging = false; placeTrail(); }
  sfx('good'); warm(0.25); Atmos.motes(lanternAt(), 4);
  say(f.yes); S.asking = false;
}

/* ======================= 3. safe on the far shore; the sea closes, calmly ======================= */
async function arrive() {
  S.phase = 'safe'; app.className = app.className.replace(/phase-\w+/, 'phase-safe');
  setAct(null); target.hidden = true; beads(S.n, S.n);
  place();                       // the lights gather on the far shore
  say(W.safe); beatClip('safe');
  sfx('soft');                   // one soft tone: nothing celebrates the waters closing (gate 1, 03 note 6)
  await anim(3200);
  Atmos.water(null); Atmos.prints(null);
  setPlate('calm'); surf(0.6);
  await anim(5200);
  Atmos.water('calm');
  await anim(1200);
  await pausePoint(W.pauseQ, W.pauseH);
  reward();
}
function setPlate(state) { $$('.plates img').forEach(im => im.classList.toggle('on', im.dataset.state === state || (state === 'dawn' && im.dataset.state === 'split'))); }

/* the walls: a tap shows them standing still by Allah's command (decoration; the game is whole without it) */
$$('.wall').forEach(w => w.addEventListener('pointerdown', e => {
  if (S.phase !== 'walk') return; gesture();
  const [x, y] = toWorld(e.clientX, e.clientY); Atmos.ripple(x, y); Atmos.fish(x, y); sfx('lap');
  if (!S.wallSaid && !S.asking) { S.wallSaid = true; say(W.wall); }
}));

/* ======================= parent pause ======================= */
function pausePoint(q, h) {
  return new Promise(res => {
    S.pauseQ = { q, h }; $('#pauseQ').textContent = t(q); $('#pauseHint').textContent = t(h);
    $('#pause').hidden = false; sfx('soft'); setTimeout(() => $('#pauseGo').focus({ preventScroll: true }), 80);
    $('#pauseGo').onclick = () => { $('#pause').hidden = true; S.pauseQ = null; sfx('tap'); res(); };
  });
}

/* ======================= reward moment: dim, lamp rises, shamsa draws itself, slow motes, two-note chime, still ======================= */
function buildShamsa() {
  const g = $('#shamsaG'); if (g.childElementCount) return;
  const P = []; const star = (n, r1, r2, rot = 0) => { let d = ''; for (let i = 0; i < 2 * n; i++) { const r = i % 2 ? r2 : r1, a = rot + Math.PI * i / n; d += (i ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1); } return d + 'Z'; };
  // the shamsa approved on Nuh (scholar gate 3): gold line on a solid ivory disc, a rosette centre, never a sun or an eye
  P.push(`<circle r="92"/>`, `<circle r="84"/>`, `<path d="${star(16, 80, 62)}"/>`, `<path d="${star(8, 58, 34, Math.PI / 8)}"/>`, `<path d="${star(8, 58, 34)}"/>`, `<path d="${star(8, 26, 12)}"/>`);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; P.push(`<path d="M${(70 * Math.cos(a)).toFixed(1)} ${(70 * Math.sin(a)).toFixed(1)} q ${(8 * Math.cos(a + 1.2)).toFixed(1)} ${(8 * Math.sin(a + 1.2)).toFixed(1)} ${(14 * Math.cos(a)).toFixed(1)} ${(14 * Math.sin(a)).toFixed(1)}"/>`); }
  g.innerHTML = P.join('');
  $$('path,circle', g).forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength ? p.getTotalLength() : 600)));
}
async function reward() {
  S.phase = 'end'; app.className = app.className.replace(/phase-\w+/, 'phase-end');
  buildShamsa();
  const r = lantern.getBoundingClientRect(), rw = $('#reward');
  rw.style.setProperty('--lx', ((r.left + r.width / 2) / innerWidth * 100) + '%'); rw.style.setProperty('--ly', ((r.top + r.height / 2) / innerHeight * 100) + '%');
  // the medallion draws itself on the end side, clear of the ending card (which opens on the start side)
  const port = G.orient === 'port', sx = port ? 50 : 76;
  rw.style.setProperty('--sx', (rtl() ? 100 - sx : sx) + '%'); rw.style.setProperty('--sy', (port ? 24 : 30) + '%');
  void rw.offsetWidth; rw.classList.add('on');
  await anim(900); sfx('done'); Atmos.motes(lanternAt(), 9);
  await anim(2600);
  S.ended = true; $('#endBody').textContent = t(W.endB);
  $('#tierBox').checked = G.tier; $('#ending').hidden = false; app.classList.add('ended');
  setTimeout(() => $('#againBtn').focus({ preventScroll: true }), 80);
}
$('#againBtn').addEventListener('click', () => { G.tier = $('#tierBox').checked; sfx('tap'); reset(); });

/* ======================= reset ======================= */
function reset() {
  Object.assign(S, { n: G.tier ? 11 : 8, pos: 0, phase: 'camp', asking: false, moving: false, ended: false, pauseQ: null, warm: 0, lagging: false, wallSaid: false, act: null, onBeach: false });
  app.className = 'phase-camp' + (G.bed ? ' bed' : '') + (Atmos.ok ? '' : ' nopixi');
  $('#ending').hidden = true; $('#pause').hidden = true; $('#reward').classList.remove('on'); $('#choices').hidden = true; setAct(null);
  $('#qCry').hidden = true; $('#qReply').hidden = true; dim(false); lantern.style.setProperty('--warm', 0);
  setPlate('shore'); Atmos.reset(); buildTrail(); buildMarks(); beads(0, 0);
  place(); if (!RM) lantern.classList.add('idle');
  say(W.camp); beatClip('camp');
}

/* ======================= settings ======================= */
$('#langBtn').addEventListener('click', () => { gesture(); G.lang = rtl() ? 'en' : 'ar'; try { localStorage.setItem('islamicKidsLang', G.lang); } catch (e) { /* private */ } applyLang(); });
$('#soundBtn').addEventListener('click', () => { gesture(); G.sound = !G.sound; masterGate(); $('#soundBtn').setAttribute('aria-pressed', String(G.sound)); if (!G.sound) { stopClip(); surf(0); } else surf(S.phase === 'walk' ? 0.4 : 0.8); });
$('#bedBtn').addEventListener('click', () => { gesture(); G.bed = !G.bed; $('#bedBtn').setAttribute('aria-pressed', String(G.bed)); app.classList.toggle('bed', G.bed); surf(S.phase === 'walk' ? 0.4 : 0.8); Atmos.calm(); });
$('#listenBtn').addEventListener('click', () => { gesture(); playClip(); });
addEventListener('resize', fit);
addEventListener('keydown', e => { if (e.key === 'Escape') clearSel(); });

/* ======================= atmosphere canvas (PixiJS). Decoration only: the game is whole without it. ======================= */
const Atmos = (() => {
  const A = { ok: false };
  let px = null, layers = {}, tex = {}, state = { water: null, stars: true, still: RM }, motes = [], ripples = [], prints = [], fishes = [], glints = [], dispSprite = null;
  const canvas = $('#atmos');
  function softTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return PIXI.Texture.from(c); }
  async function init() {
    if (!window.PIXI) throw new Error('no PIXI');
    px = new PIXI.Application();
    await px.init({ canvas, width: L.w, height: L.h, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(2, (devicePixelRatio || 1) * G.s), preference: 'webgl', autoStart: false, sharedTicker: false });
    tex.ring = softTex(128, 48, (g) => { g.strokeStyle = 'rgba(240,248,255,.95)'; g.lineWidth = 3; g.beginPath(); g.ellipse(64, 24, 58, 18, 0, 0, Math.PI * 2); g.stroke(); });
    tex.mote = softTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.25, 'rgba(240,200,110,.7)'); gr.addColorStop(1, 'rgba(224,183,92,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    tex.glint = softTex(32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(.3, 'rgba(255,230,170,.5)'); gr.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
    // a soft pressed print in damp sand: an oval dent with a light rim (paired, small; never a figure)
    tex.print = softTex(20, 34, (g) => { g.fillStyle = 'rgba(120,88,52,.55)'; g.beginPath(); g.ellipse(10, 18, 6.5, 12, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(255,240,205,.5)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(10, 17, 7.5, 13, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); });
    tex.disp = softTex(256, 256, (g) => { const im = g.createImageData(256, 256); for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const v = 128 + 60 * Math.sin(x / 256 * Math.PI * 6 + Math.sin(y / 256 * Math.PI * 4) * 1.5) + 30 * Math.sin(y / 256 * Math.PI * 10); const i = (y * 256 + x) * 4; im.data[i] = v; im.data[i + 1] = 128 + 50 * Math.cos(y / 256 * Math.PI * 8 + x / 40); im.data[i + 2] = 128; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); });
    tex.disp.source.addressMode = 'repeat';
    ['fish-a', 'fish-b'].forEach(n => { const im = new Image(); im.src = IMG + n + '.webp'; tex[n] = null; im.onload = () => { tex[n] = PIXI.Texture.from(im); }; });
    dispSprite = new PIXI.Sprite(tex.disp); dispSprite.texture.source.addressMode = 'repeat'; dispSprite.scale.set(2.2, 1.2);
    const filter = new PIXI.DisplacementFilter({ sprite: dispSprite, scale: { x: 9, y: 4 } });
    layers.water = new PIXI.Container(); layers.water.filters = [filter];
    layers.waterMask = new PIXI.Graphics(); layers.water.mask = layers.waterMask;
    layers.fish = new PIXI.Container(); layers.fishMask = new PIXI.Graphics(); layers.fish.mask = layers.fishMask;
    layers.prints = new PIXI.Container(); layers.stars = new PIXI.Container(); layers.splash = new PIXI.Container(); layers.motes = new PIXI.Container();
    px.stage.addChild(dispSprite, layers.water, layers.waterMask, layers.fish, layers.fishMask, layers.prints, layers.stars, layers.splash, layers.motes);
    dispSprite.renderable = false;
    A.ok = true; app.classList.remove('nopixi');
    resize(); seedStars(); wake();
  }
  function plateSprite(st) { const im = $(`.plates img[data-state="${st}"]`); if (!im || !im.complete || !im.naturalWidth) return null; const sp = new PIXI.Sprite(PIXI.Texture.from(im)); sp.width = L.w; sp.height = L.h; return sp; }
  function polys(g, list) { g.clear(); list.forEach(P => g.poly(P.flat()).fill(0xffffff)); }
  function resize() {
    if (!A.ok) return;
    px.renderer.resolution = Math.min(2, (devicePixelRatio || 1) * G.s);
    px.renderer.resize(L.w, L.h); canvas.style.width = L.w + 'px'; canvas.style.height = L.h + 'px';
    polys(layers.fishMask, L.walls);
    if (state.water) water(state.water, true);
    seedStars(); redoPrints(); wake();
  }
  function water(which, instant) {
    state.water = which; if (!A.ok) return;
    const old = layers.water.children.slice();
    if (which) {
      const sp = plateSprite(which); if (!sp) { setTimeout(() => state.water === which && water(which, instant), 400); return; }
      sp.alpha = instant || RM ? 1 : 0; layers.water.addChild(sp); sp.__in = true;
      polys(layers.waterMask, which === 'split' || which === 'dawn' ? L.walls : [L.sea]);
    }
    old.forEach(o => { o.__out = true; o.__fast = !which; if (instant || RM) o.destroy(); });
    wake();
  }
  function seedStars() {
    if (!A.ok) return; layers.stars.removeChildren().forEach(c => c.destroy()); glints = [];
    const [x0, y0, x1, y1] = L.sky;
    for (let i = 0; i < 16; i++) { const s = new PIXI.Sprite(tex.glint); s.anchor.set(0.5); s.blendMode = 'add'; s.x = lerp(x0, x1, Math.random()); s.y = lerp(y0, y1, Math.random() ** 1.4); s.scale.set(0.35 + Math.random() * 0.4); s.ph = Math.random() * 6.28; s.per = 4 + Math.random() * 4; layers.stars.addChild(s); glints.push(s); }
    layers.stars.alpha = state.stars ? 1 : 0;
  }
  function stars(on) { state.stars = on; wake(); }
  function ripple(x, y) { if (!A.ok) return; const r = new PIXI.Sprite(tex.ring); r.anchor.set(0.5); r.x = x; r.y = y; r.scale.set(0.2); r.life = 0; layers.splash.addChild(r); ripples.push(r); wake(); }
  function fish(x, y) {
    if (!A.ok || fishes.length > 5) return; const n = Math.random() < 0.5 ? 'fish-a' : 'fish-b'; if (!tex[n]) return;
    const f = new PIXI.Sprite(tex[n]); f.anchor.set(0.5); const sc = 46 / Math.max(tex[n].width, tex[n].height); f.scale.set(sc);
    const dir = Math.random() < 0.5 ? -1 : 1; if (dir < 0) f.scale.x = -sc;   // faces the way it swims
    f.x = x - dir * 30; f.y = y + (Math.random() - 0.5) * 30; f.vx = dir * (34 + Math.random() * 20); f.life = 0; f.max = 3.2; f.alpha = 0; f.tint = 0xcfe8ee;
    layers.fish.addChild(f); fishes.push(f); wake();
  }
  function motesAt([x, y], n) {
    if (!A.ok || G.bed) return;
    for (let i = 0; i < n; i++) { const m = new PIXI.Sprite(tex.mote); m.anchor.set(0.5); m.blendMode = 'add'; m.x = x + (Math.random() - 0.5) * 120; m.y = y - 40 + (Math.random() - 0.3) * 50; m.scale.set(0.25 + Math.random() * 0.35); m.life = 0; m.max = 2.6 + Math.random() * 1.6; m.vx = (Math.random() - 0.5) * 14; m.alpha = 0; layers.motes.addChild(m); motes.push(m); }
    wake();
  }
  let printSpan = [];
  function addPrints(t0, t1, fresh) {
    if (!A.ok) return; const k = 3;
    for (let i = 0; i < k; i++) {
      const tt = lerp(t0, t1, (i + 0.5) / k), [x, y, d] = pathAt(tt);
      [-1, 1].forEach(side => { const p = new PIXI.Sprite(tex.print); p.anchor.set(0.5); p.x = x + side * 9 * d + (i % 2 ? 4 : -4) * d; p.y = y + side * 3 * d; p.scale.set(0.55 * d); p.alpha = fresh && !RM ? 0 : 0.8; p.__in = fresh; layers.prints.addChild(p); prints.push(p); });
    }
  }
  function printsAlong(t0, t1) {
    if (t0 == null) { prints.forEach(p => (p.__out = true)); printSpan = []; wake(); return; }
    printSpan.push([t0, t1]); addPrints(t0, t1, true); wake();
  }
  function redoPrints() { layers.prints.removeChildren().forEach(c => c.destroy()); prints = []; printSpan.forEach(([a, b]) => addPrints(a, b, false)); }
  let raf = 0, last = 0, clock = 0;
  function wake() { if (A.ok && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt; let live = false;
    const still = state.still || G.bed;
    // the water layers crossfade; the displacement drifts slowly (no loop faster than the 3 s rule allows)
    layers.water.children.slice().forEach(o => {
      if (o.__out) { o.alpha -= dt * (o.__fast ? 1.4 : 0.35); if (o.alpha <= 0) o.destroy(); else live = true; }
      else if (o.__in && o.alpha < 1) { o.alpha = Math.min(1, o.alpha + dt * 0.33); live = true; }
    });
    if (layers.water.children.length && !still) { dispSprite.x -= dt * 12; dispSprite.y += dt * 3; live = true; }
    // stars: slow twinkle (4-8 s), fading at dawn
    const st = state.stars ? 1 : 0; if (Math.abs(layers.stars.alpha - st) > 0.01) { layers.stars.alpha += Math.sign(st - layers.stars.alpha) * dt * 0.3; live = true; }
    if (layers.stars.alpha > 0.01 && !state.still) { glints.forEach(s => (s.alpha = 0.45 + 0.4 * Math.sin(s.ph + clock * 6.28 / s.per))); live = true; }
    prints.forEach(p => { if (p.__out) { p.alpha -= dt * 0.5; live = true; } else if (p.__in && p.alpha < 0.8) { p.alpha = Math.min(0.8, p.alpha + dt * 1.2); live = true; } });
    prints = prints.filter(p => { if (p.__out && p.alpha <= 0) { p.destroy(); return false; } return true; });
    fishes = fishes.filter(f => { f.life += dt; f.x += f.vx * dt; f.y += Math.sin(f.life * 2) * 0.2; const k = f.life / f.max; f.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 1.1) * 0.85; if (k >= 1) { f.destroy(); return false; } live = true; return true; });
    ripples = ripples.filter(r => { r.life += dt; r.scale.set(0.2 + r.life * 0.9); r.alpha = Math.max(0, 1 - r.life / 1.6); if (r.life > 1.6) { r.destroy(); return false; } live = true; return true; });
    motes = motes.filter(m => { m.life += dt; const k = m.life / m.max; m.y -= dt * 26; m.x += m.vx * dt; m.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 0.9); if (k >= 1) { m.destroy(); return false; } live = true; return true; });
    px.render();
    if (live) raf = requestAnimationFrame(frame);
  }
  function reset() { if (!A.ok) return; water('shore', true); state.stars = true; layers.stars.alpha = 1; printsAlong(null); motes.forEach(m => m.destroy()); motes = []; wake(); }
  function calm() { if (A.ok) wake(); }
  Object.assign(A, { init, resize, water: (w, i) => water(w, i), stars, ripple, fish, motes: motesAt, prints: printsAlong, reset, calm });
  return A;
})();

/* ======================= boot ======================= */
async function boot() {
  try { MANIFEST = await (await fetch(IMG + 'manifest.json')).json(); } catch (e) { /* aspects fall back to defaults */ }
  if (MANIFEST.layout) ['land', 'port'].forEach(k => MANIFEST.layout[k] && Object.assign(LAYOUT[k], MANIFEST.layout[k]));
  app.classList.add('nopixi');
  Object.assign(S, { n: 8, pos: 0, phase: 'camp' });
  applyLang();
  reset();
  try { await Atmos.init(); Atmos.reset(); } catch (e) { app.classList.add('nopixi'); }
  window.__musa = { S, G, L: () => L, Atmos, W, FEARS, CLIPS, say, pathAt }; // for the headless play-through and wording checks
}
boot();
})();
