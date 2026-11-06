/* ============================================================
   Bilingual switching for Islamic Kids
   ------------------------------------------------------------
   Any element carrying data-ar is translatable: the English stays
   in the HTML, the Arabic rides along in the attribute.

       <p data-ar="مرحبا">Hello</p>

   Switching language swaps the two and remembers the choice, so a
   child who picks Arabic stays in Arabic as they move around the
   site. Quranic text (.arabic, .arabic-full, .arabic-large) is
   never touched; transliteration is hidden in Arabic mode because
   it only exists to help people who cannot read the script.

   Works alongside the older data-i18n system on the Adam story
   page: one button drives both.
   ============================================================ */
(function () {
    'use strict';

    var KEY = 'islamicKidsLang';
    var EN_STORE = '__enHTML';

    function stored() {
        try {
            return localStorage.getItem(KEY);
        } catch (e) {
            return null;
        }
    }

    function remember(lang) {
        try {
            localStorage.setItem(KEY, lang);
        } catch (e) { /* private mode - the page still works, it just forgets */ }
    }

    function current() {
        return stored() === 'ar' ? 'ar' : 'en';
    }

    function apply(lang) {
        var root = document.documentElement;
        root.lang = lang;
        root.dir = lang === 'ar' ? 'rtl' : 'ltr';
        root.setAttribute('data-lang', lang);

        // innerHTML is deliberate: translations carry inline markup such as
        // <strong> and <em>. Both sides are static text we author in this repo -
        // the site takes no user input, so there is no untrusted path here.
        var nodes = document.querySelectorAll('[data-ar]');
        Array.prototype.forEach.call(nodes, function (el) {
            /* The v1 bedtime button carries its Arabic NAME in data-ar; swapping
               its innerHTML replaced the moon with a sentence. Treat it as a label. */
            if (el.classList.contains('bedtime-btn')) {
                if (el.__enLabel === undefined) el.__enLabel = el.getAttribute('aria-label') || '';
                el.setAttribute('aria-label', lang === 'ar' ? el.getAttribute('data-ar') : el.__enLabel);
                return;
            }
            if (!el[EN_STORE]) {
                el[EN_STORE] = el.innerHTML;
            }
            el.innerHTML = lang === 'ar' ? el.getAttribute('data-ar') : el[EN_STORE];
        });

        // Keep the older data-i18n pages (Adam) in step with the same button.
        /* v2: icon-only controls carry their Arabic accessible name in
           data-ar-label (the English one stays in aria-label). */
        var labelled = document.querySelectorAll('[data-ar-label]');
        Array.prototype.forEach.call(labelled, function (el) {
            if (el.__enLabel === undefined) {
                el.__enLabel = el.getAttribute('aria-label') || '';
            }
            el.setAttribute('aria-label', lang === 'ar' ? el.getAttribute('data-ar-label') : el.__enLabel);
        });

        localiseTitles(lang);

        if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage(lang);
        }

        updateButtons(lang);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    /* v2: the document title and the video titles follow the language, so a
       screen reader does not read an English title with the Arabic voice.
       <title data-ar> is swapped above; otherwise the Arabic title is the page's
       h1 (already swapped), never anything personal. */
    var EN_TITLE = null;
    function localiseTitles(lang) {
        if (EN_TITLE === null) EN_TITLE = document.title;
        var h1el = document.querySelector('h1');
        var h1 = null;
        if (h1el) {   /* the h1's text without its decorative (aria-hidden) emoji */
            var c = h1el.cloneNode(true);
            Array.prototype.forEach.call(c.querySelectorAll('[aria-hidden="true"]'), function (n) { n.remove(); });
            h1 = c;
        }
        var t = document.querySelector('title');
        if (t && !t.hasAttribute('data-ar')) {
            document.title = lang === 'ar' && h1 ? h1.textContent.replace(/\s+/g, ' ').trim() + ' - أطفال الإسلام' : EN_TITLE;
        }
        Array.prototype.forEach.call(document.querySelectorAll('iframe[title]'), function (f) {
            if (f.__enTitle === undefined) f.__enTitle = f.getAttribute('title');
            f.setAttribute('title', lang === 'ar' && h1 ? 'فيديو: ' + h1.textContent.replace(/\s+/g, ' ').trim() : f.__enTitle);
        });
    }

    function updateButtons(lang) {
        var btns = document.querySelectorAll('.lang-toggle-btn');
        Array.prototype.forEach.call(btns, function (btn) {
            // The button always shows the language you would switch TO.
            btn.textContent = lang === 'en' ? 'عربي' : 'English';
            btn.setAttribute('data-current', lang);
            btn.setAttribute('aria-label',
                lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية');
            btn.setAttribute('title', btn.getAttribute('aria-label'));
        });
    }

    function toggle() {
        var next = current() === 'en' ? 'ar' : 'en';
        remember(next);
        apply(next);
    }

    function init() {
        var btns = document.querySelectorAll('.lang-toggle-btn');
        Array.prototype.forEach.call(btns, function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                toggle();
            });
        });
        apply(current());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.bilingual = { toggle: toggle, apply: apply, current: current };
})();
