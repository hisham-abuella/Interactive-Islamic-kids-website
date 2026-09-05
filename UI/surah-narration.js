/* ============================================
   Surah narration

   Story pages are slide-based, so their narration is slide-indexed. A surah
   page is a scroll page, so the natural unit here is the verse: each verse
   card gets its own listen button, and there is one control at the top that
   reads the whole surah verse by verse.

   The spoken text is taken from the page itself - the translation and the
   explanation already sitting in the card, in whichever language is active -
   so the narration can never drift out of sync with what is written. Where a
   pre-generated file exists it is used; otherwise the browser's own speech
   synthesis reads the same words, so the feature works before any audio has
   been generated and degrades quietly if a file is missing.

   Files, when generated: audio/<surah-id>/<lang>/verse-<n>.mp3
   ============================================ */
(function () {
    'use strict';

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

    function label(key) {
        var ar = lang() === 'ar';
        return {
            listen: ar ? 'استمع' : 'Listen',
            stop: ar ? 'إيقاف' : 'Stop',
            readAll: ar ? '▶ اقرأ السورة كلها' : '▶ Read the whole surah',
            stopAll: ar ? '■ إيقاف' : '■ Stop'
        }[key];
    }

    /* The words for a verse: its meaning and the explanation beside it. The
       Arabic script itself is not read here - a recitation is not a reading. */
    function textFor(card) {
        var parts = [];
        var t = card.querySelector('.translation');
        var e = card.querySelector('.verse-explanation p');
        if (t) parts.push(t.textContent.trim());
        if (e) parts.push(e.textContent.trim());
        return parts.join(' ').replace(/\s+/g, ' ').trim();
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
        if (!window.speechSynthesis) { onEnd(); return; }
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang() === 'ar' ? 'ar-SA' : 'en-GB';
        u.rate = 0.9;
        u.onend = onEnd;
        u.onerror = onEnd;
        state.utterance = u;
        window.speechSynthesis.speak(u);
    }

    function playIndex(i, cards) {
        if (i >= cards.length) { stop(); return; }
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
            var on = state.playingIndex === i;
            btn.textContent = (on ? '■ ' : '▶ ') + (on ? label('stop') : label('listen'));
            btn.setAttribute('aria-pressed', String(on));
        });
        var all = document.querySelector('.surah-listen-all');
        if (all) {
            all.textContent = state.playAll ? label('stopAll') : label('readAll');
            all.setAttribute('aria-pressed', String(state.playAll));
        }
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
                if (state.playingIndex === i) { stop(); return; }
                stop();
                state.playAll = false;
                playIndex(i, cards);
            });
            var content = card.querySelector('.verse-content') || card;
            content.appendChild(btn);
        });

        var picker = document.querySelector('.stage-picker');
        if (picker && !document.querySelector('.surah-listen-all')) {
            var all = document.createElement('button');
            all.type = 'button';
            all.className = 'surah-listen-all';
            all.setAttribute('aria-pressed', 'false');
            all.addEventListener('click', function () {
                if (state.playAll) { stop(); return; }
                stop();
                state.playAll = true;
                playIndex(0, cards);
            });
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
