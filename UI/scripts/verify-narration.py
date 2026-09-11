#!/usr/bin/env python3
"""Check that narration lines up with what is on screen, for both page types.

Stories are slide-based and surahs are scroll pages, so they are checked
differently, but the invariant is the same: for every unit a child can be shown,
there is a line of narration in each language, and a generated audio file for it.

  stories - EN scripts == AR scripts == mp3s per language. The slide count is NOT
            checked here and cannot be: stories.js assembles slides at runtime from
            scenes, mini-quizzes, lesson and dua boxes, the quiz cards and a video
            slide, so it exists only in a browser. Measured there on 2026-09-11:
            adam 18, ibrahim 16, musa 20, nuh 16 - each equal to its script count,
            with no slide left without a script. Yusuf is deliberately
            `classic-scroll` and builds no slides at all; its narration plays
            through the 17 scripts in order regardless, verified by watching it
            request slide-0.mp3 and start.
  surahs  - verse cards == mp3s per language (a missing file is not fatal: the
            page falls back to the browser's own speech synthesis, so those are
            reported as "speech-synthesis only" rather than as failures)

Usage:  python3 scripts/verify-narration.py
Exit status is non-zero only if a story is out of step, or a surah page has a
partial set of audio (some verses voiced and others not, which is jarring mid-read).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
UI = os.path.dirname(HERE)
AUDIO = os.path.join(UI, 'audio')


def mp3_count(story, lang):
    d = os.path.join(AUDIO, story, lang)
    if not os.path.isdir(d):
        return 0
    return len([f for f in os.listdir(d) if f.endswith('.mp3')])


def story_scripts():
    """Parse voice-scripts.js for the per-story EN/AR script counts."""
    src = open(os.path.join(UI, 'voice-scripts.js'), encoding='utf-8').read()
    out = {}
    # each story block: 'name': { en: [...], ar: [...] }
    for m in re.finditer(r"'([a-z-]+)':\s*\{", src):
        name = m.group(1)
        if not name.startswith('prophet-'):
            continue
        # walk braces to find this story's block
        i = src.index('{', m.end() - 1)
        depth, j = 0, i
        while j < len(src):
            if src[j] == '{':
                depth += 1
            elif src[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        block = src[i:j + 1]
        counts = {}
        for lang in ('en', 'ar'):
            lm = re.search(r'\b%s:\s*\[' % lang, block)
            if not lm:
                counts[lang] = 0
                continue
            k = block.index('[', lm.end() - 1)
            d, n = 0, k
            while n < len(block):
                if block[n] == '[':
                    d += 1
                elif block[n] == ']':
                    d -= 1
                    if d == 0:
                        break
                n += 1
            counts[lang] = len(re.findall(r'\bslide:\s*\d+', block[k:n + 1]))
        out[name] = counts
    return out


def main():
    problems = []

    print('Stories')
    scripts = story_scripts()
    for story in sorted(scripts):
        en, ar = scripts[story]['en'], scripts[story]['ar']
        men, mar = mp3_count(story, 'en'), mp3_count(story, 'ar')
        counts = {'en scripts': en, 'ar scripts': ar, 'en mp3': men, 'ar mp3': mar}
        uniform = len({en, ar, men, mar}) == 1
        print('  %-18s en %-3d  ar %-3d  mp3 %d/%d  %s'
              % (story, en, ar, men, mar, 'ok' if uniform else 'MISMATCH'))
        if not uniform:
            problems.append('%s: %s' % (story, counts))

    print('\nSurah pages')
    for f in sorted(os.listdir(UI)):
        if not (f.startswith('surah-') or f == 'ayat-al-kursi.html') or not f.endswith('.html'):
            continue
        sid = f[:-5]
        verses = len(re.findall(r'<div class="verse-card"', open(os.path.join(UI, f),
                                                                encoding='utf-8').read()))
        if not verses:
            continue
        en, ar = mp3_count(sid, 'en'), mp3_count(sid, 'ar')
        if en == 0 and ar == 0:
            print('  %-26s %2d verses  no audio (speech-synthesis only)' % (f, verses))
        elif en == verses and ar == verses:
            print('  %-26s %2d verses  ok' % (f, verses))
        else:
            print('  %-26s %2d verses  PARTIAL  en %d, ar %d' % (f, verses, en, ar))
            problems.append('%s has partial audio: %d verses, en %d, ar %d'
                            % (f, verses, en, ar))

    print()
    if problems:
        for p in problems:
            print('FAIL  %s' % p)
        print('\n%d problem(s) found' % len(problems))
        return 1
    print('Narration is in step: every story script has a counterpart in the other\n'
          'language and a generated file, and no surah page has a partial set of audio.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
