/* Game 04, Ibrahim: Stars and Guests: the third painted game (2026-11-07).
   Painted DOM planes + DOM HUD; one PixiJS canvas (decoration only) for star twinkle and motes. All words live in the
   DOM (Arabic shaping, RTL). No browser TTS: the only voice is Baba's recorded story narration (Ibrahim slides 1, 2
   and 3), played as single sentences cut at recorded pauses; never a "this is my lord" sentence and never slide 6
   or 9 (an ayah and the dua). No music: one- or two-note chimes and natural sounds. Systems reused from
   games/musa/musa.js. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const IMG = '../images/games/ibrahim/';
const AUDIO = '../audio/prophet-ibrahim/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const G = { lang: 'en', sound: true, bed: false, tier: false, orient: null, s: 1, ox: 0, oy: 0, sel: null, clip: null, gesture: false };
try { if (localStorage.getItem('islamicKidsLang') === 'ar') G.lang = 'ar'; } catch (e) { /* private mode */ }
const anim = ms => wait(RM ? Math.min(ms, 200) : G.bed ? ms * 1.25 : ms);
// reading time is never shortened by reduced motion (only movement is)
const read = ms => wait(G.bed ? ms * 1.25 : ms);
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[G.lang] != null ? o[G.lang] : o.en));
const rtl = () => G.lang === 'ar';
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, x) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

/* ======================= layout: logical world coordinates, one table per composition =======================
   Measured against the painted plates (shipped plate pixels). horizon: where the sky meets the far dunes (a body
   sets below it). arc: rise -> top -> set, a quadratic curve across the open middle of the sky. tent: the places in
   Ibrahim's tent (the mat where the guests sit is never drawn with anyone on it). */
const LAYOUT = {
  land: {
    // measured on plate-night-land (cropped inside its gold rule, 1240 x 783): the far dunes meet the sky at y ~ 575
    w: 1240, h: 783,
    horizon: 578,
    arc: { rise: [150, 590], top: [620, 135], set: [1090, 590] },
    size: { star: 84, moon: 150, sun: 176 },
    sky: [40, 20, 1200, 520],
    // plate-tent-land: the household curtain hangs at x 870-1010; the striped mat (the guests' place) is x 320-880,
    // y 540-690. In the tent the ribbon moves to the top (CSS), so the sand at the bottom is free for the dishes.
    tent: { curtain: [940, 470, 150, 300], dishes: [[760, 778, 210], [520, 776, 170]], near: [600, 610, 290], far: [180, 742, 150], mat: [600, 600, 620, 180] }
  },
  port: {
    // phone, measured on plate-night-port (690 x 1278): the far dunes meet the sky at y ~ 950. The narration ribbon
    // sits in the sky at the top, the time bar and the choices over the sand at the bottom.
    w: 690, h: 1278,
    horizon: 952,
    arc: { rise: [110, 965], top: [345, 440], set: [580, 965] },
    size: { star: 80, moon: 150, sun: 170 },
    sky: [40, 240, 650, 900],
    // plate-tent-port: the household curtain hangs at x 500-640, y 590-1000; the mat is x 50-560, y 880-990
    tent: { curtain: [548, 800, 110, 330], dishes: [[255, 1190, 200], [480, 1185, 170]], near: [300, 935, 240], far: [130, 1105, 130], mat: [300, 930, 480, 140] }
  }
};
let MANIFEST = { aspects: {} };

/* ======================= words (gate-1 approved text kept as approved; new lines listed in the spec) ======================= */
const BODIES = {
  star: { name: { en: 'the star', ar: 'النجم' }, f: false, from: 'night', to: 'night', u0: 0.42,
    show: { en: 'Prophet Ibrahim wanted to teach his people who the true Lord is. Look at the night sky: one star shines brighter than all the others. Tap it.',
      ar: 'أراد النبي إبراهيم عليه السلام أن يعلّم قومه من هو الرب الحق. انظر إلى سماء الليل: نجم واحد يلمع أكثر من كل النجوم. المسه.' },
    tapped: { en: 'It is beautiful, and Ibrahim showed it to his people. Now let the night pass: slide the gold knob along the line and watch the star.',
      ar: 'ما أجمله! وأراه إبراهيم لقومه. والآن دع الليل يمضي: حرّك المقبض الذهبي على الخط وراقب النجم.' },
    labels: [{ en: 'Night', ar: 'الليل' }, { en: 'Before dawn', ar: 'قبيل الفجر' }],
    vt: { en: 'The night passes', ar: 'الليل يمضي' },
    ask: { en: 'The star has set. Did it stay with us all the time?', ar: 'غاب النجم. هل بقي معنا طوال الوقت؟' },
    no: { en: 'No, it went away', ar: 'لا، لقد غاب' }, yes: { en: 'Yes, it stayed', ar: 'نعم، بقي' },
    again: { en: 'Look again: it went down and was gone. Let us watch once more.', ar: 'انظر مرة أخرى: لقد نزل وغاب. لنراقب مرة أخرى.' },
    right: { en: 'Yes, it went away. Ibrahim showed his people: something that goes away cannot be our Lord. Allah never goes away and never sleeps: He is always with us, hearing and seeing.',
      ar: 'نعم، لقد غاب. بيّن إبراهيم لقومه أن ما يغيب لا يمكن أن يكون ربنا. الله لا يغيب أبداً ولا ينام، وهو معنا دائماً يسمع ويرى.' } },
  moon: { name: { en: 'the moon', ar: 'القمر' }, f: false, from: 'night', to: 'morning', u0: 0.45,
    show: { en: 'Then the moon rose, big and bright! Tap the moon.', ar: 'ثم طلع القمر كبيراً منيراً! المس القمر.' },
    tapped: { en: 'So bright! Now let the night pass until morning. Slide the knob and watch the moon.', ar: 'ما أشد نوره! والآن دع الليل يمضي حتى الصباح. حرّك المقبض وراقب القمر.' },
    labels: [{ en: 'Night', ar: 'الليل' }, { en: 'Morning', ar: 'الصباح' }],
    vt: { en: 'Night turns to morning', ar: 'الليل يتحول إلى صباح' },
    ask: { en: 'The moon has set. Did it stay with us all the time?', ar: 'غاب القمر. هل بقي معنا طوال الوقت؟' },
    no: { en: 'No, it went away', ar: 'لا، لقد غاب' }, yes: { en: 'Yes, it stayed', ar: 'نعم، بقي' },
    again: { en: 'Look again: it went down and was gone. Let us watch once more.', ar: 'انظر مرة أخرى: لقد نزل وغاب. لنراقب مرة أخرى.' },
    right: { en: 'Yes, when morning came, the moon went away too. Ibrahim was showing his people that something which disappears cannot be our Lord.',
      ar: 'نعم، لما جاء الصباح غاب القمر أيضاً. كان إبراهيم يُري قومه أن ما يغيب لا يمكن أن يكون رباً.' } },
  sun: { name: { en: 'the sun', ar: 'الشمس' }, f: true, from: 'morning', to: 'evening', u0: 0.45,
    show: { en: 'Morning came, and the sun rose, the biggest and brightest of all! Tap the sun.', ar: 'وجاء الصباح وأشرقت الشمس، أكبرها وأشدها ضياءً! المس الشمس.' },
    tapped: { en: 'So big and warm! Now let the day pass until evening. Slide the knob and watch the sun.', ar: 'ما أكبرها وأدفأها! والآن دع النهار يمضي حتى المساء. حرّك المقبض وراقب الشمس.' },
    labels: [{ en: 'Morning', ar: 'الصباح' }, { en: 'Evening', ar: 'المساء' }],
    vt: { en: 'Day turns to evening', ar: 'النهار يتحول إلى مساء' },
    ask: { en: 'The sun has set. Did it stay with us all the time?', ar: 'غابت الشمس. هل بقيت معنا طوال الوقت؟' },
    no: { en: 'No, it went away', ar: 'لا، لقد غابت' }, yes: { en: 'Yes, it stayed', ar: 'نعم، بقيت' },
    again: { en: 'Look again: it went down and was gone. Let us watch once more.', ar: 'انظر مرة أخرى: لقد نزلت وغابت. لنراقب مرة أخرى.' },
    right: { en: 'Yes, when evening came, even the big, bright sun went away.', ar: 'نعم، لما جاء المساء غابت حتى الشمس الكبيرة المضيئة.' } }
};
const ORDER = ['star', 'moon', 'sun'];
const W = {
  next: { en: 'Next', ar: 'التالي' },
  tierAsk: { en: 'Grown-up: before tapping, ask your child to say why.', ar: 'للوالدين: قبل الاختيار، اطلبوا من الطفل أن يقول السبب.' },
  frameAsk: { en: 'Here they are again: the star, the moon and the sun. Who made them? Drag each one into the frame, or tap it.',
    ar: 'ها هي مرة أخرى: النجم والقمر والشمس. من خلقها؟ اسحب كل واحد منها إلى الإطار، أو المسه.' },
  placed: { star: { en: 'Allah made the star.', ar: 'الله خلق النجم.' }, moon: { en: 'Allah made the moon.', ar: 'الله خلق القمر.' }, sun: { en: 'Allah made the sun.', ar: 'الله خلق الشمس.' } },
  missFrame: { en: 'Bring it up into the frame.', ar: 'ضعه في الإطار في الأعلى.' },
  frameDone: { en: 'Allah made them all. Only Allah, who never sets and never sleeps, deserves to be worshipped.',
    ar: 'الله خلقها كلها. والله وحده، الذي لا يغيب ولا ينام، هو المستحق للعبادة.' },
  pause1Q: { en: 'The sun is so big and bright. Why can it not be our Lord?', ar: 'الشمس كبيرة جداً ومضيئة. لماذا لا يمكن أن تكون ربنا؟' },
  pause1H: { en: 'Idea: it sets every evening; Allah made it, and Allah never sets or sleeps.', ar: 'فكرة: إنها تغيب كل مساء؛ الله خلقها، والله لا يغيب ولا ينام.' },
  toTent: { en: "Next: Ibrahim's guests", ar: 'التالي: ضيوف إبراهيم' },
  tentIntro: { en: 'Ibrahim was known for welcoming guests generously. One day, guests came to his tent and greeted him with "Salam!", peace. How do we answer?',
    ar: 'عُرف إبراهيم بإكرام الضيوف. وفي يوم وصل ضيوف إلى خيمته وقالوا: "سلاماً!" كيف نردّ عليهم؟' },
  optSalam: { en: 'Wa alaykum as-salam, welcome!', ar: 'وعليكم السلام، أهلاً وسهلاً!' }, optAway: { en: 'Who are you? Go away.', ar: 'من أنتم؟ اذهبوا.' },
  away: { en: 'Guests are a gift. Ibrahim answered their greeting of peace with peace and welcomed them in. Let us choose again.', ar: 'الضيوف نعمة. ردّ إبراهيم تحيتهم بالسلام ورحّب بهم. لنختر مرة أخرى.' },
  hurry: { en: 'Peace answered with peace! Then Ibrahim went quickly and quietly to his household to get food ready. Tap the curtain to the household.',
    ar: 'ردّ السلام بالسلام! ثم ذهب إبراهيم مسرعاً بهدوء إلى أهله ليجهّز الطعام. المس الستارة التي إلى أهل البيت.' },
  food: { en: 'What food shall we bring for the guests? Tap the best one.', ar: 'أي طعام نقدّم للضيوف؟ المس الأفضل.' },
  crust: { en: 'That is kind, but Ibrahim gave his guests his very best. Let us choose again.', ar: 'هذا لطيف، لكن إبراهيم قدّم لضيوفه أفضل ما عنده. لنختر مرة أخرى.' },
  best: { en: 'Yes! Ibrahim brought his very best: a fat, roasted calf. Where shall the tray go? Drag it there, or tap the place.',
    ar: 'نعم! جاء إبراهيم بأفضل ما عنده: عجل سمين مشويّ. أين نضع الصينية؟ اسحبها إلى هناك، أو المس المكان.' },
  selTray: { en: 'Now tap the place for the tray.', ar: 'والآن المس مكان الصينية.' },
  farMsg: { en: 'That is a long way for the guests to reach. Ibrahim brought the food close to them. Try again.', ar: 'هذا بعيد عن الضيوف. قرّب إبراهيم الطعام إليهم. حاول مرة أخرى.' },
  missTray: { en: 'Bring the tray to one of the glowing places.', ar: 'ضع الصينية في أحد الأماكن المضيئة.' },
  invite: { en: 'The food is close to them. How shall we invite them to eat?', ar: 'الطعام قريب منهم. كيف ندعوهم إلى الأكل؟' },
  optPolite: { en: "Please, won't you eat?", ar: 'تفضّلوا، ألا تأكلون؟' }, optRude: { en: 'Eat it now!', ar: 'كُلوا الآن!' },
  rude: { en: 'Ibrahim spoke to his guests gently and politely. Let us choose again.', ar: 'كان إبراهيم يكلّم ضيوفه بلطف وأدب. لنختر مرة أخرى.' },
  done: { en: 'A warm welcome: peace answered with peace, hurrying to prepare, the best food, brought close, and a gentle invitation.',
    ar: 'ترحيب دافئ: ردّ السلام بالسلام، والإسراع في التجهيز، وأفضل الطعام، مقرّباً إليهم، ودعوة لطيفة.' },
  /* the parent line the scholar requires: the guests were angels, and angels do not eat */
  angels: { en: "For the grown-up: these guests were really angels sent by Allah with good news. Angels do not eat, so they did not eat the food. Ibrahim's welcome was still the best welcome.",
    ar: 'للوالدين: كان هؤلاء الضيوف ملائكة أرسلهم الله ببشرى. والملائكة لا يأكلون، فلم يأكلوا من الطعام. ومع ذلك كان ترحيب إبراهيم أكرم ترحيب.' },
  pause2Q: { en: 'Who visits our home? What could we do to make them feel welcome, like Ibrahim?', ar: 'من يزور بيتنا؟ ماذا نستطيع أن نفعل ليشعروا بالترحيب، كما فعل إبراهيم؟' },
  pause2H: { en: 'Idea: choose one thing to do for the next guest: greet them, bring water, or share the best snack.', ar: 'فكرة: اختر شيئاً واحداً تفعله للضيف القادم: تحية، أو كوب ماء، أو أطيب ما عندك.' },
  night: { en: 'Night came again, and the stars came out over the desert. Allah made them all, and Allah is always with us, hearing and seeing.',
    ar: 'وجاء الليل من جديد، وظهرت النجوم فوق الصحراء. الله خلقها كلها، والله معنا دائماً يسمع ويرى.' },
  endB: { en: 'You watched the star, the moon and the sun set, and found that only Allah, who made them, deserves worship. Then you learned how Ibrahim welcomed his guests with his very best.',
    ar: 'شاهدت النجم والقمر والشمس تغيب، وعرفت أن الله وحده الذي خلقها هو المستحق للعبادة. ثم تعلّمت كيف أكرم إبراهيم ضيوفه بأفضل ما عنده.' },
  beadsLabel: { en: 'The story so far', ar: 'القصة حتى الآن' },
  bodyLabel: o => ({ en: `The ${o === 'star' ? 'bright star' : o}. Tap it.`, ar: `${t(BODIES[o].name)}. المسه.` })
};
/* Baba's recorded story narration: single sentences, cut inside recorded pauses (ffmpeg silencedetect, 2026-11-07)
   and checked by Whisper large-v3-turbo (heard exactly the one sentence, nothing before or after). The "this is my
   lord" sentences of slides 1-3 are never played; slides 6 (an ayah) and 9 (the dua) are never used. */
const CLIPS = {
  intro: { slide: 1, en: [0, 3.6], ar: [0, 3.63] },          // Ibrahim wanted to teach his people who the true Lord is.
  moon: { slide: 2, en: [9.5, 14.45], ar: [9.1, 13.6] },      // Ibrahim was showing his people that something which disappears ...
  made: { slide: 3, en: [9.85, 16.8], ar: [9.2, 16.5] }       // Ibrahim showed his people that only Allah ... deserves to be worshipped!
};

/* ======================= sound: Web Audio, no music ======================= */
let AC = null, master = null, windNode = null;
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
function hush(a, n, lpF, d, peak) { // a soft swell of filtered noise: steps on sand, cloth, a breath of wind
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
  else if (kind === 'step') { hush(a, n, 420, 0.16, 0.3 * v); hush(a, n + 0.26, 400, 0.16, 0.26 * v); hush(a, n + 0.52, 420, 0.16, 0.22 * v); }
  else if (kind === 'cloth') hush(a, n, 1400, 0.5, 0.12 * v);
  else if (kind === 'set') hush(a, n, 300, 1.6, 0.12 * v);   // a soft breath as a light sets: never a fall or a crash
}
function wind(level) { // the desert breathing: a slow, very low noise swell (no melody)
  const a = ac(); if (!a) return;
  if (!windNode) {
    const s = a.createBufferSource(); s.buffer = noise(a); s.loop = true;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    // the swell is a gain stage AFTER the level, so it scales with the level: at level 0 there is no pulse at all
    // (scholar's Yusuf review: an LFO added to a near-zero gain left a pulsing hiss after Sounds off)
    const g = a.createGain(); g.gain.value = 0;
    const sw = a.createGain(); sw.gain.value = 1;
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.3; lfo.connect(lg).connect(sw.gain); lfo.start();
    s.connect(lp).connect(g).connect(sw).connect(master); s.start(); windNode = { s, g, sw, lfo };
  }
  const t0 = a.currentTime, v = level * 0.025 * vol();
  windNode.g.gain.cancelScheduledValues(t0);
  windNode.g.gain.setValueAtTime(windNode.g.gain.value, t0);
  windNode.g.gain.setTargetAtTime(v, t0, v ? 1.6 : 0.15);
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
  clipTimer = setInterval(() => { // stop inside the recorded pause, with a short fade, so nothing of the next sentence is heard
    if (G.clip !== au) { clearInterval(clipTimer); return; }
    if (au.currentTime >= to - 0.18) au.volume = Math.max(0, au.volume - 0.34);
    if (au.currentTime >= to || au.ended) { au.pause(); clearInterval(clipTimer); b.classList.remove('playing'); }
  }, 40);
  au.addEventListener('ended', () => b.classList.remove('playing'));
}
let pendingClip = null;
function maybeAutoClip() { if (pendingClip && G.sound) { const b = pendingClip; pendingClip = null; if (clipBeat === b) playClip(); } }
function beatClip(beat) { setClip(beat); if (G.gesture && G.sound) playClip(); else pendingClip = beat; }
function gesture() { if (!G.gesture) { G.gesture = true; ac(); wind(1); maybeAutoClip(); } }

/* ======================= world fit, RTL mirror ======================= */
const world = $('#world'), app = $('#app');
let L = LAYOUT.land;
function fit() {
  const vw = innerWidth, vh = innerHeight;
  const orient = vw / vh < 0.8 ? 'port' : 'land';
  const changed = orient !== G.orient; G.orient = orient; L = LAYOUT[orient];
  const s = Math.max(vw / L.w, vh / L.h);
  G.s = s; G.ox = (vw - L.w * s) / 2; G.oy = Math.min(0, (vh - L.h * s) * (orient === 'port' ? 0.5 : 0.35));
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
function box(el, x, y, w, h) { Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - h) + 'px', width: w + 'px', height: h + 'px' }); }
const asp = (n, d = 1) => MANIFEST.aspects[n] || d;

/* the arc of a light across the sky: a quadratic curve rise -> top -> set, u in 0..1 */
function arcAt(u) {
  const { rise: a, top: c, set: b } = L.arc;
  // control point so that the curve passes through `top` at u = 0.5
  const cx = 2 * c[0] - (a[0] + b[0]) / 2, cy = 2 * c[1] - (a[1] + b[1]) / 2, k = 1 - u;
  return [k * k * a[0] + 2 * k * u * cx + u * u * b[0], k * k * a[1] + 2 * k * u * cy + u * u * b[1]];
}

/* ======================= state ======================= */
const S = {};
const bodyEl = $('#body');
function place() {
  // the light in the sky
  $('#skybox').style.height = L.horizon + 'px';
  if (S.body) {
    const [x, y] = arcAt(S.u), sz = L.size[S.body], hit = Math.max(sz, 76 / G.s);
    Object.assign(bodyEl.style, { left: (x - hit / 2) + 'px', top: (y - hit / 2) + 'px', width: hit + 'px', height: hit + 'px' });
    bodyEl.style.setProperty('--sz', sz + 'px');
  }
  // the tent
  const T = L.tent, c = $('#curtain');
  Object.assign(c.style, { left: (T.curtain[0] - T.curtain[2] / 2) + 'px', top: (T.curtain[1] - T.curtain[3] / 2) + 'px', width: T.curtain[2] + 'px', height: T.curtain[3] + 'px' });
  const mg = $('.matglow'); Object.assign(mg.style, { left: (T.mat[0] - T.mat[2] / 2) + 'px', top: (T.mat[1] - T.mat[3] / 2) + 'px', width: T.mat[2] + 'px', height: T.mat[3] + 'px' });
  [['#spotNear', T.near], ['#spotFar', T.far]].forEach(([sel, [x, y, w]]) => { const el = $(sel); Object.assign(el.style, { left: (x - w / 2) + 'px', top: (y - w * 0.3) + 'px', width: w + 'px', height: (w * 0.6) + 'px' }); });
  placeDishes();
  $$('.chip').forEach(ch => (ch.style.scale = rtl() ? '-1 1' : ''));   // words inside the mirrored world read the right way round
}
function placeDishes() {
  const T = L.tent;
  [['#dishBest', 'platter', 0], ['#dishCrust', 'bread', 1]].forEach(([sel, n, i]) => {
    const el = $(sel); let [x, y, w] = T.dishes[i];
    if (sel === '#dishBest' && S.trayAt) { const p = T[S.trayAt]; x = p[0]; y = p[1] + p[2] * 0.12; w = T.dishes[0][2] * (S.trayAt === 'near' ? 1 : 0.8); }
    const h = w / asp(n, 1.3); box(el, x, y, w, h + 40);
    el.querySelector('img').style.height = h + 'px';
  });
}

/* ======================= beads (progress through the story, no numbers) ======================= */
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
  if (S.pauseQ) { $('#pauseQ').textContent = t(S.pauseQ.q); $('#pauseHint').textContent = t(S.pauseQ.h); }
  if (S.ended) $('#endBody').textContent = t(W.endB);
  if (S.body) { bodyEl.setAttribute('aria-label', t(W.bodyLabel(S.body))); timeLabels(); }
  $('#beads').setAttribute('aria-label', t(W.beadsLabel));
  stopClip();
  fit();
}

/* ======================= drag, tap-to-select, keyboard ======================= */
function makeDraggable(el, opts) {
  let st = null;
  const sc = () => (opts.screen ? 1 : G.s), fl = () => (!opts.screen && rtl() ? -1 : 1);
  el.addEventListener('pointerdown', e => {
    if (!opts.enabled()) return; e.preventDefault(); gesture();
    st = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; el.setPointerCapture(e.pointerId);
    sfx('tap');
  });
  el.addEventListener('pointermove', e => {
    if (!st || e.pointerId !== st.id) return;
    const dx = (e.clientX - st.x) / sc() * fl(), dy = (e.clientY - st.y) / sc();
    if (!st.moved && Math.hypot(e.clientX - st.x, e.clientY - st.y) < 8) return;
    if (!st.moved) { st.moved = true; el.classList.add('dragging'); clearSel(); opts.targets().forEach(tg => tg.classList.add('target-on')); }
    el.style.translate = `${dx}px ${dy}px`;
    const hot = hit(e.clientX, e.clientY, opts.targets()); opts.targets().forEach(tg => tg.classList.toggle('hot', tg === hot));
  });
  const end = e => {
    if (!st || e.pointerId !== st.id) return; const moved = st.moved; st = null;
    el.classList.remove('dragging'); opts.targets().forEach(tg => tg.classList.remove('target-on', 'hot'));
    if (!moved) { el.style.translate = ''; return opts.onTap ? opts.onTap(el) : select(el, opts); }
    const tg = hit(e.clientX, e.clientY, opts.targets());
    if (tg) opts.onDrop(el, tg); else { springBack(el); opts.onMiss && opts.onMiss(el); }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  // keyboard and screen readers: a click without a pointer (Enter, Space) does the tap action
  el.addEventListener('click', e => { if (e.detail === 0 && opts.enabled()) { gesture(); opts.onTap ? opts.onTap(el) : select(el, opts); } });
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
function wob(el) { el.classList.remove('wob'); void el.offsetWidth; el.classList.add('wob'); }
function land(el) { el.classList.remove('land'); void el.offsetWidth; el.classList.add('land'); }

/* ======================= choices ======================= */
const ICON = {
  gone: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 30h36" stroke="#8F6418" stroke-width="2.4" stroke-linecap="round"/><path d="M15 30a9 9 0 0 1 18 0z" fill="#E0B75C" opacity=".55"/></svg>',
  stay: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 36h36" stroke="#8F6418" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="18" r="9" fill="#E0B75C"/></svg>',
  welcome: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linejoin="round"><path d="M4 38L24 10l20 28z"/><path d="M18 38c0-8 3-13 6-13s6 5 6 13" fill="#E0B75C" fill-opacity=".5"/></svg>',
  shut: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linejoin="round"><path d="M4 38L24 10l20 28z"/><path d="M18 38V27h12v11"/></svg>',
  platter: () => `<img src="${IMG}platter.webp" alt="">`,
  sharp: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#3E5A5B" stroke-width="2.4" stroke-linejoin="round"><path d="M8 12h32v18H22l-8 8v-8H8z"/></svg>'
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
    // the right answer is not always first, and both look alike: the choice is a real one
    if (Math.random() < 0.5) bx.appendChild(bx.firstChild);
    bx.hidden = false; setTimeout(() => bx.querySelector('button').focus({ preventScroll: true }), 80);
  });
}
function setAct(label, fn) { const b = $('#actBtn'); S.act = fn; if (!label) { $('#actRow').hidden = true; return; } b.innerHTML = ''; const sp = document.createElement('span'); sp.dataset.tx = '1'; sp.__tx = label; sp.textContent = t(label); b.appendChild(sp); $('#actRow').hidden = false; }
$('#actBtn').addEventListener('click', () => { gesture(); const f = S.act; if (f) f(); });
function setPhase(p) { S.phase = p; app.className = app.className.replace(/phase-\w+/, 'phase-' + p); }
function setPlate(state, instant) {
  $$('.plates img').forEach(im => { im.style.opacity = ''; im.classList.toggle('instant', !!instant); im.classList.toggle('on', im.dataset.state === state); });
  S.plate = state;
}

/* ======================= 1. the sky: a light, time passing, a factual question ======================= */
function timeLabels() {
  const o = BODIES[S.body]; $('#t0').textContent = t(o.labels[0]); $('#t1').textContent = t(o.labels[1]);
  $('#time').setAttribute('aria-valuetext', t(o.vt));
}
async function showBody(k, rise) {
  const o = BODIES[k]; S.body = k; S.tapped = false; S.setting = false;
  bodyEl.className = 'b-' + k; bodyEl.hidden = false; bodyEl.disabled = false;
  bodyEl.setAttribute('aria-label', t(W.bodyLabel(k)));
  if (rise && !RM) {
    // the light rises by itself from the horizon: the child watches (never makes it rise)
    S.u = 0.02; bodyEl.classList.add('rising'); place(); await anim(60);
    S.u = o.u0; place(); await anim(3200); bodyEl.classList.remove('rising');
  } else { S.u = o.u0; place(); }
  say(o.show); bodyEl.classList.add('call');
  if (k === 'star') beatClip('intro'); else setClip(null);
  setTimeout(() => { if (!S.tapped && S.phase === 'sky') bodyEl.focus({ preventScroll: true }); }, 200);
}
bodyEl.addEventListener('click', () => {
  if (S.phase !== 'sky' || S.tapped || S.setting) return;
  gesture(); S.tapped = true; bodyEl.classList.remove('call'); land(bodyEl); bodyEl.classList.add('lit');
  sfx('good'); Atmos.motes(arcAt(S.u), 4);
  const o = BODIES[S.body]; say(o.tapped);
  const r = $('#time'); r.value = 0; r.disabled = false; timeLabels(); $('#timebar').hidden = false;
  setTimeout(() => r.focus({ preventScroll: true }), 120);
});
$('#time').addEventListener('input', e => { gesture(); scrub(+e.target.value / 100); });
// letting go near the end finishes the setting (small hands rarely reach the very end of the line)
$('#time').addEventListener('change', e => { if (+e.target.value >= 85 && !S.setting) { e.target.value = 100; scrub(1); } });
function scrub(k) {
  if (!S.body || S.setting) return;
  const o = BODIES[S.body];
  S.u = lerp(o.u0, 1, k); bodyEl.classList.add('scrub'); place();
  // the sky changes with the time: night to morning, morning to evening (crossfade in register)
  if (o.to !== o.from) {
    const next = $(`.plates img[data-state="${o.to}"]`); next.classList.add('instant'); next.style.opacity = String(smooth(0.45, 1, k));
  }
  bodyEl.style.opacity = String(1 - smooth(0.9, 1, k));
  if (k >= 1) setDone();
}
async function setDone() {
  if (S.setting || !S.body) return;
  S.setting = true; const o = BODIES[S.body]; const r = $('#time'); r.disabled = true;
  bodyEl.classList.remove('scrub', 'lit'); bodyEl.hidden = true; bodyEl.style.opacity = '';
  setPlate(o.to, true); sfx('set');
  await anim(700); $('#timebar').hidden = true;
  say(o.ask); if (G.tier) await tierHint(o.ask);
  for (;;) {
    const c = await choose([{ id: 'no', label: o.no, icon: ICON.gone }, { id: 'yes', label: o.yes, icon: ICON.stay }]);
    if (c === 'no') break;
    sfx('soft'); say(o.again);
    await Promise.all([watchAgain(), read(3200)]);
    say(o.ask);
  }
  sfx('good'); Atmos.motes([L.w / 2, L.horizon - 40], 5);
  say(o.right); beads(ORDER.indexOf(S.body) + 1);
  if (S.body === 'moon') beatClip('moon'); else setClip(null);
  await next();
  const i = ORDER.indexOf(S.body);
  if (i < ORDER.length - 1) return showBody(ORDER[i + 1], true);
  S.body = null; madeRound();
}
/* "Look again": the light is shown once more just above the horizon, and sinks away again by itself */
async function watchAgain() {
  const o = BODIES[S.body]; bodyEl.hidden = false; bodyEl.disabled = true; bodyEl.style.opacity = '1';
  S.u = 0.86; place(); await anim(400);
  bodyEl.classList.add('rising'); S.u = 1; place(); bodyEl.style.opacity = '0';
  await anim(2600); bodyEl.classList.remove('rising'); bodyEl.hidden = true; bodyEl.style.opacity = '';
  void o;
}
function tierHint(ask) { say({ en: ask.en + ' ' + W.tierAsk.en, ar: ask.ar + ' ' + W.tierAsk.ar }); return read(2400); }
/* the grown-up sets the pace after a longer line: one Next button (the narration never runs ahead of the reading) */
function next() { return new Promise(res => { setAct(W.next, () => { setAct(null); sfx('tap'); res(); }); setTimeout(() => $('#actBtn').focus({ preventScroll: true }), 80); }); }

/* ======================= 2. "Allah made them all": the three lights into the cartouche ======================= */
function madeRound() {
  setPhase('made'); S.placedN = 0;
  $('#made').hidden = false; $('#tokens').hidden = false;
  $$('.slot').forEach(s => s.classList.remove('full'));
  $$('.token').forEach(tk => { tk.hidden = false; tk.style.translate = ''; tk.classList.remove('gone'); });
  say(W.frameAsk); setClip(null);
  setTimeout(() => $('.token').focus({ preventScroll: true }), 150);
}
$$('.token').forEach(tk => makeDraggable(tk, {
  screen: true,
  enabled: () => S.phase === 'made' && !tk.classList.contains('gone'),
  targets: () => [$('#made')],
  onTap: el => putToken(el),
  onDrop: el => putToken(el),
  onMiss: () => say(W.missFrame)
}));
async function putToken(tk) {
  if (tk.classList.contains('gone')) return;
  const k = tk.dataset.k, slot = $(`.slot[data-k="${k}"]`);
  // glide into its slot in the cartouche
  const a = tk.getBoundingClientRect(), b = slot.getBoundingClientRect();
  const cur = (tk.style.translate || '0px 0px').split(' ').map(parseFloat);
  const to = `${cur[0] + (b.left + b.width / 2) - (a.left + a.width / 2)}px ${(cur[1] || 0) + (b.top + b.height / 2) - (a.top + a.height / 2)}px`;
  tk.classList.add('gone'); tk.style.translate = to;
  sfx('good'); say(W.placed[k]);
  await anim(650);
  slot.classList.add('full'); slot.innerHTML = tk.innerHTML; tk.hidden = true;
  S.placedN++;
  if (S.placedN < 3) { const nx = $$('.token').find(x => !x.hidden); if (nx) nx.focus({ preventScroll: true }); return; }
  beads(4);
  await anim(500);
  sfx('done'); Atmos.motes([L.w / 2, L.horizon * 0.5], 6);
  say(W.frameDone); $('#tokens').hidden = true;
  await read(1800); $('#made').hidden = true; $('#qShow').hidden = false;
  beatClip('made');
  await read(4000); await next();
  await pausePoint(W.pause1Q, W.pause1H);
  setAct(W.toTent, toTent); $('#actBtn').focus({ preventScroll: true });
}

/* ======================= 3. the guests (51:25-27, 11:69): the guests are never drawn ======================= */
async function wipe(fn) {
  const w = $('.wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  await anim(650); fn(); await anim(750); w.classList.remove('go');
}
async function toTent() {
  setAct(null); $('#qShow').hidden = true; $('#made').hidden = true; stopClip(); setClip(null);
  await wipe(() => { setPhase('tent'); setPlate('tent', true); Atmos.stars(false); wind(0.5); place(); });
  world.setAttribute('aria-label', rtl() ? 'خيمة إبراهيم' : "Ibrahim's tent");
  say(W.tentIntro); if (G.tier) await tierHint(W.tentIntro);
  for (;;) {
    const c = await choose([{ id: 'salam', label: W.optSalam, icon: ICON.welcome }, { id: 'away', label: W.optAway, icon: ICON.shut }]);
    if (c === 'salam') break;
    sfx('soft'); say(W.away); await read(3200); say(W.tentIntro);
  }
  sfx('good'); $('.matglow').classList.add('on'); beads(5);
  say(W.hurry); const cu = $('#curtain'); cu.hidden = false; S.step = 'curtain';
  setTimeout(() => cu.focus({ preventScroll: true }), 120);
}
$('#curtain').addEventListener('click', async () => {
  if (S.step !== 'curtain') return; gesture(); S.step = 'food';
  const cu = $('#curtain'); cu.classList.add('open'); sfx('cloth'); setTimeout(() => sfx('step'), 300);
  await anim(1300); cu.hidden = true; cu.classList.remove('open');
  // two dishes come out from the household: the best, and a plain crust (a kind thing, just not the best)
  S.trayAt = null; placeDishes();
  ['#dishBest', '#dishCrust'].forEach(s => { const d = $(s); d.hidden = false; d.classList.remove('gone', 'chosen'); d.style.translate = ''; land(d); });
  say(W.food); if (G.tier) await tierHint(W.food);
  setTimeout(() => $(Math.random() < 0.5 ? '#dishBest' : '#dishCrust').focus({ preventScroll: true }), 120);
});
$('#dishCrust').addEventListener('click', () => {
  if (S.step !== 'food') return; gesture(); sfx('soft'); wob($('#dishCrust')); say(W.crust);
});
makeDraggable($('#dishBest'), {
  enabled: () => S.step === 'food' || S.step === 'carry',
  targets: () => [$('#spotNear'), $('#spotFar')],
  onTap: el => {
    if (S.step === 'food') return chooseBest();
    if (S.step === 'carry') select(el, { onSelect: () => say(W.selTray) });
  },
  onDrop: (el, tg) => putTray(tg),
  onMiss: () => say(W.missTray)
});
async function chooseBest() {
  S.step = 'carry'; sfx('good'); const d = $('#dishBest'); d.classList.add('chosen'); land(d);
  $('#dishCrust').classList.add('gone'); setTimeout(() => ($('#dishCrust').hidden = true), 700);
  beads(6); say(W.best);
  ['#spotNear', '#spotFar'].forEach(s => ($(s).hidden = false));
  // the two places appear in a random order for the keyboard, so the near one is a real choice
  const sp = $('#spotNear').parentNode; if (Math.random() < 0.5) sp.insertBefore($('#spotFar'), $('#spotNear')); else sp.insertBefore($('#spotNear'), $('#spotFar'));
  // keyboard: focus goes to the first place (Tab reaches the other); pointer users drag or tap the tray
  setTimeout(() => $('.spot:not([hidden])', sp).focus({ preventScroll: true }), 120);
}
['#spotNear', '#spotFar'].forEach(s => $(s).addEventListener('click', () => { if (S.step !== 'carry') return; gesture(); clearSel(); putTray($(s)); }));
async function putTray(tg) {
  const d = $('#dishBest');
  if (tg.id === 'spotFar') {
    sfx('soft'); springBack(d); S.trayAt = null; placeDishes(); say(W.farMsg); wob(d); return;
  }
  S.step = 'invite'; d.style.translate = ''; d.classList.add('glide'); S.trayAt = 'near'; placeDishes();
  ['#spotNear', '#spotFar'].forEach(s => ($(s).hidden = true));
  sfx('step'); await anim(1100); land(d); d.classList.remove('glide'); sfx('good'); Atmos.motes(L.tent.near, 3);
  beads(7);
  say(W.invite); if (G.tier) await tierHint(W.invite);
  for (;;) {
    const c = await choose([{ id: 'polite', label: W.optPolite, icon: ICON.platter }, { id: 'rude', label: W.optRude, icon: ICON.sharp }]);
    if (c === 'polite') break;
    sfx('soft'); say(W.rude); await read(3000); say(W.invite);
  }
  sfx('done'); beads(8); say(W.done);
  await read(1500); await next();
  say(W.angels);   // the tray stays whole: nothing shows the food being eaten (gate 1)
  await read(1500); await next();
  await pausePoint(W.pause2Q, W.pause2H);
  nightEnd();
}

/* ======================= parent pause ======================= */
function pausePoint(q, h) {
  return new Promise(res => {
    S.pauseQ = { q, h }; $('#pauseQ').textContent = t(q); $('#pauseHint').textContent = t(h);
    $('#pause').hidden = false; sfx('soft'); setTimeout(() => $('#pauseGo').focus({ preventScroll: true }), 80);
    $('#pauseGo').onclick = () => { $('#pause').hidden = true; S.pauseQ = null; sfx('tap'); res(); };
  });
}

/* ======================= 4. night again: the reward moment and the ending ======================= */
async function nightEnd() {
  S.step = null;
  await wipe(() => {
    setPhase('end'); setPlate('night', true); Atmos.stars(true); wind(0.7);
    $('#dishBest').hidden = true; $('.matglow').classList.remove('on'); S.trayAt = null; place();
  });
  world.setAttribute('aria-label', rtl() ? 'الصحراء في الليل' : 'The desert at night');
  say(W.night);
  await read(5200);
  reward();
}
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
  buildShamsa();
  const rw = $('#reward');
  // the lamp glow rises over the far town, where Ibrahim's people lived
  rw.style.setProperty('--lx', '50%'); rw.style.setProperty('--ly', (G.orient === 'port' ? 62 : 58) + '%');
  const port = G.orient === 'port', sx = port ? 50 : 76;
  rw.style.setProperty('--sx', (rtl() ? 100 - sx : sx) + '%'); rw.style.setProperty('--sy', (port ? 30 : 30) + '%');
  void rw.offsetWidth; rw.classList.add('on');
  await anim(900); sfx('done'); Atmos.motes([L.w / 2, L.horizon], 9);
  await anim(2600);
  S.ended = true; $('#endBody').textContent = t(W.endB);
  $('#tierBox').checked = G.tier; $('#ending').hidden = false; app.classList.add('ended');
  wind(0);   // the ending is a still, quiet frame: the wind fades to nothing (no pulse remains)
  setTimeout(() => $('#againBtn').focus({ preventScroll: true }), 80);
}
$('#againBtn').addEventListener('click', () => { G.tier = $('#tierBox').checked; sfx('tap'); reset(); });

/* ======================= reset ======================= */
function reset() {
  Object.assign(S, { phase: 'sky', body: null, u: 0, tapped: false, setting: false, ended: false, pauseQ: null, act: null, step: null, trayAt: null, placedN: 0 });
  app.className = 'phase-sky' + (G.bed ? ' bed' : '') + (Atmos.ok ? '' : ' nopixi');
  ['#ending', '#pause', '#choices', '#timebar', '#made', '#tokens', '#qShow', '#curtain', '#dishBest', '#dishCrust', '#spotNear', '#spotFar'].forEach(s => ($(s).hidden = true));
  $('#reward').classList.remove('on'); $('.matglow').classList.remove('on'); setAct(null);
  $$('.slot').forEach(s => { s.classList.remove('full'); s.innerHTML = ''; });
  setPlate('night', true); Atmos.reset(); beads(0);
  world.setAttribute('aria-label', rtl() ? 'الصحراء في الليل' : 'The desert at night');
  place();
  showBody('star', false);
}

/* ======================= settings ======================= */
$('#langBtn').addEventListener('click', () => { gesture(); G.lang = rtl() ? 'en' : 'ar'; try { localStorage.setItem('islamicKidsLang', G.lang); } catch (e) { /* private */ } applyLang(); });
$('#soundBtn').addEventListener('click', () => { gesture(); G.sound = !G.sound; $('#soundBtn').setAttribute('aria-pressed', String(G.sound)); if (!G.sound) { stopClip(); wind(0); setMuted(true); } else { setMuted(false); wind(0.8); } });
$('#bedBtn').addEventListener('click', () => { gesture(); G.bed = !G.bed; $('#bedBtn').setAttribute('aria-pressed', String(G.bed)); app.classList.toggle('bed', G.bed); wind(0.8); Atmos.calm(); });
$('#listenBtn').addEventListener('click', () => { gesture(); playClip(); });
addEventListener('resize', fit);
addEventListener('keydown', e => { if (e.key === 'Escape') clearSel(); });

/* ======================= atmosphere canvas (PixiJS). Decoration only: the game is whole without it. ======================= */
const Atmos = (() => {
  const A = { ok: false };
  let px = null, layers = {}, tex = {}, state = { stars: true, still: RM }, motes = [], glints = [];
  const canvas = $('#atmos');
  function softTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return PIXI.Texture.from(c); }
  async function init() {
    if (!window.PIXI) throw new Error('no PIXI');
    px = new PIXI.Application();
    await px.init({ canvas, width: L.w, height: L.h, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: Math.min(2, (devicePixelRatio || 1) * G.s), preference: 'webgl', autoStart: false, sharedTicker: false });
    tex.mote = softTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(.25, 'rgba(240,200,110,.7)'); gr.addColorStop(1, 'rgba(224,183,92,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    tex.glint = softTex(32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(.3, 'rgba(255,230,170,.5)'); gr.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
    layers.stars = new PIXI.Container(); layers.motes = new PIXI.Container();
    px.stage.addChild(layers.stars, layers.motes);
    A.ok = true; app.classList.remove('nopixi');
    resize(); wake();
  }
  function resize() {
    if (!A.ok) return;
    px.renderer.resolution = Math.min(2, (devicePixelRatio || 1) * G.s);
    px.renderer.resize(L.w, L.h); canvas.style.width = L.w + 'px'; canvas.style.height = L.h + 'px';
    seedStars(); wake();
  }
  function seedStars() {
    if (!A.ok) return; layers.stars.removeChildren().forEach(c => c.destroy()); glints = [];
    const [x0, y0, x1, y1] = L.sky;
    for (let i = 0; i < 18; i++) { const s = new PIXI.Sprite(tex.glint); s.anchor.set(0.5); s.blendMode = 'add'; s.x = lerp(x0, x1, Math.random()); s.y = lerp(y0, y1, Math.random() ** 1.3); s.scale.set(0.3 + Math.random() * 0.35); s.ph = Math.random() * 6.28; s.per = 4 + Math.random() * 4; layers.stars.addChild(s); glints.push(s); }
    layers.stars.alpha = state.stars ? 1 : 0;
  }
  function stars(on) { state.stars = on; wake(); }
  function motesAt([x, y], n) {
    if (!A.ok || G.bed) return;
    for (let i = 0; i < n; i++) { const m = new PIXI.Sprite(tex.mote); m.anchor.set(0.5); m.blendMode = 'add'; m.x = x + (Math.random() - 0.5) * 120; m.y = y - 30 + (Math.random() - 0.3) * 50; m.scale.set(0.25 + Math.random() * 0.35); m.life = 0; m.max = 2.6 + Math.random() * 1.6; m.vx = (Math.random() - 0.5) * 14; m.alpha = 0; layers.motes.addChild(m); motes.push(m); }
    wake();
  }
  let raf = 0, last = 0, clock = 0;
  function wake() { if (A.ok && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    raf = 0; const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt; let live = false;
    // stars show only over a night sky; slow twinkle (4-8 s)
    const st = state.stars && (S.plate === 'night' || S.plate === 'evening') ? (S.plate === 'evening' ? 0.45 : 1) : 0;
    if (Math.abs(layers.stars.alpha - st) > 0.01) { layers.stars.alpha += Math.sign(st - layers.stars.alpha) * dt * 0.4; live = true; }
    if (layers.stars.alpha > 0.01 && !state.still && !G.bed) { glints.forEach(s => (s.alpha = 0.45 + 0.4 * Math.sin(s.ph + clock * 6.28 / s.per))); live = true; }
    motes = motes.filter(m => { m.life += dt; const k = m.life / m.max; m.y -= dt * 26; m.x += m.vx * dt; m.alpha = k < 0.2 ? k * 4 : Math.max(0, (1 - k) * 0.9); if (k >= 1) { m.destroy(); return false; } live = true; return true; });
    px.render();
    if (live) raf = requestAnimationFrame(frame);
  }
  function reset() { if (!A.ok) return; state.stars = true; motes.forEach(m => m.destroy()); motes = []; wake(); }
  function calm() { if (A.ok) wake(); }
  Object.assign(A, { init, resize, stars, motes: motesAt, reset, calm, wake });
  return A;
})();

/* ======================= boot ======================= */
async function boot() {
  try { MANIFEST = await (await fetch(IMG + 'manifest.json')).json(); } catch (e) { /* aspects fall back to defaults */ }
  if (MANIFEST.layout) ['land', 'port'].forEach(k => MANIFEST.layout[k] && Object.assign(LAYOUT[k], MANIFEST.layout[k]));
  app.classList.add('nopixi');
  applyLang();
  reset();
  try { await Atmos.init(); Atmos.reset(); } catch (e) { app.classList.add('nopixi'); }
  window.__ibr = { levelDb, wind, acState: () => (AC ? AC.state : 'none'), S, G, L: () => L, Atmos, W, BODIES, CLIPS, say, arcAt, setDone, scrub }; // for the headless play-through and wording checks
}
boot();
})();
