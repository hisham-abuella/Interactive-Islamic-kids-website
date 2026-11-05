"""Narrate every story slide and surah verse locally, in Hisham's cloned voice (Fish S2-Pro).

The engine, reference recording and Whisper QA are the ones the personal website's articles
were narrated with - ~/Work/Whisper-audio/bakeoff/narrate.py - imported, not copied. Each
sentence-sized piece is transcribed back by Whisper, a bad take is regenerated (up to
--tries), and pieces that never pass are listed so they can be checked by ear.

Text comes from the same places as the ElevenLabs generators, so the files are drop-in:
  stories - scripts/voice-scripts-data.json            -> audio/<story>/<lang>/slide-<n>.mp3
  surahs  - each page's verse translation + explanation -> audio/<surah>/<lang>/verse-<n>.mp3

Renders into a staging folder first; --install copies the staged mp3s over UI/audio.

Usage (the bakeoff project's venv has mlx-audio and mlx-whisper):
  uv run --project ~/Work/Whisper-audio/bakeoff python scripts/narrate-s2pro.py \
      --stage /path/to/stage [--lang en|ar] [--only prophet-adam,surah-fatiha] [--units slide-0,verse-1]
  ... --stage /path/to/stage --install

Re-taking a unit whose installed take misread a word:
  --seed-base 10      takes use seeds 10, 11, ... (the default 0, 1, ... reproduces the old takes)
  --must-hear "TRIGGER=>WORDS"   (repeatable) a piece whose text contains TRIGGER passes only if
                      Whisper heard every one of WORDS (compared as Arabic letters, so alef and
                      hamza forms are unified). E.g. --must-hear "للعبادة=>للعبادة لقومه".
                      If TRIGGER is Latin (an English line that transliterates Arabic, which
                      Whisper writes in Arabic script), it is left out of the English score.
"""
import argparse
import glob
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
UI = HERE.parent
BAKEOFF = Path.home() / "Work/Whisper-audio/bakeoff"
VERSE_BREAK = ' <break time="0.5s" /> '     # between a verse's meaning and its explanation

# The model misreads digits in Arabic (950 came out as "five ... fifty"), so these are spoken as words.
# Audio only: the page keeps its digits. Add a number here if one appears in an Arabic script.
AR_NUMBERS = {"950": "تسعمئة وخمسين", "500": "خمسمئة", "100": "مئة", "50": "خمسين"}

AR_DIACRITICS = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")


def ar_canon(s):
    """Arabic words without tashkeel, tatweel or the usual spelling variants of alef, ya, ta marbuta."""
    s = AR_DIACRITICS.sub("", s)
    s = re.sub("[إأآٱ]", "ا", s).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    return re.sub(r"[^ء-ي\s]", " ", s).split()


def ar_verse_audio_on():
    m = re.search(r"var AR_VERSE_AUDIO\s*=\s*(true|false)\s*;", (UI / "surah-narration.js").read_text())
    return bool(m and m.group(1) == "true")


def load_plan_module():
    spec = importlib.util.spec_from_file_location("plan", HERE / "build-narration-plan.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def units(lang):
    """(page id, file stem, text) for everything a child can hear, stories first."""
    out = []
    stories = json.loads((HERE / "voice-scripts-data.json").read_text())
    for sid, langs in stories.items():
        for s in langs[lang]:
            if s.get("held"):      # silent until the scholar approves new wording (no-recitation rule)
                continue
            out.append((sid, f"slide-{s['slide']}", s["script"]))
    plan = load_plan_module()
    for page in sorted(glob.glob(str(UI / "surah-*.html"))) + [str(UI / "ayat-al-kursi.html")]:
        src = open(page, encoding="utf-8").read()
        pid = Path(page).stem
        for n, card in enumerate(plan.VERSE_CARD.findall(src), 1):
            tr, ex = plan.TRANSLATION.search(card), plan.EXPLANATION.search(card)
            g = 2 if lang == "en" else 1
            out.append((pid, f"verse-{n}", plan.text(tr.group(g) or "") + VERSE_BREAK + plan.text(ex.group(g) or "")))
    # The voice cannot say the ligature ﷺ: Whisper heard "Muhammad thickly", or nothing, or
    # junk in its place. Audio only: the page keeps ﷺ.
    if lang == "en":
        out = [(pid, stem, re.sub(r",\s*,", ",", re.sub(r"\s*ﷺ\s*", ", peace be upon him, ", t))
                .replace(", .", ".").replace(", !", "!")) for pid, stem, t in out]
    else:
        out = [(pid, stem, re.sub(r"\s*ﷺ", " صلى الله عليه وسلم", t)) for pid, stem, t in out]
    if lang == "ar":
        num = re.compile(r"\b(" + "|".join(sorted(AR_NUMBERS, key=len, reverse=True)) + r")\b")
        out = [(pid, stem, num.sub(lambda m: AR_NUMBERS[m.group(1)], t)) for pid, stem, t in out]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", required=True, type=Path)
    ap.add_argument("--lang", default="en", choices=["en", "ar"])
    ap.add_argument("--only", default="", help="comma-separated page ids")
    ap.add_argument("--units", default="", help="comma-separated file stems, e.g. slide-0,verse-1")
    ap.add_argument("--tries", type=int, default=4)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--flagged", action="store_true", help="re-render only units with a piece Whisper flagged")
    ap.add_argument("--install", action="store_true", help="copy staged mp3s into UI/audio and stop")
    ap.add_argument("--seed-base", type=int, default=0, help="first take seed (new takes, not the old ones)")
    ap.add_argument("--must-hear", action="append", default=[], metavar="TRIGGER=>WORDS",
                    help="a piece containing TRIGGER passes only if Whisper heard all of WORDS")
    args = ap.parse_args()
    only = set(filter(None, args.only.split(",")))
    pick = set(filter(None, args.units.split(",")))
    todo = [u for u in units(args.lang) if (not only or u[0] in only) and (not pick or u[1] in pick)]
    # No recitation: an Arabic verse unit's "meaning" line is still the ayah itself, so it is not
    # rendered (or installed) while AR_VERSE_AUDIO is off in surah-narration.js. See
    # scripts/verify-no-recitation.py, which must pass before the flag is turned on.
    if args.lang == "ar" and not ar_verse_audio_on():
        held = [u for u in todo if u[1].startswith("verse-")]
        if held:
            print(f"skipping {len(held)} Arabic verse unit(s): AR_VERSE_AUDIO is off (no-recitation interim)")
        todo = [u for u in todo if not u[1].startswith("verse-")]

    if args.install:
        n = 0
        for pid, stem, _ in todo:
            src = args.stage / pid / args.lang / f"{stem}.mp3"
            if src.exists():
                shutil.copy2(src, UI / "audio" / pid / args.lang / f"{stem}.mp3")
                n += 1
        print(f"installed {n} of {len(todo)} {args.lang} files")
        return

    sys.path.insert(0, str(BAKEOFF))
    import mlx_whisper
    import narrate
    from mlx_audio.audio_io import write as audio_write

    rules = []
    for r in args.must_hear:
        trig, _, words = r.partition("=>")
        rules.append((trig.strip(), ar_canon(words) or words.lower().split()))

    class KidsNarrator(narrate.Narrator):
        def best_take(self, text, tmp):
            spoken = " ".join(narrate.TAG_RE.sub(" ", text).split())
            mine = [(t, w) for t, w in rules if t in spoken]
            log, best = [], None
            for attempt in range(self.tries):
                audio = self.take(text, seed=args.seed_base + attempt)
                audio_write(str(tmp), audio, self.sr, format="wav")
                heard = mlx_whisper.transcribe(str(tmp), path_or_hf_repo=narrate.WHISPER,
                                               language=args.lang)["text"].strip()
                secs = len(audio) / self.sr
                if args.lang == "en":
                    # A transliterated Arabic phrase comes back in Arabic script: score the
                    # English around it, and let --must-hear judge the phrase itself.
                    ref_en, heard_en = spoken, heard
                    for t, _ in mine:
                        if not ar_canon(t):
                            ref_en = ref_en.replace(t, " ")
                            heard_en = re.sub(r"[\u0600-\u06ff]+", " ", heard_en)
                    # bakeoff's score() now also returns the softened-letter list (Arabic only)
                    ok, wer, cer, wps = narrate.score(ref_en, heard_en, secs)[:4]
                else:
                    rw, hw = ar_canon(spoken), ar_canon(heard)
                    wer = narrate.edits(rw, hw) / max(len(rw), 1)
                    rc, hc = "".join(rw), "".join(hw)
                    cer = narrate.edits(rc, hc) / max(len(rc), 1)
                    wps = len(rw) / max(secs, 0.01)
                    # Whisper's Arabic spelling drifts more than its English, so judge mostly on letters
                    ok = (wer <= 0.15 or cer <= 0.06) and (len(rw) < 8 or 1.0 <= wps <= 3.5)
                hc = set(ar_canon(heard)) | set(re.findall(r"[a-z']+", heard.lower()))
                missing = [w for _, ws in mine for w in ws if w not in hc]
                ok = ok and not missing
                log.append(dict(attempt=attempt, seed=args.seed_base + attempt, ok=ok,
                                wer=round(wer, 3), cer=round(cer, 3), wps=round(wps, 2), heard=heard,
                                **({"missing": missing} if missing else {})))
                rank = (not ok, len(missing), cer, abs(wps - 2.6))
                if best is None or rank < best[0]:
                    best = (rank, audio)
                if ok:
                    break
            return best[1], dict(text=text, passed=any(l["ok"] for l in log), tries=len(log), takes=log)

    narrator = KidsNarrator(args.tries)
    qa_path = args.stage / f"qa-{args.lang}.json"
    qa = json.loads(qa_path.read_text()) if qa_path.exists() else {}
    if args.flagged:
        todo = [u for u in todo if any(not p["passed"] for p in qa.get(f"{u[0]}/{u[1]}", []))]
        args.force = True
    tmp = args.stage / "_take.wav"
    t_start = time.time()
    for i, (pid, stem, text) in enumerate(todo, 1):
        out = args.stage / pid / args.lang / f"{stem}.mp3"
        if out.exists() and not args.force:
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        t0 = time.time()
        audio, info = narrator.segment(text, tmp)
        wav = out.with_suffix(".wav")
        audio_write(str(wav), audio, narrator.sr, format="wav")
        narrate.to_mp3(wav, out)
        wav.unlink()
        qa[f"{pid}/{stem}"] = info
        qa_path.write_text(json.dumps(qa, indent=1, ensure_ascii=False))
        bad = sum(not p["passed"] for p in info)
        print(f"[{i}/{len(todo)}] {pid}/{args.lang}/{stem}: {len(audio) / narrator.sr:5.1f}s "
              f"in {time.time() - t0:5.1f}s  pieces={len(info)} FLAGGED={bad}", flush=True)
    tmp.unlink(missing_ok=True)
    flagged = [(k, p["text"]) for k, ps in qa.items() for p in ps if not p["passed"]]
    print(f"done in {(time.time() - t_start) / 60:.1f} min; {len(flagged)} piece(s) flagged for a listen")
    for k, t in flagged:
        print(f"  {k}: {t[:100]}")


if __name__ == "__main__":
    main()
