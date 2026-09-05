/* ============================================
   Bedtime reading mode
   The site gets read aloud at night, so a bright parchment page in a dim
   room is the wrong default for that moment. The choice is remembered
   per device, like the language.
   ============================================ */
(function () {
    'use strict';
    var KEY = 'islamicKidsBedtime';

    function stored() {
        try { return localStorage.getItem(KEY) === 'on'; } catch (e) { return false; }
    }

    function apply(on) {
        if (on) {
            document.documentElement.setAttribute('data-theme', 'bedtime');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        var btns = document.querySelectorAll('.bedtime-btn');
        Array.prototype.forEach.call(btns, function (b) {
            b.setAttribute('aria-pressed', String(on));
            b.textContent = on ? '☀️' : '🌙';
        });
        try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    }

    function init() {
        Array.prototype.forEach.call(document.querySelectorAll('.bedtime-btn'), function (b) {
            b.addEventListener('click', function () {
                apply(document.documentElement.getAttribute('data-theme') !== 'bedtime');
            });
        });
        apply(stored());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
