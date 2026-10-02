#!/usr/bin/env python3
"""Audit every quiz for the tells a child can exploit without knowing the answer.

A quiz a child can beat by pattern is not teaching anything, so three separate
tells are measured, in both languages:

  position  - is the correct option sitting in the same slot every time? Four
              options means 25% per slot by chance.
  length    - is the correct option reliably the longest (or the shortest)?
              Also 25% by chance. This one was fixed once already, in the
              2026-09-04 pass, and is easy to reintroduce.
  duplicates - two options that say the same thing, or a question with no
              correct option or more than one.

Usage:  python3 scripts/verify-quizzes.py
Exit status is non-zero if a structural problem is found (the duplicates tier);
the position and length tiers print a distribution to judge.
"""
import collections
import glob
import html
import os
import re
import sys

UI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CARD = re.compile(r'<div class="quiz-card[^"]*" data-question="\d+">(.*?)<div class="quiz-feedback">',
                  re.S)
OPTION = re.compile(r'<button class="quiz-option" data-correct="(true|false)"'
                    r'(?: data-ar="([^"]*)")?>(.*?)</button>', re.S)
QUESTION = re.compile(r'<p class="quiz-question"(?: data-ar="([^"]*)")?>(.*?)</p>', re.S)


def text(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    return re.sub(r'\s+', ' ', html.unescape(html.unescape(s))).strip()


def main():
    pos = {'en': collections.Counter(), 'ar': collections.Counter()}
    longest = {'en': 0, 'ar': 0}
    shortest = {'en': 0, 'ar': 0}
    total = 0
    problems = []

    for path in sorted(glob.glob(os.path.join(UI, '*.html'))):
        page = os.path.basename(path)
        src = open(path, encoding='utf-8').read()
        for qi, card in enumerate(CARD.findall(src), 1):
            opts = OPTION.findall(card)
            if not opts:
                continue
            total += 1
            q = QUESTION.search(card)
            label = '%s q%d' % (page, qi)

            correct = [i for i, o in enumerate(opts) if o[0] == 'true']
            if len(correct) != 1:
                problems.append('%s: %d correct options (expected 1)' % (label, len(correct)))
                continue
            ci = correct[0]

            for lang in ('en', 'ar'):
                vals = [text(o[2] if lang == 'en' else o[1]) for o in opts]
                if lang == 'ar' and not all(vals):
                    if q and not q.group(1):
                        continue          # page uses the older data-i18n path
                    problems.append('%s: an option has no Arabic' % label)
                    continue
                if len(set(vals)) != len(vals):
                    dupes = [v for v, n in collections.Counter(vals).items() if n > 1]
                    problems.append('%s [%s]: duplicate options %r' % (label, lang, dupes))
                pos[lang][ci] += 1
                lens = [len(v) for v in vals]
                if lens[ci] == max(lens) and lens.count(max(lens)) == 1:
                    longest[lang] += 1
                if lens[ci] == min(lens) and lens.count(min(lens)) == 1:
                    shortest[lang] += 1

    print('%d quiz questions across the site.\n' % total)
    for lang in ('en', 'ar'):
        n = sum(pos[lang].values())
        if not n:
            continue
        print('%s — %d questions scored' % (lang.upper(), n))
        bars = ', '.join('slot %d: %d (%d%%)' % (i + 1, pos[lang][i], round(100 * pos[lang][i] / n))
                         for i in range(4))
        print('  position of the correct answer — %s' % bars)
        print('  correct answer is strictly longest:  %d (%d%%)'
              % (longest[lang], round(100 * longest[lang] / n)))
        print('  correct answer is strictly shortest: %d (%d%%)'
              % (shortest[lang], round(100 * shortest[lang] / n)))
        worst = max(pos[lang].values())
        if round(100 * worst / n) >= 40:
            print('  ^ WARNING: one slot holds %d%% of answers (25%% expected by chance)'
                  % round(100 * worst / n))
        if round(100 * longest[lang] / n) >= 40 or round(100 * shortest[lang] / n) >= 40:
            print('  ^ WARNING: answer length is a usable signal')
        print()

    if problems:
        print('Structural problems:')
        for p in problems:
            print('  - %s' % p)
        return 1
    print('No duplicate options, and every question has exactly one correct answer.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
