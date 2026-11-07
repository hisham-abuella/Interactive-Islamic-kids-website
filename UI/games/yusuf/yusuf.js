/* Game 02, Yusuf's Journey: the third painted game (2026-11-07).
   Painted DOM planes + DOM HUD; one PixiJS canvas (decoration only) for the river's shimmer, gold motes and falling
   grain. All words live in the DOM (Arabic shaping, RTL). No browser TTS: the only voice is Baba's recorded story
   narration (Yusuf slides 0, 2, 4, 5, 6 and 7, which hold no ayah), played in sentence-aligned parts. Slide 8 (12:92)
   and slide 10 (the dua) are never played. No music: one- or two-note chimes and natural sounds.
   Systems reused from games/musa/musa.js. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const IMG = '../images/games/yusuf/';
const AUDIO = '../audio/prophet-yusuf/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const G = { lang: 'en', sound: true, bed: false, tier: false, orient: null, s: 1, tx: 0, ty: 0, sel: null, clip: null, gesture: false, quiet: false, view: null };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }
const anim = ms => wait(RM ? Math.min(ms, 200) : G.bed ? ms * 1.25 : ms);
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const rtl = () => G.lang === 'ar';
const lerp = (a, b, k) => a + (b - a) * k;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ======================= layout: logical world coordinates, one table per composition =======================
   Measured on the painted plates (shipped pixels). stones: the journey road, [x, y, depth]; depth scales the props.
   start: where the way begins (the hills). cam: the granary view [x, y, w, h]. river: polygon for the shimmer. */
const LAYOUT = {
  land: {
    // measured on plate-day-land (1440 x 914 shipped): green hills with olive trees at the lower left, the road from
    // the bottom up into the dunes, the river curving across, palms, fields and the storehouse (door at 1135, 575)
    w: 1440, h: 920,
    start: [87, 565, 1],
    stones: [[232, 607, 0.95], [533, 669, 0.9], [886, 627, 0.78], [1207, 456, 0.66], [1353, 700, 0.8]],
    propH: { well: 150, camel: 200, palm: 280, door: 120, sheaf: 130 },
    stars: [[128, 129], [253, 218], [377, 119], [502, 228], [626, 140], [751, 238], [875, 140], [1000, 233], [1124, 129], [1249, 223], [1050, 62]],   // below the bead bar, clear of the HUD buttons and the moon
    sun: [284, 140, 140], moon: [1300, 150, 130],   // clear of the parent note at the top centre
    cam: [734, 327, 706, 490],   // inside the plate on both sides (mirrored in Arabic)
    store: [1150, 574, 80, 100],
    sheaves: [[906, 550], [995, 524], [1072, 553], [1270, 669], [1353, 710], [1430, 664], [1394, 586]],
    sacks: [[912, 482], [995, 472], [1078, 480], [1161, 472], [1244, 480], [1010, 664], [1083, 669], [1254, 669], [1337, 700], [1420, 690]],
    camels: [[[554, 472], [818, 482], 150, true], [[471, 441], [772, 441], 135, true]],   // the sprite faces left: flip to walk right
    river: [[1093, 490], [865, 501], [740, 560], [742, 619], [803, 661], [1010, 713], [1218, 775], [1467, 837], [1467, 773], [1270, 713], [1114, 671], [958, 640], [886, 591], [875, 550], [1010, 515]],
    fg: [35, 920, 330, false]
  },
  port: {
    // phone, measured on plate-day-port (760 x 1429 shipped): the road winds up from the green hills at the bottom
    // to the river, palms, fields and storehouse near the top (door at 440, 425). The narration sits in the sky.
    w: 760, h: 1431,
    start: [108, 1204, 1],
    stones: [[168, 1103, 1], [430, 932, 0.85], [219, 564, 0.68], [541, 599, 0.68], [667, 478, 0.62]],
    propH: { well: 130, camel: 170, palm: 230, door: 110, sheaf: 120 },
    // the dream: the narration moves to the bottom, so the eleven lights use the sky and the far horizon
    stars: [[108, 166], [259, 145], [420, 181], [582, 145], [693, 211], [178, 287], [345, 297], [506, 276], [642, 327], [118, 418], [430, 428]],
    sun: [148, 599, 110], moon: [612, 599, 100],
    cam: [229, 55, 474, 1026],
    store: [440, 416, 70, 80],
    sheaves: [[299, 559], [370, 599], [562, 503], [627, 544], [683, 599], [602, 650], [451, 650]],
    sacks: [[289, 559], [360, 559], [430, 559], [501, 559], [572, 559], [319, 650], [390, 650], [461, 650], [531, 650], [602, 650]],
    camels: [[[148, 902], [279, 760], 130, true], [[703, 902], [642, 771], 120, false]],
    river: [[148, 317], [299, 297], [420, 327], [440, 418], [430, 468], [330, 490], [148, 470], [138, 377]],
    fg: [37, 1431, 260, false]
  }
};
let MANIFEST = { aspects: {} };

/* ======================= words ======================= */
/* The five steps of the road, the wording approved at gate 1 (mockup 02), kept as approved. */
const STEPS = [
  { id: 'well', label: { en: 'The deep well', ar: 'البئر العميقة' },
    told: { en: 'His jealous brothers left Yusuf in a deep, dark well. But Allah was always with him.', ar: 'تركه إخوته الحاسدون في بئر عميقة مظلمة. لكن الله كان معه دائماً.' },
    hint: { en: 'What happened first, right after the brothers made their bad plan?', ar: 'ماذا حدث أولاً، بعد أن دبّر الإخوة خطتهم السيئة؟' } },
  { id: 'camel', label: { en: 'Travellers find him', ar: 'المسافرون يجدونه' },
    told: { en: 'Some travellers found him in the well and took him to Egypt.', ar: 'وجده بعض المسافرين في البئر وأخذوه إلى مصر.' },
    hint: { en: 'Who found Yusuf in the well?', ar: 'من وجد يوسف في البئر؟' } },
  { id: 'palm', label: { en: 'Growing up in Egypt', ar: 'يكبر في مصر' },
    told: { en: 'In Egypt, Yusuf grew up wise. He always told the truth and was kind to everyone.', ar: 'في مصر كبر يوسف حكيماً، يقول الحق دائماً ويحسن إلى الجميع.' },
    hint: { en: 'Where did the travellers take him?', ar: 'إلى أين أخذه المسافرون؟' } },
  { id: 'door', label: { en: 'Prison, though innocent', ar: 'السجن ظلماً' },
    told: { en: 'Some people were unfair to him, and he was put in prison though he did nothing wrong. He stayed patient.', ar: 'أساء إليه بعض الناس فسُجن وهو لم يفعل شيئاً خطأ. وظل صابراً.' },
    hint: { en: 'Something unfair happened to Yusuf in Egypt. What was it?', ar: 'حدث ليوسف شيء ظالم في مصر. ما هو؟' } },
  { id: 'sheaf', label: { en: "The king's dream explained", ar: 'تفسير رؤيا الملك' },
    told: { en: "With Allah's help, Yusuf explained the king's dream: seven good years, then seven hard years.", ar: 'بعون الله فسّر يوسف رؤيا الملك: سبع سنوات خير، ثم سبع سنوات شدة.' },
    hint: { en: 'Whose strange dream did Yusuf explain?', ar: 'رؤيا من العجيبة فسّرها يوسف؟' } }
];
const W = {
  dream: { en: 'Prophet Yusuf, peace be upon him, had an amazing dream: eleven stars, the sun and the moon. Tap each faint star to see it shine.',
    ar: 'رأى النبي يوسف عليه السلام رؤيا مدهشة: رأى أحد عشر نجماً، ورأى الشمس والقمر. المس كل نجمة باهتة لتراها تلمع.' },
  dreamAll: { en: 'Eleven stars, the sun and the moon, just as in the dream. His father, Prophet Yaqub, told him it was a special gift from Allah.',
    ar: 'أحد عشر نجماً، ومعها الشمس والقمر، كما في الرؤيا. وأخبره أبوه النبي يعقوب عليه السلام أنها هبة خاصة من الله.' },
  beginBtn: { en: 'Begin the journey', ar: 'لنبدأ الرحلة' },
  journey: { en: "Prophet Yusuf's journey starts with his dream. Drag the picture that comes next onto the glowing stone.", ar: 'تبدأ رحلة النبي يوسف عليه السلام برؤياه. اسحب الصورة التالية إلى الحجر المضيء.' },
  notYet: { en: 'Not yet! That part comes later.', ar: 'ليس بعد! هذا الجزء يأتي لاحقاً.' },
  next: { en: 'Which picture comes next?', ar: 'أي صورة تأتي بعد ذلك؟' },
  selCard: { en: 'Now tap the glowing stone.', ar: 'والآن المس الحجر المضيء.' },
  missStone: { en: 'Bring the picture to the glowing stone on the road.', ar: 'ضع الصورة على الحجر المضيء في الطريق.' },
  stone: { en: 'The next stone on the road', ar: 'الحجر التالي في الطريق' },
  storeAsk: { en: 'In the good years Yusuf saved food so no one would go hungry later. Drag the 7 sheaves of wheat into the storehouse.', ar: 'في سنوات الخير ادّخر يوسف الطعام لئلا يجوع أحد فيما بعد. اسحب حزم القمح السبع إلى المخزن.' },
  selSheaf: { en: 'Now tap the storehouse door.', ar: 'والآن المس باب المخزن.' },
  missStore: { en: 'Bring the sheaf to the storehouse door.', ar: 'ضع الحزمة عند باب المخزن.' },
  sheaf: { en: 'A sheaf of wheat', ar: 'حزمة قمح' },
  storeDone: { en: 'The storehouse is full! When the hard years came, there was food for everyone.', ar: 'امتلأ المخزن! ولما جاءت سنوات الشدة كان هناك طعام للجميع.' },
  hard: { en: 'Then the hard years came. The fields were dry, but the storehouse was full.', ar: 'ثم جاءت سنوات الشدة. جفّت الحقول، لكن المخزن كان ممتلئاً.' },
  /* narrated, never quizzed (scholar ruling): no option ever says a prophet did wrong */
  brothersTold: { en: 'The brothers who left Yusuf in the well have come, hungry, with empty sacks. They did not know him, but he knew them. Yusuf was kind: he gave them food. Tap each sack to fill it with grain.',
    ar: 'جاء الإخوة الذين تركوا يوسف في البئر، جائعين وأكياسهم فارغة. لم يعرفوه، لكنه عرفهم. فأحسن إليهم يوسف وأعطاهم الطعام. المس كل كيس لتملأه بالقمح.' },
  sack: { en: 'An empty sack', ar: 'كيس فارغ' },
  sackFull: { en: 'A full sack', ar: 'كيس ممتلئ' },
  forgave: { en: 'Later, when they knew who he was, Yusuf forgave them with all his heart.', ar: 'وبعد ذلك، حين عرفوا من هو، سامحهم يوسف من كل قلبه.' },
  carryOn: { en: 'Carry on', ar: 'لنكمل' },
  family: { en: 'His whole family came to live in Egypt, and his dream came true.', ar: 'وجاءت أسرته كلها لتعيش في مصر، وتحققت رؤياه.' },
  pauseQ: { en: 'If someone had hurt you, what would you feel like doing? What did Yusuf choose, and why?', ar: 'لو آذاك أحد، ماذا ستشعر أنك تريد أن تفعل؟ وماذا اختار يوسف، ولماذا؟' },
  pauseH: { en: "Idea: Yusuf trusted Allah's plan, and forgiving let the whole family be together again.", ar: 'فكرة: وثق يوسف بتدبير الله، وبالمسامحة اجتمعت الأسرة كلها من جديد.' },
  turnAsk: { en: 'Your turn! Your little brother knocks over your block tower by accident and says "Sorry!" What will you do?', ar: 'دورك الآن! أوقع أخوك الصغير برج المكعبات بغير قصد وقال: "آسف!" ماذا ستفعل؟' },
  optFix: { en: 'Forgive him and build it again together', ar: 'أسامحه ونبنيه معاً من جديد' },
  optCross: { en: 'Stay cross with him', ar: 'أبقى غاضباً منه' },
  cross: { en: 'Feeling cross for a moment is okay. But staying cross keeps the tower broken and both of you sad. Yusuf forgave something much bigger. Shall we choose again?', ar: 'لا بأس أن تغضب لحظة. لكن البقاء غاضباً يُبقي البرج مهدوماً ويحزنكما معاً. لقد سامح يوسف ما هو أكبر بكثير. هل نختار مرة أخرى؟' },
  build: { en: 'Lovely! Tap the blocks to build the tower again, together.', ar: 'رائع! المس المكعبات لتبنيا البرج معاً من جديد.' },
  built: { en: 'The tower is back, and so are the smiles.', ar: 'عاد البرج، وعادت الابتسامات.' },
  block: { en: 'A fallen block', ar: 'مكعب واقع' },
  endB: { en: "You walked the whole path with Yusuf: the well, the travellers, Egypt, prison, the king's dream and the reunion. He was patient in hard times, and when he could have been angry, he forgave.",
    ar: 'مشيت الطريق كله مع يوسف: البئر، والمسافرين، ومصر، والسجن، ورؤيا الملك، واجتماع الأسرة. صبر في الشدة، وحين كان يستطيع أن يغضب، سامح.' },
  starLabel: { en: 'A faint star', ar: 'نجمة باهتة' },
  starLit: { en: 'A shining star', ar: 'نجمة لامعة' },
  beadsLabel: { en: 'The journey so far', ar: 'الرحلة حتى الآن' }
};
/* Baba's recorded story narration, in sentence-aligned parts (seconds, cut at recorded pauses; ffmpeg silencedetect,
   2026-11-07: EN slide 5 pause 6.78-7.26, AR slide 5 pause 7.58-7.74). Slides 0, 2, 4, 6 and 7 play whole. Slide 8
   (which carries 12:92's meaning) and slide 10 (the dua) are never played. */
const CLIPS = {
  dream: { slide: 0, en: [0, 99], ar: [0, 99] },
  well: { slide: 2, en: [0, 99], ar: [0, 99] },
  camel: { slide: 4, en: [0, 99], ar: [0, 99] },
  palm: { slide: 5, en: [0, 7.0], ar: [0, 7.66] },        // In Egypt ... kind to everyone.
  door: { slide: 5, en: [7.0, 99], ar: [7.66, 99] },      // But some people were mean to him ... prison
  sheaf: { slide: 6, en: [0, 99], ar: [0, 99] },
  store: { slide: 7, en: [0, 99], ar: [0, 99] }
};

/* ======================= sound: Web Audio, no music ======================= */
let AC = null, master = null, windNode = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); master = AC.createGain(); master.connect(AC.destination); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
const vol = () => (G.sound && !G.quiet ? (G.bed ? 0.45 : 1) * (G.clip && !G.clip.paused ? 0.4 : 1) : 0);
let noiseBuf = null;
function noise(a) { if (noiseBuf) return noiseBuf; const b = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5 + w * 0.15; } return (noiseBuf = b); }
function bell(a, f, at, dur, v) {
  [[1, 1], [2.76, 0.28], [5.4, 0.08]].forEach(([m, g]) => {
    const o = a.createOscillator(), e = a.createGain(); o.type = 'sine'; o.frequency.value = f * m;
    e.gain.setValueAtTime(0.0001, at); e.gain.exponentialRampToValueAtTime(v * g, at + 0.012); e.gain.exponentialRampToValueAtTime(0.0001, at + dur / m ** 0.3);
    o.connect(e).connect(master); o.start(at); o.stop(at + dur + 0.1);
  });
}
function hush(a, n, lpF, d, peak) { // a soft swell of filtered noise: sand underfoot, grain pouring, a wooden knock
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
  else if (kind === 'star') bell(a, 880, n, 1.6, 0.03 * v);       // one note, always the same: never a tune
  else if (kind === 'place') { hush(a, n, 300, 0.22, 0.32 * v); }
  else if (kind === 'thump') hush(a, n, 180, 0.3, 0.45 * v);
  else if (kind === 'pour') hush(a, n, 1400, 1.1, 0.16 * v);
  else if (kind === 'block') hush(a, n, 900, 0.09, 0.4 * v);
}
function wind(level) { // the desert air: a slow, very low noise swell (no melody)
  const a = ac(); if (!a) return;
  if (!windNode) {
    const s = a.createBufferSource(); s.buffer = noise(a); s.loop = true;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    const g = a.createGain(); g.gain.value = 0.0001;
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.008; lfo.connect(lg).connect(g.gain); lfo.start();
    s.connect(lp).connect(g).connect(master); s.start(); windNode = { s, g, lfo };
  }
  windNode.g.gain.cancelScheduledValues(a.currentTime);
  windNode.g.gain.setTargetAtTime(Math.max(0.0001, level * 0.022 * vol()), a.currentTime, 1.6);
}

/* Baba's voice: the recorded story clip for this beat (never TTS, never scripture), one sentence-aligned part */
let clipBeat = null, clipTimer = 0;
function stopClip() { if (G.clip) { G.clip.pause(); G.clip = null; } clearInterval(clipTimer); $('#listenBtn').classList.remove('playing'); }
function setClip(beat) { clipBeat = beat; $('#listenBtn').hidden = !(beat in CLIPS); stopClip(); }
function playClip() {
  if (!(clipBeat in CLIPS) || G.quiet) return;
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
    if (au.currentTime >= to || au.ended) { au.pause(); clearInterval(clipTimer); b.classList.remove('playing'); wind(windLevel()); }
  }, 40);
  au.addEventListener('ended', () => b.classList.remove('playing'));
}
const windLevel = () => (S.phase === 'dream' || S.phase === 'end' ? 0.5 : 1);

/* ======================= world fit, camera, RTL mirror ======================= */
const world = $('#world'), app = $('#app');
let L = LAYOUT.land;
function fit(glide) {
  const vw = innerWidth, vh = innerHeight;
  const orient = vw / vh < 0.8 ? 'port' : 'land';
  const changed = orient !== G.orient; G.orient = orient; L = LAYOUT[orient];
  let [rx, ry, rw, rh] = S.zoom ? L.cam : [0, 0, L.w, L.h];
  rx = Math.max(0, Math.min(rx, L.w - rw)); ry = Math.max(0, Math.min(ry, L.h - rh));
  const s = Math.max(vw / rw, vh / rh);
  const ox = (vw - rw * s) / 2, oy = Math.min(0, (vh - rh * s) * 0.5);
  G.s = s; G.ty = oy - ry * s;
  if (rtl()) { const rxm = L.w - rx - rw; G.tx = ox - rxm * s + L.w * s; }
  else G.tx = ox - rx * s;
  // the painted plate always covers the screen: never show past its edges (any screen shape, zoomed or not)
  if (rtl()) G.tx = Math.min(L.w * s, Math.max(vw, G.tx)); else G.tx = Math.min(0, Math.max(vw - L.w * s, G.tx));
  G.ty = Math.min(0, Math.max(vh - L.h * s, G.ty));
  world.classList.toggle('cam', !!glide && !RM);
  world.style.width = L.w + 'px'; world.style.height = L.h + 'px';
  world.style.transform = rtl() ? `translate(${G.tx}px,${G.ty}px) scale(${-s},${s})` : `translate(${G.tx}px,${G.ty}px) scale(${s})`;
  world.classList.toggle('rtl', rtl());
  const f = $('.frame'); f.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  [['.f1', 10], ['.f2', 17]].forEach(([c, m]) => { const r = $(c, f); r.setAttribute('x', m); r.setAttribute('y', m); r.setAttribute('width', Math.max(0, vw - 2 * m)); r.setAttribute('height', Math.max(0, vh - 2 * m)); });
  if (changed) { loadPlates(); buildStars(); Atmos.resize(); }
  place(); placeAct();
}
const toWorld = (cx, cy) => [rtl() ? (G.tx - cx) / G.s : (cx - G.tx) / G.s, (cy - G.ty) / G.s];
function loadPlates() {
  $$('.plates img').forEach(im => { const src = `${IMG}plate-${im.dataset.state}-${G.orient}.webp`; if (!im.src.endsWith(src.replace(/^(\.\.\/)+/, ''))) im.src = src; });
}
function box(el, x, y, w, h) { Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - h) + 'px', width: w + 'px', height: h + 'px' }); }
const asp = (n, d = 1) => MANIFEST.aspects[n] || d;
const minWorld = px => px / G.s;   // a size in world units that is at least `px` screen pixels
function setPlate(state) { $$('.plates img').forEach(im => im.classList.toggle('on', im.dataset.state === state)); Atmos.river(state); }

/* ======================= state ======================= */
const S = {};
function setPhase(p) { S.phase = p; app.className = app.className.replace(/phase-\w+/, 'phase-' + p); }

/* the eleven stars of the dream: the game draws exactly eleven (12:4), the plates paint none */
function buildStars() {
  const sky = $('#sky'), lit = S.lit || 0; sky.innerHTML = '';
  L.stars.forEach(([x, y], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'star' + (i < lit || S.phase !== 'dream' ? ' lit' : '');
    const sz = Math.max(70, minWorld(56)); Object.assign(b.style, { left: (x - sz / 2) + 'px', top: (y - sz / 2) + 'px', width: sz + 'px', height: sz + 'px' });
    b.setAttribute('aria-label', t(b.classList.contains('lit') ? W.starLit : W.starLabel));
    b.addEventListener('click', () => kindle(b));
    sky.appendChild(b);
  });
}
function placeOrbs() {
  [['.orb.sun', L.sun, 'sun'], ['.orb.moon', L.moon, 'moon']].forEach(([sel, [x, y, h], n]) => { const el = $(sel); box(el, x, y + h / 2, h * asp(n, 1), h); });
}
function placeStones() {
  const st = $('#stones');
  if (st.childElementCount !== STEPS.length) {
    st.innerHTML = '';
    STEPS.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'stone'; b.dataset.i = i; b.addEventListener('click', () => stoneTap(i)); st.appendChild(b); });
  }
  $$('.stone', st).forEach((b, i) => {
    const [x, y, d] = L.stones[i], sz = Math.max(110 * d, minWorld(76));
    Object.assign(b.style, { left: (x - sz / 2) + 'px', top: (y - sz / 2) + 'px', width: sz + 'px', height: sz + 'px' });
    const next = S.phase === 'journey' && i === S.step;
    b.classList.toggle('next', next); b.classList.toggle('done', i < S.step || S.phase !== 'journey');
    b.hidden = S.phase !== 'journey' || i < S.step;
    b.tabIndex = next ? 0 : -1; b.setAttribute('aria-hidden', next ? 'false' : 'true');
    b.setAttribute('aria-label', t(W.stone));
  });
}
function placeProps() {
  const pr = $('#props');
  STEPS.forEach((s, i) => {
    let el = $(`.prop.p-${s.id}`, pr);
    if (!el) { el = document.createElement('img'); el.className = `prop p-${s.id}`; el.src = IMG + s.id + '.webp'; el.alt = ''; el.draggable = false; pr.appendChild(el); }
    const [x, y, d] = L.stones[i], h = L.propH[s.id] * d;   // the prop stands on its stone
    box(el, x, y + h * 0.12, h * asp(s.id, 1), h);
    el.classList.toggle('on', i < S.step);
  });
  // the travellers' camels that come for food (the brothers are never drawn: only the camels and their sacks)
  [0, 1].forEach(k => {
    let el = $(`.prop.cm${k}`, pr);
    if (!el) { el = document.createElement('img'); el.className = `prop cm${k} walk`; el.src = IMG + 'camel.webp'; el.alt = ''; el.draggable = false; pr.appendChild(el); }
    const [from, to, h, flip] = L.camels[k], p = S.camelsIn ? to : from;
    box(el, p[0], p[1], h * asp('camel', 1), h); el.style.transform = flip ? 'scaleX(-1)' : '';   // transform, so the landing squash (scale) does not unflip it
    el.classList.toggle('on', !!S.camels);
  });
}
function placeTrail() {
  const tr = $('#trailDots');
  const pts = [L.start, ...L.stones];
  if (!tr.childElementCount || tr.dataset.o !== G.orient) {
    tr.innerHTML = ''; tr.dataset.o = G.orient;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0, d0] = pts[i - 1], [x1, y1, d1] = pts[i], n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 34));
      for (let k = 1; k < n; k++) { const q = k / n, d = document.createElement('span'); d.className = 'dot'; d.dataset.seg = i - 1; d.style.left = lerp(x0, x1, q) + 'px'; d.style.top = (lerp(y0, y1, q) - Math.sin(q * Math.PI) * 14) + 'px'; d.style.setProperty('--d', lerp(d0, d1, q)); tr.appendChild(d); }
    }
  }
  $$('.dot', tr).forEach(d => d.classList.toggle('on', S.phase === 'journey' || S.phase === 'store' ? +d.dataset.seg < S.step : S.step >= STEPS.length && S.phase !== 'dream'));
}
function placeField() {
  const st = $('#store'), [sx, sy, sw, sh] = L.store;
  const w = Math.max(sw, minWorld(72)), h = Math.max(sh, minWorld(72));
  Object.assign(st.style, { left: (sx - w / 2) + 'px', top: (sy - h / 2) + 'px', width: w + 'px', height: h + 'px' });
  $$('#field .sheaf').forEach((b, i) => {
    const [x, y] = L.sheaves[i], hh = Math.max(96, minWorld(64)), ww = Math.max(hh * asp('sheaf', 0.55), minWorld(56));
    box(b, x, y, ww, hh); const im = $('img', b); im.style.height = hh + 'px'; im.style.width = 'auto';
  });
  $$('#field .sack').forEach((b, i) => {
    const [x, y] = L.sacks[i], hh = Math.max(64, minWorld(56)), ww = Math.max(hh, minWorld(56));
    box(b, x, y, ww, hh); $$('img', b).forEach(im => { im.style.width = ww + 'px'; im.style.height = 'auto'; });
  });
}
function place() {
  placeOrbs(); placeStones(); placeProps(); placeTrail(); placeField();
  const fg = $('.palm-fg'), [fx, fy, fh, flip] = L.fg; box(fg, fx, fy + 12, fh * asp('palm', 0.6), fh); fg.style.scale = flip ? '-1 1' : '';
}

/* ======================= beads (progress, no numbers) ======================= */
function beads(total, done) {
  const b = $('#beads'); b.hidden = !total; b.innerHTML = '';
  for (let i = 0; i < total; i++) { const d = document.createElement('span'); d.className = 'bead' + (i < done ? ' full' : i === done ? ' now' : ''); b.appendChild(d); }
  b.setAttribute('aria-label', t(W.beadsLabel));
}

/* ======================= narration ribbon ======================= */
let sayCur = null;
function say(o) { sayCur = o; const p = $('#say'); p.textContent = t(o); p.classList.remove('in'); void p.offsetWidth; p.classList.add('in'); placeAct(); }

/* ======================= language ======================= */
function applyLang() {
  const ar = rtl();
  document.documentElement.lang = G.lang; document.documentElement.dir = ar ? 'rtl' : 'ltr';
  $$('[data-ar]').forEach(el => { if (el.dataset.en === undefined) el.dataset.en = el.innerHTML; el.innerHTML = ar ? el.dataset.ar : el.dataset.en; });
  $$('[data-ar-label]').forEach(el => { if (el.dataset.enLabel === undefined) el.dataset.enLabel = el.getAttribute('aria-label') || ''; el.setAttribute('aria-label', ar ? el.dataset.arLabel : el.dataset.enLabel); });
  const lb = $('#langBtn'); lb.textContent = ar ? 'English' : 'عربي'; lb.lang = ar ? 'en' : 'ar'; lb.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
  if (sayCur) $('#say').textContent = t(sayCur);
  $$('[data-tx]').forEach(el => (el.textContent = t(el.__tx)));
  $$('.card').forEach(c => c.setAttribute('aria-label', t(c.__s.label)));
  $$('#sky .star').forEach(b => b.setAttribute('aria-label', t(b.classList.contains('lit') ? W.starLit : W.starLabel)));
  $$('#field .sheaf').forEach(b => b.setAttribute('aria-label', t(W.sheaf)));
  $$('#field .sack').forEach(b => b.setAttribute('aria-label', t(b.classList.contains('full') ? W.sackFull : W.sack)));
  $$('#tower .block').forEach(b => b.setAttribute('aria-label', t(W.block)));
  if (S.turnQ) $('#turnQ').textContent = t(S.turnQ);
  if (S.pauseQ) { $('#pauseQ').textContent = t(S.pauseQ.q); $('#pauseHint').textContent = t(S.pauseQ.h); }
  if (S.ended) $('#endBody').textContent = t(W.endB);
  $('#beads').setAttribute('aria-label', t(W.beadsLabel));
  stopClip();
  fit();
}

/* ======================= drag, tap-to-select, keyboard ======================= */
// inWorld: the element lives inside the mirrored, scaled world (sheaves), so the drag is in world units
function makeDraggable(el, opts) {
  let st = null;
  el.addEventListener('pointerdown', e => {
    if (!opts.enabled(el)) return; e.preventDefault(); gesture();
    st = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; el.setPointerCapture(e.pointerId);
    sfx('tap');
  });
  el.addEventListener('pointermove', e => {
    if (!st || e.pointerId !== st.id) return;
    let dx = e.clientX - st.x, dy = e.clientY - st.y;
    if (!st.moved && Math.hypot(dx, dy) < 8) return;
    if (opts.inWorld) { dx = dx / G.s * (rtl() ? -1 : 1); dy /= G.s; }
    if (!st.moved) { st.moved = true; el.classList.add('dragging'); clearSel(); opts.targets().forEach(tg => tg.classList.add('target-on')); }
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
  // keyboard: Enter or Space places it straight on the glowing target (no hidden second step)
  el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && opts.enabled(el)) { e.preventDefault(); gesture(); clearSel(); opts.onDrop(el, opts.targets()[0]); } });
}
function hit(cx, cy, targets, pad = 50) {
  let best = null, bd = 1e9;
  targets.forEach(tg => { if (!tg || tg.hidden) return; const r = tg.getBoundingClientRect(); if (cx < r.left - pad || cx > r.right + pad || cy < r.top - pad || cy > r.bottom + pad) return; const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2)); if (d < bd) { bd = d; best = tg; } });
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
function gesture() { if (!G.gesture) { G.gesture = true; ac(); wind(windLevel()); maybeAutoClip(); } }
let pendingClip = null;
function maybeAutoClip() { if (pendingClip && G.sound) { const b = pendingClip; pendingClip = null; if (clipBeat === b) playClip(); } }
function beatClip(beat) { setClip(beat); if (G.gesture && G.sound) playClip(); else pendingClip = beat; }
$('#actBtn').addEventListener('click', () => { gesture(); const f = S.act; if (f) { S.act = null; $('#actRow').hidden = true; f(); } });
function setAct(label, fn) { const b = $('#actBtn'); S.act = fn; if (!label) { $('#actRow').hidden = true; return; } b.innerHTML = ''; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = label; sp.textContent = t(label); b.appendChild(sp); $('#actRow').hidden = false; placeAct(); setTimeout(() => b.focus({ preventScroll: true }), 80); }
// the action button always sits just above the narration when the narration is at the bottom (its height varies with the words)
function placeAct() { const row = $('#actRow'); if (row.hidden) return; const r = $('.ribbon').getBoundingClientRect(); row.style.bottom = r.top > innerHeight / 2 ? (innerHeight - r.top + 14) + 'px' : ''; }

/* ======================= 1. the dream ======================= */
function kindle(b) {
  gesture();
  if (S.phase !== 'dream' || b.classList.contains('lit')) return;
  b.classList.add('lit'); b.setAttribute('aria-label', t(W.starLit)); sfx('star');
  S.lit = $$('#sky .star.lit').length; beads(11, S.lit);
  const r = b.getBoundingClientRect(); Atmos.motes(toWorld(r.left + r.width / 2, r.top + r.height / 2), 2);
  if (S.lit >= 11) dreamDone();
  else { const nx = $('#sky .star:not(.lit)'); if (document.activeElement === b && nx) nx.focus({ preventScroll: true }); }
}
async function dreamDone() {
  $('.orb.sun').classList.add('on'); await anim(500); $('.orb.moon').classList.add('on');
  sfx('good'); say(W.dreamAll);
  await anim(2200);
  $('#bowNote').hidden = false;          // the story page's note on the bow, for the parent (gate 1, 02)
  setAct(W.beginBtn, startJourney);
}

/* ======================= 2. the journey road ======================= */
function buildTray() {
  const tr = $('#tray'); tr.innerHTML = '';
  shuffle(STEPS).forEach(s => {
    const c = document.createElement('button'); c.type = 'button'; c.className = 'card'; c.dataset.id = s.id; c.__s = s;
    c.innerHTML = `<img src="${IMG}${s.id}.webp" alt="" draggable="false">`;
    const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = s.label; sp.textContent = t(s.label); c.appendChild(sp);
    c.setAttribute('aria-label', t(s.label)); c.setAttribute('aria-pressed', 'false');
    makeDraggable(c, { enabled: () => S.phase === 'journey' && !S.busy, targets: () => [$(`.stone[data-i="${S.step}"]`)], onDrop: (el) => tryCard(el),
      onSelect: () => say(W.selCard), onMiss: () => say(W.missStone) });
    tr.appendChild(c);
  });
}
function startJourney() {
  $('#bowNote').hidden = true; setAct(null);
  setPhase('journey'); S.step = 0; S.misses = 0;
  setPlate('day'); $('#sky').classList.add('gone'); $$('.orb').forEach(o => o.classList.remove('on'));
  app.classList.toggle('pics', G.tier);
  buildTray(); $('#tray').hidden = false;
  beads(STEPS.length, 0); place();
  say(W.journey); setClip(null); wind(1);
  setTimeout(() => $('#tray .card')?.focus({ preventScroll: true }), 120);
}
function stoneTap(i) { gesture(); if (S.phase !== 'journey' || i !== S.step || !G.sel) return; const el = G.sel.el; clearSel(); tryCard(el); }
async function tryCard(card) {
  if (S.phase !== 'journey' || S.busy) return;
  const want = STEPS[S.step];
  if (card.dataset.id !== want.id) {
    S.misses++; sfx('soft'); springBack(card); card.classList.remove('wob'); void card.offsetWidth; card.classList.add('wob');
    say({ en: W.notYet.en + ' ' + want.hint.en, ar: W.notYet.ar + ' ' + want.hint.ar });
    if (S.misses >= 2) $(`.card[data-id="${want.id}"]`).classList.add('hint');
    return;
  }
  S.busy = true; S.misses = 0;
  card.style.translate = ''; card.classList.remove('hint', 'selected'); card.classList.add('used'); card.blur();
  S.step++; place(); sfx('place'); setTimeout(() => sfx('good'), 260);
  if (S.step >= STEPS.length) $('#tray').hidden = true;   // no empty tray left on screen
  const [x, y] = L.stones[S.step - 1]; Atmos.motes([x, y - 40], 5);
  beads(STEPS.length, S.step); say(want.told); beatClip(want.id);
  await anim(1200);
  S.busy = false;
  if (want.id === 'sheaf') { await anim(2600); return granary(); }
  const nx = $('#tray .card:not(.used)'); if (nx && (!document.activeElement || document.activeElement === document.body || document.activeElement.closest('.used'))) nx.focus({ preventScroll: true });
}

/* ======================= 3. the good years: store the harvest ======================= */
async function granary() {
  setPhase('store'); $('#tray').hidden = true; clearSel();
  S.zoom = true; fit(true); place();
  await anim(2400);
  const f = $('#field'); f.innerHTML = ''; S.stored = 0;
  L.sheaves.forEach((_, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sheaf'; b.setAttribute('aria-label', t(W.sheaf)); b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<img src="${IMG}sheaf.webp" alt="" draggable="false">`;
    makeDraggable(b, { inWorld: true, enabled: el => S.phase === 'store' && !el.classList.contains('gone'), targets: () => [$('#store')], onDrop: el => storeSheaf(el),
      onSelect: () => say(W.selSheaf), onMiss: () => say(W.missStore) });
    f.appendChild(b);
  });
  const st = $('#store'); st.hidden = false; st.classList.add('on');
  place(); beads(7, 0);
  say(W.storeAsk); beatClip('store');
  setTimeout(() => $('#field .sheaf')?.focus({ preventScroll: true }), 120);
}
$('#store').addEventListener('click', () => { gesture(); if (S.phase === 'store' && G.sel) { const el = G.sel.el; clearSel(); storeSheaf(el); } });
async function storeSheaf(b) {
  if (b.classList.contains('gone') || S.phase !== 'store') return;
  const [sx, sy] = L.store, w = parseFloat(b.style.width), h = parseFloat(b.style.height);
  b.style.translate = ''; b.classList.add('gone'); b.tabIndex = -1;
  b.style.left = (sx - w / 2) + 'px'; b.style.top = (sy - h / 2) + 'px';
  sfx('thump'); S.stored++; beads(7, S.stored); Atmos.motes([sx, sy - 30], 3);
  const st = $('#store'); st.classList.remove('land'); void st.offsetWidth;
  if (S.stored < 7) { const nx = $('#field .sheaf:not(.gone)'); if (nx && (document.activeElement === b || document.activeElement === document.body)) nx.focus({ preventScroll: true }); return; }
  st.classList.add('full'); sfx('good'); say(W.storeDone);
  await anim(3600);
  setPlate('hard'); say(W.hard); setClip(null);
  await anim(4200);
  brothers();
}

/* ======================= 4. the brothers come for food: camels and sacks only ======================= */
async function brothers() {
  setPhase('sacks'); $('#field').innerHTML = ''; $('#store').hidden = true;
  S.camels = true; place(); await anim(100);
  S.camelsIn = true; place(); sfx('place');
  await anim(RM ? 200 : 4800);
  const f = $('#field'); S.filled = 0;
  L.sacks.forEach(() => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sack'; b.setAttribute('aria-label', t(W.sack));
    b.innerHTML = `<img src="${IMG}bundle.webp" alt="" draggable="false">`;   // the cloth bag approved on Musa: slack when empty, plump when full
    b.addEventListener('click', () => fillSack(b));
    f.appendChild(b);
  });
  place(); beads(10, 0);
  say(W.brothersTold);
  setTimeout(() => $('#field .sack')?.focus({ preventScroll: true }), 120);
}
async function fillSack(b) {
  gesture();
  if (S.phase !== 'sacks' || b.classList.contains('full')) return;
  b.classList.add('full'); b.setAttribute('aria-label', t(W.sackFull)); sfx('pour');
  const r = b.getBoundingClientRect(); Atmos.grain(toWorld(r.left + r.width / 2, r.top));
  S.filled++; beads(10, S.filled);
  if (S.filled < 10) { const nx = $('#field .sack:not(.full)'); if (nx && (document.activeElement === b || document.activeElement === document.body)) nx.focus({ preventScroll: true }); return; }
  await anim(1600);
  sfx('good');
  await anim(1400);
  // the forgiveness: narrated, then 12:92 from the story page. Shown, never voiced; no sound while it is on screen.
  say(W.forgave);
  await anim(1800);
  G.quiet = true; wind(0); stopClip();
  $('#ayah').hidden = false;
  setAct(W.carryOn, family);
}
async function family() {
  $('#ayah').hidden = true; G.quiet = false;
  setPhase('family'); S.zoom = false; fit(true);
  setPlate('eve'); wind(0.6);
  await anim(1800);
  $('#sky').classList.remove('gone'); buildStars();
  $('.orb.sun').classList.add('on'); $('.orb.moon').classList.add('on');
  say(W.family);
  await anim(2400);
  $('#bowNote').hidden = false;          // the dream came true: the note on the bow again, beside the words
  setAct(W.carryOn, async () => { $('#bowNote').hidden = true; await pausePoint(W.pauseQ, W.pauseH); yourTurn(); });
}

/* ======================= parent pause ======================= */
function pausePoint(q, h) {
  return new Promise(res => {
    S.pauseQ = { q, h }; $('#pauseQ').textContent = t(q); $('#pauseHint').textContent = t(h);
    $('#pause').hidden = false; sfx('soft'); setTimeout(() => $('#pauseGo').focus({ preventScroll: true }), 80);
    $('#pauseGo').onclick = () => { $('#pause').hidden = true; S.pauseQ = null; sfx('tap'); res(); };
  });
}

/* ======================= 5. your turn: forgive, then build the tower again together ======================= */
const FALLEN = [[-180, 0, -24], [-100, 0, 18], [100, 0, -12], [180, 0, 30]];   // dx from the middle, bottom, rotate: clear of the tower's column
function yourTurn() {
  setPhase('turn'); S.turnQ = W.turnAsk; $('#turnQ').textContent = t(W.turnAsk);
  const tw = $('#tower'); tw.innerHTML = ''; S.built = 0;
  FALLEN.forEach(([dx, by, rot], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'block b' + i; b.disabled = true;
    b.innerHTML = '<span class="tile" aria-hidden="true"></span>'; b.setAttribute('aria-label', t(W.block));   // a UI-kit tile: every painted block render carried a cross-like motif
    b.style.left = `calc(50% + ${dx * (G.orient === 'port' ? 0.7 : 1)}px)`; b.style.bottom = by + 'px'; b.style.rotate = rot + 'deg';
    b.addEventListener('click', () => stack(b));
    tw.appendChild(b);
  });
  $('#turn').hidden = false;
  turnChoose();
}
async function turnChoose() {
  const bx = $('#turnChoices');
  for (;;) {
    const c = await new Promise(res => {
      bx.innerHTML = '';
      [{ id: 'fix', primary: true, label: W.optFix, icon: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M8 20h8v-6H8zM8 14h8V8H8zM9 8h6V3H9z"/></svg>' },
       { id: 'cross', label: W.optCross, icon: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2" stroke-linejoin="round"><path d="M4 20h7v-6H4zM13 20h7l-2.5-6.5L11 15z"/><path d="M7 14l2-5 5 2-2 5"/></svg>' }]
        .forEach(o => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (o.primary ? 'gold' : 'soft'); b.innerHTML = o.icon;
          const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = o.label; sp.textContent = t(o.label); b.appendChild(sp);
          b.addEventListener('click', () => { gesture(); res(o.id); }); bx.appendChild(b);
        });
      if (Math.random() < 0.5) bx.appendChild(bx.firstChild);   // the kind answer is not always first
      bx.hidden = false; setTimeout(() => bx.querySelector('button').focus({ preventScroll: true }), 80);
    });
    if (c === 'fix') break;
    sfx('soft'); S.turnQ = W.cross; $('#turnQ').textContent = t(W.cross);
    bx.hidden = true; await wait(RM ? 600 : 2600);
  }
  bx.hidden = true; sfx('good'); S.turnQ = W.build; $('#turnQ').textContent = t(W.build);
  $$('#tower .block').forEach(b => (b.disabled = false));
  setTimeout(() => $('#tower .block')?.focus({ preventScroll: true }), 80);
}
async function stack(b) {
  gesture();
  if (b.classList.contains('up') || b.disabled) return;
  const sz = b.offsetHeight || 60;   // the layout size: a rotated block's bounding box is taller
  b.classList.add('up'); b.style.left = '50%'; b.style.bottom = (S.built * (sz - 4)) + 'px'; b.style.rotate = '0deg';
  b.style.zIndex = 10 + S.built; S.built++; sfx('block');
  if (S.built < 4) { const nx = $('#tower .block:not(.up)'); if (nx && document.activeElement === b) nx.focus({ preventScroll: true }); return; }
  await anim(700); sfx('good'); S.turnQ = W.built; $('#turnQ').textContent = t(W.built);
  await anim(2400);
  $('#turn').hidden = true; S.turnQ = null;
  reward();
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
  setPhase('end'); beads(0, 0);
  buildShamsa();
  const rw = $('#reward'), [stx, sty] = L.store;
  const sx0 = (rtl() ? G.tx - stx * G.s : G.tx + stx * G.s), sy0 = G.ty + sty * G.s;
  rw.style.setProperty('--lx', (sx0 / innerWidth * 100) + '%'); rw.style.setProperty('--ly', (sy0 / innerHeight * 100) + '%');
  // the medallion draws itself on the end side, clear of the ending card (which opens on the start side)
  const port = G.orient === 'port', sx = port ? 50 : 76;
  rw.style.setProperty('--sx', (rtl() ? 100 - sx : sx) + '%'); rw.style.setProperty('--sy', (port ? 24 : 30) + '%');
  void rw.offsetWidth; rw.classList.add('on');
  await anim(900); sfx('done'); Atmos.motes([stx, sty - 60], 9);
  await anim(2600);
  S.ended = true; $('#endBody').textContent = t(W.endB);
  $('#tierBox').checked = G.tier; $('#ending').hidden = false; app.classList.add('ended');
  setTimeout(() => $('#againBtn').focus({ preventScroll: true }), 80);
}
$('#againBtn').addEventListener('click', () => { G.tier = $('#tierBox').checked; sfx('tap'); reset(); });

/* ======================= reset ======================= */
function reset() {
  Object.assign(S, { phase: 'dream', step: 0, misses: 0, lit: 0, busy: false, zoom: false, stored: 0, filled: 0, built: 0, camels: false, camelsIn: false, ended: false, pauseQ: null, turnQ: null, act: null });
  G.quiet = false; clearSel();
  app.className = 'phase-dream' + (G.bed ? ' bed' : '') + (Atmos.ok ? '' : ' nopixi');
  ['#ending', '#pause', '#turn', '#tray', '#bowNote', '#ayah', '#choices', '#store'].forEach(s => ($(s).hidden = true));
  $('#reward').classList.remove('on'); $('#store').classList.remove('full', 'on'); setAct(null);
  $('#field').innerHTML = ''; $('#sky').classList.remove('gone'); $$('.orb').forEach(o => o.classList.remove('on'));
  setPlate('night'); Atmos.reset(); fit(); buildStars(); beads(11, 0);
  say(W.dream); beatClip('dream');
}

/* ======================= settings ======================= */
$('#langBtn').addEventListener('click', () => { gesture(); G.lang = rtl() ? 'en' : 'ar'; try { localStorage.setItem('islamicKidsLang', G.lang); } catch (e) { /* private */ } applyLang(); });
$('#soundBtn').addEventListener('click', () => { gesture(); G.sound = !G.sound; $('#soundBtn').setAttribute('aria-pressed', String(G.sound)); if (!G.sound) { stopClip(); wind(0); } else wind(windLevel()); });
$('#bedBtn').addEventListener('click', () => { gesture(); G.bed = !G.bed; $('#bedBtn').setAttribute('aria-pressed', String(G.bed)); app.classList.toggle('bed', G.bed); wind(windLevel()); Atmos.calm(); });
$('#listenBtn').addEventListener('click', () => { gesture(); playClip(); });
addEventListener('resize', () => fit());
addEventListener('keydown', e => { if (e.key === 'Escape') clearSel(); });

/* ======================= atmosphere canvas (PixiJS). Decoration only: the game is whole without it. ======================= */
const Atmos = (() => {
  const A = { ok: false };
  let px = null, layers = {}, tex = {}, state = { river: null }, motes = [], grains = [], dispSprite = null;
  const canvas = $('#atmos');
  function softTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return PIXI.Texture.from(c); }
  async function init() {
    if (!window.PIXI) throw new Error('no PIXI');
    px = new PIXI.Application();
    await px.init({ canvas, width: L.w, height: L.h, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(2, (devicePixelRatio || 1) * G.s), preference: 'webgl', autoStart: false, sharedTicker: false });
    tex.mote = softTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.25, 'rgba(240,200,110,.7)'); gr.addColorStop(1, 'rgba(224,183,92,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    tex.grain = softTex(10, 16, (g) => { g.fillStyle = 'rgba(222,178,92,1)'; g.beginPath(); g.ellipse(5, 8, 3.2, 6, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,236,180,.8)'; g.beginPath(); g.ellipse(4, 6, 1.2, 2.6, 0, 0, Math.PI * 2); g.fill(); });
    tex.disp = softTex(256, 256, (g) => { const im = g.createImageData(256, 256); for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const v = 128 + 60 * Math.sin(x / 256 * Math.PI * 6 + Math.sin(y / 256 * Math.PI * 4) * 1.5) + 30 * Math.sin(y / 256 * Math.PI * 10); const i = (y * 256 + x) * 4; im.data[i] = v; im.data[i + 1] = 128 + 50 * Math.cos(y / 256 * Math.PI * 8 + x / 40); im.data[i + 2] = 128; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); });
    tex.disp.source.addressMode = 'repeat';
    dispSprite = new PIXI.Sprite(tex.disp); dispSprite.texture.source.addressMode = 'repeat'; dispSprite.scale.set(2.2, 1.2);
    const filter = new PIXI.DisplacementFilter({ sprite: dispSprite, scale: { x: 6, y: 3 } });
    layers.river = new PIXI.Container(); layers.river.filters = [filter];
    layers.riverMask = new PIXI.Graphics(); layers.river.mask = layers.riverMask;
    layers.grain = new PIXI.Container(); layers.motes = new PIXI.Container();
    px.stage.addChild(dispSprite, layers.river, layers.riverMask, layers.grain, layers.motes);
    dispSprite.renderable = false;
    A.ok = true; app.classList.remove('nopixi');
    resize(); wake();
  }
  function plateSprite(st) { const im = $(`.plates img[data-state="${st}"]`); if (!im || !im.complete || !im.naturalWidth) return null; const sp = new PIXI.Sprite(PIXI.Texture.from(im)); sp.width = L.w; sp.height = L.h; return sp; }
  function resize() {
    if (!A.ok) return;
    px.renderer.resolution = Math.min(2, (devicePixelRatio || 1) * G.s * (S.zoom ? 1 : 1));
    px.renderer.resize(L.w, L.h); canvas.style.width = L.w + 'px'; canvas.style.height = L.h + 'px';
    layers.riverMask.clear(); layers.riverMask.poly(L.river.flat()).fill(0xffffff);
    if (state.river) river(state.river, true);
    wake();
  }
  // the river shimmers softly: a copy of the plate's river, gently displaced (night has no shimmer)
  function river(which, instant) {
    state.river = which; if (!A.ok) return;
    const old = layers.river.children.slice();
    if (which && which !== 'night') {
      const sp = plateSprite(which); if (!sp) { setTimeout(() => state.river === which && river(which, instant), 400); return; }
      sp.alpha = instant || RM ? 1 : 0; layers.river.addChild(sp); sp.__in = true;
    }
    old.forEach(o => { o.__out = true; if (instant || RM) o.destroy(); });
    wake();
  }
  function motesAt([x, y], n) {
    if (!A.ok || G.bed) return;
    for (let i = 0; i < n; i++) { const m = new PIXI.Sprite(tex.mote); m.anchor.set(0.5); m.blendMode = 'add'; m.x = x + (Math.random() - 0.5) * 120; m.y = y - 20 + (Math.random() - 0.3) * 50; m.scale.set(0.25 + Math.random() * 0.35); m.life = 0; m.max = 2.6 + Math.random() * 1.6; m.vx = (Math.random() - 0.5) * 14; m.alpha = 0; layers.motes.addChild(m); motes.push(m); }
    wake();
  }
  function grainAt([x, y]) {   // a short soft pour of grains into the sack
    if (!A.ok || RM) return;
    const n = G.bed ? 6 : 12;
    for (let i = 0; i < n; i++) { const g = new PIXI.Sprite(tex.grain); g.anchor.set(0.5); g.x = x + (Math.random() - 0.5) * 18; g.y = y - 60 - Math.random() * 40; g.vy = 60 + Math.random() * 40; g.life = 0; g.max = 0.7 + Math.random() * 0.4; g.rotation = Math.random() * 3; g.alpha = 0; layers.grain.addChild(g); grains.push(g); }
    wake();
  }
  let raf = 0, last = 0;
  function wake() { if (A.ok && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; let live = false;
    const still = RM || G.bed;
    layers.river.children.slice().forEach(o => {
      if (o.__out) { o.alpha -= dt * 0.4; if (o.alpha <= 0) o.destroy(); else live = true; }
      else if (o.__in && o.alpha < 1) { o.alpha = Math.min(1, o.alpha + dt * 0.36); live = true; }
    });
    if (layers.river.children.length && !still) { dispSprite.x -= dt * 10; dispSprite.y += dt * 2; live = true; }
    grains = grains.filter(g => { g.life += dt; g.y += g.vy * dt; g.vy += 240 * dt; const k = g.life / g.max; g.alpha = k < 0.15 ? k * 6 : Math.max(0, 1 - k); if (k >= 1) { g.destroy(); return false; } live = true; return true; });
    motes = motes.filter(m => { m.life += dt; const k = m.life / m.max; m.y -= dt * 26; m.x += m.vx * dt; m.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 0.9); if (k >= 1) { m.destroy(); return false; } live = true; return true; });
    px.render();
    if (live) raf = requestAnimationFrame(frame);
  }
  function reset() { if (!A.ok) return; river('night', true); motes.forEach(m => m.destroy()); motes = []; grains.forEach(g => g.destroy()); grains = []; wake(); }
  function calm() { if (A.ok) wake(); }
  Object.assign(A, { init, resize, river: (w, i) => river(w, i), motes: motesAt, grain: grainAt, reset, calm });
  return A;
})();

/* ======================= boot ======================= */
async function boot() {
  try { MANIFEST = await (await fetch(IMG + 'manifest.json')).json(); } catch (e) { /* aspects fall back to defaults */ }
  if (MANIFEST.layout) ['land', 'port'].forEach(k => MANIFEST.layout[k] && Object.assign(LAYOUT[k], MANIFEST.layout[k]));
  app.classList.add('nopixi');
  S.phase = 'dream';
  applyLang();
  reset();
  try { await Atmos.init(); Atmos.reset(); } catch (e) { app.classList.add('nopixi'); }
  window.__yusuf = { S, G, L: () => L, Atmos, W, STEPS, CLIPS, say, fit }; // for the headless play-through and wording checks
}
boot();
})();
