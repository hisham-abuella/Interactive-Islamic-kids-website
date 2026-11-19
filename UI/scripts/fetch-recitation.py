#!/usr/bin/env python3
"""Fetch the human recitation for every ayah on the site, once, into UI/recitation/.

Qari: Sheikh Mahmoud Khalil al-Husary, Muallim (teaching) recitation, 128 kbps, one file
per ayah, from EveryAyah.com (research and licence notes:
claudeteam/reviews/recitation-tafsir-sources-2026-11-04.md). Approved by the owner on
2026-11-18. The files are kept in the repo so nothing is fetched live and nothing changes
without a commit; UI/recitation/SHA256SUMS pins every file, and
scripts/verify-no-recitation.py checks the folder against it.

This folder is the ONLY place Quranic audio may live. It is human recitation; no synthetic
voice ever produces a file here.

Usage:
  python3 scripts/fetch-recitation.py            # download what is missing, write SHA256SUMS
  python3 scripts/fetch-recitation.py --check    # verify the folder against SHA256SUMS
"""
import argparse
import hashlib
import os
import re
import subprocess
import sys
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UI = os.path.dirname(HERE)
OUT = os.path.join(UI, 'recitation', 'husary-muallim')
SUMS = os.path.join(UI, 'recitation', 'SHA256SUMS')
BASE = 'https://everyayah.com/data/Husary_Muallim_128kbps/'

# page -> surah number (the same map as verify-scripture.py). Ayat al-Kursi is 2:255.
PAGES = {
    'surah-fatiha': 1, 'surah-al-ikhlas': 112, 'surah-al-falaq': 113, 'surah-an-nas': 114,
    'surah-al-kawthar': 108, 'surah-al-asr': 103, 'surah-an-nasr': 110,
    'surah-al-kafirun': 109, 'surah-al-maun': 107, 'surah-quraysh': 106,
    'surah-al-masad': 111, 'surah-al-fil': 105, 'surah-az-zalzalah': 99,
    'surah-ad-duha': 93, 'surah-ash-sharh': 94, 'surah-at-tin': 95,
    'surah-al-humazah': 104, 'surah-at-takathur': 102, 'surah-al-qariah': 101,
    'surah-al-adiyat': 100, 'surah-al-bayyinah': 98,
}


def ayat():
    """Every (surah, ayah) shown on a verse card, from the pages themselves."""
    keys = []
    for page, s in PAGES.items():
        html = open(os.path.join(UI, page + '.html'), encoding='utf-8').read()
        n = len(re.findall(r'class="verse-card" data-verse="\d+"', html))
        keys += [(s, a) for a in range(1, n + 1)]
    keys.append((2, 255))
    return keys


def name(s, a):
    return '%03d%03d.mp3' % (s, a)


def sha(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 16), b''):
            h.update(chunk)
    return h.hexdigest()


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'default=nw=1:nk=1', path], capture_output=True, text=True)
    return float(out.stdout.strip() or 0)


def fetch(keys):
    os.makedirs(OUT, exist_ok=True)
    for s, a in keys:
        dest = os.path.join(OUT, name(s, a))
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            continue
        req = urllib.request.Request(BASE + name(s, a), headers={'User-Agent': 'kids-site-fetch/1.0'})
        with urllib.request.urlopen(req, timeout=60) as r:
            if r.headers.get('Content-Type', '').split(';')[0] != 'audio/mpeg':
                sys.exit('not audio: ' + name(s, a))
            data = r.read()
        with open(dest + '.part', 'wb') as f:
            f.write(data)
        os.replace(dest + '.part', dest)
        print('fetched', name(s, a), len(data))
        time.sleep(0.5)


def write_sums(keys):
    lines = ['%s  husary-muallim/%s' % (sha(os.path.join(OUT, name(s, a))), name(s, a)) for s, a in sorted(keys)]
    timing = os.path.join(UI, 'recitation', 'husary-muallim', 'parts.json')
    if os.path.exists(timing):
        lines.append('%s  husary-muallim/parts.json' % sha(timing))
    with open(SUMS, 'w') as f:
        f.write('\n'.join(lines) + '\n')


def check(keys):
    bad = []
    want = {}
    for line in open(SUMS):
        h, p = line.split()
        want[p] = h
    for s, a in keys:
        p = 'husary-muallim/' + name(s, a)
        full = os.path.join(UI, 'recitation', p)
        if p not in want:
            bad.append('not pinned: ' + p)
        elif not os.path.exists(full):
            bad.append('missing: ' + p)
        elif sha(full) != want[p]:
            bad.append('changed: ' + p)
        elif duration(full) < 1:
            bad.append('empty audio: ' + p)
    timing = 'husary-muallim/parts.json'
    if timing in want and sha(os.path.join(UI, 'recitation', timing)) != want[timing]:
        bad.append('changed: ' + timing)
    on_disk = set('husary-muallim/' + f for f in os.listdir(OUT))
    for extra in sorted(on_disk - set(want)):
        bad.append('unpinned file: ' + extra)
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    keys = ayat()
    if args.check:
        bad = check(keys)
        for b in bad:
            print('FAIL', b)
        print('%d ayat, %s' % (len(keys), 'OK' if not bad else '%d problems' % len(bad)))
        sys.exit(1 if bad else 0)
    fetch(keys)
    write_sums(keys)
    total = sum(os.path.getsize(os.path.join(OUT, name(s, a))) for s, a in keys)
    print('%d ayat, %.1f MB' % (len(keys), total / 1e6))


if __name__ == '__main__':
    main()
