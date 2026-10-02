/* ============================================
   Memorization map
   Each surah card carries a state the child sets themselves:
   not started -> learning -> memorized. Stored on the device only;
   nothing leaves the browser and no account is involved.
   ============================================ */
(function () {
    'use strict';

    var STATES = ['not-started', 'learning', 'memorized'];
    var LABEL = {
        en: ['Not started', 'Learning', 'Memorized'],
        ar: ['لم تبدأ بعد', 'أحفظها الآن', 'حفظتها']
    };
    var MARK = ['○', '◐', '★'];
    var KEY = 'ik-surah-progress';

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
        catch (e) { return {}; }
    }
    function save(v) {
        try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    }
    function lang() {
        return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    var state = load();
    var cards = Array.prototype.slice.call(document.querySelectorAll('.surah-progress'));
    if (!cards.length) return;

    function render() {
        var done = 0, learning = 0, resume = null;

        cards.forEach(function (card) {
            var id = card.getAttribute('data-surah');
            var st = state[id] || 0;
            if (st === 2) done++;
            if (st === 1) { learning++; if (!resume) resume = card; }

            var badge = card.querySelector('.progress-badge');
            if (!badge) {
                badge = document.createElement('button');
                badge.type = 'button';
                badge.className = 'progress-badge';
                // the badge is a control inside a link, so it must not navigate
                badge.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    state[id] = ((state[id] || 0) + 1) % 3;
                    save(state);
                    render();
                });
                card.querySelector('.story-info').insertBefore(
                    badge, card.querySelector('.story-info').firstChild);
            }
            badge.setAttribute('data-state', STATES[st]);
            badge.textContent = MARK[st] + ' ' + LABEL[lang()][st];
            badge.setAttribute('aria-label', LABEL[lang()][st] + ' — ' +
                (lang() === 'ar' ? 'اضغط لتغيير الحالة' : 'tap to change'));
        });

        var counter = document.getElementById('progressCount');
        if (counter) {
            var tpl = lang() === 'ar'
                ? counter.getAttribute('data-ar-template')
                : 'You have memorized {done} of {total} surahs';
            var n = lang() === 'ar'
                ? String(done).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; })
                : done;
            var t = lang() === 'ar'
                ? String(cards.length).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; })
                : cards.length;
            counter.textContent = tpl.replace('{done}', n).replace('{total}', t);
        }

        var link = document.getElementById('resumeLink');
        if (link) {
            if (resume) {
                link.href = resume.getAttribute('data-surah');
                link.hidden = false;
            } else {
                link.hidden = true;
            }
        }
    }

    render();
    document.addEventListener('languageChanged', render);
})();
