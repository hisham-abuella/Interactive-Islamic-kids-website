/* Game 05, The Garden of Choices (Adam): the fifth painted game (2026-11-12).
   Painted DOM planes + DOM HUD; one PixiJS canvas (decoration only) for motes. All words live in the DOM (Arabic
   shaping, RTL). No browser TTS: the only voice is Baba's recorded story narration (Adam slides 5, 6, 9 and 16),
   played as single sentences cut inside recorded pauses; never slide 7 (the slip: the AR dual verbs are in doubt),
   never slide 8 or 11 (they contain the dua). Adam's dua (7:23) is on screen only and never voiced.
   No music: one- or two-note chimes and natural sounds. Systems reused from games/ibrahim/ibrahim.js. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const IMG = '../images/games/adam/';
const AUDIO = '../audio/prophet-adam/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const G = { lang: 'en', sound: true, bed: false, tier: false, orient: null, s: 1, ox: 0, oy: 0, sel: null, clip: null, gesture: false };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }
const anim = ms => wait(RM ? Math.min(ms, 200) : G.bed ? ms * 1.25 : ms);
// reading time is never shortened by reduced motion (only movement is)
const read = ms => wait(G.bed ? ms * 1.25 : ms);
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const rtl = () => G.lang === 'ar';

/* ======================= layout: logical world coordinates, one table per composition =======================
   Measured against the shipped plates (pixels of the exported WebP). Every entry is [x, y(bottom), width] unless noted.
   garden: the five fruits hang on the allowed trees (never on the one tree), the basket sits on the open lawn,
   tree: the one tree's box [cx, cy, w, h]. court: the three beds, the jug's rest, the ledge for Mama's pot, the
   ball's start, the cat asleep in a corner, and where the shards land. */
const LAYOUT = {
  land: {
    // plate-garden-land (seed 1120712) and plate-court-land (seed 1224903), 1240 x 791
    w: 1240, h: 791,
    fruits: [[150, 330, 84, 'pomegranate'], [300, 245, 80, 'pomegranate'], [215, 425, 80, 'pomegranate'], [1040, 470, 92, 'dates'], [1165, 330, 92, 'dates']],
    tree: [625, 310, 340, 400], crown: [445, 105, 805, 380], basket: [290, 782, 230],
    beds: [[292, 614, 104], [440, 614, 104], [636, 614, 104]], jug: [520, 742, 112], ball: [760, 728, 72],
    pot: [1060, 572, 118], cat: [800, 590, 150], shards: [[950, 668], [1048, 690], [1148, 672]], leaves: [1050, 704, 270]
  },
  port: {
    // plate-garden-port (Qwen edit 699657 of seed 419717, bark marks removed) and plate-court-port (seed 623526), 690 x 1327;
    // the phone shows x ~40-650
    w: 690, h: 1327,
    fruits: [[165, 400, 70, 'pomegranate'], [105, 495, 72, 'pomegranate'], [62, 420, 62, 'pomegranate'], [530, 438, 76, 'figs'], [612, 486, 76, 'figs']],   // on the pomegranate and fig trees' own leaves, below the intro ribbon; none on or near the one tree (scholar 3.1)
    tree: [350, 590, 270, 420], crown: [215, 430, 490, 665], basket: [345, 1195, 210],
    beds: [[140, 928, 104], [338, 928, 104], [530, 928, 104]], jug: [150, 1110, 100], ball: [320, 1120, 68],
    pot: [520, 1070, 112], cat: [430, 1215, 120], shards: [[420, 1120], [520, 1150], [610, 1118]], leaves: [520, 1160, 240]
  }
};
let MANIFEST = { aspects: {} };

/* ======================= words (gate-1 approved text kept as approved; new lines listed in the spec) ======================= */
/* only what grows on the painted trees: pomegranates and dates (landscape), pomegranates and figs (portrait) */
const FRUIT = {
  pomegranate: { en: 'A pomegranate', ar: 'رمّانة' },
  dates: { en: 'Some dates', ar: 'بعض التمر' },
  figs: { en: 'Two figs', ar: 'حبّتا تين' }
};
const NFRUIT = 5;
const P = {};   // the story page's own sentences, read from #pageText (copied by build.py)
const W = {
  next: { en: 'Next', ar: 'التالي' },
  tierAsk: { en: 'Grown-up: before tapping, ask your child to say why.', ar: 'للوالدين: قبل الاختيار، اطلبوا من الطفل أن يقول السبب.' },
  tierStartQ: { en: 'Before we start: what is one mistake you made this week? What did you do about it?', ar: 'قبل أن نبدأ: ما خطأ واحد وقعت فيه هذا الأسبوع؟ وماذا فعلت بعده؟' },
  tierStartH: { en: 'Idea: the grown-up can share one of their own first. Everybody makes mistakes.', ar: 'فكرة: يمكن أن يبدأ الكبير بخطأ من أخطائه. كلنا نخطئ.' },
  intro: { en: 'Prophet Adam and Hawa lived in Jannah, a beautiful garden with everything they could want. Gather five fruits from the trees into the basket: drag each one, or tap it.',
    ar: 'عاش النبي آدم عليه السلام وحواء في الجنة، حديقة جميلة فيها كل ما يريدان. اجمع خمس ثمرات من الأشجار في السلة: اسحب كل واحدة أو المسها.' },
  got: { en: 'into the basket.', ar: 'في السلة.' },
  missBasket: { en: 'Bring it down into the basket.', ar: 'ضعها في السلة.' },
  treeAsk: { en: 'One tree in the garden was different. Tap the tall tree that stands by itself.', ar: 'كانت في الحديقة شجرة واحدة مختلفة. المس الشجرة العالية التي تقف وحدها.' },
  treeMore: { en: 'This tree has no fruit to take. Gather the fruit from the other trees.', ar: 'ليس في هذه الشجرة ثمر نأخذه. اجمع الثمر من الأشجار الأخرى.' },
  /* the slip is narrated, never played: the child never picks or eats from the tree (gate 1) */
  sorry: { en: 'Adam and Hawa turned to Allah and asked His forgiveness: they said sorry to Allah. We call this istighfar, and we say: Astaghfirullah.',
    ar: 'ندم آدم وحواء، فتوجّها إلى الله واستغفراه. وهذا اسمه الاستغفار، ونقول: أستغفر الله.' },
  readAsk: { en: 'This is the dua they said. Read it together, then tap the button.', ar: 'هذا هو الدعاء الذي قالاه. اقرآه معاً، ثم المسا الزر.' },
  readBtn: { en: 'We read it together', ar: 'قرأناه معاً' },
  pause1Q: { en: "Adam and Hawa asked Allah's forgiveness straight away. Why is it good to say sorry quickly when we make a mistake?", ar: 'استغفر آدم وحواء الله على الفور. لماذا من الجيد أن نعتذر بسرعة حين نخطئ؟' },
  pause1H: { en: 'Idea: saying sorry quickly stops a small mistake growing, and Allah loves to forgive.', ar: 'فكرة: الاعتذار السريع يمنع الخطأ الصغير من أن يكبر، والله يحب أن يغفر.' },
  toCourt: { en: 'Next: our own garden', ar: 'التالي: حديقتنا نحن' },
  courtIntro: { en: 'Here is your own garden on earth. The little plants are thirsty: drag the water jug to each one, or tap a plant.',
    ar: 'هذه حديقتك أنت على الأرض. النبتات الصغيرة عطشى: اسحب إبريق الماء إلى كل واحدة، أو المس النبتة.' },
  watered: { en: 'It grew!', ar: 'لقد نمت!' },
  missJug: { en: 'Bring the jug to a little plant.', ar: 'قرّب الإبريق من نبتة صغيرة.' },
  play: { en: 'All watered. Time to play: tap the ball!', ar: 'سُقيت كلها. حان وقت اللعب: المس الكرة!' },
  crash: { en: "Oh no! The ball knocked over Mama's clay pot and it broke. Nobody saw. What will you do?", ar: 'أوه، لا! أوقعت الكرة أصيص أمي الفخاري فانكسر. لم يرَ أحد. ماذا ستفعل؟' },
  optTruth: { en: 'Tell the truth and help fix it', ar: 'أقول الحقيقة وأساعد في إصلاحه' },
  optHide: { en: 'Hide the pieces under the leaves', ar: 'أخبئ القطع تحت الأوراق' },
  optCat: { en: 'Say the cat did it', ar: 'أقول إن القطة فعلت ذلك' },
  hide: { en: 'The pieces are hidden, but the garden feels gloomy, and so does your heart. Hiding a mistake makes it heavier. Adam did not hide his mistake; he turned to Allah and asked forgiveness. Let us choose again.',
    ar: 'اختفت القطع، لكن الحديقة صارت حزينة، وقلبك أيضاً. إخفاء الخطأ يجعله أثقل. لم يُخفِ آدم خطأه، بل استغفر الله. لنختر مرة أخرى.' },
  cat: { en: 'The cat was fast asleep the whole time. It would be blamed for something it did not do. That is not fair, and it is not true. Let us choose again.',
    ar: 'كانت القطة نائمة طوال الوقت. ستُلام على شيء لم تفعله. هذا ليس عدلاً، وليس صدقاً. لنختر مرة أخرى.' },
  again: { en: 'Choose again', ar: 'لنختر مرة أخرى' },
  truth: { en: 'That is brave! Now let us fix it: drag the pieces back onto the pot, or tap each piece.', ar: 'هذه شجاعة! والآن لنصلحه: اسحب القطع إلى الأصيص، أو المس كل قطعة.' },
  piece: { en: 'It fits.', ar: 'في مكانها.' },
  missPiece: { en: 'Bring the piece back to the pot.', ar: 'أعِد القطعة إلى الأصيص.' },
  fixed: { en: 'Mended! Now, what will you say to Mama?', ar: 'تم إصلاحه! والآن، ماذا ستقول لأمي؟' },
  optSorry: { en: 'Sorry, Mama. I will be more careful.', ar: 'آسف يا أمي، سأكون أكثر حذراً.' },
  optBig: { en: 'It is not a big deal.', ar: 'ليس أمراً مهماً.' },
  big: { en: 'Mama loved that pot, so it matters to her. A real sorry shows we care. Let us choose again.', ar: 'أمي كانت تحب ذلك الأصيص، فهو مهم لها. الاعتذار الصادق يُظهر أننا نهتم. لنختر مرة أخرى.' },
  hug: { en: 'Mama smiles and forgives you. And we can ask Allah to forgive us too, like Adam: we say Astaghfirullah.', ar: 'ابتسمت أمي وسامحتك. ونستغفر الله أيضاً كما فعل آدم: نقول أستغفر الله.' },
  sayIt: { en: 'We said it together', ar: 'قلناها معاً' },
  pause2Q: { en: 'When you make a mistake, what are the three steps?', ar: 'حين تخطئ، ما الخطوات الثلاث؟' },
  pause2H: { en: 'Own it, say sorry, put it right. And ask Allah to forgive us.', ar: 'أعترف به، وأعتذر، وأصلحه. وأستغفر الله.' },
  evening: { en: 'Evening comes to your garden. The plants are growing, and the pot is whole again.', ar: 'جاء المساء إلى حديقتك. النبتات تنمو، والأصيص سليم من جديد.' },
  endB: { en: "You learned Adam's dua, and when an accident happened you told the truth, fixed it and said sorry.", ar: 'تعلّمت دعاء آدم، وحين وقع الحادث قلت الحقيقة وأصلحت الخطأ واعتذرت.' },
  beadsLabel: { en: 'The story so far', ar: 'القصة حتى الآن' },
  fruitLabel: n => ({ en: `${n.en}. Drag it to the basket, or tap it.`, ar: `${n.ar}. اسحبها إلى السلة أو المسها.` }),
  bedLabel: i => ({ en: `Little plant ${i}`, ar: `النبتة الصغيرة ${['١', '٢', '٣'][i - 1]}` }),
  shardLabel: i => ({ en: `Piece ${i} of the pot`, ar: `القطعة ${['١', '٢', '٣'][i - 1]} من الأصيص` })
};
/* Baba's recorded story narration: single sentences, cut inside recorded pauses (ffmpeg silencedetect, 2026-11-12)
   and checked by Whisper large-v3-turbo (heard exactly the intended words, nothing before or after). Never slide 7
   (the slip), 8 (contains the dua) or 11 (the dua). Times are filled from the measurement (see the spec). */
const CLIPS = {
  jannah: { slide: 5, en: [5.1, 9.05], ar: [3.28, 5.95] },     // They lived happily together in Jannah, which means paradise. / عاشا معاً بسعادة في الجنة
  rule: { slide: 6, en: [0, 6.9], ar: [0, 8.6] },              // Allah told Adam and Hawa they could enjoy everything in Jannah, but ... ONE tree they must not go near.
  earth: { slide: 9, en: [0, 9.5], ar: [0, 10.82] },           // Adam and Hawa were sent to live on Earth. Allah told them ... including you!
  remember: { slide: 16, en: [5.4, 10.5], ar: [5.57, 10.4] }  // Remember, when you make a mistake, say sorry to Allah - He loves to forgive! / تذكر، عندما تخطئ، استغفر الله - فهو يحب أن يغفر!
};

/* ======================= sound: Web Audio, no music ======================= */
let AC = null, master = null, airNode = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); master = AC.createGain(); master.connect(AC.destination); }
  if (AC.state === 'suspended' && G.sound) AC.resume();
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
function hush(a, n, lpF, d, peak, hp) { // a soft swell of filtered noise: water, leaves, a breath of air
  const s = a.createBufferSource(); s.buffer = noise(a); const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = lpF;
  const g = a.createGain(); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(peak, n + d * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, n + d);
  let chain = s.connect(lp);
  if (hp) { const h = a.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = hp; chain = chain.connect(h); }
  chain.connect(g).connect(master); s.start(n, Math.random()); s.stop(n + d + 0.05);
}
function sfx(kind) {
  const v = vol(); if (!v) return; const a = ac(); if (!a) return; const n = a.currentTime;
  if (kind === 'good') { bell(a, 659, n, 1.4, 0.07 * v); bell(a, 988, n + 0.12, 1.6, 0.05 * v); }
  else if (kind === 'done') { bell(a, 523, n, 2.4, 0.07 * v); bell(a, 784, n + 0.35, 2.8, 0.055 * v); }
  else if (kind === 'soft') bell(a, 392, n, 1.1, 0.045 * v);
  else if (kind === 'tap') bell(a, 1320, n, 0.25, 0.018 * v);
  else if (kind === 'pour') hush(a, n, 2600, 0.9, 0.09 * v, 700);          // water from the jug
  else if (kind === 'rustle') hush(a, n, 3200, 0.6, 0.07 * v, 900);        // leaves
  else if (kind === 'roll') hush(a, n, 300, 0.9, 0.16 * v);                // the ball rolling on earth
  else if (kind === 'thud') { hush(a, n, 220, 0.35, 0.3 * v); bell(a, 330, n + 0.05, 0.4, 0.02 * v); }   // a soft, muffled knock: never a crash
}
function air(level) { // the garden breathing: a slow, very low noise swell (no melody)
  const a = ac(); if (!a) return;
  if (!airNode) {
    const s = a.createBufferSource(); s.buffer = noise(a); s.loop = true;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    // the swell is a gain stage AFTER the level, so at level 0 there is no pulse at all (scholar's Yusuf review)
    const g = a.createGain(); g.gain.value = 0;
    const sw = a.createGain(); sw.gain.value = 1;
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.06; lg.gain.value = 0.3; lfo.connect(lg).connect(sw.gain); lfo.start();
    s.connect(lp).connect(g).connect(sw).connect(master); s.start(); airNode = { s, g, sw, lfo };
  }
  const t0 = a.currentTime, v = level * 0.02 * vol();
  airNode.g.gain.cancelScheduledValues(t0);
  airNode.g.gain.setValueAtTime(airNode.g.gain.value, t0);
  airNode.g.gain.setTargetAtTime(v, t0, v ? 1.6 : 0.15);
}
/* Sounds off: the master fades to exactly 0 and the AudioContext is suspended, so nothing at all reaches the speakers */
let muteTimer = 0;
function setMuted(off) {
  const a = ac(); if (!a) return; clearTimeout(muteTimer);
  master.gain.cancelScheduledValues(a.currentTime); master.gain.setValueAtTime(master.gain.value, a.currentTime);
  if (off) { master.gain.linearRampToValueAtTime(0, a.currentTime + 0.25); muteTimer = setTimeout(() => { if (!G.sound && AC.state === 'running') AC.suspend(); }, 400); }
  else { if (AC.state === 'suspended') AC.resume(); master.gain.linearRampToValueAtTime(1, a.currentTime + 0.25); }
}
/* measurement hook for the headless audio trace: RMS of the master output in dBFS */
let probe = null;
function levelDb() {
  const a = ac(); if (!a) return -Infinity;
  if (!probe) { probe = a.createAnalyser(); probe.fftSize = 8192; master.connect(probe); }
  if (a.state !== 'running') return -Infinity;   // suspended: no samples reach the output at all
  const d = new Float32Array(probe.fftSize); probe.getFloatTimeDomainData(d);
  let e = 0; for (const x of d) e += x * x; const rms = Math.sqrt(e / d.length);
  return rms > 0 ? 20 * Math.log10(rms) : -Infinity;
}

/* Baba's voice: the recorded story clip for this beat (never TTS, never scripture), one sentence */
let clipBeat = null, clipTimer = 0;
function stopClip() { if (G.clip) { G.clip.pause(); G.clip = null; } clearInterval(clipTimer); $('#listenBtn').classList.remove('playing'); }
function setClip(beat) { clipBeat = beat; $('#listenBtn').hidden = !(beat in CLIPS); stopClip(); pendingClip = null; }
function playClip() {
  if (!(clipBeat in CLIPS)) return;
  const b = $('#listenBtn');
  if (G.clip && !G.clip.paused) { stopClip(); return; }
  const c = CLIPS[clipBeat], [from, to] = c[G.lang];
  const au = new Audio(`${AUDIO}${G.lang}/slide-${c.slide}.mp3`); G.clip = au;
  const start = () => { try { au.currentTime = from; } catch (e) { /* not seekable yet */ } au.play().then(() => b.classList.add('playing')).catch(() => {}); };
  if (au.readyState >= 1) start(); else au.addEventListener('loadedmetadata', start, { once: true });
  clearInterval(clipTimer);
  clipTimer = setInterval(() => { // stop inside the recorded pause, with a short fade, so nothing of the next sentence is heard
    if (G.clip !== au) { clearInterval(clipTimer); return; }
    if (au.currentTime >= to - 0.08) au.volume = Math.max(0, au.volume - 0.5);   // the fade sits inside the pause (Arabic pauses are short)
    if (au.currentTime >= to || au.ended) { au.pause(); clearInterval(clipTimer); b.classList.remove('playing'); }
  }, 40);
  au.addEventListener('ended', () => b.classList.remove('playing'));
}
let pendingClip = null;
function maybeAutoClip() { if (pendingClip && G.sound) { const b = pendingClip; pendingClip = null; if (clipBeat === b) playClip(); } }
function beatClip(beat) { setClip(beat); if (G.gesture && G.sound) playClip(); else pendingClip = beat; }
function gesture() { if (!G.gesture) { G.gesture = true; ac(); air(1); maybeAutoClip(); } }

/* ======================= world fit, RTL mirror ======================= */
const world = $('#world'), app = $('#app');
let L = LAYOUT.land;
function fit() {
  const vw = innerWidth, vh = innerHeight;
  const orient = vw / vh < 0.8 ? 'port' : 'land';
  const changed = orient !== G.orient; G.orient = orient; L = LAYOUT[orient];
  const s = Math.max(vw / L.w, vh / L.h);
  G.s = s; G.ox = (vw - L.w * s) / 2; G.oy = Math.min(0, (vh - L.h * s) * (orient === 'port' ? 0.5 : 0.45));
  world.style.width = L.w + 'px'; world.style.height = L.h + 'px';
  world.style.transform = rtl() ? `translate(${G.ox + L.w * s}px,${G.oy}px) scale(${-s},${s})` : `translate(${G.ox}px,${G.oy}px) scale(${s})`;
  world.classList.toggle('rtl', rtl());
  const f = $('.frame'); f.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  [['.f1', 10], ['.f2', 17]].forEach(([c, m]) => { const r = $(c, f); r.setAttribute('x', m); r.setAttribute('y', m); r.setAttribute('width', Math.max(0, vw - 2 * m)); r.setAttribute('height', Math.max(0, vh - 2 * m)); });
  if (changed) { loadPlates(); Atmos.resize(); }
  place();
}
function loadPlates() {
  $$('.plates img').forEach(im => { const src = `${IMG}plate-${im.dataset.state}-${G.orient}.webp`; if (!im.src.endsWith(src.replace(/^(\.\.\/)+/, ''))) im.src = src; });
}
const asp = (n, d = 1) => MANIFEST.aspects[n] || d;
/* a prop standing on the ground: [x, bottom y, width] -> a box whose bottom-centre is at (x, y) */
function stand(el, [x, y, w], n, extraH = 0) { const h = w / asp(n, 1); Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - h - extraH) + 'px', width: w + 'px', height: (h + extraH) + 'px' }); return h; }

/* ======================= state ======================= */
const S = {};
function place() {
  // round 1: fruit on the allowed trees, the basket, the one tree
  $$('.fruit').forEach(f => {
    const i = +f.dataset.i; const [x, y, w, k] = L.fruits[i];
    if (f.dataset.k !== k) { f.dataset.k = k; f.querySelector('img').src = `${IMG}fruit-${k}.webp`; label(f, W.fruitLabel(FRUIT[k])); }   // a turn of the device: the fruit of this composition's trees
    const h = w / asp('fruit-' + k, 1); Object.assign(f.style, { left: (x - w / 2) + 'px', top: (y - h / 2) + 'px', width: w + 'px', height: h + 'px' });
  });
  const [tx, ty, tw, th] = L.tree; Object.assign($('#tree').style, { left: (tx - tw / 2) + 'px', top: (ty - th / 2) + 'px', width: tw + 'px', height: th + 'px' });
  stand($('#basket'), L.basket, 'basket');
  // round 2: the beds, the jug, the ball, Mama's pot, the cat, the shards
  $$('.bed').forEach(b => { const i = +b.dataset.i; const [x, y, w] = L.beds[i]; stand(b, [x, y, w], b.dataset.grown ? 'bloom' : 'sprout'); });
  stand($('#jug'), L.jug, 'jug');
  // the ball rolls up to the foot of Mama's pot
  stand($('#ball'), S.ballRolled ? [L.pot[0] - L.pot[2] * 0.6, L.pot[1] + 6, L.ball[2]] : L.ball, 'ball');
  stand($('#potspot'), L.pot, 'pot');
  stand($('#cat'), L.cat, 'cat');
  stand($('#leaves'), L.leaves, 'leaves');
  placeShards();
  $$('.chip').forEach(ch => (ch.style.scale = rtl() ? '-1 1' : ''));   // words inside the mirrored world read the right way round
}

/* ======================= beads (progress through the story, no numbers, no deeds) ======================= */
const NBEADS = 8;
function beads(done) {
  const b = $('#beads'); b.hidden = false; b.innerHTML = '';
  for (let i = 0; i < NBEADS; i++) { const d = document.createElement('span'); d.className = 'bead' + (i < done ? ' full' : i === done ? ' now' : ''); b.appendChild(d); }
  b.setAttribute('aria-label', t(W.beadsLabel)); S.beads = done;
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
  $$('[data-lbl]').forEach(el => el.setAttribute('aria-label', t(el.__lbl)));
  if (S.pauseQ) { $('#pauseQ').textContent = t(S.pauseQ.q); $('#pauseHint').textContent = t(S.pauseQ.h); }
  if (S.ended) $('#endBody').textContent = t(W.endB);
  $('#beads').setAttribute('aria-label', t(W.beadsLabel));
  stopClip();
  fit();
}
function label(el, o) { el.__lbl = o; el.dataset.lbl = '1'; el.setAttribute('aria-label', t(o)); }

/* ======================= drag, tap, keyboard ======================= */
function makeDraggable(el, opts) {
  let st = null;
  const sc = () => G.s, fl = () => (rtl() ? -1 : 1);
  el.addEventListener('pointerdown', e => {
    if (!opts.enabled()) return; e.preventDefault(); gesture();
    st = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; el.setPointerCapture(e.pointerId);
    sfx('tap');
  });
  el.addEventListener('pointermove', e => {
    if (!st || e.pointerId !== st.id) return;
    const dx = (e.clientX - st.x) / sc() * fl(), dy = (e.clientY - st.y) / sc();
    if (!st.moved && Math.hypot(e.clientX - st.x, e.clientY - st.y) < 8) return;
    if (!st.moved) { st.moved = true; el.classList.add('dragging'); opts.targets().forEach(tg => tg.classList.add('target-on')); }
    el.style.translate = `${(st.bx || 0) + dx}px ${(st.by || 0) + dy}px`;
    const hot = hit(e.clientX, e.clientY, opts.targets()); opts.targets().forEach(tg => tg.classList.toggle('hot', tg === hot));
  });
  const end = e => {
    if (!st || e.pointerId !== st.id) return; const moved = st.moved; st = null;
    el.classList.remove('dragging'); opts.targets().forEach(tg => tg.classList.remove('target-on', 'hot'));
    if (!moved) { return opts.onTap(el); }
    const tg = hit(e.clientX, e.clientY, opts.targets());
    if (tg) opts.onDrop(el, tg); else { springBack(el, opts.home ? opts.home(el) : '0px 0px'); opts.onMiss && opts.onMiss(el); }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  // keyboard and screen readers: a click without a pointer (Enter, Space) does the tap action
  el.addEventListener('click', e => { if (e.detail === 0 && opts.enabled()) { gesture(); opts.onTap(el); } });
}
function hit(cx, cy, targets, pad = 50) {
  let best = null, bd = 1e9;
  targets.forEach(tg => { if (tg.hidden) return; const r = tg.getBoundingClientRect(); if (cx < r.left - pad || cx > r.right + pad || cy < r.top - pad || cy > r.bottom + pad) return; const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2)); if (d < bd) { bd = d; best = tg; } });
  return best;
}
function springBack(el, home = '0px 0px') {
  const from = el.style.translate || '0px 0px';
  el.style.translate = home === '0px 0px' ? '' : home;
  if (!RM) el.animate([{ translate: from }, { translate: home }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
}
function wob(el) { el.classList.remove('wob'); void el.offsetWidth; el.classList.add('wob'); }
function land(el) { el.classList.remove('land'); void el.offsetWidth; el.classList.add('land'); }
/* glide an element (in world space) onto the centre of a target, then call back */
function glideTo(el, tg) {
  const a = el.getBoundingClientRect(), b = tg.getBoundingClientRect();
  const cur = (el.style.translate || '0px 0px').split(' ').map(parseFloat);
  const dx = ((b.left + b.width / 2) - (a.left + a.width / 2)) / G.s * (rtl() ? -1 : 1), dy = ((b.top + b.height / 2) - (a.top + a.height / 2)) / G.s;
  el.classList.add('glide'); el.style.translate = `${(cur[0] || 0) + dx}px ${(cur[1] || 0) + dy}px`;
}

/* ======================= choices ======================= */
const ICON = {
  truth: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linejoin="round"><path d="M8 12h32v18H22l-8 8v-8H8z"/><path d="M17 21h14" stroke-linecap="round"/></svg>',
  hide: () => `<img src="${IMG}leaves.webp" alt="">`,
  cat: () => `<img src="${IMG}cat.webp" alt="">`,
  sorry: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linejoin="round"><path d="M24 39C12 31 7 25 7 18a8 8 0 0 1 17-4 8 8 0 0 1 17 4c0 7-5 13-17 21z" fill="#E0B75C" fill-opacity=".45"/></svg>',
  shrug: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linecap="round"><path d="M10 30h28"/><path d="M14 22h20" opacity=".5"/></svg>'
};
function choose(opts) {
  return new Promise(res => {
    const bx = $('#choices'); bx.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn soft'; b.dataset.id = o.id;
      b.innerHTML = typeof o.icon === 'function' ? o.icon() : o.icon; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = o.label; sp.textContent = t(o.label); b.appendChild(sp);
      b.addEventListener('click', () => { gesture(); bx.hidden = true; res(o.id); });
      bx.appendChild(b);
    });
    // shuffled, and all look alike: the choice is a real one (chance never decides a reward)
    const kids = [...bx.children]; for (let i = kids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); bx.appendChild(kids[j]); kids.splice(j, 1); }
    bx.hidden = false; setTimeout(() => bx.querySelector('button').focus({ preventScroll: true }), 80);
  });
}
function setAct(lbl, fn) { const b = $('#actBtn'); S.act = fn; if (!lbl) { $('#actRow').hidden = true; return; } b.innerHTML = ''; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = lbl; sp.textContent = t(lbl); b.appendChild(sp); $('#actRow').hidden = false; }
$('#actBtn').addEventListener('click', () => { gesture(); const f = S.act; if (f) f(); });
function next(lbl = W.next) { return new Promise(res => { setAct(lbl, () => { setAct(null); sfx('tap'); res(); }); setTimeout(() => $('#actBtn').focus({ preventScroll: true }), 80); }); }
function setPhase(p) { S.phase = p; app.className = app.className.replace(/phase-\w+/, 'phase-' + p); }
function setPlate(state, instant) {
  $$('.plates img').forEach(im => { im.classList.toggle('instant', !!instant); im.classList.toggle('on', im.dataset.state === state); });
  S.plate = state;
}
function tierHint(o) { say({ en: o.en + ' ' + W.tierAsk.en, ar: o.ar + ' ' + W.tierAsk.ar }); return read(2400); }

/* ======================= 1. the garden (Jannah): fruit from the allowed trees, the one rule ======================= */
function buildFruits() {
  const box = $('#fruits'); box.innerHTML = '';
  for (let i = 0; i < NFRUIT; i++) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'fruit call'; b.dataset.i = i;
    b.innerHTML = '<img alt="" draggable="false">';
    box.appendChild(b);
    makeDraggable(b, {
      enabled: () => S.phase === 'garden' && !b.classList.contains('in'),
      targets: () => [$('#basket')],
      onTap: el => fruitIn(el),
      onDrop: el => fruitIn(el),
      onMiss: () => say(W.missBasket)
    });
  }
  place();
}
async function fruitIn(el) {
  if (el.classList.contains('in')) return;
  const k = el.dataset.k, name = FRUIT[k];
  el.classList.add('in'); el.classList.remove('call');
  glideTo(el, $('#basket'));
  sfx('good'); say({ en: `${name.en} ${W.got.en}`, ar: `${name.ar} ${W.got.ar}` });
  await anim(600);
  el.hidden = true;
  const im = document.createElement('img'); im.src = `${IMG}fruit-${k}.webp`; im.alt = ''; im.className = 'bf b' + S.fruitN; $('#inbasket').appendChild(im);
  land($('#basket')); S.fruitN++;
  Atmos.motes(L.basket, 2);
  if (S.fruitN < NFRUIT) { const nx = $$('.fruit').find(x => !x.hidden); if (nx) nx.focus({ preventScroll: true }); return; }
  beads(1);
  await read(1100);
  if (S.ruleHeard) return slip();
  say(W.treeAsk); $('#tree').classList.add('call'); setClip(null);
  setTimeout(() => $('#tree').focus({ preventScroll: true }), 120);
}
/* the one tree: the child only hears the rule. No praise, no "kept" state, no comparison with Adam (gate 1, MUST 1).
   It has no fruit, and it is never a drop target: nothing can be taken from it. */
$('#tree').addEventListener('click', async () => {
  if (S.phase !== 'garden' || S.treeBusy) return;
  gesture(); $('#tree').classList.remove('call'); $('#tree').classList.add('heard'); sfx('soft');
  if (S.ruleHeard && S.fruitN < NFRUIT) { say(W.treeMore); return; }
  S.treeBusy = true;
  say(P.rule); beatClip('rule');
  const first = !S.ruleHeard; S.ruleHeard = true;
  if (first && S.beads < 2 && S.fruitN >= NFRUIT) beads(2);
  if (S.fruitN < NFRUIT) {
    await read(4200); S.treeBusy = false; say(W.treeMore);
    const nx = $$('.fruit').find(x => !x.hidden); if (nx) nx.focus({ preventScroll: true });
    return;
  }
  await next(); S.treeBusy = false;
  slip();
});
/* the slip: narrated from the story page, never played. The garden dims; Shaytan is never shown. */
async function slip() {
  setPhase('story'); beads(2); setClip(null);
  $('#tree').classList.remove('heard', 'call');
  await anim(300);
  say(P.slip); setPlate('dim'); air(0.5);
  await read(3000); await next();
  say(W.sorry);
  await read(2600); await next();
  // Adam's dua: on screen exactly as on the story page; read together by the family; never voiced
  stopClip(); setClip(null);
  $('#duaCard').hidden = false; say(W.readAsk); beads(3);
  await next(W.readBtn);
  $('#duaCard').hidden = true;
  // forgiven: the page's own words over the still, dim garden. No light, no motes and no win chime here (scholar
  // gates 2-3, 3.2 and 3.3): no light is connected to Allah's act, the one tree is never lit, and reading the dua is
  // never scored. The crossfade to the earth at dawn carries the hope (never "the light came back to the garden").
  sfx('soft');
  say(P.forgave); beads(4);
  await read(2600); await next();
  // then Allah sent them to live on earth: the scene becomes the earth at dawn (never "the light came back to the garden")
  setPlate('earth'); air(0.8);
  world.setAttribute('aria-label', rtl() ? 'الأرض عند الفجر' : 'The earth at dawn');
  say(P.earth); beatClip('earth'); beads(5);
  await read(3600); await next();
  await pausePoint(W.pause1Q, W.pause1H);
  setAct(W.toCourt, toCourt); $('#actBtn').focus({ preventScroll: true });
}

/* ======================= 2. your own garden on earth: water, play, an accident, a choice ======================= */
async function wipe(fn) {
  const w = $('.wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  await anim(650); fn(); await anim(750); w.classList.remove('go');
}
function buildBeds() {
  const box = $('#beds'); box.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bed'; b.dataset.i = i;
    b.innerHTML = `<img class="sp" src="${IMG}sprout.webp" alt="" draggable="false"><img class="bl" src="${IMG}bloom.webp" alt="" draggable="false">`;
    label(b, W.bedLabel(i + 1));
    b.addEventListener('click', () => { if (S.step !== 'water' || b.dataset.grown) return; gesture(); waterBed(b); });
    box.appendChild(b);
  }
}
async function toCourt() {
  setAct(null); stopClip(); setClip(null);
  await wipe(() => { setPhase('court'); setPlate('court', true); air(0.6); place(); });
  world.setAttribute('aria-label', rtl() ? 'حديقتك على الأرض' : 'Your garden on earth');
  S.step = 'water'; say(W.courtIntro);
  setTimeout(() => $('.bed').focus({ preventScroll: true }), 150);
}
makeDraggable($('#jug'), {
  enabled: () => S.step === 'water',
  targets: () => $$('.bed').filter(b => !b.dataset.grown),
  onTap: () => { const b = $$('.bed').find(x => !x.dataset.grown); if (b) waterBed(b); },
  onDrop: (el, tg) => { springBack(el); waterBed(tg); },
  onMiss: () => say(W.missJug)
});
async function waterBed(b) {
  if (b.dataset.grown || S.watering) return;
  S.watering = true;
  const j = $('#jug'); j.classList.add('pouring'); sfx('pour');
  // the jug tilts over the plant: placed beside the bed for a moment
  const [x, y] = L.beds[+b.dataset.i]; j.style.translate = ''; j.dataset.at = '1';
  Object.assign(j.style, { left: (x + 10) + 'px', top: (y - 210) + 'px' });
  await anim(700);
  b.dataset.grown = '1'; b.classList.add('grown'); place(); land(b);
  sfx('good'); say(W.watered); Atmos.motes([x, y - 60], 3);
  await anim(450);
  j.classList.remove('pouring'); delete j.dataset.at; place();
  S.watering = false;
  if ($$('.bed').every(x => x.dataset.grown)) {
    S.step = 'ball'; beads(6);
    say(W.play); const ball = $('#ball'); ball.hidden = false; land(ball);
    setTimeout(() => ball.focus({ preventScroll: true }), 120);
  } else { const nx = $$('.bed').find(x => !x.dataset.grown); if (nx) nx.focus({ preventScroll: true }); }
}
/* Mama's clay pot breaks into three pieces: the same painted pot cut by three polygons (no extra art) */
const SHARDS = [
  'polygon(0% 0%,100% 0%,100% 34%,72% 40%,50% 31%,27% 43%,0% 36%)',
  'polygon(0% 36%,27% 43%,50% 31%,56% 62%,40% 100%,0% 100%)',
  'polygon(50% 31%,72% 40%,100% 34%,100% 100%,40% 100%,56% 62%)'
];
const SEAMS = 'M0 36 L27 43 L50 31 L72 40 L100 34 M50 31 L56 62 L40 100';
const TILT = [-24, 18, 32];
function buildShards() {
  const box = $('#shards'); box.innerHTML = '';
  SHARDS.forEach((cp, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'shard'; b.dataset.i = i; b.hidden = true;
    b.innerHTML = `<img src="${IMG}pot.webp" alt="" draggable="false" style="clip-path:${cp}">`;
    label(b, W.shardLabel(i + 1));
    box.appendChild(b);
    makeDraggable(b, {
      enabled: () => S.step === 'mend' && !b.classList.contains('home'),
      targets: () => [$('#potspot')],
      home: el => el.dataset.off || '0px 0px',
      onTap: el => shardHome(el),
      onDrop: el => shardHome(el),
      onMiss: () => say(W.missPiece)
    });
  });
  $('#seams path').setAttribute('d', SEAMS);
}
/* every shard is a full-size copy of the pot box (clipped), so "home" is translate 0 with no rotation */
function placeShards() {
  const ps = $('#potspot').style;
  $$('.shard').forEach(b => { Object.assign(b.style, { left: ps.left, top: ps.top, width: ps.width, height: ps.height }); });
}
function scatterShards() {
  const [px, py] = L.pot, h = L.pot[2] / asp('pot', 0.8);
  $$('.shard').forEach((b, i) => {
    const [sx, sy] = L.shards[i];
    const off = `${sx - px}px ${sy - py + h * 0.35}px`;
    b.dataset.off = off; b.hidden = false; b.classList.remove('home');
    b.style.rotate = TILT[i] + 'deg'; b.style.translate = off;
  });
}
$('#ball').addEventListener('click', async () => {
  if (S.step !== 'ball') return; gesture(); S.step = 'rolling';
  const ball = $('#ball'); sfx('roll'); ball.classList.add('rolling'); S.ballRolled = true; place();
  await anim(1100);
  sfx('thud'); const pot = $('#pot'); pot.classList.add('tip');
  await anim(520);
  // the pot breaks: three pieces on the earth (a soft knock, never a crash or a shatter effect)
  pot.classList.remove('tip'); pot.hidden = true; $('#potspot').classList.add('empty'); scatterShards();
  ball.classList.remove('rolling');
  await anim(400);
  say(W.crash); if (G.tier) await tierHint(W.crash);
  for (;;) {
    const c = await choose([{ id: 'truth', label: W.optTruth, icon: ICON.truth }, { id: 'hide', label: W.optHide, icon: ICON.hide }, { id: 'cat', label: W.optCat, icon: ICON.cat }]);
    if (c === 'truth') break;
    sfx('soft');
    if (c === 'hide') { const lv = $('#leaves'); lv.hidden = false; land(lv); sfx('rustle'); app.classList.add('gloom'); }
    else { $('#cat').classList.add('asleep-glow'); }
    say(W[c]); await read(2600); await next(W.again);
    $('#leaves').hidden = true; app.classList.remove('gloom'); $('#cat').classList.remove('asleep-glow');
    say(W.crash);
  }
  sfx('good'); say(W.truth); S.step = 'mend'; S.mended = 0; beads(7);
  setTimeout(() => $('.shard').focus({ preventScroll: true }), 120);
});
async function shardHome(b) {
  if (b.classList.contains('home')) return;
  b.classList.add('home', 'glide'); b.style.translate = '0px 0px'; b.style.rotate = '0deg';
  sfx('good'); say(W.piece);
  await anim(650); land($('#potspot')); S.mended++;
  if (S.mended < 3) { const nx = $$('.shard').find(x => !x.classList.contains('home')); if (nx) nx.focus({ preventScroll: true }); return; }
  // whole again: the pot with fine seams where it was mended
  S.step = 'sorry';
  $$('.shard').forEach(x => (x.hidden = true)); const pot = $('#pot'); pot.hidden = false; $('#potspot').classList.remove('empty'); $('#potspot').classList.add('mended');
  sfx('done'); Atmos.motes([L.pot[0], L.pot[1] - 80], 4);
  say(W.fixed); if (G.tier) await tierHint(W.fixed);
  for (;;) {
    const c = await choose([{ id: 'sorry', label: W.optSorry, icon: ICON.sorry }, { id: 'big', label: W.optBig, icon: ICON.shrug }]);
    if (c === 'sorry') break;
    sfx('soft'); say(W.big); await read(3000); say(W.fixed);
  }
  sfx('good'); beads(8);
  say(W.hug); $('#istighfar').hidden = false; beatClip('remember');
  await read(2200); await next(W.sayIt);
  $('#istighfar').hidden = true;
  await pausePoint(W.pause2Q, W.pause2H);
  eveningEnd();
}

/* ======================= parent pause ======================= */
function pausePoint(q, h) {
  return new Promise(res => {
    S.pauseQ = { q, h }; $('#pauseQ').textContent = t(q); $('#pauseHint').textContent = t(h);
    $('#pause').hidden = false; sfx('soft'); setTimeout(() => $('#pauseGo').focus({ preventScroll: true }), 80);
    $('#pauseGo').onclick = () => { $('#pause').hidden = true; S.pauseQ = null; sfx('tap'); res(); };
  });
}

/* ======================= the reward moment and the ending: evening in the garden, calm and still ======================= */
async function eveningEnd() {
  S.step = null; stopClip(); setClip(null);
  setPhase('end'); app.classList.add('evening');
  say(W.evening);
  await read(4200);
  reward();
}
function buildShamsa() {
  const g = $('#shamsaG'); if (g.childElementCount) return;
  const Pp = []; const star = (n, r1, r2, rot = 0) => { let d = ''; for (let i = 0; i < 2 * n; i++) { const r = i % 2 ? r2 : r1, a = rot + Math.PI * i / n; d += (i ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1); } return d + 'Z'; };
  // the shamsa approved on Nuh (scholar gate 3): gold line on a solid ivory disc, a rosette centre, never a sun or an eye
  Pp.push(`<circle r="92"/>`, `<circle r="84"/>`, `<path d="${star(16, 80, 62)}"/>`, `<path d="${star(8, 58, 34, Math.PI / 8)}"/>`, `<path d="${star(8, 58, 34)}"/>`, `<path d="${star(8, 26, 12)}"/>`);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; Pp.push(`<path d="M${(70 * Math.cos(a)).toFixed(1)} ${(70 * Math.sin(a)).toFixed(1)} q ${(8 * Math.cos(a + 1.2)).toFixed(1)} ${(8 * Math.sin(a + 1.2)).toFixed(1)} ${(14 * Math.cos(a)).toFixed(1)} ${(14 * Math.sin(a)).toFixed(1)}"/>`); }
  g.innerHTML = Pp.join('');
  $$('path,circle', g).forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength ? p.getTotalLength() : 600)));
}
async function reward() {
  buildShamsa();
  const rw = $('#reward');
  // the lamp glow rises over the mended pot and the flowers
  const port = G.orient === 'port';
  rw.style.setProperty('--lx', '50%'); rw.style.setProperty('--ly', (port ? 70 : 66) + '%');
  const sx = port ? 50 : 76;
  rw.style.setProperty('--sx', (rtl() ? 100 - sx : sx) + '%'); rw.style.setProperty('--sy', (port ? 28 : 32) + '%');
  void rw.offsetWidth; rw.classList.add('on');
  await anim(900); sfx('done'); Atmos.motes([L.w / 2, L.h * 0.7], 7);
  await anim(2600);
  S.ended = true; $('#endBody').textContent = t(W.endB);
  $('#tierBox').checked = G.tier; $('#ending').hidden = false; app.classList.add('ended');
  air(0);   // the ending is a still, quiet frame: the air fades to nothing (no pulse remains)
  setTimeout(() => $('#againBtn').focus({ preventScroll: true }), 80);
}
$('#againBtn').addEventListener('click', () => { G.tier = $('#tierBox').checked; sfx('tap'); reset(); });

/* ======================= reset ======================= */
async function reset() {
  Object.assign(S, { phase: 'garden', step: null, ended: false, pauseQ: null, act: null, fruitN: 0, ruleHeard: false, treeBusy: false, watering: false, ballRolled: false, mended: 0 });
  app.className = 'phase-garden' + (G.bed ? ' bed' : '') + (Atmos.ok ? '' : ' nopixi');
  ['#ending', '#pause', '#choices', '#duaCard', '#istighfar', '#leaves', '#ball'].forEach(s => ($(s).hidden = true));
  $('#reward').classList.remove('on'); setAct(null); setClip(null);
  $('#inbasket').innerHTML = ''; $('#tree').classList.remove('call', 'heard');
  const pot = $('#pot'); pot.hidden = false; pot.classList.remove('tip'); $('#potspot').classList.remove('empty', 'mended');
  const j = $('#jug'); j.style.translate = ''; j.classList.remove('pouring'); delete j.dataset.at;
  buildFruits(); buildBeds(); buildShards();
  setPlate('garden', true); Atmos.reset(); beads(0);
  world.setAttribute('aria-label', rtl() ? 'الحديقة' : 'The garden');
  place();
  if (G.tier) await pausePoint(W.tierStartQ, W.tierStartH);
  say(W.intro); beatClip('jannah');
  setTimeout(() => { if (S.phase === 'garden') { const f = $('.fruit'); if (f) f.focus({ preventScroll: true }); } }, 200);
}

/* ======================= settings ======================= */
$('#langBtn').addEventListener('click', () => { gesture(); G.lang = rtl() ? 'en' : 'ar'; try { localStorage.setItem('islamicKidsLang', G.lang); } catch (e) { /* private */ } applyLang(); });
$('#soundBtn').addEventListener('click', () => { gesture(); G.sound = !G.sound; $('#soundBtn').setAttribute('aria-pressed', String(G.sound)); if (!G.sound) { stopClip(); air(0); setMuted(true); } else { setMuted(false); air(0.8); } });
$('#bedBtn').addEventListener('click', () => { gesture(); G.bed = !G.bed; $('#bedBtn').setAttribute('aria-pressed', String(G.bed)); app.classList.toggle('bed', G.bed); air(0.8); Atmos.calm(); });
$('#listenBtn').addEventListener('click', () => { gesture(); playClip(); });
addEventListener('resize', fit);

/* ======================= atmosphere canvas (PixiJS). Decoration only: the game is whole without it. ======================= */
const Atmos = (() => {
  const A = { ok: false };
  let px = null, layers = {}, tex = {}, motes = [];
  const canvas = $('#atmos');
  function softTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return PIXI.Texture.from(c); }
  async function init() {
    if (!window.PIXI) throw new Error('no PIXI');
    px = new PIXI.Application();
    await px.init({ canvas, width: L.w, height: L.h, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(2, (devicePixelRatio || 1) * G.s), preference: 'webgl', autoStart: false, sharedTicker: false });
    tex.mote = softTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.25, 'rgba(240,200,110,.7)'); gr.addColorStop(1, 'rgba(224,183,92,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    layers.motes = new PIXI.Container(); px.stage.addChild(layers.motes);
    A.ok = true; app.classList.remove('nopixi');
    resize();
  }
  function resize() {
    if (!A.ok) return;
    px.renderer.resolution = Math.min(2, (devicePixelRatio || 1) * G.s);
    px.renderer.resize(L.w, L.h); canvas.style.width = L.w + 'px'; canvas.style.height = L.h + 'px';
    wake();
  }
  function motesAt([x, y], n) {
    if (!A.ok || G.bed) return;
    for (let i = 0; i < n; i++) { const m = new PIXI.Sprite(tex.mote); m.anchor.set(0.5); m.blendMode = 'add'; m.x = x + (Math.random() - 0.5) * 120; m.y = y - 30 + (Math.random() - 0.3) * 50; m.scale.set(0.25 + Math.random() * 0.35); m.life = 0; m.max = 2.6 + Math.random() * 1.6; m.vx = (Math.random() - 0.5) * 14; m.alpha = 0; layers.motes.addChild(m); motes.push(m); }
    wake();
  }
  let raf = 0, last = 0;
  function wake() { if (A.ok && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; let live = false;
    motes = motes.filter(m => { m.life += dt; const k = m.life / m.max; m.y -= dt * 26; m.x += m.vx * dt; m.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 0.9); if (k >= 1) { m.destroy(); return false; } live = true; return true; });
    px.render();
    if (live) raf = requestAnimationFrame(frame);   // the loop sleeps when nothing moves
  }
  function reset() { if (!A.ok) return; motes.forEach(m => m.destroy()); motes = []; wake(); }
  function calm() { if (A.ok) wake(); }
  Object.assign(A, { init, resize, motes: motesAt, reset, calm, wake });
  return A;
})();

/* ======================= boot ======================= */
async function boot() {
  $$('#pageText [data-k]').forEach(el => (P[el.dataset.k] = { en: el.innerHTML.trim(), ar: el.dataset.ar }));
  try { MANIFEST = await (await fetch(IMG + 'manifest.json')).json(); } catch (e) { /* aspects fall back to defaults */ }
  if (MANIFEST.layout) ['land', 'port'].forEach(k => MANIFEST.layout[k] && Object.assign(LAYOUT[k], MANIFEST.layout[k]));
  app.classList.add('nopixi');
  applyLang();
  reset();
  try { await Atmos.init(); Atmos.reset(); } catch (e) { app.classList.add('nopixi'); }
  window.__adam = { levelDb, air, acState: () => (AC ? AC.state : 'none'), S, G, L: () => L, Atmos, W, P, CLIPS, FRUIT, say }; // for the headless play-through and wording checks
}
boot();
})();
