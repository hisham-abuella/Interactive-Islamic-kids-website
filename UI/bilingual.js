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
            if (!el[EN_STORE]) {
                el[EN_STORE] = el.innerHTML;
            }
            el.innerHTML = lang === 'ar' ? el.getAttribute('data-ar') : el[EN_STORE];
        });

        // Keep the older data-i18n pages (Adam) in step with the same button.
        if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage(lang);
        }

        updateButtons(lang);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
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
