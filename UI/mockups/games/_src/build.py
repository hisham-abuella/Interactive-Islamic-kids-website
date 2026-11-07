#!/usr/bin/env python3
"""Assemble the self-contained game mockups. Scripture and its translations are copied
byte-for-byte out of the existing story pages (asserted present), never retyped."""
import re, sys, pathlib

REPO = pathlib.Path('/Users/hishamabuella/Work/Interactive-Islamic-kids-website')
UI = REPO / 'UI'
SRC = pathlib.Path(__file__).parent / 'src'
OUT = UI / 'mockups' / 'games'

def page(name):
    return (UI / name).read_text(encoding='utf-8')

def one(rx, text, label):
    m = re.findall(rx, text, flags=re.S)
    assert len(m) >= 1, f'not found: {label}'
    return m[0]

def dua(name):
    s = page(name)
    ar = one(r'<p class="arabic-text" lang="ar"(?: data-ayah="[^"]*")?>(.*?)</p>', s, name + ' dua')
    tr_ar, tr_en = one(r'<p class="dua-translation" data-ar="(.*?)">(.*?)</p>', s, name + ' tr')
    nt_ar, nt_en = one(r'<p class="dua-note" data-ar="(.*?)">(.*?)</p>', s, name + ' note')
    return ar, (tr_en, tr_ar), (nt_en, nt_ar)

def literal(name, *parts):
    # A literal that no longer matches its story page blocks only the games that use it
    # (pair()/raw substitution assert on None), not every game in the build.
    s = page(name)
    for p in parts:
        if p not in s:
            print(f'WARNING literal not in {name}: {p[:60]}...')
            return None
    return parts

S, T = {}, {}
S['NUH_DUA'], T['NUH_TR'], T['NUH_HEAD'] = dua('story-prophet-nuh.html')
S['MUSA_DUA'], T['MUSA_TR'], T['MUSA_HEAD'] = dua('story-prophet-musa.html')
T['MUSA_TRUST'] = literal('story-prophet-musa.html', '"No! My Lord is with me, and He will guide me."', '&quot;كلا! إن معي ربي سيهدين.&quot;')
# MUSA_STRIKE removed (scholar 2026-11-03): Allah's words are not shown as a quoted paraphrase; the game uses indirect speech.
# Game 03 painted (2026-11-06): Musa's reply. EN is the page's quoted wording; AR is the page's reported speech
# (scholar gate 1, 03 fix 4: the Arabic gives the meaning in reported speech, never near-Quranic wording).
T['MUSA_REPLY'] = literal('story-prophet-musa.html', '"No! My Lord is with me, and He will guide me."', 'وأخبرهم أن الله معه وسيهديه إلى طريق النجاة')
T['MUSA_CRY'] = literal('story-prophet-musa.html', '"They have caught us!"', '&quot;لقد أدركونا!&quot;')
T['IBR_FACE'] = literal('story-prophet-ibrahim.html', '"I turn my face to the One who created the heavens and the earth!"', '&quot;إني وجهت وجهي للذي فطر السماوات والأرض&quot;')
T['IBR_LEARN'] = literal('story-prophet-ibrahim.html', 'Ibrahim understood that only <strong>Allah</strong> - who created the stars, moon, and sun - deserves to be worshipped!',
                         'أدرك إبراهيم أن <strong>الله</strong> وحده - الذي خلق النجوم والقمر والشمس - هو المستحق للعبادة!')
# Adam: the Arabic dua from the page; its translation and note from translations.js (the Adam page's i18n source)
adam = page('story-prophet-adam.html')
S['ADAM_DUA'] = one(r'<p class="arabic-text" lang="ar"(?: data-ayah="[^"]*")?>(.*?)</p>', adam, 'adam dua')
tj = page('translations.js')
tr = re.findall(r'duaTranslation: "((?:[^"\\]|\\.)*)"', tj)
nt = re.findall(r'duaNote: "((?:[^"\\]|\\.)*)"', tj)
ttl = re.findall(r'duaTitle: "((?:[^"\\]|\\.)*)"', tj)
assert len(tr) == 2 and len(nt) == 2 and len(ttl) == 2
un = lambda x: x.replace('\\"', '"')
T['ADAM_TR'] = (un(tr[0]), un(tr[1]))
T['ADAM_NOTE'] = (un(nt[0]), un(nt[1]))
T['ADAM_TITLE'] = (un(ttl[0]), un(ttl[1]))
T['ADAM_FORGAVE'] = literal('translations.js', 'And SubhanAllah - Allah forgave them! Allah is the Most Merciful!', 'وسبحان الله - غفر الله لهما! الله أرحم الراحمين!')

GAMES = {
    # 01 is the painted flagship (2026-11-04); v1 is the first CSS-shape mockup, kept for comparison.
    # The flagship has its own home, UI/games/nuh-ark.html (round 4, 2026-11-04), linked from the end of
    # the Nuh story; mockups/games/01-nuh-ark.html is a redirect stub. Its source uses ../ paths.
    '01-nuh-ark.html': ('../story-prophet-nuh.html', 'Nuh and the Ark', 'نوح والسفينة'),
    '01-nuh-ark-v1.html': ('../../story-prophet-nuh.html', 'Nuh and the Ark', 'نوح والسفينة'),
    '02-yusuf-journey.html': ('../../story-prophet-yusuf.html', "Yusuf's Journey", 'رحلة يوسف'),
    '03-musa-sea.html': ('../../story-prophet-musa.html', 'The Path Through the Sea', 'الطريق في البحر'),
    # 03 painted (2026-11-06): the second painted game, at UI/games/musa-sea.html; the mockup above is kept as is.
    '03-musa-sea-painted.html': ('../story-prophet-musa.html', 'The Path Through the Sea', 'الطريق في البحر'),
    '04-ibrahim-stars.html': ('../../story-prophet-ibrahim.html', 'Ibrahim: Stars and Guests', 'إبراهيم: النجوم والضيوف'),
    '05-adam-garden.html': ('../../story-prophet-adam.html', 'The Garden of Choices', 'حديقة الاختيارات'),
}

# Games built somewhere other than OUT (path relative to UI/).
OUT_PATH = {'01-nuh-ark.html': 'games/nuh-ark.html', '03-musa-sea-painted.html': 'games/musa-sea.html'}

def pair(p):
    assert p is not None, 'a copied literal no longer matches its story page'
    en, ar = p
    return f'<span class="l-en">{en}</span><span class="l-ar" lang="ar">{ar}</span>'

def main():
    css = (SRC / 'common.css').read_text()
    js = (SRC / 'common.js').read_text()
    top, narr, bottom = [(SRC / f).read_text() for f in ('top.html', 'narr.html', 'bottom.html')]
    OUT.mkdir(parents=True, exist_ok=True)
    only = sys.argv[1:]
    for name, (back, en, ar) in GAMES.items():
        src = SRC / name
        if not src.exists() or (only and name not in only):
            continue
        h = src.read_text()
        h = h.replace('</title>', '</title>\n<link rel="icon" href="data:,">', 1)
        h = h.replace('{{COMMON_CSS}}', css).replace('{{COMMON_JS}}', js)
        h = h.replace('{{TOP}}', top).replace('{{NARR}}', narr).replace('{{BOTTOM}}', bottom)
        h = h.replace('{{BACK}}', back).replace('{{TITLE_EN}}', en).replace('{{TITLE_AR}}', ar)
        h = re.sub(r'\{\{S:(\w+)\}\}', lambda m: S[m.group(1)], h)
        h = re.sub(r'\{\{T:(\w+)\}\}', lambda m: pair(T[m.group(1)]), h)
        # raw EN or AR half of a copied pair, for pages that use the data-ar system instead of l-en/l-ar spans
        h = re.sub(r'\{\{R:(\w+):(en|ar)\}\}', lambda m: (T[m.group(1)] or pair(None))[m.group(2) == 'ar'], h)
        left = re.findall(r'\{\{[^}]*\}\}', h)
        assert not left, (name, left)
        dest = UI / OUT_PATH[name] if name in OUT_PATH else OUT / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(h, encoding='utf-8')
        print('wrote', dest, len(h))

main()
