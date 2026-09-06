#!/usr/bin/env python3
"""Build the per-verse narration plan that generate-surah-audio.js consumes.

The spoken text is taken from the page itself - each verse's translation and the
explanation beside it - so the narration cannot drift out of sync with what is
written. English comes from the element's text, Arabic from its data-ar.

Usage:
    python3 scripts/build-narration-plan.py <page.html> [...] -o plan.json
    python3 scripts/build-narration-plan.py surah-at-tin.html          # to stdout
"""
import html
import json
import os
import re
import sys

UI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

VERSE_CARD = re.compile(r'<div class="verse-card" data-verse="\d+">(.*?)\n                </div>',
                        re.S)
TRANSLATION = re.compile(r'<p class="translation"(?: data-ar="([^"]*)")?>(.*?)</p>', re.S)
EXPLANATION = re.compile(r'<div class="verse-explanation">.*?<p(?: data-ar="([^"]*)")?>(.*?)</p>',
                         re.S)


def text(s):
    """Strip inline markup and unescape entities, leaving speakable text."""
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(html.unescape(s))
    return re.sub(r'\s+', ' ', s).strip().strip('"“”')


def verses(page):
    src = open(os.path.join(UI, page), encoding='utf-8').read()
    out = []
    for card in VERSE_CARD.findall(src):
        tr, ex = TRANSLATION.search(card), EXPLANATION.search(card)
        if not tr or not ex:
            raise SystemExit('%s: a verse card is missing its translation or explanation' % page)
        out.append({
            'en': '%s %s' % (text(tr.group(2)), text(ex.group(2))),
            'ar': '%s %s' % (text(tr.group(1) or ''), text(ex.group(1) or '')),
        })
    return out


def main():
    args = sys.argv[1:]
    out_path = None
    if '-o' in args:
        i = args.index('-o')
        out_path = args[i + 1]
        args = args[:i] + args[i + 2:]
    if not args:
        raise SystemExit(__doc__)

    plan, total = {}, {'en': 0, 'ar': 0}
    for page in args:
        vs = verses(page)
        plan[page[:-5]] = vs
        for v in vs:
            for lang in ('en', 'ar'):
                total[lang] += len(v[lang])
        print('%-26s %2d verses  en %5d chars  ar %5d chars'
              % (page, len(vs), sum(len(v['en']) for v in vs), sum(len(v['ar']) for v in vs)),
              file=sys.stderr)
    print('%-26s %s  total %d characters'
          % ('', ' ' * 22, total['en'] + total['ar']), file=sys.stderr)

    data = json.dumps(plan, ensure_ascii=False, indent=2)
    if out_path:
        open(out_path, 'w', encoding='utf-8').write(data)
        print('wrote %s' % out_path, file=sys.stderr)
    else:
        print(data)


if __name__ == '__main__':
    main()
