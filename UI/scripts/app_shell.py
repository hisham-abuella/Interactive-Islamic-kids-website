"""The Illuminated Page v2 app shell (UI/DESIGN.md 7.1-7.2), in one place.

surah-page-template.py emits a surah page with shell(); apply-app-shell.py
converts a hand-made v1 page with convert(). Both use the same strings, so a
generated page and a converted one carry byte-identical chrome.
"""
import re

V = '20261107'

HEAD_META = (
    '    <meta name="theme-color" content="#FBF6EA">\n'
    '    <link rel="manifest" href="manifest.webmanifest">\n'
    '    <link rel="icon" href="images/app/icon.svg" type="image/svg+xml">\n'
    '    <link rel="apple-touch-icon" href="images/app/apple-touch-icon.png">\n'
)

FONTS_NOTE = '    <!-- fonts are self-hosted: @font-face in styles.css (vendor/fonts) -->\n'

ICON = '<svg class="icon%s" aria-hidden="true"><use href="vendor/icons/sprite.svg#i-%s"/></svg>'

TABS = [
    ('index.html', 'house', 'Home', 'الرئيسية'),
    ('stories.html', 'book-open', 'Stories', 'القصص'),
    ('quran.html', 'book-marked', 'Quran', 'القرآن'),
]


def actions():
    return (
        '        <div class="app-bar__actions">\n'
        '            <button class="icon-btn bedtime-btn" type="button" aria-pressed="false" aria-label="Bedtime reading mode" data-ar-label="وضع القراءة الليلية">\n'
        '                ' + ICON % (' icon-moon', 'moon') + '\n'
        '                ' + ICON % (' icon-sun', 'sun') + '\n'
        '            </button>\n'
        '            <button class="lang-toggle-btn" type="button" aria-label="Switch to Arabic" title="Switch to Arabic">عربي</button>\n'
        '        </div>\n'
    )


def tab_bar(current):
    rows = []
    for href, icon, en, ar in TABS:
        cur = ' aria-current="page"' if href == current else ''
        rows.append('            <li><a href="%s"%s><span class="tab-icon">%s</span><span data-ar="%s">%s</span></a></li>\n'
                    % (href, cur, ICON % ('', icon), ar, en))
    return (
        '    <!-- Tab bar (bottom on phone and tablet, side rail on desktop) -->\n'
        '    <nav class="tab-bar" aria-label="Main" data-ar-label="القائمة الرئيسية">\n'
        '        <ul>\n' + ''.join(rows) +
        '        </ul>\n'
        '    </nav>\n'
    )


def shell(body_class, current, title_en=None, title_ar=None, back=None, back_en=None, back_ar=None):
    """The <body> opening, app bar and tab bar.

    A sub-screen (a surah) has a back button and a title; a tab screen
    (stories, quran) has the brand, like Home.
    """
    if back:
        start = (
            '        <a class="icon-btn" href="%s" aria-label="%s" data-ar-label="%s">\n'
            '            %s\n'
            '        </a>\n'
            '        <p class="app-bar__title" data-ar="%s">%s</p>\n'
        ) % (back, back_en, back_ar, ICON % (' flip-rtl', 'chevron-left'), title_ar, title_en)
    else:
        start = (
            '        <a class="app-bar__brand" href="index.html" aria-label="Islamic Kids, home" data-ar-label="أطفال الإسلام، الرئيسية">\n'
            '            <span class="brand-mark" aria-hidden="true">☪</span>\n'
            '            <span data-ar="أطفال الإسلام">Islamic Kids</span>\n'
            '        </a>\n'
            '        <span class="app-bar__spacer"></span>\n'
        )
    return (
        '<body class="%s">\n'
        '    <a class="visually-hidden" href="#main" data-ar="انتقل إلى المحتوى">Skip to content</a>\n'
        '\n'
        '    <!-- Top app bar -->\n'
        '    <header class="app-bar">\n' + start + actions() +
        '    </header>\n'
        '\n' + tab_bar(current) +
        '\n'
    ) % body_class


def surah_shell(title_en, title_ar):
    return shell('app surah-screen', 'quran.html', title_en, title_ar,
                 back='quran.html', back_en='Back to all surahs', back_ar='العودة إلى كل السور')


# ---------------------------------------------------------------- converting v1 pages

GOOGLE = re.compile(r'(    <link rel="preconnect" href="https://fonts\.g[^"]*"[^>]*>\n'
                    r'|    <link href="https://fonts\.googleapis\.com/[^"]*" rel="stylesheet">\n)+')
V1_BODY = re.compile(r'<body>\n.*?    </header>\n\n', re.S)
H1 = re.compile(r'<h1 data-ar="([^"]*)">(.*?)</h1>')


def head(html):
    html = html.replace('content="width=device-width, initial-scale=1.0"',
                        'content="width=device-width, initial-scale=1.0, viewport-fit=cover"', 1)
    html = html.replace('    <meta name="theme-color" content="#0d9488">\n', HEAD_META, 1)
    html, n = GOOGLE.subn(FONTS_NOTE, html, 1)
    html = html.replace('    <link rel="stylesheet" href="styles.css?v=%s">\n' % V,
                        '    <link rel="stylesheet" href="styles.css?v=%s">\n'
                        '    <link rel="stylesheet" href="app.css?v=%s">\n' % (V, V), 1)
    return html


def surah_body(html):
    """main id, segmented stage picker, app footer."""
    html = html.replace('<main class="surah-main">', '<main class="surah-main" id="main">', 1)
    html = html.replace('<div class="stage-buttons">', '<div class="stage-buttons segmented">', 1)
    html = html.replace('    <footer>\n', '    <footer class="app-footer">\n', 1)
    return html


def convert(html, kind, current=None):
    """kind: 'surah' or 'tab'. Returns the converted page; raises if a v1 part is missing."""
    if 'class="app-bar"' in html:
        return html
    if not V1_BODY.search(html):
        raise ValueError('no v1 header')
    html = head(html)
    if kind == 'surah':
        m = H1.search(html)
        title_ar, title_en = m.group(1), m.group(2)
        html = V1_BODY.sub(lambda _: surah_shell(title_en, title_ar), html, 1)
        html = surah_body(html)
    else:
        html = V1_BODY.sub(lambda _: shell('app list-screen', current), html, 1)
        html = html.replace('<section class="stories-hero">', '<section class="stories-hero" id="main">', 1)
        html = html.replace('    <footer>\n', '    <footer class="app-footer">\n', 1)
    return html
