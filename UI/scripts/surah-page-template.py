"""Build a surah page from a content spec.

Scripture carries lang="ar" explicitly: it is never translated, so it stays
Arabic whatever language the page is showing, and without the attribute it
inherits lang="en" from <html> and a screen reader reads the Quran with an
English voice.

Every surah page carries the same furniture - stage picker, per-verse narration,
parent note, aria-hidden decoration, full EN/AR parity - and hand-writing 400
lines each invites drift. This emits the current template so new surahs are
cheap and consistent.
"""
import html


def esc(s):
    return s.replace('"', '&quot;')


def correct_slots(slug, n_questions):
    """Which option slot the correct answer sits in, per question.

    A quiz whose answer is always the second button is one a child can beat
    without knowing the surah - it was 74% site-wide before this was measured.
    Placing the answer here, in the generator, means the property survives a
    rebuild; a shuffle applied to the built HTML does not, and was silently
    reverted twice.

    Derived from the slug, so it is stable for a given surah and reproducible,
    with two constraints: no slot takes more than two of a page's questions
    (kills "always slot N"), and a four-question page never uses each slot
    exactly once (which would let a child deduce the last answer from the
    first three).
    """
    import collections
    import random
    rnd = random.Random('islamic-kids/' + slug)
    while True:
        slots = [rnd.randrange(4) for _ in range(n_questions)]
        counts = collections.Counter(slots)
        if max(counts.values()) > 2:
            continue
        if n_questions == 4 and len(counts) == 4:
            continue
        return slots


def mark_arabic(text):
    """Wrap an Arabic run inside otherwise-English text in <span lang=\"ar\">.

    Mixed-script text in one element inherits the page language, so the Arabic
    half of a subtitle like 'The Fig - \u0627\u0644\u062a\u064a\u0646' would be read aloud with an
    English voice.
    """
    import re as _re
    return _re.sub('([\u0600-\u06ff][\u0600-\u06ff\\s\u064b-\u0652]*)',
                   lambda m: '<span lang="ar">%s</span>' % m.group(1).strip(), text)


def page(spec):
    v = spec['verses']
    q = spec['quiz']
    facts = spec['facts']
    tips = spec['tips']

    def badges():
        en = ' '.join('<span class="info-badge">%s</span>' % b[0] for b in spec['badges'])
        ar = ' '.join('<span class="info-badge">%s</span>' % b[1] for b in spec['badges'])
        return ('<div class="surah-info" data-ar="%s">\n                %s\n            </div>'
                % (esc(ar), '\n                '.join(
                    '<span class="info-badge">%s</span>' % b[0] for b in spec['badges'])))

    intro = []
    for card in spec['intro']:
        cls = card.get('cls', 'intro-card')
        body = []
        for p in card['body']:
            if isinstance(p, tuple):
                body.append('                    <p data-ar="%s">%s</p>' % (esc(p[1]), p[0]))
            else:  # a list block
                items = '\n'.join('                        <li data-ar="%s">%s</li>' % (esc(i[1]), i[0])
                                  for i in p['items'])
                body.append('                    <ul>\n%s\n                    </ul>' % items)
        badges_html = ''
        if card.get('badges'):
            bl = '\n'.join('                            <div class="light-badge" data-ar="%s">%s</div>'
                           % (esc(b[1]), b[0]) for b in card['badges'])
            badges_html = ('\n                    <div class="lights-container">\n%s\n                    </div>'
                           % bl)
        inner = '\n'.join(body) + badges_html
        if cls.startswith('story-card'):
            intro.append('                <div class="%s">\n                    <h2 data-ar="%s">%s</h2>\n'
                         '                    <div class="story-content">\n%s\n                    </div>\n'
                         '                </div>' % (cls, esc(card['h2'][1]), card['h2'][0], inner))
        else:
            intro.append('                <div class="%s">\n                    <h2 data-ar="%s">%s</h2>\n%s\n'
                         '                </div>' % (cls, esc(card['h2'][1]), card['h2'][0], inner))

    verses = []
    for i, vv in enumerate(v, 1):
        verses.append('''                <div class="verse-card" data-verse="%d">
                    <div class="verse-number">%d</div>
                    <div class="verse-content">
                        <p class="arabic" lang="ar">%s</p>
                        <p class="transliteration">%s</p>
                        <p class="translation" data-ar="%s">%s</p>
                        <div class="verse-explanation">
                            <span class="explanation-icon" aria-hidden="true">\U0001f4a1</span>
                            <p data-ar="%s">%s</p>
                        </div>
                    </div>
                </div>''' % (i, i, vv['ar'], vv['tl'], esc(vv['tr_ar']), vv['tr_en'],
                             esc(vv['ex_ar']), vv['ex_en']))

    # Hafs: the Bismillah heads the surah but is not one of its ayat (it is ayah 1
    # of Al-Fatiha only, and Al-Fatiha is not built from this template). So it gets
    # its own centred line and no ۝; verify-scripture.py fails a block whose ۝
    # count differs from the ayah count.
    full = '\n                        '.join(
        ['<span class="full-bismillah">%s</span>' % spec['bismillah_ar']] +
        [x['ar'] + ' ۝' for x in v])

    quiz = []
    slots = correct_slots(spec['slug'], len(q))
    for qi, qq in enumerate(q, 1):
        options = list(qq['options'])
        ci = next(i for i, o in enumerate(options) if o[2])
        ti = min(slots[qi - 1], len(options) - 1)
        options.insert(ti, options.pop(ci))   # rotate, so distractors keep their order
        opts = '\n'.join(
            '                        <button class="quiz-option" data-correct="%s" data-ar="%s">%s</button>'
            % ('true' if o[2] else 'false', esc(o[1]), o[0]) for o in options)
        quiz.append('''                <div class="quiz-card%s" data-question="%d">
                    <div class="question-number" data-ar="السؤال %s من %s">Question %d of %d</div>
                    <p class="quiz-question" data-ar="%s">%s</p>
                    <div class="quiz-options">
%s
                    </div>
                    <div class="quiz-feedback"></div>
                </div>''' % ('' if qi == 1 else ' hidden', qi,
                             '١٢٣٤'[qi - 1], '٤', qi, len(q),
                             esc(qq['q'][1]), qq['q'][0], opts))

    facts_html = '\n'.join('''                    <div class="fact-card">
                        <div class="fact-number">%d</div>
                        <p data-ar="%s">%s</p>
                    </div>''' % (i, esc(f[1]), f[0]) for i, f in enumerate(facts, 1))

    tips_html = '\n'.join('''                    <div class="tip-card">
                        <div class="tip-icon" aria-hidden="true">%s</div>
                        <h3 data-ar="%s">%s</h3>
                        <p data-ar="%s">%s</p>
                    </div>''' % (t['icon'], esc(t['h'][1]), t['h'][0], esc(t['p'][1]), t['p'][0])
                           for t in tips)

    spec = dict(spec, sub_en=mark_arabic(spec['sub_en']))

    # v2 app shell (UI/DESIGN.md 7.1-7.2): the same strings scripts/apply-app-shell.py uses
    import importlib.util as _ilu
    import os as _os
    _sp = _ilu.spec_from_file_location('app_shell', _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'app_shell.py'))
    _shell = _ilu.module_from_spec(_sp)
    _sp.loader.exec_module(_shell)
    spec = dict(spec, shell=_shell.surah_shell(spec['title_en'], spec['title_ar']))

    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="%(desc)s">
    <meta name="theme-color" content="#FBF6EA">
    <link rel="manifest" href="manifest.webmanifest">
    <link rel="icon" href="images/app/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="images/app/apple-touch-icon.png">
    <title>%(title_en)s - Islamic Kids</title>
    <!-- fonts are self-hosted: @font-face in styles.css (vendor/fonts) -->
    <link rel="stylesheet" href="styles.css?v=20261107">
    <link rel="stylesheet" href="app.css?v=20261107">
    <link rel="stylesheet" href="surah.css?v=20261107">
</head>
%(shell)s    <!-- Hero -->
    <section class="surah-hero">
        <div class="surah-hero-content">
            <div class="surah-icon" aria-hidden="true">%(icon)s</div>
            <h1 data-ar="%(title_ar)s">%(title_en)s</h1>
            <p class="surah-subtitle" data-ar="%(sub_ar)s">%(sub_en)s</p>
            %(badges)s
        </div>
    </section>

    <!-- Main Content -->
    <main class="surah-main" id="main">
        <div class="surah-container">

            <!-- Introduction -->
            <section class="intro-section">
%(intro)s
            </section>

            <!-- Bismillah -->
            <section class="bismillah-section">
                <div class="bismillah-card">
                    <p class="arabic-large" lang="ar">%(bismillah_ar)s</p>
                    <p class="transliteration">Bismillah ir-Rahman ir-Raheem</p>
                    <p class="translation" data-ar="نبدأ قراءةَ السورة باسم الله، ونطلب عونَه، وهو الرحمن الذي وسِعت رحمتُه كلَّ الخلق، الرحيمُ بالمؤمنين.">"In the name of Allah, the Most Gracious, the Most Merciful"</p>
                </div>
            </section>

            <!-- Verses -->
            <section class="verses-section">
                <h2 class="section-title" data-ar="\U0001f4dc تعلّم كل آية">\U0001f4dc Learn Each Verse</h2>

                <div class="stage-picker" role="group" aria-label="Learning stage" data-ar-label="مرحلة التعلّم">
                    <span class="stage-label" data-ar="كيف تريد أن تتعلّم؟">How do you want to learn?</span>
                    <div class="stage-buttons segmented">
                        <button class="stage-btn" type="button" data-stage="read" data-ar="اقرأ">Read</button>
                        <button class="stage-btn" type="button" data-stage="practice" data-ar="تدرّب">Practice</button>
                        <button class="stage-btn" type="button" data-stage="recite" data-ar="احفظ">Recite</button>
                    </div>
                </div>

%(verses)s
            </section>

            <!-- Full Surah -->
            <section class="full-surah-section">
                <h2 class="section-title" data-ar="\U0001f4bf السورة كاملة">\U0001f4bf Complete Surah</h2>
                <div class="full-surah-card">
                    <p class="arabic-full" lang="ar" dir="rtl">
                        %(full)s
                    </p>
                </div>
            </section>

            <!-- Video -->
            <section class="video-section">
                <h2 class="section-title" data-ar="\U0001f3ac تعلّم التلاوة">\U0001f3ac Learn to Recite</h2>
                <p class="video-intro" data-ar="%(video_intro_ar)s">%(video_intro_en)s</p>
                <div class="video-container">
                    <div class="video-frame">
                        <iframe
                            width="100%%"
                            height="450"
                            src="https://www.youtube.com/embed/%(video)s"
                            title="Learn %(title_en)s"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </section>

            <!-- Quiz -->
            <section class="quiz-section">
                <div class="quiz-intro">
                    <div class="quiz-icon" aria-hidden="true">\U0001f3af</div>
                    <h2 data-ar="اختبر معلوماتك!">Test Your Knowledge!</h2>
                    <p data-ar="%(quiz_intro_ar)s">%(quiz_intro_en)s</p>
                </div>

%(quiz)s

                <div class="quiz-results hidden" id="quizResults">
                    <div class="results-content">
                        <div class="results-icon" aria-hidden="true">\U0001f389</div>
                        <h2 data-ar="ما شاء الله!">MashaAllah!</h2>
                        <p class="results-score" data-ar="أجبت <span id=&quot;scoreDisplay&quot;>0</span> من ٤ إجابات صحيحة!">You got <span id="scoreDisplay">0</span> out of 4 correct!</p>
                        <p class="results-message" data-ar="%(results_ar)s">%(results_en)s</p>
                    </div>
                </div>
            </section>

            <!-- Reflection -->
            <section class="reply-section">
                <h2 class="section-title" data-ar="%(reflect_h_ar)s">%(reflect_h_en)s</h2>
                <div class="reply-card">
%(reflect)s
                </div>
            </section>

            <!-- Fun Facts -->
            <section class="fun-facts-section">
                <h2 class="section-title" data-ar="\U0001f31f معلومات ممتعة!">\U0001f31f Amazing Fun Facts!</h2>
                <div class="facts-grid">
%(facts)s
                </div>
            </section>

            <!-- Tips -->
            <section class="tips-section">
                <h2 class="section-title" data-ar="\U0001f4a1 نصائح للحفظ">\U0001f4a1 Tips for Memorization</h2>
                <div class="tips-grid">
%(tips)s
                </div>
            </section>

            <!-- For the grown-up reading aloud -->
            <section class="parent-note">
                <h2 data-ar="\U0001f468‍\U0001f466 للكبير الذي يقرأ">\U0001f468‍\U0001f466 For the grown-up reading</h2>
                <p class="parent-ask"><strong data-ar="اسأل طفلك:">Ask your child:</strong>
                    <span data-ar="%(ask_ar)s">%(ask_en)s</span></p>
                <p class="parent-recap"><strong data-ar="اختم بهذه:">Finish with:</strong>
                    <span data-ar="%(recap_ar)s">%(recap_en)s</span></p>
            </section>

            <!-- Navigation -->
            <div class="page-navigation">
                <a href="%(prev)s" class="nav-btn" data-ar="%(prev_ar)s">%(prev_en)s</a>
                <a href="%(next)s" class="nav-btn next" data-ar="%(next_ar)s">%(next_en)s</a>
            </div>

        </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
        <div class="footer-content">
            <div class="footer-dua">
                <p data-ar="\U0001f932 يسّر الله لك تعلّم كلامه وحفظه!">\U0001f932 May Allah make it easy for you to learn and memorize His words!</p>
            </div>
            <p class="footer-subtitle" data-ar="\U0001f319 أطفال الإسلام - نتعلّم ديننا بالحب ✨">\U0001f319 Islamic Kids - Learning Islam with Love ✨</p>
        </div>
    </footer>

    <script src="surah.js?v=20261107"></script>
    <script src="surah-narration.js?v=20261107"></script>
    <script src="bilingual.js?v=20261107"></script>
    <script src="bedtime.js?v=20261107"></script>

</body>
</html>
''' % dict(spec,
           badges=badges(),
           intro='\n\n'.join(intro),
           verses='\n\n'.join(verses),
           full=full,
           quiz='\n\n'.join(quiz),
           facts=facts_html,
           tips=tips_html,
           reflect='\n'.join('                    <p data-ar="%s">%s</p>' % (esc(p[1]), p[0])
                             for p in spec['reflect']))
