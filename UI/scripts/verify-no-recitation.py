#!/usr/bin/env python3
"""No synthetic voice may speak Quranic wording. Fails the build if one can.

The rule (islamic-content-scholar, claudeteam/reviews/site-fixes-scholar-confirm-2026-11-04.md,
"Round 3 (2026-11-04)", Part 2): no synthetic voice (the S2-Pro clone, ElevenLabs or the
browser's speech synthesis) speaks an ayah: not a whole ayah however short, not a run of 4 or
more consecutive words of one, and not an ayah in transliteration. Names of Allah, dhikr
formulas, the isti'adha and a few approved short fragments are allowed; they are listed, each
with its ruling, in scripts/recitation-whitelist.json.

What is checked:

  1. NARRATION UNITS - exactly what the voice is given: units() from scripts/narrate-s2pro.py
     (story scripts from voice-scripts-data.json and every surah verse card, with the
     ﷺ substitution), in both languages. Arabic is normalised (no tashkeel or tatweel, alef
     and hamza forms unified, alef maqsura -> ya, ta marbuta -> ha) and compared with
     quran-simple-clean (scripts/data/quran-simple-clean.json, from api.alquran.cloud).
     English is checked for transliterated ayat with a consonant-skeleton matcher.
  2. AUDIO ON DISK - a unit that fails 1 must have no mp3 (the file would recite).
  3. THE INTERIM FLAG - while AR_VERSE_AUDIO in surah-narration.js is false, the Arabic surah
     verse units (whose "meaning" line is still the ayah) are SUPPRESSED, not passed: they are
     reported loudly, and the check fails if any of their mp3s exists. Turning the flag on
     makes them ordinary units again, so they must then be clean.
  4. SPEECH PATHS - every UI file that uses speech synthesis: no speak(...) call may be given
     an ayah, a translation line, quran text or data-ayah; surah-narration.js may not name
     any of them in code at all; and every Arabic or English string literal in those files
     is scanned like a narration unit (on-screen-only ayah data is listed in the whitelist).

Usage:
  python3 scripts/verify-no-recitation.py
  python3 scripts/verify-no-recitation.py --text "..." --lang ar     # test one line
  python3 scripts/verify-no-recitation.py --transcripts t.json        # {"path": {"lang":..,"text":..}}
  python3 scripts/verify-no-recitation.py --self-test                 # plants ayat, must flag them
Exit status 1 on any finding.
"""
import argparse
import glob
import importlib.util
import json
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
UI = os.path.dirname(HERE)
QURAN = os.path.join(HERE, 'data', 'quran-simple-clean.json')
WHITELIST = os.path.join(HERE, 'recitation-whitelist.json')
RUN = 4          # forbidden: this many consecutive words of one ayah
SKEL_RUN = 12    # forbidden: this many skeleton consonants of one ayah, in English (about 4 words)


def load_narrate():
    spec = importlib.util.spec_from_file_location('narrate_s2pro', os.path.join(HERE, 'narrate-s2pro.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


N = load_narrate()


def canon(s):
    """Arabic words, normalised: narrate-s2pro's ar_canon plus a bare hamza dropped."""
    return [w for w in (x.replace('ء', '') for x in N.ar_canon(s)) if w]


# ---------------------------------------------------------------- English transliteration
LAT_DI = [('sh', 'X'), ('ch', 'X'), ('th', 'Z'), ('dh', 'Z'), ('zh', 'Z'), ('kh', 'K'), ('gh', 'G')]
LAT = {'b': 'B', 'p': 'B', 't': 'T', 'd': 'Z', 'z': 'Z', 's': 'S', 'j': 'J', 'g': 'J', 'h': 'H',
       'k': 'K', 'q': 'K', 'c': 'K', 'x': 'K', 'r': 'R', 'm': 'M', 'n': 'N', 'f': 'F', 'v': 'F'}
AR = {'ب': 'B', 'ت': 'T', 'ط': 'T', 'ث': 'Z', 'ذ': 'Z', 'ظ': 'Z', 'ز': 'Z', 'ض': 'Z', 'د': 'Z',
      'س': 'S', 'ص': 'S', 'ش': 'X', 'ج': 'J', 'ح': 'H', 'ه': 'H', 'خ': 'K', 'ك': 'K', 'ق': 'K',
      'غ': 'G', 'ر': 'R', 'م': 'M', 'ن': 'N', 'ف': 'F'}
# dropped on both sides: vowels, alef, waw, ya, 'ayn, hamza, and lam (the article assimilates
# in transliteration: "as-samee", "minal")


def _english():
    try:
        return {w.strip().lower() for w in open('/usr/share/dict/words', encoding='utf-8', errors='ignore')}
    except OSError:
        return set()


ENGLISH = _english() | {'allah', 'him', 'her', 'his', 'them'}


def wskel(sk):
    """Word skeleton for word-by-word matching: a final H is dropped on both sides (ta marbuta,
    and "walidiyah"/"rahmah"/"Allah" are spelt with or without it)."""
    return sk[:-1] if sk.endswith('H') else sk


def edit1(a, b):
    """True if a and b differ by at most one inserted, deleted or changed letter."""
    if abs(len(a) - len(b)) > 1:
        return False
    i = 0
    while i < min(len(a), len(b)) and a[i] == b[i]:
        i += 1
    return a[i + 1:] == b[i + 1:] or a[i:] == b[i + 1:] or a[i + 1:] == b[i:]


def collapse(s):
    return re.sub(r'(.)\1+', r'\1', s)


def skel_ar(words):
    return collapse(''.join(AR.get(c, '') for c in ''.join(words)))


def skel_en(text):
    """(skeleton, position in text of each skeleton letter)."""
    out, pos = [], []
    t = text.lower()
    i = 0
    while i < len(t):
        two = t[i:i + 2]
        sym = next((v for k, v in LAT_DI if two == k), None)
        if sym:
            step = 2
        else:
            sym, step = LAT.get(t[i], ''), 1
        if sym and not (out and out[-1] == sym):
            out.append(sym)
            pos.append(i)
        i += step
    return ''.join(out), pos


# ---------------------------------------------------------------- the Quran index
BISMILLAH = canon('بسم الله الرحمن الرحيم')


class Quran:
    """quran-simple-clean, indexed per surah so that a run crossing two ayat is still found.
    (The api puts the basmala at the start of ayah 1 of every surah but 1 and 9: it is removed.)"""

    def __init__(self):
        data = json.load(open(QURAN, encoding='utf-8'))
        self.ref = []                      # ayah index -> "s:a"
        self.words = {}                    # surah -> words
        self.wayah = {}                    # surah -> ayah index of each word
        self.skel = {}                     # surah -> skeleton string
        self.sayah = {}                    # surah -> ayah index of each skeleton letter
        self.wskel = {}                    # surah -> skeleton of each word
        self.grams = defaultdict(set)      # 4-word gram -> {(surah, pos)}
        self.short = defaultdict(set)      # whole ayat of 2-3 words -> {ayah index}
        self.one = defaultdict(set)        # whole ayat of 1 word
        self.fuzzy = defaultdict(list)     # short ayah with one word left out -> [(ayah, the word)]
        self.sk = defaultdict(set)         # skeleton gram -> {(surah, pos)}
        self.wk = defaultdict(set)         # 4 word-skeletons -> {(surah, pos)}
        self.wk3 = defaultdict(set)        # 3 non-empty word-skeletons -> {(surah, pos)}
        self.wsk_ne = {}                   # surah -> non-empty word skeletons
        self.wayah_ne = {}
        for s, a, text in data['ayahs']:
            w = canon(text)
            if a == 1 and s not in (1, 9) and w[:4] == BISMILLAH:
                w = w[4:]
            i = len(self.ref)
            self.ref.append(f'{s}:{a}')
            self.words.setdefault(s, []).extend(w)
            self.wayah.setdefault(s, []).extend([i] * len(w))
            sk = skel_ar(w)
            prev = self.skel.get(s, '')
            if prev and sk and prev[-1] == sk[0]:
                sk = sk[1:]
            self.skel[s] = prev + sk
            self.sayah.setdefault(s, []).extend([i] * len(sk))
            self.wskel.setdefault(s, []).extend(wskel(skel_ar([x])) for x in w)
            if 2 <= len(w) < RUN:
                self.short[tuple(w)].add(i)
                if len(''.join(w)) >= 10:
                    for j in range(len(w)):
                        self.fuzzy[(len(w), j, tuple(w[:j] + w[j + 1:]))].append((i, w[j]))
            elif len(w) == 1:
                self.one[w[0]].add(i)
        for s, w in self.words.items():
            for k in range(len(w) - RUN + 1):
                self.grams[tuple(w[k:k + RUN])].add((s, k))
            sk = self.skel[s]
            for k in range(len(sk) - SKEL_RUN + 1):
                self.sk[sk[k:k + SKEL_RUN]].add((s, k))
            ws = self.wskel[s]
            for k in range(len(ws) - RUN + 1):
                self.wk[tuple(ws[k:k + RUN])].add((s, k))
            ne = [(x, self.wayah[s][j]) for j, x in enumerate(ws) if x]
            self.wsk_ne[s] = [x for x, _ in ne]
            self.wayah_ne[s] = [a for _, a in ne]
            for k in range(len(ne) - 2):
                self.wk3[tuple(self.wsk_ne[s][k:k + 3])].add((s, k))

    def refs(self, idxs):
        out = []
        for i in idxs:
            if self.ref[i] not in out:
                out.append(self.ref[i])
        return out

    @staticmethod
    def _extend(seq, k, n, hits, src):
        """Longest run seq[k:e] (e >= k+n) found at some hit; returns (e, [(s, pos) that hold it])."""
        e, live = k + n, set(hits)
        while e < len(seq) and seq[e] is not None:
            nxt = {(s, p) for s, p in live if p + (e - k) < len(src[s]) and src[s][p + (e - k)] == seq[e]}
            if not nxt:
                break
            live, e = nxt, e + 1
        return e, live

    def scan_ar(self, w, spans=()):
        """w: canonical words; spans: (start, end) of each whitelisted phrase found in w. A run
        is excused only if ONE whitelisted phrase covers all of it ("لا إله إلا هو" alone is
        dhikr; "الله لا إله إلا هو الحي القيوم" is 2:255 and is flagged). Two adjacent entries
        never combine: «لا إله إلا هو» + «الرحمن الرحيم» is the end of 2:163, and «حسبي الله» +
        «لا إله إلا هو» is 9:129; neither combination was reviewed as a whole (scholar, Round 4,
        3). Yields (kind, run, refs)."""
        excused = lambda k, e: any(a <= k and e <= b for a, b in spans)
        masked = {j for a, b in spans for j in range(a, b)}
        k = 0
        while k <= len(w) - RUN:
            hits = self.grams.get(tuple(w[k:k + RUN]))
            if not hits:
                k += 1
                continue
            e, live = self._extend(w, k, RUN, hits, self.words)
            if not excused(k, e):
                refs = self.refs(self.wayah[s][q] for s, p in sorted(live) for q in (p, p + e - k - 1))
                yield f'{e - k}-word run of an ayah', ' '.join(w[k:e]), refs
            k = e
        for n in (2, 3):
            for k in range(len(w) - n + 1):
                win = w[k:k + n]
                if excused(k, k + n):
                    continue
                hits = self.short.get(tuple(win))
                if hits:
                    yield 'whole ayah', ' '.join(win), self.refs(sorted(hits))
                    continue
                # one word off by a letter (Whisper hears "إن أعطيناك الكوثر"), ayat of 10+ letters
                near = [i for j in range(n) for i, wj in self.fuzzy.get((n, j, tuple(win[:j] + win[j + 1:])), [])
                        if edit1(win[j], wj) and len(win[j]) >= 2]
                if near:
                    yield 'whole ayah (one letter off)', ' '.join(win), self.refs(sorted(set(near)))
        # a one-word ayah is a finding only when it is the whole line (a single key word that
        # an explanation explains is allowed, rule 2)
        real = [x for j, x in enumerate(w) if j not in masked]
        if len(w) == 1 and real and real[0] in self.one:
            yield 'whole ayah', real[0], self.refs(sorted(self.one[real[0]]))

    def scan_en(self, text):
        found = []
        # (a) consonant skeleton of the whole line: long transliterations, whatever the word breaks
        sk, pos = skel_en(text)
        k = 0
        while k <= len(sk) - SKEL_RUN:
            hits = self.sk.get(sk[k:k + SKEL_RUN])
            if not hits:
                k += 1
                continue
            e, live = self._extend(list(sk), k, SKEL_RUN, hits, self.skel)
            refs = self.refs(self.sayah[s][q] for s, p in sorted(live) for q in (p, p + e - k - 1))
            a, b = pos[k], pos[e - 1] + 1
            a = text.rfind(' ', 0, a) + 1
            b2 = text.find(' ', b)
            found.append((f'transliterated ayah ({e - k} consonants)', text[a:b2 if b2 > 0 else len(text)], refs))
            k = e
        # (b) word by word: short words ("Qul huwa Allahu ahad") that (a) is too short to see.
        # Four words in a row whose skeletons equal four words of an ayah, with at least 7
        # skeleton letters between them (so that "and he is a" cannot match).
        words = re.findall(r"[A-Za-z'-]+", text)
        ws = [wskel(skel_en(x.replace('-', '').replace("'", ''))[0]) for x in words]
        k = 0
        while k <= len(ws) - RUN:
            hits = self.wk.get(tuple(ws[k:k + RUN]))
            if not hits or len(''.join(ws[k:k + RUN])) < 7:
                k += 1
                continue
            e, live = self._extend(ws, k, RUN, hits, self.wskel)
            phrase = ' '.join(words[k:e])
            if not any(phrase in f[1] or f[1] in phrase for f in found):
                refs = self.refs(self.wayah[s][q] for s, p in sorted(live) for q in (p, p + e - k - 1))
                found.append((f'transliterated ayah ({e - k} words)', phrase, refs))
            k = e
        # (c) the same, ignoring words with no consonant skeleton ("li", "wa"): three words in a
        # row with at least 6 skeleton letters, at least two of them not English words
        # ("Rabbi ighfir li wa li walidayya"; not "upon him a plain").
        ne = [(i, x) for i, x in enumerate(ws) if x]
        nes = [x for _, x in ne]
        k = 0
        while k <= len(nes) - 3:
            hits = self.wk3.get(tuple(nes[k:k + 3]))
            foreign = sum(re.sub(r"[^a-z]", '', words[i].lower()) not in ENGLISH for i, _ in ne[k:k + 3])
            if not hits or len(''.join(nes[k:k + 3])) < 6 or foreign < 2:
                k += 1
                continue
            e, live = self._extend(nes, k, 3, hits, self.wsk_ne)
            phrase = ' '.join(words[ne[k][0]:ne[e - 1][0] + 1])
            if not any(phrase in f[1] or f[1] in phrase for f in found):
                refs = self.refs(self.wayah_ne[s][q] for s, p in sorted(live) for q in (p, p + e - k - 1))
                found.append((f'transliterated ayah ({e - k} words)', phrase, refs))
            k = e
        yield from found


# ---------------------------------------------------------------- whitelist
class Whitelist:
    def __init__(self, transcripts=False):
        # transcripts: scanning Whisper transcripts (--transcripts). Entries marked
        # "transcripts_only" (a Whisper spelling, e.g. «أعود» for «أعوذ») apply only then: in a
        # script or a page that spelling is a typo, and is checked like any other text.
        self.transcripts = transcripts
        self.data = json.load(open(WHITELIST, encoding='utf-8'))
        self.ar = [(canon(p['phrase']), p) for p in self.data['phrases'] if p['lang'] == 'ar']
        self.en = [(re.compile(re.escape(p['phrase']).replace(r'\ ', r'[\s-]+'), re.I), p)
                   for p in self.data['phrases'] if p['lang'] == 'en']
        self.used = set()

    def applies(self, p):
        """Whether whitelist entry p may excuse text in the unit being scanned."""
        if p.get('units') and self._unit not in p['units']:
            return False
        if p.get('except_units') and self._unit in p['except_units']:
            return False
        if p.get('transcripts_only') and not self.transcripts:
            return False
        return True

    def mask_ar(self, w):
        """(start, end) of each occurrence of a whitelisted phrase in w."""
        spans = []
        for ph, p in self.ar:
            if not self.applies(p):
                continue
            n = len(ph)
            for k in range(len(w) - n + 1):
                if w[k:k + n] == ph:
                    spans.append((k, k + n))
                    self.used.add(p['phrase'])
        return spans

    def mask_en(self, text):
        for rx, p in self.en:
            if not self.applies(p):
                continue
            text, n = rx.subn(' | ', text)
            if n:
                self.used.add(p['phrase'])
        return text

    def scan(self, Q, unit, text):
        self._unit = unit
        w = canon(text)
        out = list(Q.scan_ar(w, self.mask_ar(w)))
        if re.search('[A-Za-z]', text):
            out += list(Q.scan_en(self.mask_en(re.sub(r'<[^>]+>', ' ', text))))
        return out


# ---------------------------------------------------------------- speech paths in the UI
CODE_FORBIDDEN = re.compile(r'translation|quran|data-ayah|\barabic\b|complete-surah|full-surah|ayah-text')
SPEAK_CALL = re.compile(r'\b(speak|speakText|playWithWebSpeech|SpeechSynthesisUtterance)\s*\(')
SPEAK_ARG_FORBIDDEN = re.compile(
    r'\.translation|quran-text|data-ayah|\.arabic|complete-surah|full-surah|'
    r'aya[ht]\w*\s*\[[^\]]*\]\s*\.\s*(ar|en)\b|AYAT\s*\[[^\]]*\]\s*\.\s*(ar|en)\b', re.I)
STRING_LIT = re.compile(r"'((?:\\.|[^'\\\n])*)'|\"((?:\\.|[^\"\\\n])*)\"|`((?:\\.|[^`\\])*)`")


def strip_comments(src):
    keep = lambda m: re.sub(r'[^\n]', ' ', m.group(0))     # blank it, keep line numbers
    src = re.sub(r'/\*[\s\S]*?\*/', keep, src)
    src = re.sub(r'<!--[\s\S]*?-->', keep, src)
    return re.sub(r'(?m)(?<![:\\\'"])//.*$', keep, src)


def call_args(src, start):
    depth, i = 1, start
    while i < len(src) and depth:
        depth += {'(': 1, ')': -1}.get(src[i], 0)
        i += 1
    return src[start:i - 1]


def speech_files():
    out = []
    for p in sorted(glob.glob(os.path.join(UI, '**', '*.*'), recursive=True)):
        rel = os.path.relpath(p, UI)
        if not p.endswith(('.js', '.html', '.mjs')) or rel.startswith(('scripts' + os.sep, 'node_modules')):
            continue
        src = open(p, encoding='utf-8', errors='replace').read()
        if 'speechSynthesis' in src or 'SpeechSynthesisUtterance' in src:
            out.append((rel, src))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--text')
    ap.add_argument('--lang', default='ar')
    ap.add_argument('--transcripts')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    Q, WL = Quran(), Whitelist(transcripts=bool(args.transcripts))

    if args.text is not None:
        f = WL.scan(Q, 'cli', args.text)
        for kind, run, refs in f:
            print(f'FLAG  {kind}: {run}  [{", ".join(refs[:4])}]')
        print('clean' if not f else f'{len(f)} finding(s)')
        return 1 if f else 0

    if args.self_test:
        plants = [('ar', 'قال لهم: ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين.'),
                  ('ar', 'وفي القصة: إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ، فما أجمل ذلك!'),
                  ('ar', 'قال: ملك الناس'),
                  ('ar', 'القارعة'),
                  ('ar', 'الله لا إله إلا هو الحي القيوم، لا تأخذه سنة ولا نوم'),
                  ('ar', 'إن أعطيناك الكوثر يقول الله'),
                  ('en', 'In Arabic it is: Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna.'),
                  ('en', 'Say: Rabbi ishrah li sadri wa yassir li amri.'),
                  ('en', 'He said: Qul huwa Allahu ahad, Allahu samad.'),
                  ('en', 'Here is a beautiful dua Prophet Nuh made: Rabbi ighfir li wa li walidayya.')]
        bad = 0
        for lang, t in plants:
            f = WL.scan(Q, 'self-test', t)
            print(('caught ' if f else 'MISSED ') + f'[{lang}] {t}')
            for kind, run, refs in f:
                print(f'         {kind}: {run} [{", ".join(refs[:3])}]')
            bad += not f
        # Round 4, 3: two adjacent whitelist entries never combine to excuse a run
        plants += [('ar', 'لا إله إلا هو الرحمن الرحيم'),          # 2:163 (end)
                   ('ar', 'حسبي الله لا إله إلا هو')]               # 9:129 (part)
        for lang, t in plants[-2:]:
            f = WL.scan(Q, 'self-test', t)
            print(('caught ' if f else 'MISSED ') + f'[{lang}] {t}  (two adjacent whitelist entries)')
            for kind, run, refs in f:
                print(f'         {kind}: {run} [{", ".join(refs[:3])}]')
            bad += not f
        # Round 4, 3: the Whisper spelling «أعود» is excused only when scanning transcripts
        tw = 'أعود بالله من الشيطان الرجيم'
        f = WL.scan(Q, 'prophet-adam/ar/slide-7', tw)
        print(('caught ' if f else 'MISSED ') + f'[ar] {tw}  (in a script: transcripts_only entry must not apply)')
        bad += not f
        f = Whitelist(transcripts=True).scan(Q, 'prophet-adam/ar/slide-7', tw)
        print(('clean  ' if not f else 'FALSE+ ') + f'[ar] {tw}  (in a Whisper transcript)')
        bad += bool(f)
        # Round 4, 3: entries 0 and 13 may not excuse Al-Fatiha verses 1 and 3 (for when
        # AR_VERSE_AUDIO is on: a meaning line that is still the ayah must fail)
        for unit, t in (('surah-fatiha/ar/verse-1', 'بسم الله الرحمن الرحيم'),
                        ('surah-fatiha/ar/verse-3', 'الرحمن الرحيم')):
            f = WL.scan(Q, unit, t)
            print(('caught ' if f else 'MISSED ') + f'[ar] {unit}: {t}')
            bad += not f
            f = WL.scan(Q, 'prophet-adam/ar/slide-1', t)
            print(('clean  ' if not f else 'FALSE+ ') + f'[ar] prophet-adam/ar/slide-1: {t}  (dhikr / Names of Allah elsewhere)')
            bad += bool(f)
        clean = [('ar', 'هذا دعاء جميل دعا به النبي نوح: سأل الله أن يغفر له ولوالديه.'),
                 ('en', 'Here is a beautiful dua Prophet Nuh made. It means: My Lord, forgive me and my parents.'),
                 ('ar', 'قل: لا إله إلا هو.'),
                 ('ar', 'حسبي الله ونعم الوكيل'),
                 ('ar', 'أعوذ بالله من الشيطان الرجيم')]
        for lang, t in clean:
            f = WL.scan(Q, 'self-test', t)
            print(('clean  ' if not f else 'FALSE+ ') + f'[{lang}] {t}')
            bad += bool(f)
        print('SELF-TEST ' + ('PASSED' if not bad else 'FAILED'))
        return 1 if bad else 0

    if args.transcripts:
        tr = json.load(open(args.transcripts, encoding='utf-8'))
        flagged = 0
        for path, rec in sorted(tr.items()):
            f = WL.scan(Q, path.split('audio/')[-1].replace('.mp3', ''), rec['text'])
            if f:
                flagged += 1
                for kind, run, refs in f:
                    print(f'FLAG  {path}: {kind}: {run}  [{", ".join(refs[:4])}]')
        print(f'transcripts scanned: {len(tr)}; flagged: {flagged}')
        return 1 if flagged else 0

    problems = []
    narr = open(os.path.join(UI, 'surah-narration.js'), encoding='utf-8').read()
    m = re.search(r'var AR_VERSE_AUDIO\s*=\s*(true|false)\s*;', narr)
    if not m:
        problems.append('surah-narration.js: AR_VERSE_AUDIO flag not found')
    flag_on = bool(m and m.group(1) == 'true')

    # held story slides: wording awaits the scholar; they must be silent (no mp3; units() skips them)
    held = []
    data = json.load(open(os.path.join(HERE, 'voice-scripts-data.json'), encoding='utf-8'))
    for sid, langs in data.items():
        for lang, scripts in langs.items():
            for x in scripts:
                if x.get('held'):
                    unit = f'{sid}/{lang}/slide-{x["slide"]}'
                    held.append((unit, x['held']))
                    if os.path.exists(os.path.join(UI, 'audio', sid, lang, f'slide-{x["slide"]}.mp3')):
                        problems.append(f'{unit}: held (silent) but its mp3 exists')
    for code_file in ('audio-narration.js',):
        if 'script.held' not in open(os.path.join(UI, code_file), encoding='utf-8').read():
            problems.append(f'{code_file}: does not honour held scripts, so a held slide could be spoken')

    # 1-3. narration units and their audio
    suppressed, suppressed_audio, n_units = [], [], 0
    for lang in ('en', 'ar'):
        for pid, stem, text in N.units(lang):
            unit = f'{pid}/{lang}/{stem}'
            mp3 = os.path.join(UI, 'audio', pid, lang, stem + '.mp3')
            if lang == 'ar' and stem.startswith('verse-') and not flag_on:
                suppressed.append(unit)
                if os.path.exists(mp3):
                    suppressed_audio.append(unit)
                continue
            n_units += 1
            for kind, run, refs in WL.scan(Q, unit, text):
                problems.append(f'{unit}: {kind}: «{run}» [{", ".join(refs[:4])}]'
                                + ('  AND ITS MP3 EXISTS' if os.path.exists(mp3) else ''))

    # 4. speech paths
    files = speech_files()
    n_lits = 0
    onscreen = WL.data.get('onscreen_only', [])
    used_onscreen = set()
    for rel, src in files:
        code = strip_comments(src)
        if rel.endswith('.html'):
            # only script is code; page markup is on screen and is not read by any speech path
            # (the speak(...) argument rule above is what keeps markup out of speech)
            code = re.sub(r'(?s)(<script\b[^>]*>)(.*?)(</script>)|[^\n]',
                          lambda m: m.group(0) if m.group(1) else (' ' if m.group(0) != '\n' else '\n'), code)
        if rel == 'surah-narration.js':
            for mm in CODE_FORBIDDEN.finditer(code):
                line = code[:mm.start()].count('\n') + 1
                problems.append(f'{rel}: names «{mm.group(0)}» in code (line ~{line}): a speech path could read ayah text')
        for mm in SPEAK_CALL.finditer(code):
            arg = call_args(code, mm.end())
            if SPEAK_ARG_FORBIDDEN.search(arg):
                problems.append(f'{rel}: {mm.group(1)}({arg.strip()[:80]}) is given ayah or translation text')
        for lm in STRING_LIT.finditer(code):
            lit = next(g for g in lm.groups() if g is not None)
            if len(lit) < 8:
                continue
            key = re.search(r'["\']?(\w+)["\']?\s*:\s*$', code[max(0, lm.start() - 40):lm.start()])
            key = key.group(1) if key else None
            skip = None
            for j, o in enumerate(onscreen):
                if o['file'] != rel:
                    continue
                if 'text' in o and o['text'] in lit:
                    skip = j
                elif 'field' in o and o['field'] == key:
                    w = canon(lit)
                    # the literal must be scripture and nothing else
                    if w and any(run == ' '.join(w) for _, run, _ in Q.scan_ar(w)):
                        skip = j
                if skip is not None:
                    break
            if skip is not None:
                used_onscreen.add(skip)
                continue
            n_lits += 1
            line = code[:lm.start()].count('\n') + 1
            for kind, run, refs in WL.scan(Q, rel, lit):
                problems.append(f'{rel}:{line}: string a speech path may read: {kind}: «{run}» [{", ".join(refs[:4])}]')

    unused = [p['phrase'] for p in WL.data['phrases'] if p['phrase'] not in WL.used]
    for j, o in enumerate(onscreen):
        if j not in used_onscreen:
            problems.append(f'recitation-whitelist.json onscreen_only entry {j} ({o["file"]}) matched nothing: '
                            'the code changed; re-review it')

    print(f'Checked {n_units} narration units (EN + AR), {len(files)} files with speech synthesis, '
          f'{n_lits} string literals in them, against {len(Q.ref)} ayat.')
    if suppressed:
        print()
        print('!' * 78)
        print(f'!! INTERIM: AR_VERSE_AUDIO is false in surah-narration.js. {len(suppressed)} Arabic surah')
        print('!! verse units are NOT CHECKED: their "meaning" line is still the ayah itself.')
        print('!! They may have no audio, and nothing may speak them. Before turning the flag')
        print('!! on, their tafsir lines must be written, approved by the scholar, and pass this check.')
        print(f'!! Of those {len(suppressed)}, mp3s on disk: {len(suppressed_audio)}')
        print('!' * 78)
        for u in suppressed_audio:
            problems.append(f'{u}: mp3 exists for a suppressed unit that recites its ayah')
    if held:
        print()
        print(f'!! HELD (silent, awaiting the scholar): {len(held)} story slide(s), not checked as units:')
        for u, why in held:
            print(f'!!   {u}: {why}')
    if unused:
        print(f'\nNOTE: whitelist entries not used by any unit (keep or prune): {len(unused)}')
    if problems:
        print(f'\nFAIL: {len(problems)} finding(s)')
        for p in problems:
            print('  ' + p)
        return 1
    print('\nNO RECITATION: no narration unit, audio file or speech path speaks an ayah.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
