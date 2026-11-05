#!/usr/bin/env python3
"""Render, cut out and export the painted art for a game, locally and through the RAM gate.

    python3 scripts/build-game-art.py nuh gen [names...]      # Draw Things, one image at a time
    python3 scripts/build-game-art.py nuh cut [names...]      # rembg (run THIS under the heavy lane)
    python3 scripts/build-game-art.py nuh export              # Pillow: trim, outline, tint, WebP
    python3 scripts/build-game-art.py nuh list                # prompts and seeds only

The three stages are separate commands on purpose (user RAM rule): Draw Things and rembg
never run at the same time. `gen` calls the gated shim ~/.local/bin/draw-things-cli, which
waits for >= 25% free RAM and the heavy lane, and exits when done (memory freed).
`cut` loads a rembg model in this process, so it must be started as
    ram-gate run --heavy -- python3 scripts/build-game-art.py nuh cut
and it refuses to run if a draw-things-cli process is alive.

Raw outputs go to UI/art-raw/<game>/ (gitignored). Shipped WebP goes to UI/images/games/<game>/.
Prompts, seeds and negatives live in scripts/specs/games/<game>.py (scholar checklist 3a.7).
"""
import importlib
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from specs.illustrations import STYLE  # noqa: E402

CLI = os.path.expanduser("~/.local/bin/draw-things-cli")
ROOT = Path(__file__).resolve().parent.parent
TIMEOUT = 1800


def spec(game):
    return importlib.import_module(f"specs.games.{game}")


def raw_dir(game):
    d = ROOT / "art-raw" / game
    d.mkdir(parents=True, exist_ok=True)
    return d


def gen(game, names, force=False):
    S = spec(game)
    out = raw_dir(game)
    log = out / "gen-log.txt"
    for name, a in S.items():
        if (names and name not in names) or a["kind"] == "derived":
            continue
        png = out / f"{name}.png"
        if png.exists() and not force:
            print(f"skip {name} (exists)")
            continue
        edit = a["kind"] in ("edit", "cutedit")
        cmd = [CLI, "generate", "--model", S.EDIT_MODEL if edit else S.Z_MODEL,
               "--prompt", f"{a['prompt']}, {STYLE}",
               "--negative-prompt", S.NEG + (", " + a["neg_extra"] if a.get("neg_extra") else ""),
               "--width", str(a["w"]), "--height", str(a["h"]),
               "--seed", str(a["seed"]), "--output", str(png), "--disable-preview", "--offline"]
        if edit:
            src = out / f"{a['source']}.png"
            if not src.exists():
                print(f"  {name}: source {a['source']} missing, generate it first")
                continue
            cmd += ["--image", str(src)]
            cmd += ["--strength", str(a.get("strength", 1.0))]
        t0 = time.time()
        print(f"gen {name} ({a['kind']}, seed {a['seed']}) ...", flush=True)
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=TIMEOUT)
        dt = time.time() - t0
        ok = p.returncode == 0 and png.exists()
        msg = f"{time.strftime('%H:%M:%S')} {name} seed={a['seed']} {'ok' if ok else 'FAILED'} {dt:.0f}s"
        print("  " + msg, flush=True)
        if not ok:
            print((p.stderr or p.stdout)[-1500:])
        with log.open("a") as f:
            f.write(msg + "\n")


def cut(game, names, force=False):
    alive = subprocess.run(["pgrep", "-f", "/opt/homebrew/bin/draw-things-cli"], capture_output=True)
    if alive.returncode == 0:
        sys.exit("draw-things-cli is running; rembg must not run beside it. Try again when it exits.")
    from PIL import Image
    from rembg import new_session, remove
    S = spec(game)
    out = raw_dir(game)
    sess = new_session("isnet-general-use")
    for name, a in S.items():
        if a["kind"] not in ("cutout", "cutedit") or (names and name not in names):
            continue
        src, dst = out / f"{name}.png", out / f"{name}.cut.png"
        if not src.exists() or (dst.exists() and not force):
            continue
        im = Image.open(src).convert("RGB")
        # The plate STYLE asks for a "fine gold rule border"; crop it off before cutting out.
        w, h = im.size
        m = int(min(w, h) * a.get("crop", 0.06))
        im = im.crop((m, m, w - m, h - m))
        t0 = time.time()
        res = remove(im, session=sess, post_process_mask=True)
        res.save(dst)
        res.save(out / f"{name}.rembg.png")   # kept: the export may merge it with a model-free cut
        print(f"cut {name} {time.time() - t0:.1f}s", flush=True)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    game, stage, *names = sys.argv[1:]
    force = "--force" in names
    names = [n for n in names if n != "--force"]
    if stage == "list":
        for n, a in spec(game).items():
            print(f"{n}  [{a['kind']} {a['w']}x{a['h']} seed {a['seed']}]\n  {a['prompt']}, {STYLE}\n")
    elif stage == "gen":
        gen(game, names, force)
    elif stage == "cut":
        cut(game, names, force)
    elif stage == "export":
        mod = importlib.import_module(f"specs.games.{game}_export")
        mod.export(raw_dir(game), ROOT / "images" / "games" / game)
    else:
        sys.exit(f"unknown stage {stage}")


if __name__ == "__main__":
    main()
