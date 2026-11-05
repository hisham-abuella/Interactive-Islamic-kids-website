/* Game 01, Nuh and the Ark: painted flagship (2026-11-04).
   Painted DOM planes + DOM HUD; one PixiJS canvas (decoration only) for rain, water shimmer and motes.
   All words live in the DOM (Arabic shaping, RTL). No browser TTS: the only voice is Baba's recorded
   story narration, where a clip for the beat exists. No music: one- or two-note chimes and natural sounds. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const IMG = '../images/games/nuh/';
const AUDIO = '../audio/prophet-nuh/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const G = { lang: 'en', sound: true, bed: false, tier: false, orient: null, s: 1, ox: 0, oy: 0, sel: null, clip: null, gesture: false };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }
const anim = ms => wait(RM ? Math.min(ms, 200) : G.bed ? ms * 1.25 : ms);
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const num = n => (G.lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rtl = () => G.lang === 'ar';

/* ======================= layout: logical world coordinates, one table per composition =======================
   x = centre, y = base line (feet / keel), w = width, all in plate pixels. Measured against the painted plates. */
const LAYOUT = {
  land: {
    w: 1240, h: 776, plate: 'land',
    ark: { x: 565, y: 650, w: 490 }, float: { x: 545, y: 640 }, judi: { x: 966, y: 222, w: 250 },
    pile: { x: 1050, y: 680, w: 220 }, plank: { x: 1050, y: 628, w: 200 },
    mallet: { size: 118, dx: 0.36, dy: -0.16 },
    ramp: { x0: 0.1, len: 170, angle: 28 }, rampSpot: { r: 70 },
    // the first ten slots are the well-spaced ones (5 pairs); the last six only come with 8 pairs
    herd: [[870, 600], [975, 590], [1080, 600], [885, 668], [995, 668], [1105, 668], [925, 530], [1035, 525], [1135, 545], [800, 668],
           [130, 560], [1150, 640], [820, 560], [1180, 600], [120, 668], [700, 690]],
    tents: [[251, 662], [375, 644]], taunt: [250, 470],
    reeds: [{ x: 30, y: 776, h: 280 }, { x: 1210, y: 776, h: 240, flip: true }],
    waterY: 444, judiWaterY: 470, animalScale: 0.64
  },
  port: {
    // phone: the narration ribbon sits over the empty sky at the top, so the whole ground is play space
    w: 690, h: 1303, plate: 'port',
    ark: { x: 345, y: 975, w: 530 }, float: { x: 345, y: 1010 }, judi: { x: 345, y: 716, w: 300 },
    pile: { x: 545, y: 1185, w: 170 }, plank: { x: 545, y: 1138, w: 150 },
    mallet: { size: 112, dx: 0.3, dy: -0.12 },
    ramp: { x0: 0.3, len: 120, angle: 34 }, rampSpot: { r: 62 },
    herd: [[150, 1062], [270, 1068], [390, 1060], [510, 1066], [610, 1058], [130, 1160], [270, 1166], [410, 1160], [550, 1166], [340, 1252],
           [120, 1250], [590, 1250], [220, 1256], [470, 1256], [70, 1150], [630, 1150]],
    tents: [[100, 798], [198, 794]], taunt: [260, 700],
    reeds: [{ x: 50, y: 1303, h: 220 }, { x: 640, y: 1303, h: 200, flip: true }],
    waterY: 760, judiWaterY: 742, animalScale: 0.6
  }
};
/* ark image geometry (fractions of the ark sprite): where the plank rows sit, the deck door and the cabin windows */
const ARK = { aspect: 0.372, hullTop: 0.43, keel: 0.97, waterline: 0.8, wins: [[0.237, 0.305], [0.282, 0.305], [0.327, 0.305]] };
/* animal sprites: height in logical px (land), and their aspect (w/h), filled from the export manifest.
   f: the Arabic noun is feminine (بقرة، زرافة، سلحفاة), so its sentences take هذه / تحتاج / نوعها / التي / أخرى. */
const KINDS = {
  elephant: { h: 165, n: { en: 'elephant', ar: 'فيل' }, p: { en: 'elephants', ar: 'الفيلة' } },
  lion: { h: 120, n: { en: 'lion', ar: 'أسد' }, p: { en: 'lions', ar: 'الأسود' } },
  camel: { h: 165, n: { en: 'camel', ar: 'جمل' }, p: { en: 'camels', ar: 'الجمال' } },
  sheep: { h: 108, n: { en: 'sheep', ar: 'خروف' }, p: { en: 'sheep', ar: 'الخراف' } },
  giraffe: { h: 200, f: true, n: { en: 'giraffe', ar: 'زرافة' }, p: { en: 'giraffes', ar: 'الزرافات' } },
  rabbit: { h: 86, n: { en: 'rabbit', ar: 'أرنب' }, p: { en: 'rabbits', ar: 'الأرانب' } },
  tortoise: { h: 80, f: true, n: { en: 'tortoise', ar: 'سلحفاة' }, p: { en: 'tortoises', ar: 'السلاحف' } },
  hoopoe: { h: 92, n: { en: 'hoopoe bird', ar: 'هدهد' }, p: { en: 'hoopoes', ar: 'الهداهد' } },
  cow: { h: 130, f: true, n: { en: 'cow', ar: 'بقرة' }, p: { en: 'cows', ar: 'الأبقار' } },
  goat: { h: 118, n: { en: 'goat', ar: 'ماعز' }, p: { en: 'goats', ar: 'الماعز' } }
};
let MANIFEST = { aspects: {} };

/* ======================= words (gate-1 approved text kept as approved) ======================= */
const ROWS = 6;
const TAUNTS = [
  { en: 'A boat? There is no sea here!', ar: 'سفينة؟ لا يوجد بحر هنا!' },
  { en: 'Why work so hard? It will never float!', ar: 'لماذا تتعب نفسك؟ لن تطفو أبداً!' },
  { en: 'Ha! Building a ship on dry land!', ar: 'ها! يبني سفينة على اليابسة!' }
];
const W = {
  intro: { en: 'Allah told Prophet Nuh to build a huge ark, far from any sea. Drag the plank to the ark.', ar: 'أمر الله النبيَّ نوحاً عليه السلام أن يبني سفينة ضخمة بعيداً عن البحر. اسحب اللوح إلى السفينة.' },
  hold: { en: 'Good! Now press and hold the mallet to fix the plank firmly. Slow and steady.', ar: 'أحسنت! والآن اضغط مطوّلاً على المطرقة لتثبّت اللوح جيداً. بهدوء وثبات.' },
  miss: { en: 'Bring the plank right onto the ark.', ar: 'ضع اللوح فوق السفينة.' },
  selPlank: { en: 'Now tap the ark to place the plank.', ar: 'والآن المس السفينة لتضع اللوح.' },
  next: { en: 'That plank is firm. Drag the next plank.', ar: 'ثبت اللوح. اسحب اللوح التالي.' },
  moreTaunt: { en: 'More mocking words... Nuh did not stop. Keep building: drag the next plank.', ar: 'كلمات سخرية أخرى... لكن نوحاً لم يتوقف. واصل البناء: اسحب اللوح التالي.' },
  tauntTap: { en: 'Those are mocking words. They cannot stop good work. Nuh kept doing what Allah asked, so we keep building too.', ar: 'هذه كلمات سخرية، ولا تستطيع أن توقف العمل الطيب. ظل نوح يفعل ما أمره الله، فلنواصل البناء نحن أيضاً.' },
  laugh: { en: 'Some people by the tents are laughing at the ark. What should we do?', ar: 'بعض الناس عند الخيام يضحكون من السفينة. ماذا نفعل؟' },
  keepYes: { en: 'Yes! Nuh kept going, because Allah had asked him to. Drag the next plank.', ar: 'نعم! واصل نوح العمل لأن الله أمره بذلك. اسحب اللوح التالي.' },
  stopNo: { en: 'If we stop, the ark stays half built, and it will be needed soon. Laughing cannot hurt the work. Let us choose again.', ar: 'إن توقفنا بقيت السفينة نصف مبنية، وسنحتاجها قريباً. الضحك لا يضرّ العمل. لنختر مرة أخرى.' },
  keepBtn: { en: 'Keep building, trusting Allah', ar: 'نواصل البناء ونتوكل على الله' },
  stopBtn: { en: 'Stop, they are laughing', ar: 'نتوقف، إنهم يضحكون' },
  built: { en: 'The ark is built! Nuh worked patiently, plank by plank, even when people laughed.', ar: 'اكتملت السفينة! عمل نوح بصبر لوحاً بعد لوح، حتى حين ضحك الناس.' },
  pause1: { en: 'Nuh kept building even when people laughed. Has anyone ever laughed at something good you were doing? What helped you keep going?', ar: 'واصل نوح البناء حتى حين ضحك الناس. هل ضحك أحد يوماً من شيء طيب كنت تفعله؟ ما الذي ساعدك على الاستمرار؟' },
  pause1h: { en: 'Idea: we keep doing good because Allah sees it, not because people clap.', ar: 'فكرة: نستمر في فعل الخير لأن الله يرانا، لا لأن الناس يصفقون لنا.' },
  animals: { en: 'Allah told Nuh to bring a pair of every animal. Drag an animal to the ramp, then find its partner.', ar: 'أمر الله نوحاً أن يحمل زوجين من كل حيوان. اسحب حيواناً إلى المنحدر، ثم ابحث عن شريكه.' },
  findPartner: a => ({ en: `Now find its partner: another ${a.n.en}.`,
    ar: a.f ? `والآن ابحث عن شريكها: ${a.n.ar} أخرى.` : `والآن ابحث عن شريكه: ${a.n.ar} آخر.` }),
  notPartner: (a, b) => ({ en: `This ${a.n.en} needs a partner of its own kind. Who matches the ${b.n.en} by the ramp?`,
    ar: (a.f ? `هذه ال${a.n.ar} تحتاج إلى شريك من نوعها.` : `هذا ال${a.n.ar} يحتاج إلى شريك من نوعه.`) +
        ` من يطابق ال${b.n.ar} ${b.f ? 'التي' : 'الذي'} عند المنحدر؟` }),
  backToMeadow: a => ({ en: 'Okay, that one went back to the meadow. Pick any animal.', ar: `حسناً، ${a.f ? 'عادت' : 'عاد'} إلى المرج. اختر أي حيوان.` }),
  selAnimal: { en: 'Now tap the glowing ramp.', ar: 'والآن المس المنحدر المضيء.' },
  aboard: (a, left) => ({ en: `Two ${a.p.en} are safely aboard! ${left === 1 ? 'One more pair to go.' : 'More pairs are waiting.'}`,
    ar: `صعد زوجٌ من ${a.p.ar} بأمان! ` + (left === 1 ? 'بقي زوجٌ واحد.' : 'أزواج أخرى تنتظر.') }),
  rain: { en: 'Every pair is aboard. Then the rain began, more rain than anyone had ever seen!', ar: 'صعدت كل الأزواج. ثم بدأ المطر، مطرٌ لم يرَ أحد مثله قط!' },
  floated: { en: 'Water covered the earth, but the ark floated safely with everyone inside. Tap the waves if you like.', ar: 'غطى الماء الأرض، لكن السفينة طفت بأمان وكل من فيها. المس الأمواج إن أحببت.' },
  command: { en: 'After many days, Allah commanded the rain to stop and the water to go down. Tap the ark to watch where it comes to rest.', ar: 'وبعد أيام كثيرة أمر الله المطر أن يتوقف والماء أن ينحسر. المس السفينة لترى أين تستقر.' },
  watchBtn: { en: 'Watch the ark come to rest', ar: 'شاهد السفينة تستقر' },
  rest: { en: 'The ark came to rest safely on a mountain called Judi. Prophet Nuh thanked Allah for keeping them safe.', ar: 'فاستقرت السفينة بسلام على جبل اسمه الجودي. فحمد النبي نوح الله على نجاتهم.' },
  pause2: { en: 'Why do you think Nuh trusted Allah, even when there was no sea nearby?', ar: 'لماذا برأيك وثق نوح بالله، مع أنه لم يكن هناك بحر قريب؟' },
  pause2h: { en: 'Idea: Allah always keeps His promise, so doing what He asks is always worth it.', ar: 'فكرة: الله يفي بوعده دائماً، ففعل ما يأمر به يستحق العناء دائماً.' },
  endBody: n => ({ en: `You helped build the ark, plank by plank, and you kept building when people laughed. You helped ${n} pairs of animals aboard. Prophet Nuh was patient and trusted Allah.`,
    ar: `ساعدت في بناء السفينة لوحاً بعد لوح، وواصلت البناء حين ضحك الناس، وساعدت ${num(n)} أزواج من الحيوانات على الصعود. كان النبي نوح عليه السلام صابراً واثقاً بالله.` }),
  arkLabel: r => ({ en: r < ROWS ? `The ark, part built. Place the plank here.` : 'The ark', ar: r < ROWS ? 'السفينة، لم تكتمل بعد. ضع اللوح هنا.' : 'السفينة' }),
  beadsLabel: { en: 'Progress', ar: 'التقدّم' }
};
/* Baba's recorded story narration, used at the beats it matches. Slide 7 was re-recorded without the dove
   (11:44 text only); the Whisper QA heard it dove-free with Judi in EN and AR (WER 0.06 / 0.0), and the
   installed mp3s are byte-identical to the QA'd ones (checked 2026-11-04), so it plays at the Judi beat. */
const CLIPS = { build: 4, animals: 5, flood: 6, judi: 7 };

/* ======================= sound: Web Audio, no music ======================= */
let AC = null, master = null, rainNode = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); master = AC.createGain(); master.connect(AC.destination); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
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
function sfx(kind) {
  const v = vol(); if (!v) return; const a = ac(); if (!a) return; const n = a.currentTime;
  if (kind === 'knock') { // wood on wood: a short filtered noise tick over a low body thump
    const s = a.createBufferSource(); s.buffer = noise(a); const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900 + Math.random() * 200; bp.Q.value = 2.5;
    const g = a.createGain(); g.gain.setValueAtTime(0.5 * v, n); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.07);
    s.connect(bp).connect(g).connect(master); s.start(n, Math.random()); s.stop(n + 0.1);
    const o = a.createOscillator(), e = a.createGain(); o.frequency.setValueAtTime(190, n); o.frequency.exponentialRampToValueAtTime(110, n + 0.12);
    e.gain.setValueAtTime(0.32 * v, n); e.gain.exponentialRampToValueAtTime(0.0001, n + 0.14); o.connect(e).connect(master); o.start(n); o.stop(n + 0.16);
  } else if (kind === 'good') { bell(a, 659, n, 1.4, 0.07 * v); bell(a, 988, n + 0.12, 1.6, 0.05 * v); }
  else if (kind === 'done') { bell(a, 523, n, 2.4, 0.07 * v); bell(a, 784, n + 0.35, 2.8, 0.055 * v); }
  else if (kind === 'soft') bell(a, 392, n, 1.1, 0.045 * v);
  else if (kind === 'tap') bell(a, 1320, n, 0.25, 0.018 * v);
  else if (kind === 'lap' || kind === 'step') { // water lapping / soft hoof on sand: low swoosh of noise
    const s = a.createBufferSource(); s.buffer = noise(a); const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = kind === 'lap' ? 650 : 420;
    const g = a.createGain(), d = kind === 'lap' ? 0.55 : 0.16; g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(0.35 * v, n + d * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, n + d);
    s.connect(lp).connect(g).connect(master); s.start(n, Math.random()); s.stop(n + d + 0.05);
  }
}
function rainSound(on) {
  if (!on && !rainNode) return;
  const a = ac(); if (!a) return;
  if (on && !rainNode) {
    const s = a.createBufferSource(); s.buffer = noise(a); s.loop = true;
    const hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
    const g = a.createGain(); g.gain.value = 0.0001; s.connect(hp).connect(lp).connect(g).connect(master); s.start();
    rainNode = { s, g };
  }
  if (!rainNode) return;
  const target = on ? Math.max(0.0001, 0.06 * vol()) : 0.0001;
  rainNode.g.gain.cancelScheduledValues(a.currentTime);
  rainNode.g.gain.setTargetAtTime(target, a.currentTime, on ? 1.2 : 1.8);
  if (!on) { const r = rainNode; rainNode = null; setTimeout(() => { try { r.s.stop(); } catch (e) { /* stopped */ } }, 7000); }
}

/* Baba's voice: the recorded story clip for this beat (never TTS, never scripture) */
let clipBeat = null;
function setClip(beat) {
  clipBeat = beat; const b = $('#listenBtn'); b.hidden = !(beat in CLIPS);
  if (G.clip) { G.clip.pause(); G.clip = null; b.classList.remove('playing'); }
}
function playClip() {
  if (!(clipBeat in CLIPS)) return;
  const b = $('#listenBtn');
  if (G.clip && !G.clip.paused) { G.clip.pause(); b.classList.remove('playing'); return; }
  G.clip = new Audio(`${AUDIO}${G.lang}/slide-${CLIPS[clipBeat]}.mp3`);
  G.clip.addEventListener('ended', () => b.classList.remove('playing'));
  G.clip.play().then(() => b.classList.add('playing')).catch(() => {});
}

/* ======================= world fit, RTL mirror ======================= */
const world = $('#world'), app = $('#app');
let L = LAYOUT.land;
function fit() {
  const vw = innerWidth, vh = innerHeight;
  const orient = vw / vh < 0.8 ? 'port' : 'land';
  const changed = orient !== G.orient; G.orient = orient; L = LAYOUT[orient];
  const s = Math.max(vw / L.w, vh / L.h);
  G.s = s; G.ox = (vw - L.w * s) / 2; G.oy = Math.min(0, (vh - L.h * s) * (orient === 'port' ? 0.35 : 0.5));
  world.style.width = L.w + 'px'; world.style.height = L.h + 'px';
  world.style.transform = rtl() ? `translate(${G.ox + L.w * s}px,${G.oy}px) scale(${-s},${s})` : `translate(${G.ox}px,${G.oy}px) scale(${s})`;
  world.classList.toggle('rtl', rtl());
  const f = $('.frame'); f.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  [['.f1', 10], ['.f2', 17]].forEach(([c, m]) => { const r = $(c, f); r.setAttribute('x', m); r.setAttribute('y', m); r.setAttribute('width', Math.max(0, vw - 2 * m)); r.setAttribute('height', Math.max(0, vh - 2 * m)); });
  if (changed) { loadPlates(); place(); Atmos.resize(); } else place();
}
const toWorld = (cx, cy) => { let x = (cx - G.ox) / G.s; const y = (cy - G.oy) / G.s; if (rtl()) x = L.w - (cx - G.ox) / G.s; return [x, y]; };
function loadPlates() {
  $$('.plates img').forEach(im => { const src = `${IMG}plate-${im.dataset.state}-${L.plate}.webp`; if (!im.src.endsWith(src.replace(/^(\.\.\/)+/, ''))) im.src = src; });
}
function box(el, x, y, w, h) { Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - h) + 'px', width: w + 'px', height: h + 'px' }); }

/* ======================= state ======================= */
const S = {};
const ark = $('#ark'), plank = $('#plank'), mallet = $('#mallet');
function arkRect() { // current logical rect of the ark (base point moves with phase)
  const a = S.arkAt || { x: L.ark.x, y: L.ark.y, w: L.ark.w };
  const h = a.w * ARK.aspect; return { x: a.x, y: a.y, w: a.w, h, left: a.x - a.w / 2, top: a.y - h };
}
function place() {
  const r = arkRect(); box(ark, r.x, r.y, r.w, r.h);
  const g = $('.arkglow'); box(g, r.x, r.y + r.h * 0.15, r.w * 1.5, r.h * 1.5);
  ark.style.setProperty('--reveal', revealPct(S.row || 0));
  const hint = $('.ark-row-hint', ark), rowH = (ARK.keel - ARK.hullTop) / ROWS;
  hint.style.top = ((ARK.keel - ((S.row || 0) + 0.5) * rowH) * 100 - 3) + '%';
  ARK.wins.forEach(([wx, wy], i) => { const w = $('.win.w' + i, ark); w.style.left = (wx * 100 - 2) + '%'; w.style.top = (wy * 100 - 2.5) + '%'; });
  const p = L.pile; const pi = $('#pile'); pi.style.left = (p.x - p.w / 2) + 'px'; pi.style.top = (p.y - p.w * (MANIFEST.aspects['timber-pile'] ? 1 / MANIFEST.aspects['timber-pile'] : 0.55)) + 'px'; pi.style.width = p.w + 'px';
  const pk = L.plank, ph = pk.w / (MANIFEST.aspects.plank || 6); box(plank, pk.x, pk.y, pk.w, ph);
  const ms = L.mallet.size; box(mallet, r.x + r.w * L.mallet.dx, r.top + r.h * (1 + L.mallet.dy) + ms / 2, ms, ms);
  L.tents.forEach(([x, y], i) => { const l = $('.lantern.l' + (i + 1)); l.style.left = x + 'px'; l.style.top = y + 'px'; });
  L.reeds.forEach((rd, i) => { const el = $('.reeds.r' + (i + 1)), w = rd.h * (MANIFEST.aspects.reeds || 0.6); box(el, rd.x, rd.y + 10, w, rd.h); el.style.scale = rd.flip ? '-1 1' : ''; });
  placeRamp(); placeHerd();
}
function revealPct(rows) { const top = rows >= ROWS ? 0 : ARK.keel - (ARK.keel - ARK.hullTop) * (rows / ROWS); return (top * 100).toFixed(2) + '%'; }

/* ======================= beads (progress, no numbers) ======================= */
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
  $$('.taunt').forEach(d => (d.textContent = t(d.__o)));
  $$('.animal').forEach(a => a.setAttribute('aria-label', t(KINDS[a.dataset.k].n)));
  $$('[data-tx]').forEach(el => (el.textContent = t(el.__tx)));
  if (S.pauseQ) { $('#pauseQ').textContent = t(S.pauseQ.q); $('#pauseHint').textContent = t(S.pauseQ.h); }
  if (S.ended) $('#endBody').textContent = t(W.endBody(S.pairs));
  $('#beads').setAttribute('aria-label', t(W.beadsLabel));
  ark.setAttribute('aria-label', t(W.arkLabel(S.row || 0)));
  if (G.clip) { G.clip.pause(); G.clip = null; $('#listenBtn').classList.remove('playing'); }
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
    if (!moved) { el.style.translate = ''; if (opts.onTap && opts.onTap(el)) return; return select(el, opts); }
    const tg = hit(e.clientX, e.clientY, opts.targets());
    if (tg) opts.onDrop(el, tg); else { springBack(el); opts.onMiss && opts.onMiss(el); }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && opts.enabled()) { e.preventDefault(); gesture(); if (opts.onTap && opts.onTap(el)) return; select(el, opts); } });
  el.__drag = opts;
}
function hit(cx, cy, targets, pad = 40) {
  let best = null, bd = 1e9;
  targets.forEach(tg => { const r = tg.getBoundingClientRect(); if (cx < r.left - pad || cx > r.right + pad || cy < r.top - pad || cy > r.bottom + pad) return; const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2)); if (d < bd) { bd = d; best = tg; } });
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
  opts.targets().forEach(tg => { tg.classList.add('target-on', 'selectable'); tg.tabIndex = 0; });
  opts.onSelect && opts.onSelect(el);
}
function clearSel() {
  if (!G.sel) return; const { el, opts } = G.sel; el.classList.remove('selected'); el.setAttribute('aria-pressed', 'false');
  opts.targets().forEach(tg => tg.classList.remove('target-on', 'selectable')); G.sel = null;
}
function targetActivate(tg) { if (!G.sel) return false; const { el, opts } = G.sel; if (!opts.targets().includes(tg)) return false; clearSel(); opts.onDrop(el, tg); return true; }
[ark, $('#rampSpot')].forEach(tg => {
  tg.addEventListener('click', () => { gesture(); targetActivate(tg); });
  tg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); targetActivate(tg); } });
});
function gesture() { if (!G.gesture) { G.gesture = true; ac(); maybeAutoClip(); } }
let pendingClip = null;
function maybeAutoClip() { if (pendingClip && G.sound) { const b = pendingClip; pendingClip = null; if (clipBeat === b) playClip(); } }
function beatClip(beat) { setClip(beat); if (G.gesture && G.sound) playClip(); else pendingClip = beat; }

/* ======================= building ======================= */
makeDraggable(plank, {
  enabled: () => S.phase === 'build' && !S.loose && !S.asking,
  targets: () => [ark],
  onSelect: () => say(W.selPlank),
  onDrop: el => fixPlankStart(el),
  onMiss: () => say(W.miss)
});
function fixPlankStart(el) {
  S.loose = true; el.style.translate = ''; plank.hidden = true;
  const lo = $('.loose', ark), rowH = (ARK.keel - ARK.hullTop) / ROWS, cy = ARK.keel - (S.row + 0.5) * rowH;
  Object.assign(lo.style, { left: '16%', width: '68%', top: (cy * 100 - 4) + '%', height: '8%', rotate: (-2 + Math.random()) + 'deg', translate: '0 -6px' });
  lo.hidden = false; lo.classList.remove('land'); void lo.offsetWidth; lo.classList.add('land');
  $('.ark-row-hint', ark).classList.remove('on');
  sfx('knock');
  mallet.hidden = false; mallet.classList.add('idle'); mallet.style.setProperty('--p', 0);
  say(W.hold); setTimeout(() => mallet.focus({ preventScroll: true }), 60);
}
/* press-and-hold: progress only grows while held; letting go keeps what was done (steady effort wins) */
const HOLD_MS = 1600;
let holdT = 0, holding = false, holdLast = 0, knockAt = 0;
function holdStart(e) { if (!S.loose) return; e && e.preventDefault(); gesture(); if (holding) return; holding = true; holdLast = performance.now(); mallet.classList.remove('idle'); requestAnimationFrame(holdTick); }
function holdEnd() { holding = false; mallet.classList.remove('knock'); }
function holdTick(now) {
  if (!holding || !S.loose) return;
  holdT += now - holdLast; holdLast = now; const p = Math.min(1, holdT / HOLD_MS);
  mallet.style.setProperty('--p', p);
  if (now - knockAt > 330) { knockAt = now; sfx('knock'); mallet.classList.add('knock'); setTimeout(() => mallet.classList.remove('knock'), 120); const lo = $('.loose', ark); lo.style.translate = `0 ${-6 + 6 * p}px`; }
  if (p >= 1) { holding = false; holdT = 0; plankFixed(); return; }
  requestAnimationFrame(holdTick);
}
mallet.addEventListener('pointerdown', e => { mallet.setPointerCapture(e.pointerId); holdStart(e); });
mallet.addEventListener('pointerup', holdEnd); mallet.addEventListener('pointercancel', holdEnd); mallet.addEventListener('lostpointercapture', holdEnd);
mallet.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) holdStart(e); });
mallet.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') holdEnd(); });
mallet.addEventListener('contextmenu', e => e.preventDefault());

async function plankFixed() {
  const lo = $('.loose', ark); lo.hidden = true; mallet.hidden = true; mallet.style.setProperty('--p', 0);
  S.loose = false; S.row++;
  ark.style.setProperty('--reveal', revealPct(S.row)); ark.setAttribute('aria-label', t(W.arkLabel(S.row)));
  sfx('good'); Atmos.dust(S.row); beads(ROWS, S.row);
  const old = $$('.taunt:not(.fade)'); // anyone still taunting fades away once the work goes on
  if (old.length) { old.forEach(x => x.classList.add('fade')); arkGlow(); setTimeout(() => old.forEach(x => x.remove()), 1200); }
  if (S.row >= ROWS) return built();
  if (S.row === 1) await firstTaunt();
  else if (S.row === 3 || S.row === 5) showTaunt(TAUNTS[S.row === 3 ? 1 : 2]);
  readyPlank();
  if (S.row > 1) say(S.row === 3 || S.row === 5 ? W.moreTaunt : W.next);
}
function readyPlank() {
  plank.hidden = false; plank.classList.add('idle'); place();
  $('.ark-row-hint', ark).classList.add('on');
  if (!RM) plank.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], { duration: 500, easing: 'cubic-bezier(.3,1.4,.5,1)' });
}
function arkGlow() { const g = $('.arkglow'); g.classList.add('on'); setTimeout(() => g.classList.remove('on'), 2600); }
function showTaunt(o) {
  const d = document.createElement('button'); d.type = 'button'; d.className = 'taunt'; d.__o = o; d.textContent = t(o);
  const [x, y] = L.taunt; d.style.left = (x - 160 + Math.random() * 60) + 'px'; d.style.top = (y - 60 - Math.random() * 50) + 'px';
  d.addEventListener('click', () => { sfx('soft'); say(W.tauntTap); });
  $('#taunts').appendChild(d); sfx('soft');
  if (!RM) d.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 900, easing: 'ease-out' });
}
function choose(opts) {
  return new Promise(res => {
    const box = $('#choices'); box.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (o.primary ? 'gold' : 'soft');
      b.innerHTML = o.icon; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = o.label; sp.textContent = t(o.label); b.appendChild(sp);
      b.addEventListener('click', () => { gesture(); box.hidden = true; res(o.id); });
      box.appendChild(b);
    });
    box.hidden = false; setTimeout(() => box.querySelector('button').focus({ preventScroll: true }), 80);
  });
}
async function firstTaunt() {
  S.asking = true; showTaunt(TAUNTS[0]); say(W.laugh);
  for (;;) {
    const c = await choose([
      { id: 'keep', primary: true, label: W.keepBtn, icon: `<img src="${IMG}mallet.webp" alt="">` },
      { id: 'stop', label: W.stopBtn, icon: '<svg class="ic" viewBox="0 0 44 44" aria-hidden="true"><rect x="12" y="10" width="7" height="24" rx="2.5" fill="#3E5A5B"/><rect x="25" y="10" width="7" height="24" rx="2.5" fill="#3E5A5B"/></svg>' }
    ]);
    if (c === 'keep') { sfx('good'); const tt = $$('.taunt'); tt.forEach(x => x.classList.add('fade')); setTimeout(() => tt.forEach(x => x.remove()), 1200); arkGlow(); say(W.keepYes); S.asking = false; return; }
    sfx('soft'); ark.classList.remove('wob'); void ark.offsetWidth; ark.classList.add('wob');
    say(W.stopNo); await wait(2600);
  }
}
async function built() {
  $$('.taunt').forEach(x => x.remove()); $('#pile').hidden = true; plank.hidden = true;
  arkGlow(); sfx('done'); Atmos.motes(arkCentre(), 8);
  say(W.built); await anim(2200);
  await pausePoint(W.pause1, W.pause1h);
  startAnimals();
}
const arkCentre = () => { const r = arkRect(); return [r.x, r.top + r.h * 0.45]; };

/* ======================= two by two ======================= */
function placeRamp() {
  const r = arkRect(), rp = L.ramp, ramp = $('#ramp'), spot = $('#rampSpot');
  const doorX = r.left + r.w * rp.x0, doorY = r.top + r.h * ARK.hullTop + 6;
  const ang = rp.angle * Math.PI / 180, fx = doorX - Math.cos(ang) * rp.len, fy = doorY + Math.sin(ang) * rp.len;
  Object.assign(ramp.style, { left: fx + 'px', top: (fy - 12) + 'px', width: (rp.len + 24) + 'px', height: '24px', rotate: `${-rp.angle}deg` });
  S.rampFoot = [fx - 20, fy + 30]; S.rampTop = [doorX + 10, doorY];
  const R = rp.rampSpot ? rp.rampSpot.r : L.rampSpot.r;
  Object.assign(spot.style, { left: (S.rampFoot[0] - R) + 'px', top: (S.rampFoot[1] - R * 1.4) + 'px', width: 2 * R + 'px', height: 2 * R + 'px' });
}
function animalH(k) { return KINDS[k].h * L.animalScale; }
function placeHerd() {
  $$('.animal').forEach(a => {
    if (a.__boarded) return;
    const h = animalH(a.dataset.k), w = h * (MANIFEST.aspects['animal-' + a.dataset.k] || 1.2);
    const [x, y] = a.__waiting ? [S.rampFoot[0] - w * 0.15, S.rampFoot[1]] : L.herd[a.__slot];
    box(a, x, y, w, h); a.style.zIndex = String(Math.round(y)); // nearer in front (big animals are placed in the back rows)
  });
}
function startAnimals() {
  S.phase = 'animals'; app.className = app.className.replace(/phase-\w+/, 'phase-animals');
  const kinds = shuffle(Object.keys(KINDS)).slice(0, S.total);
  const herd = $('#herd'); herd.innerHTML = '';
  // only the first 2N slots, so 5 pairs stay well spaced. Big animals stand in the back rows and small ones
  // in front (with jitter, so partners are not always side by side), so no animal hides another.
  const slots = [...Array(S.total * 2).keys()].sort((p, q) => L.herd[p][1] - L.herd[q][1]);
  const order = shuffle(kinds.flatMap(k => [k, k])).map(k => ({ k, key: KINDS[k].h + Math.random() * 70 })).sort((p, q) => q.key - p.key);
  order.forEach(({ k }, i) => {
    const a = document.createElement('div'); a.className = 'animal' + (i % 2 ? ' flip' : ''); a.dataset.k = k; a.__slot = slots[i];
    a.setAttribute('role', 'button'); a.tabIndex = 0; a.setAttribute('aria-pressed', 'false'); a.setAttribute('aria-label', t(KINDS[k].n));
    a.innerHTML = `<img src="${IMG}animal-${k}.webp" alt="" draggable="false">`;
    makeDraggable(a, { enabled: () => S.phase === 'animals' && !a.__boarded && !S.boarding, targets: () => [$('#rampSpot')],
      onTap: el => { if (el.__waiting && !G.sel) { sendBack(el); return true; } return false; },
      onSelect: () => say(W.selAnimal), onDrop: el => toRamp(el) });
    herd.appendChild(a);
  });
  $('#ramp').hidden = false; $('#rampSpot').hidden = false; S.seat = null; S.pairs = 0;
  place(); beads(S.total, 0);
  if (!RM) $$('.animal').forEach((a, i) => a.animate([{ opacity: 0, translate: '0 16px' }, { opacity: 1, translate: '0 0' }], { duration: 600, delay: i * 70, easing: 'ease-out', fill: 'backwards' }));
  say(W.animals); beatClip('animals');
}
function sendBack(a) {
  if (S.seat !== a) return; a.__waiting = false; S.seat = null; a.classList.remove('waiting'); placeHerd(); sfx('step'); say(W.backToMeadow(KINDS[a.dataset.k]));
}
async function toRamp(a) {
  a.style.translate = '';
  if (!S.seat) {
    S.seat = a; a.__waiting = true; a.classList.add('waiting', 'land'); placeHerd(); sfx('step');
    setTimeout(() => a.classList.remove('land'), 450);
    say(W.findPartner(KINDS[a.dataset.k])); return;
  }
  if (a === S.seat) { placeHerd(); return; }
  if (a.dataset.k !== S.seat.dataset.k) {
    springBack(a); sfx('soft'); a.classList.remove('wob'); void a.offsetWidth; a.classList.add('wob');
    say(W.notPartner(KINDS[a.dataset.k], KINDS[S.seat.dataset.k])); return;
  }
  // a matching pair: both walk up the ramp together and into the ark
  S.boarding = true; const first = S.seat; S.seat = null; first.__waiting = false; first.classList.remove('waiting');
  [first, a].forEach(x => (x.__boarded = true));
  sfx('good');
  const h = animalH(a.dataset.k), w = h * (MANIFEST.aspects['animal-' + a.dataset.k] || 1.2);
  box(a, S.rampFoot[0] + w * 0.35, S.rampFoot[1], w, h); a.style.zIndex = first.style.zIndex;
  await anim(350);
  for (const [i, x] of [first, a].entries()) {
    const [tx, ty] = S.rampTop, cur = { l: parseFloat(x.style.left), t: parseFloat(x.style.top) };
    const dx = tx - (cur.l + w / 2), dy = ty - (cur.t + h);
    sfx('step');
    if (!RM) await x.animate([{ translate: '0 0', scale: 1, opacity: 1 }, { translate: `${dx * 0.6}px ${dy * 0.6}px`, scale: 0.8, opacity: 1, offset: 0.6 }, { translate: `${dx}px ${dy}px`, scale: 0.5, opacity: 0 }],
      { duration: 1400 - i * 200, easing: 'ease-in-out', fill: 'forwards', delay: i * 120 }).finished;
    x.style.visibility = 'hidden';
  }
  const win = $('.win.w' + (S.pairs % 3), ark); win.classList.add('lit');
  S.pairs++; beads(S.total, S.pairs); S.boarding = false;
  if (S.pairs >= S.total) return rain();
  say(W.aboard(KINDS[a.dataset.k], S.total - S.pairs));
}

/* ======================= the flood ======================= */
function setPlate(state) { $$('.plates img').forEach(im => im.classList.toggle('on', im.dataset.state === state)); }
async function rain() {
  S.phase = 'flood'; app.className = app.className.replace(/phase-\w+/, 'phase-flood'); beads(0, 0);
  $('#ramp').hidden = true; $('#rampSpot').hidden = true;
  say(W.rain); beatClip('flood');
  await anim(1000);
  Atmos.rain(true); rainSound(true);
  setPlate('flood'); Atmos.water('flood', true);
  await anim(1600);
  // the water lifts the ark from the ground; it floats
  S.arkAt = { x: L.float.x, y: L.float.y, w: L.ark.w };
  ark.style.transition = RM ? '' : 'top 3.5s cubic-bezier(.4,0,.2,1), left 3.5s cubic-bezier(.4,0,.2,1)'; place();
  await anim(3600); ark.style.transition = '';
  if (!RM) ark.classList.add('afloat');
  say(W.floated);
  await anim(5000);
  Atmos.rain(false); rainSound(false);
  S.phase = 'settle'; ark.classList.add('selectable'); ark.tabIndex = 0;
  say(W.command);
  const b = $('#actBtn'); b.innerHTML = `<span data-tx="1">${t(W.watchBtn)}</span>`; b.firstChild.__tx = W.watchBtn;
  b.onclick = settle; $('#actRow').hidden = false; b.focus({ preventScroll: true });
}
ark.addEventListener('click', () => { if (S.phase === 'settle') settle(); });
ark.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && S.phase === 'settle') { e.preventDefault(); settle(); } });
world.addEventListener('pointerdown', e => {
  if (S.phase !== 'flood' && S.phase !== 'settle') return;
  if (e.target.closest('#ark')) return;
  const [x, y] = toWorld(e.clientX, e.clientY);
  if (y > L.waterY) { Atmos.ripple(x, y); sfx('lap'); }
});
/* 11:44: by Allah's command the water went down and the ark came to rest on Judi. The child watches. */
async function settle() {
  if (S.phase !== 'settle') return; S.phase = 'rest'; app.className = app.className.replace(/phase-\w+/, 'phase-judi');
  sfx('tap'); $('#actRow').hidden = true; ark.classList.remove('selectable', 'afloat');
  setPlate('judi'); Atmos.water('judi', true);
  S.arkAt = { ...L.judi };
  ark.style.transition = RM ? '' : 'top 4.2s cubic-bezier(.45,0,.2,1), left 4.2s cubic-bezier(.45,0,.2,1), width 4.2s ease, height 4.2s ease'; place();
  say(W.rest); beatClip('judi');
  await anim(4300); ark.style.transition = '';
  ark.classList.add('land'); sfx('step'); setTimeout(() => ark.classList.remove('land'), 500);
  await anim(1400);
  await pausePoint(W.pause2, W.pause2h);
  reward();
}

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
  // a shamsa (sunburst rosette) in gold line on a solid ivory disc (in the HTML): no concentric centre and no sky
  // showing through, so nothing reads as a sun or an eye in the sky (3b.2; scholar gate 3, 2026-11-04)
  P.push(`<circle r="92"/>`, `<circle r="84"/>`, `<path d="${star(16, 80, 62)}"/>`, `<path d="${star(8, 58, 34, Math.PI / 8)}"/>`, `<path d="${star(8, 58, 34)}"/>`, `<path d="${star(8, 26, 12)}"/>`);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; P.push(`<path d="M${(70 * Math.cos(a)).toFixed(1)} ${(70 * Math.sin(a)).toFixed(1)} q ${(8 * Math.cos(a + 1.2)).toFixed(1)} ${(8 * Math.sin(a + 1.2)).toFixed(1)} ${(14 * Math.cos(a)).toFixed(1)} ${(14 * Math.sin(a)).toFixed(1)}"/>`); }
  g.innerHTML = P.join('');
  $$('path,circle', g).forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength ? p.getTotalLength() : 600)));
}
async function reward() {
  S.phase = 'end'; app.className = app.className.replace(/phase-\w+/, 'phase-end');
  buildShamsa();
  const r = ark.getBoundingClientRect(), rw = $('#reward');
  const lx = (r.left + r.width / 2) / innerWidth * 100, ly = Math.max(18, (r.top + r.height * 0.1) / innerHeight * 100 - 8);
  rw.style.setProperty('--lx', lx + '%'); rw.style.setProperty('--ly', ly + '%');
  // the shamsa draws itself in the open sky on the start side, away from the ark
  // (phone: the narration ribbon sits at the top, so the medallion goes below it, beside the peak)
  const port = G.orient === 'port', sx = port ? 21 : 28;
  rw.style.setProperty('--sx', (rtl() ? 100 - sx : sx) + '%'); rw.style.setProperty('--sy', (port ? 32 : 30) + '%');
  void rw.offsetWidth; rw.classList.add('on');
  await anim(900); sfx('done'); Atmos.motes(arkCentre(), 11);
  await anim(2600);
  S.ended = true; $('#endBody').textContent = t(W.endBody(S.pairs));
  $('#tierBox').checked = G.tier; $('#ending').hidden = false; app.classList.add('ended');
  setTimeout(() => $('#againBtn').focus({ preventScroll: true }), 80);
}
$('#againBtn').addEventListener('click', () => { G.tier = $('#tierBox').checked; sfx('tap'); reset(); });

/* ======================= reset ======================= */
function reset() {
  Object.assign(S, { row: 0, loose: false, pairs: 0, total: G.tier ? 8 : 5, seat: null, phase: 'build', arkAt: null, asking: false, boarding: false, ended: false, pauseQ: null });
  app.className = 'phase-build' + (G.bed ? ' bed' : '') + (Atmos.ok ? '' : ' nopixi');
  $('#ending').hidden = true; $('#pause').hidden = true; $('#reward').classList.remove('on'); $('#choices').hidden = true; $('#actRow').hidden = true;
  $('#taunts').innerHTML = ''; $('#herd').innerHTML = ''; $('#ramp').hidden = true; $('#rampSpot').hidden = true;
  $('#pile').hidden = false; $$('.win').forEach(w => w.classList.remove('lit')); $('.loose', ark).hidden = true; mallet.hidden = true;
  ark.classList.remove('afloat', 'selectable'); ark.style.transition = ''; ark.tabIndex = 0;
  setPlate('dry'); Atmos.reset(); rainSound(false);
  readyPlank(); beads(ROWS, 0); ark.setAttribute('aria-label', t(W.arkLabel(0)));
  say(W.intro); beatClip('build');
}

/* ======================= settings ======================= */
$('#langBtn').addEventListener('click', () => { gesture(); G.lang = rtl() ? 'en' : 'ar'; try { localStorage.setItem('islamicKidsLang', G.lang); } catch (e) { /* private */ } applyLang(); });
$('#soundBtn').addEventListener('click', () => { gesture(); G.sound = !G.sound; const b = $('#soundBtn'); b.setAttribute('aria-pressed', String(G.sound)); if (!G.sound) { rainSound(false); if (G.clip) G.clip.pause(); } else if (S.phase === 'flood') rainSound(true); });
$('#bedBtn').addEventListener('click', () => { gesture(); G.bed = !G.bed; $('#bedBtn').setAttribute('aria-pressed', String(G.bed)); app.classList.toggle('bed', G.bed); Atmos.calm(G.bed); });
$('#listenBtn').addEventListener('click', () => { gesture(); playClip(); });
addEventListener('resize', fit);
addEventListener('keydown', e => { if (e.key === 'Escape') clearSel(); });

/* ======================= atmosphere canvas (PixiJS). Decoration only: the game is whole without it. ======================= */
const Atmos = (() => {
  const A = { ok: false };
  let px = null, layers = {}, tex = {}, state = { rain: false, water: null, still: RM }, drops = [], splashes = [], motes = [], ripples = [], dispSprite = null;
  const canvas = $('#atmos');
  function softTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return PIXI.Texture.from(c); }
  async function init() {
    if (!window.PIXI) throw new Error('no PIXI');
    px = new PIXI.Application();
    await px.init({ canvas, width: L.w, height: L.h, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(2, (devicePixelRatio || 1) * G.s), preference: 'webgl', autoStart: false, sharedTicker: false });
    tex.drop = softTex(4, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(235,244,250,0)'); gr.addColorStop(1, 'rgba(235,244,250,.95)'); g.fillStyle = gr; g.fillRect(1, 0, 2, h); });
    tex.ring = softTex(128, 48, (g) => { g.strokeStyle = 'rgba(240,248,255,.95)'; g.lineWidth = 3; g.beginPath(); g.ellipse(64, 24, 58, 18, 0, 0, Math.PI * 2); g.stroke(); });
    tex.mote = softTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.25, 'rgba(240,200,110,.7)'); gr.addColorStop(1, 'rgba(224,183,92,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    tex.disp = softTex(256, 256, (g) => { const im = g.createImageData(256, 256); for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const v = 128 + 60 * Math.sin(x / 256 * Math.PI * 6 + Math.sin(y / 256 * Math.PI * 4) * 1.5) + 30 * Math.sin(y / 256 * Math.PI * 10); const i = (y * 256 + x) * 4; im.data[i] = v; im.data[i + 1] = 128 + 50 * Math.cos(y / 256 * Math.PI * 8 + x / 40); im.data[i + 2] = 128; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); });
    tex.disp.source.addressMode = 'repeat';
    dispSprite = new PIXI.Sprite(tex.disp); dispSprite.texture.source.addressMode = 'repeat'; dispSprite.scale.set(2.2, 1.2);
    const filter = new PIXI.DisplacementFilter({ sprite: dispSprite, scale: { x: 10, y: 4 } });
    layers.water = new PIXI.Container(); layers.water.filters = [filter];
    layers.waterMask = new PIXI.Graphics(); layers.water.mask = layers.waterMask;
    layers.splash = new PIXI.Container(); layers.rain = new PIXI.Container(); layers.motes = new PIXI.Container();
    px.stage.addChild(dispSprite, layers.water, layers.waterMask, layers.splash, layers.rain, layers.motes);
    dispSprite.renderable = false;
    for (let i = 0; i < 280; i++) { const s = new PIXI.Sprite(tex.drop); s.anchor.set(0.5, 1); s.rotation = 0.16; layers.rain.addChild(s); drops.push(s); seedDrop(s, true); }
    layers.rain.alpha = 0;
    A.ok = true; app.classList.remove('nopixi');
    resize(); loop();
  }
  function seedDrop(s, any) { s.x = Math.random() * (L.w + 200) - 100; s.y = any ? Math.random() * L.h : -Math.random() * 120; s.v = 900 + Math.random() * 500; s.scale.set(1, 0.7 + Math.random() * 0.8); s.alpha = 0.25 + Math.random() * 0.45; }
  function plateSprite(state) { const im = $(`.plates img[data-state="${state}"]`); if (!im || !im.complete || !im.naturalWidth) return null; const sp = new PIXI.Sprite(PIXI.Texture.from(im)); sp.width = L.w; sp.height = L.h; return sp; }
  function setMask(y) { layers.waterMask.clear().rect(0, y - 4, L.w, L.h - y + 4).fill(0xffffff); }
  function resize() {
    if (!A.ok) return;
    px.renderer.resolution = Math.min(2, (devicePixelRatio || 1) * G.s);
    px.renderer.resize(L.w, L.h); canvas.style.width = L.w + 'px'; canvas.style.height = L.h + 'px';
    if (state.water) water(state.water, true, true);
    wake();
  }
  function water(which, on, instant) {
    state.water = on ? which : null; if (!A.ok) return;
    const old = layers.water.children.slice();
    if (on) {
      const sp = plateSprite(which); if (!sp) { setTimeout(() => water(which, on, instant), 400); return; }
      sp.alpha = instant || RM ? 1 : 0; layers.water.addChild(sp); sp.__in = true;
      // flood: the moving water starts at the ark's waterline, so the hull sits in the water, not on it
      setMask(which === 'judi' ? L.judiWaterY : L.float.y - L.ark.w * ARK.aspect * (1 - ARK.waterline));
    }
    old.forEach(o => { o.__out = true; if (instant || RM) { o.destroy(); } });
    wake();
  }
  function rain(on) { state.rain = on; if (A.ok) wake(); }
  function ripple(x, y) { if (!A.ok) return; const r = new PIXI.Sprite(tex.ring); r.anchor.set(0.5); r.x = x; r.y = y; r.scale.set(0.2); r.life = 0; layers.splash.addChild(r); ripples.push(r); wake(); }
  function motesAt([x, y], n) {
    if (!A.ok || G.bed) return;
    for (let i = 0; i < n; i++) { const m = new PIXI.Sprite(tex.mote); m.anchor.set(0.5); m.blendMode = 'add'; m.x = x + (Math.random() - 0.5) * 160; m.y = y + (Math.random() - 0.3) * 60; m.scale.set(0.3 + Math.random() * 0.4); m.life = 0; m.max = 2.6 + Math.random() * 1.6; m.vx = (Math.random() - 0.5) * 14; m.alpha = 0; layers.motes.addChild(m); motes.push(m); }
    wake();
  }
  function dust(row) { const r = arkRect(); motesAt([r.x, r.top + r.h * (ARK.keel - (row - 0.5) * (ARK.keel - ARK.hullTop) / ROWS)], 4); }
  let raf = 0, last = 0;
  function wake() { if (A.ok && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function loop() { wake(); }
  function frame(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; let live = false;
    const still = state.still || G.bed;
    // rain fades in and out; in reduced motion it is drawn once, still
    const ra = layers.rain.alpha, rt = state.rain ? (G.bed ? 0.5 : 0.9) : 0;
    if (Math.abs(ra - rt) > 0.01) { layers.rain.alpha += Math.sign(rt - ra) * Math.min(Math.abs(rt - ra), dt * 0.6); live = true; }
    if (layers.rain.alpha > 0.01 && !still) {
      live = true;
      drops.forEach(s => { s.y += s.v * dt; s.x += s.v * dt * 0.16; if (s.y > L.h + 40) { if (state.water && Math.random() < 0.5) splash(s.x, Math.max(L.waterY + 10, L.waterY + Math.random() * (L.h - L.waterY))); seedDrop(s); } });
    }
    // water layers crossfade, the displacement drifts slowly (never faster than the 3 s rule allows)
    layers.water.children.slice().forEach(o => {
      if (o.__out) { o.alpha -= dt * 0.35; if (o.alpha <= 0) o.destroy(); else live = true; }
      else if (o.__in && o.alpha < 1) { o.alpha = Math.min(1, o.alpha + dt * 0.33); live = true; }
    });
    if (layers.water.children.length && !still) { dispSprite.x -= dt * 14; dispSprite.y += dt * 3; live = true; }
    ripples = ripples.filter(r => { r.life += dt; r.scale.set(0.2 + r.life * 0.9); r.alpha = Math.max(0, 1 - r.life / 1.6); if (r.life > 1.6) { r.destroy(); return false; } live = true; return true; });
    splashes = splashes.filter(r => { r.life += dt; r.scale.set(0.05 + r.life * 0.35, (0.05 + r.life * 0.35) * 0.6); r.alpha = Math.max(0, 0.6 - r.life); if (r.life > 0.6) { r.destroy(); return false; } live = true; return true; });
    motes = motes.filter(m => { m.life += dt; const k = m.life / m.max; m.y -= dt * 26; m.x += m.vx * dt; m.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 0.9); if (k >= 1) { m.destroy(); return false; } live = true; return true; });
    px.render();
    if (live) raf = requestAnimationFrame(frame);
  }
  function splash(x, y) { if (splashes.length > 40) return; const r = new PIXI.Sprite(tex.ring); r.anchor.set(0.5); r.x = x; r.y = y; r.life = 0; r.scale.set(0.05); layers.splash.addChild(r); splashes.push(r); }
  function reset() { if (!A.ok) return; state.rain = false; layers.rain.alpha = 0; water(null, false, true); motes.forEach(m => m.destroy()); motes = []; wake(); }
  function calm() { if (A.ok) wake(); }
  Object.assign(A, { init, resize, water: (w, on, i) => water(w, on, i), rain, ripple, motes: motesAt, dust, reset, calm });
  return A;
})();

/* ======================= boot ======================= */
async function boot() {
  try { MANIFEST = await (await fetch(IMG + 'manifest.json')).json(); } catch (e) { /* aspects fall back to defaults */ }
  if (MANIFEST.ark) Object.assign(ARK, MANIFEST.ark);
  if (MANIFEST.aspects && MANIFEST.aspects['ark-whole']) ARK.aspect = 1 / MANIFEST.aspects['ark-whole'];
  app.classList.add('nopixi');
  applyLang();
  reset();
  try { await Atmos.init(); } catch (e) { app.classList.add('nopixi'); }
  window.__nuh = { S, G, L: () => L, Atmos, W, KINDS, say }; // for the headless play-through and wording checks
}
boot();
})();
