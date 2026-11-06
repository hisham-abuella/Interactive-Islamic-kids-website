/* ============================================
   Home screen (index.html), Illuminated Page v2
   - reveals tiles as they scroll in (only after js-reveal proved JS runs)
   - fades cover plates in when loaded (never a blank box: the tile has a
     parchment skeleton behind it)
   - greets the child by name
   - fills the one gold card: "Continue" a story in progress, else "Keep
     learning" a surah marked learning, else "Tonight's story" by date
   - fills the progress row from what this device remembers
   Nothing leaves the browser.
   ============================================ */
(function () {
    'use strict';

    var STORIES = [
        { id: 'prophet-adam',    pages: 18, en: 'Prophet Adam, the first human',           ar: 'النبي آدم، أول إنسان',            enText: 'How Allah made the first human, and how we are all one family.', arText: 'كيف خلق الله أول إنسان، وكيف أننا جميعاً أسرة واحدة.' },
        { id: 'prophet-nuh',     pages: 16, en: 'Prophet Nuh and the Great Ark',           ar: 'النبي نوح والسفينة العظيمة',      enText: 'Patience and trust in Allah, told in 16 short pages.',           arText: 'الصبر والثقة بالله، في ١٦ صفحة قصيرة.' },
        { id: 'prophet-ibrahim', pages: 16, en: "Prophet Ibrahim's trust in Allah",        ar: 'ثقة النبي إبراهيم بالله',          enText: 'Faith that stayed strong, even in the fire.',                    arText: 'إيمان بقي قوياً، حتى في النار.' },
        { id: 'prophet-yusuf',   pages: 0,  en: 'Prophet Yusuf and the beautiful dream',   ar: 'النبي يوسف والرؤيا الجميلة',      enText: 'A dream, a well, a palace, and a family made whole again.',      arText: 'رؤيا، وبئر، وقصر، وأسرة اجتمعت من جديد.' },
        { id: 'prophet-musa',    pages: 20, en: 'Prophet Musa and the parting of the sea', ar: 'النبي موسى وانشقاق البحر',        enText: 'From a basket on the river to a path through the sea.',          arText: 'من سلة على النهر إلى طريق في البحر.' }
    ];

    function lang() { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }
    function num(n) { return lang() === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n); }
    function read(key) {
        try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) { return {}; }
    }

    /* ---- reveal + image fade ---- */
    function initReveal() {
        var items = document.querySelectorAll('.fade-in');
        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(items, function (el) { el.classList.add('visible'); });
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
                });
            }, { rootMargin: '0px 0px -24px 0px', threshold: 0.01 });
            Array.prototype.forEach.call(items, function (el) { io.observe(el); });
        }
        /* safety net: whatever happens, nothing stays hidden after 1.2s */
        setTimeout(function () {
            Array.prototype.forEach.call(items, function (el) { el.classList.add('visible'); });
        }, 1200);

        Array.prototype.forEach.call(document.querySelectorAll('.tile__cover img, .feature-card__cover img'), function (img) {
            var done = function () { img.classList.add('is-loaded'); };
            if (img.complete) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
        });
    }

    /* ---- greeting ---- */
    function renderGreeting() {
        var h = document.getElementById('greeting');
        if (!h) return;
        var name = '';
        try { name = (localStorage.getItem('islamicKidsName') || '').trim(); } catch (e) {}
        var hello = lang() === 'ar' ? 'السلام عليكم' : 'Assalamu alaikum';
        h.textContent = name ? hello + (lang() === 'ar' ? ' يا ' : ', ') + name : hello;
    }

    /* ---- the featured card ---- */
    function dayOfYear() {
        var d = new Date();
        return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    }

    function pick() {
        var sp = read('ik-story-progress');
        var best = null;
        STORIES.forEach(function (s) {
            var p = sp[s.id];
            if (p && !p.done && p.slide > 0 && (!best || (p.t || 0) > (best.p.t || 0))) best = { s: s, p: p };
        });
        if (best) return { kind: 'continue', story: best.s, progress: best.p };
        return { kind: 'tonight', story: STORIES[dayOfYear() % STORIES.length] };
    }

    function renderFeatured() {
        var card = document.getElementById('featured');
        if (!card) return;
        var choice = pick();
        var s = choice.story;
        var ar = lang() === 'ar';
        card.href = 'story-' + s.id + '.html';
        var img = document.getElementById('featuredImg');
        if (img && img.getAttribute('src') !== 'images/stories/' + s.id + '/cover.webp') {
            img.classList.remove('is-loaded');
            img.onload = function () { img.classList.add('is-loaded'); };
            img.src = 'images/stories/' + s.id + '/cover.webp';
        }
        var kicker = document.querySelector('#featuredKicker span');
        var title = document.getElementById('featuredTitle');
        var text = document.getElementById('featuredText');
        var cta = document.querySelector('#featuredCta span');
        title.textContent = ar ? s.ar : s.en;
        if (choice.kind === 'continue') {
            var p = choice.progress;
            kicker.textContent = ar ? 'تابع القراءة' : 'Continue reading';
            text.textContent = ar
                ? 'توقفت عند الصفحة ' + num(p.slide + 1) + ' من ' + num(p.total) + '.'
                : 'You stopped on page ' + (p.slide + 1) + ' of ' + p.total + '.';
            cta.textContent = ar ? 'تابع' : 'Continue';
        } else {
            kicker.textContent = ar ? 'قصة الليلة' : "Tonight's story";
            text.textContent = ar ? s.arText : s.enText;
            cta.textContent = ar ? 'ابدأ القراءة' : 'Start reading';
        }
    }

    /* ---- progress row ---- */
    function renderProgress() {
        var sp = read('ik-story-progress');
        var finished = STORIES.filter(function (s) { return sp[s.id] && sp[s.id].done; }).length;
        var qp = read('ik-surah-progress');
        var memorised = 0, learning = 0;
        Object.keys(qp).forEach(function (k) { if (qp[k] === 2) memorised++; if (qp[k] === 1) learning++; });
        var set = function (id, v, of) {
            var el = document.getElementById('stat' + id);
            if (el) el.textContent = num(v);
            var m = document.getElementById('meter' + id);
            if (m) m.style.width = Math.min(100, Math.round((v / of) * 100)) + '%';
        };
        set('Stories', finished, STORIES.length);
        set('Memorised', memorised, 22);
        set('Learning', learning, 22);

        /* a small "reading" badge on a story tile that is in progress */
        Array.prototype.forEach.call(document.querySelectorAll('[data-story]'), function (tile) {
            var p = sp[tile.getAttribute('data-story')];
            var cover = tile.querySelector('.tile__cover');
            var badge = cover.querySelector('.tile__badge');
            var label = p && p.done ? (lang() === 'ar' ? 'أنهيتها' : 'Finished')
                      : p && p.slide > 0 ? (lang() === 'ar' ? 'تقرؤها الآن' : 'Reading') : '';
            if (!label) { if (badge) badge.remove(); return; }
            if (!badge) { badge = document.createElement('span'); badge.className = 'tile__badge'; cover.appendChild(badge); }
            badge.textContent = label;
        });
    }

    function renderAll() { renderGreeting(); renderFeatured(); renderProgress(); }

    function init() {
        initReveal();
        renderAll();
        document.addEventListener('languageChanged', renderAll);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
