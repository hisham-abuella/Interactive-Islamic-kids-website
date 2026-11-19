/* ============================================
   Surah recitation: a human qari, never a synthetic voice

   Every verse card gets a "Recitation" button, next to (and visibly different
   from) the father's "Listen" meaning narration. It plays Sheikh Mahmoud
   Khalil al-Husary's teaching (Muallim) recitation of that ayah: slow and
   clear, with a pause after it for the child to repeat. The Complete Surah
   block gets one button that recites every ayah in order.

   Files: recitation/husary-muallim/SSSAAA.mp3, served from this site (fetched
   once by scripts/fetch-recitation.py, pinned by recitation/SHA256SUMS). No
   live third-party calls. Ayat al-Kursi is one ayah (2:255) shown on 8 cards:
   each card plays its stretch of 002255.mp3 from recitation/husary-muallim/parts.json.

   This file plays recorded human recitation only. It must never use speech
   synthesis; scripts/verify-no-recitation.py fails the build if it does.
   Recitation and meaning narration never play at once: each announces itself
   with a 'kidsaudio:start' event and the other stops.
   ============================================ */
(function () {
    'use strict';

    var DIR = 'recitation/husary-muallim/';
    var SURAH = {
        'surah-fatiha': 1, 'surah-al-ikhlas': 112, 'surah-al-falaq': 113, 'surah-an-nas': 114,
        'surah-al-kawthar': 108, 'surah-al-asr': 103, 'surah-an-nasr': 110,
        'surah-al-kafirun': 109, 'surah-al-maun': 107, 'surah-quraysh': 106,
        'surah-al-masad': 111, 'surah-al-fil': 105, 'surah-az-zalzalah': 99,
        'surah-ad-duha': 93, 'surah-ash-sharh': 94, 'surah-at-tin': 95,
        'surah-al-humazah': 104, 'surah-at-takathur': 102, 'surah-al-qariah': 101,
        'surah-al-adiyat': 100, 'surah-al-bayyinah': 98, 'ayat-al-kursi': 2
    };

    var page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    var surah = SURAH[page];
    var kursi = page === 'ayat-al-kursi';
    var parts = null;          // Ayat al-Kursi card stretches, loaded on demand

    var state = { audio: null, index: -1, all: false, stopAt: null };

    function lang() {
        return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    function digits(n) {
        return lang() === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
    }

    function label(key) {
        var ar = lang() === 'ar';
        return {
            verse: ar ? 'التلاوة' : 'Recitation',
            stop: ar ? 'إيقاف' : 'Stop',
            verseN: ar ? 'استمع إلى تلاوة الشيخ الحصري للآية {n}' : 'Listen to Sheikh al-Husary recite verse {n}',
            all: ar ? '🎧 استمع إلى السورة كلها بصوت الشيخ الحصري' : '🎧 Listen to the whole surah, recited by Sheikh al-Husary',
            allKursi: ar ? '🎧 استمع إلى آية الكرسي بصوت الشيخ الحصري' : '🎧 Listen to Ayat al-Kursi, recited by Sheikh al-Husary',
            stopAll: ar ? '■ إيقاف التلاوة' : '■ Stop the recitation',
            credit: ar
                ? 'التلاوة بصوت الشيخ محمود خليل الحصري (المصحف المعلّم)، من موقع EveryAyah.com. بعد كل آية وقفة قصيرة لتردّدها.'
                : 'Recitation by Sheikh Mahmoud Khalil al-Husary (teaching recitation), from EveryAyah.com. After each verse there is a short pause for you to repeat it.'
        }[key];
    }

    function file(ayah) {
        return DIR + ('00' + surah).slice(-3) + ('00' + ayah).slice(-3) + '.mp3';
    }

    function cards() {
        return document.querySelectorAll('.verse-card');
    }

    /* Ayat al-Kursi: the card stretches, and the 2:255 file held in memory. A
       card must start mid-file, and seeking needs HTTP range support, which not
       every server gives; a blob URL is always seekable. Fetched once (1.8 MB). */
    var kursiUrl = null;
    function loadParts() {
        if (!kursi || (parts && kursiUrl)) return Promise.resolve(parts);
        return Promise.all([
            fetch(DIR + 'parts.json').then(function (r) { return r.json(); }),
            fetch(file(255)).then(function (r) {
                if (!r.ok) throw new Error('recitation file missing');
                return r.blob();
            })
        ]).then(function (res) {
            parts = res[0]['002255'];
            kursiUrl = URL.createObjectURL(res[1]);
            return parts;
        });
    }

    function stop() {
        if (state.audio) {
            state.audio.pause();
            state.audio = null;
        }
        state.index = -1;
        state.all = false;
        state.stopAt = null;
        refresh();
    }

    /* Play card i (0-based). In "whole surah" mode, go on to the next card. */
    function play(i) {
        var list = cards();
        if (i >= list.length) { stop(); return; }
        document.dispatchEvent(new CustomEvent('kidsaudio:start', { detail: { source: 'recitation' } }));
        state.index = i;
        refresh();

        var next = function () {
            if (state.index !== i) return;
            if (state.all && !kursi) play(i + 1); else stop();
        };

        loadParts().then(function () {
            if (state.index !== i) return;
            var a;
            if (kursi) {
                a = new Audio(kursiUrl);
                if (state.all) {
                    state.stopAt = null;     // the whole ayah, start to end
                } else {
                    var p = parts[i];
                    state.stopAt = p.to;
                    a.addEventListener('loadedmetadata', function () { a.currentTime = p.from; }, { once: true });
                }
            } else {
                a = new Audio(file(i + 1));
                state.stopAt = null;
            }
            state.audio = a;
            a.addEventListener('timeupdate', function () {
                if (state.stopAt !== null && a.currentTime >= state.stopAt) { a.pause(); next(); }
            });
            a.addEventListener('ended', next);
            a.addEventListener('error', function () { if (state.audio === a) stop(); });
            a.play().catch(function () { if (state.audio === a) stop(); });
        }).catch(stop);
    }

    function refresh() {
        Array.prototype.forEach.call(cards(), function (card, i) {
            var btn = card.querySelector('.verse-recite');
            if (!btn) return;
            var on = state.index === i && !state.all;
            btn.textContent = (on ? '■ ' : '🎧 ') + (on ? label('stop') : label('verse'));
            btn.setAttribute('aria-label', label('verseN').replace('{n}', digits(i + 1)));
            btn.setAttribute('aria-pressed', String(on));
            card.classList.toggle('is-reciting', state.index === i && (!kursi || !state.all));
        });
        var all = document.querySelector('.surah-recite-all');
        if (all) {
            all.textContent = state.all ? label('stopAll') : label(kursi ? 'allKursi' : 'all');
            all.setAttribute('aria-pressed', String(state.all));
        }
        var credit = document.querySelector('.recitation-credit');
        if (credit) credit.textContent = label('credit');
    }

    function init() {
        if (!surah) return;
        var list = cards();
        if (!list.length) return;

        Array.prototype.forEach.call(list, function (card, i) {
            if (card.querySelector('.verse-recite')) return;
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'verse-recite';
            btn.addEventListener('click', function () {
                if (state.index === i && !state.all) { stop(); return; }
                stop();
                play(i);
            });
            var content = card.querySelector('.verse-content') || card;
            content.appendChild(btn);
        });

        var section = document.querySelector('.verses-section');
        if (section && !document.querySelector('.recitation-credit')) {
            var credit = document.createElement('p');
            credit.className = 'recitation-credit';
            section.appendChild(credit);
        }

        var full = document.querySelector('.full-surah-card');
        if (full && !document.querySelector('.surah-recite-all')) {
            var all = document.createElement('button');
            all.type = 'button';
            all.className = 'surah-recite-all';
            all.addEventListener('click', function () {
                if (state.all) { stop(); return; }
                stop();
                state.all = true;
                play(0);
            });
            full.parentNode.insertBefore(all, full.nextSibling);
        }

        document.addEventListener('kidsaudio:start', function (e) {
            if (e.detail && e.detail.source !== 'recitation' && state.index >= 0) stop();
        });
        document.addEventListener('languageChanged', function () { stop(); });
        window.addEventListener('beforeunload', stop);
        refresh();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
