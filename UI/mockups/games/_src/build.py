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
# Game 04 painted (2026-11-07): the story page's own sentences (reported speech, never "this is my lord"),
# and Ibrahim's dua with its translation and note, all copied from story-prophet-ibrahim.html.
T['IBR_DECLARE'] = literal('story-prophet-ibrahim.html', 'Ibrahim declared to his people that he turned in worship to Allah alone, the Creator of the heavens and the earth!',
                           'وأعلن إبراهيم لقومه أنه يتوجّه بعبادته إلى الله وحده، خالقِ السماوات والأرض!')
T['IBR_SHOWED'] = literal('story-prophet-ibrahim.html', 'Ibrahim showed his people that only <strong>Allah</strong> - who created the stars, moon, and sun - deserves to be worshipped!',
                          'بيّن إبراهيم لقومه أن <strong>الله</strong> وحده - الذي خلق النجوم والقمر والشمس - هو المستحق للعبادة!')
S['IBR_DUA'], T['IBR_TR'], T['IBR_HEAD'] = dua('story-prophet-ibrahim.html')
# Game 02 painted (2026-11-07): Yusuf's dua (12:101) with its translation and note; 12:92 and its meaning line; and the
# page's note on the dream's bow. All copied from story-prophet-yusuf.html (verified there), never retyped.
S['YUSUF_DUA'], T['YUSUF_TR'], T['YUSUF_HEAD'] = dua('story-prophet-yusuf.html')
_yu = page('story-prophet-yusuf.html')
S['YUSUF_9292'] = one(r'<p class="arabic-text quran-text story-ayah" lang="ar" data-ayah="12:92">(.*?)</p>', _yu, 'yusuf 12:92')
T['YUSUF_9292_TR'] = tuple(reversed(one(r'<p class="dua-translation story-ayah-meaning" data-ar="(.*?)">(.*?)</p>', _yu, 'yusuf 12:92 meaning')))
T['YUSUF_BOW'] = literal('story-prophet-yusuf.html', 'It was a bow of respect, allowed in their time. In Islam we prostrate only to Allah.',
                         'كان سجود تحية واحترام، وكان مباحاً في زمانهم. وفي الإسلام لا نسجد إلا لله.')
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
# Game 05 painted (2026-11-12): the Adam page's own sentences (translations.js is its i18n source), never retyped:
# the one rule (indirect speech, never Allah's words quoted), the slip ("slipped and made a mistake", 2:36), and earth.
T['ADAM_RULE'] = literal('translations.js', 'Allah told Adam and Hawa they could enjoy everything in Jannah, but that there was ONE tree they must not go near.',
                         'أخبر الله آدم وحواء أنهما يستطيعان الاستمتاع بكل شيء في الجنة، إلا شجرة واحدة نهاهما أن يقربا منها.')
T['ADAM_SLIP'] = literal('translations.js', 'Shaytan whispered to Adam and Hawa and tricked them. They slipped and made a mistake: they ate from the forbidden tree. As soon as they did, they realized what they had done.',
                         'وسوس الشيطان لآدم وحواء وخدعهما، فأزلّهما الشيطان فأخطآ وأكلا من الشجرة المحرمة. وما إن أكلا منها حتى أدركا ما فعلا.')
T['ADAM_EARTH'] = literal('translations.js', 'Adam and Hawa were sent to live on Earth. Allah told them that Earth would be their home, and from them would come all the people of the world - including you!',
                          'أُرسل آدم وحواء للعيش على الأرض. أخبرهما الله أن الأرض ستكون موطنهما، ومنهما سيأتي جميع البشر في العالم - بما فيهم أنت!')

GAMES = {
    # 01 is the painted flagship (2026-11-04); v1 is the first CSS-shape mockup, kept for comparison.
    # The flagship has its own home, UI/games/nuh-ark.html (round 4, 2026-11-04), linked from the end of
    # the Nuh story; mockups/games/01-nuh-ark.html is a redirect stub. Its source uses ../ paths.
    '01-nuh-ark.html': ('../story-prophet-nuh.html', 'Nuh and the Ark', 'نوح والسفينة'),
    '01-nuh-ark-v1.html': ('../../story-prophet-nuh.html', 'Nuh and the Ark', 'نوح والسفينة'),
    '02-yusuf-journey.html': ('../../story-prophet-yusuf.html', "Yusuf's Journey", 'رحلة يوسف'),
    # 02 painted (2026-11-07): Yusuf's Journey at UI/games/yusuf-journey.html; the mockup above is kept as is.
    '02-yusuf-journey-painted.html': ('../story-prophet-yusuf.html', "Yusuf's Journey", 'رحلة يوسف'),
    '03-musa-sea.html': ('../../story-prophet-musa.html', 'The Path Through the Sea', 'الطريق في البحر'),
    # 03 painted (2026-11-06): the second painted game, at UI/games/musa-sea.html; the mockup above is kept as is.
    '03-musa-sea-painted.html': ('../story-prophet-musa.html', 'The Path Through the Sea', 'الطريق في البحر'),
    '04-ibrahim-stars.html': ('../../story-prophet-ibrahim.html', 'Ibrahim: Stars and Guests', 'إبراهيم: النجوم والضيوف'),
    # 04 painted (2026-11-07): the third painted game, at UI/games/ibrahim-stars.html; the mockup above is kept as is.
    '04-ibrahim-stars-painted.html': ('../story-prophet-ibrahim.html', 'Ibrahim: Stars and Guests', 'إبراهيم: النجوم والضيوف'),
    '05-adam-garden.html': ('../../story-prophet-adam.html', 'The Garden of Choices', 'حديقة الاختيارات'),
    # 05 painted (2026-11-12): the fifth painted game, at UI/games/adam-garden.html; the mockup above is kept as is.
    '05-adam-garden-painted.html': ('../story-prophet-adam.html', 'The Garden of Choices', 'حديقة الاختيارات'),
}

# Games built somewhere other than OUT (path relative to UI/).
OUT_PATH_YUSUF = {'02-yusuf-journey-painted.html': 'games/yusuf-journey.html'}
OUT_PATH = {'01-nuh-ark.html': 'games/nuh-ark.html', '03-musa-sea-painted.html': 'games/musa-sea.html',
            '04-ibrahim-stars-painted.html': 'games/ibrahim-stars.html'}

OUT_PATH.update(OUT_PATH_YUSUF)
OUT_PATH['05-adam-garden-painted.html'] = 'games/adam-garden.html'

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
