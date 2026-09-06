#!/usr/bin/env python3
"""Check the Quran chain: hub order, prev/next symmetry, and that nothing is orphaned.

A surah page reached only by the hub, or a "next" that does not point back, leaves
a child stranded mid-chain. Both have happened before, so this is checked by script.

Usage:  python3 scripts/verify-chain.py
"""
import os
import re
import sys

UI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = 'quran.html'


def read(name):
    return open(os.path.join(UI, name), encoding='utf-8').read()


def main():
    hub = read(HUB)
    order = re.findall(r'class="story-card-link surah-progress" data-surah="([^"]+)"', hub)
    print('Hub lists %d surah pages, in this order:' % len(order))
    for i, p in enumerate(order, 1):
        print('  %2d. %s' % (i, p))

    problems = []

    on_disk = {f for f in os.listdir(UI)
               if (f.startswith('surah-') or f == 'ayat-al-kursi.html') and f.endswith('.html')}
    for f in sorted(on_disk - set(order)):
        problems.append('%s exists on disk but is not linked from the hub' % f)
    for f in order:
        if f not in on_disk:
            problems.append('the hub links %s, which does not exist' % f)

    nav = {}
    for page in order:
        if page not in on_disk:
            continue
        block = re.search(r'<div class="page-navigation">(.*?)</div>', read(page), re.S)
        if not block:
            problems.append('%s has no page-navigation block' % page)
            continue
        links = re.findall(r'<a href="([^"]+)" class="nav-btn([^"]*)"', block.group(1))
        prev = [h for h, c in links if 'next' not in c]
        nxt = [h for h, c in links if 'next' in c]
        nav[page] = (prev[0] if prev else None, nxt[0] if nxt else None)

    for i, page in enumerate(order):
        if page not in nav:
            continue
        prev, nxt = nav[page]
        want_prev = order[i - 1] if i else None
        want_next = order[i + 1] if i + 1 < len(order) else None

        if want_prev and prev != want_prev:
            problems.append('%s: prev is %s, hub order says %s' % (page, prev, want_prev))
        if want_next:
            if nxt != want_next:
                problems.append('%s: next is %s, hub order says %s' % (page, nxt, want_next))
            elif nav.get(want_next, (None, None))[0] != page:
                problems.append('%s -> %s, but %s does not point back'
                                % (page, want_next, want_next))
        elif nxt != HUB:
            problems.append('%s is last, so next should be %s, not %s' % (page, HUB, nxt))

    print()
    if problems:
        for p in problems:
            print('FAIL  %s' % p)
        print('\n%d problem(s) found' % len(problems))
        return 1
    print('Chain is complete and symmetric across all %d pages, '
          'and every page on disk is linked from the hub.' % len(order))
    return 0


if __name__ == '__main__':
    sys.exit(main())
