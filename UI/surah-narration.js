/* ============================================
   Surah narration

   Story pages are slide-based, so their narration is slide-indexed. A surah
   page is a scroll page, so the natural unit here is the verse: each verse
   card gets its own listen button, and there is one control at the top that
   reads the whole surah verse by verse.

   A pre-generated file (recorded from the card's meaning line and explanation)
   is played where it exists. If it is missing, the browser's own speech
   synthesis reads the card's explanation only, so the feature degrades quietly.

   Files, when generated: audio/<surah-id>/<lang>/verse-<n>.mp3

   NO RECITATION (scholar ruling, round 3, 2026-11-04, Part 2 A): no synthetic
   voice may speak Quranic wording. The Arabic "meaning" line of every verse card
   was the ayah itself, so every Arabic verse file opened by reciting it. Those
   files were removed. Until the tafsir-based Arabic meaning lines are written,
   approved and recorded, AR_VERSE_AUDIO stays false: on an Arabic page the
   listen controls show a "coming soon" note, no verse file is requested, and no
   speech synthesis runs. Turning it back on is this one flag (and the check in
   scripts/verify-no-recitation.py reads it from here). Games 07 and 08 read the
   same flag via window.SurahNarration.

   Speech synthesis, in either language, reads ONLY the explanation paragraph.
   It never reads .translation, the Arabic ayah, the complete-surah block or
   anything carrying data-ayah: verify-no-recitation.py fails the build if this
   file names any of them outside this comment.
   ============================================ */
(function () {
    'use strict';

    var AR_VERSE_AUDIO = false;

    window.SurahNarration = {
        arVerseAudio: AR_VERSE_AUDIO,
        soonText: { ar: 'السرد بالعربية قريباً', en: 'Arabic narration is coming soon' }
    };

    var state = {
        audio: null,
        utterance: null,
        playingIndex: -1,
        playAll: false
    };

    function surahId() {
        return (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    }

    function lang() {
        return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    /* Arabic page, interim: nothing to play yet. */
    function soon() {
        return lang() === 'ar' && !AR_VERSE_AUDIO;
    }

    function label(key) {
        var ar = lang() === 'ar';
        return {
            soonVerse: 'السرد بالعربية قريباً',
            listen: ar ? 'استمع' : 'Listen',
            stop: ar ? 'إيقاف' : 'Stop',
            readAll: ar ? '▶ اقرأ السورة كلها' : '▶ Read the whole surah',
            stopAll: ar ? '■ إيقاف' : '■ Stop',
            player: ar ? 'استمع إلى المعاني' : 'Listen to the meanings',
            playerSub: ar ? 'شرح كل آية، واحدة بعد الأخرى' : 'Each verse explained, one after another',
            playerOn: ar ? 'الآية {n} من {N}' : 'Verse {n} of {N}',
            playAll: ar ? 'استمع إلى معاني كل الآيات' : 'Listen to the meaning of every verse',
            pauseAll: ar ? 'إيقاف' : 'Stop'
        }[key];
    }

    /* The words speech synthesis may say for a verse: the explanation only, in
       either language. Never the ayah, and never the translation line (on an
       Arabic page that line is the ayah itself). */
    function textFor(card) {
        var e = card.querySelector('.verse-explanation p');
        return e ? e.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    function stop() {
        if (state.audio) {
            state.audio.pause();
            state.audio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        state.utterance = null;
        state.playingIndex = -1;
        state.playAll = false;
        refresh();
    }

    function speak(text, onEnd) {
        if (!window.speechSynthesis || !text || soon()) { onEnd(); return; }
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang() === 'ar' ? 'ar-SA' : 'en-GB';
        u.rate = 0.9;
        u.onend = onEnd;
        u.onerror = onEnd;
        state.utterance = u;
        window.speechSynthesis.speak(u);
    }

    function playIndex(i, cards) {
        if (i >= cards.length || soon()) { stop(); return; }
        var card = cards[i];
        state.playingIndex = i;
        refresh();

        var done = function () {
            if (state.playAll && state.playingIndex === i) {
                playIndex(i + 1, cards);
            } else if (state.playingIndex === i) {
                stop();
            }
        };

        var src = 'audio/' + surahId() + '/' + lang() + '/verse-' + (i + 1) + '.mp3';
        var a = new Audio(src);
        state.audio = a;
        a.addEventListener('ended', done);
        a.addEventListener('error', function () {
            // No generated file for this verse yet - read it aloud instead.
            state.audio = null;
            speak(textFor(card), done);
        });
        a.play().catch(function () {
            state.audio = null;
            speak(textFor(card), done);
        });
    }

    function refresh() {
        var cards = document.querySelectorAll('.verse-card');
        Array.prototype.forEach.call(cards, function (card, i) {
            var btn = card.querySelector('.verse-listen');
            if (!btn) return;
            var s = soon();
            btn.classList.toggle('is-soon', s);
            btn.setAttribute('aria-disabled', String(s));
            if (s) {
                btn.textContent = label('soonVerse');
                btn.setAttribute('aria-pressed', 'false');
                return;
            }
            var on = state.playingIndex === i;
            btn.textContent = (on ? '■ ' : '▶ ') + (on ? label('stop') : label('listen'));
            btn.setAttribute('aria-pressed', String(on));
        });
        highlight(cards);
        refreshPlayer(cards);
        var all = document.querySelector('.surah-listen-all');
        if (all) {
            var sa = soon();
            all.classList.toggle('is-soon', sa);
            all.setAttribute('aria-disabled', String(sa));
            if (sa) {
                /* two lines, one per language, so the bidi text does not interleave */
                all.textContent = '';
                var a1 = document.createElement('span');
                a1.lang = 'ar'; a1.dir = 'rtl'; a1.className = 'soon-line';
                a1.textContent = window.SurahNarration.soonText.ar;
                var a2 = document.createElement('span');
                a2.lang = 'en'; a2.dir = 'ltr'; a2.className = 'soon-line';
                a2.textContent = window.SurahNarration.soonText.en;
                all.appendChild(a1); all.appendChild(a2);
                all.setAttribute('aria-pressed', 'false');
                return;
            }
            all.textContent = state.playAll ? label('stopAll') : label('readAll');
            all.setAttribute('aria-pressed', String(state.playAll));
        }
    }

    /* v2: the verse whose meaning is being narrated is marked: a gold wash, a
       3px reading-edge bar (surah.css) and aria-current. While "listen to every
       verse" runs, a card that is off screen is brought into view (instantly if
       the reader asked for reduced motion); a single tapped verse is already in
       view, so the page never jumps under the child's finger. Focus never moves. */
    function highlight(cards) {
        Array.prototype.forEach.call(cards, function (card, i) {
            var on = state.playingIndex === i;
            card.classList.toggle('is-narrating', on);
            if (on) card.setAttribute('aria-current', 'true');
            else card.removeAttribute('aria-current');
        });
        if (state.playAll && state.playingIndex >= 0) {
            var c = cards[state.playingIndex];
            var r = c.getBoundingClientRect();
            if (r.top < 64 || r.bottom > window.innerHeight - 96) {
                var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                c.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
            }
        }
    }

    function digits(n) {
        return lang() === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
    }

    /* The sticky mini player (app screens): one play control for the whole
       surah's meaning narration, showing which verse is playing. */
    function refreshPlayer(cards) {
        var player = document.querySelector('.mini-player');
        if (!player) return;
        var btn = player.querySelector('.play-btn');
        var title = player.querySelector('.mini-player__title');
        var sub = player.querySelector('.mini-player__sub');
        var s = soon();
        btn.setAttribute('aria-disabled', String(s));
        btn.setAttribute('aria-pressed', String(!s && state.playAll));
        btn.setAttribute('aria-label', state.playAll ? label('pauseAll') : label('playAll'));
        if (s) {
            title.textContent = window.SurahNarration.soonText.ar;
            sub.textContent = window.SurahNarration.soonText.en;
            sub.lang = 'en';
            return;
        }
        sub.removeAttribute('lang');
        title.textContent = label('player');
        sub.textContent = state.playingIndex >= 0
            ? label('playerOn').replace('{n}', digits(state.playingIndex + 1)).replace('{N}', digits(cards.length))
            : label('playerSub');
    }

    function init() {
        var cards = document.querySelectorAll('.verse-card');
        if (!cards.length) return;

        Array.prototype.forEach.call(cards, function (card, i) {
            if (card.querySelector('.verse-listen')) return;
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'verse-listen';
            btn.setAttribute('aria-pressed', 'false');
            btn.addEventListener('click', function () {
                if (soon()) return;
                if (state.playingIndex === i) { stop(); return; }
                stop();
                state.playAll = false;
                playIndex(i, cards);
            });
            var content = card.querySelector('.verse-content') || card;
            content.appendChild(btn);
        });

        var picker = document.querySelector('.stage-picker');
        var playAllClick = function () {
            if (soon()) return;
            if (state.playAll) { stop(); return; }
            stop();
            state.playAll = true;
            playIndex(0, cards);
        };
        if (picker && document.body.classList.contains('app') && !document.querySelector('.mini-player')) {
            var player = document.createElement('div');
            player.className = 'mini-player';
            player.innerHTML =
                '<button class="play-btn" type="button" aria-pressed="false">' +
                '<svg class="icon icon-play" aria-hidden="true"><use href="vendor/icons/sprite.svg#i-play"/></svg>' +
                '<svg class="icon icon-pause" aria-hidden="true"><use href="vendor/icons/sprite.svg#i-pause"/></svg></button>' +
                '<span class="mini-player__text" aria-live="polite"><span class="mini-player__title"></span><span class="mini-player__sub"></span></span>';
            player.querySelector('.play-btn').addEventListener('click', playAllClick);
            picker.after(player);
        } else if (picker && !document.querySelector('.surah-listen-all')) {
            var all = document.createElement('button');
            all.type = 'button';
            all.className = 'surah-listen-all';
            all.setAttribute('aria-pressed', 'false');
            all.addEventListener('click', playAllClick);
            picker.appendChild(all);
        }

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
