"""Export stage for game 04, Ibrahim: Stars and Guests (no model is loaded here: Pillow only).

Plates: crop each one inside its OWN painted gold rule (found by its gold pixels, as for Musa: the Qwen edits redraw
the frame a few pixels off), so night, morning and evening line up for the crossfades; the tent plate gets the same
world size (centre crop to the same aspect). Cut-outs: trim to alpha, a fine dark-ink outline, a light tint-match
towards the plates' warm parchment, WebP with alpha. Shared helpers come from nuh_export.py and musa_export.py.
Writes images/games/ibrahim/manifest.json with world sizes and sprite aspects.
"""
import json
from pathlib import Path

from PIL import Image

from specs.games.musa_export import frame_box
from specs.games.nuh_export import clean_alpha, flood_cut, save_sprite  # noqa: F401

INSET = {"land": (0.012, 0.02, 0.012, 0.022), "port": (0.02, 0.012, 0.02, 0.016)}
FALLBACK = {"land": (0.04, 0.06, 0.04, 0.065), "port": (0.065, 0.045, 0.065, 0.06)}
PLATE_W = {"land": 1240, "port": 690}
STATES = ("night", "morning", "evening", "tent")

SPRITE_MAX = {  # longest side in shipped pixels (about 2x the largest display size)
    "moon": 320, "sun": 360, "platter": 480, "bread": 400,
}
FLOOD_CUT = {}


def crop_plate(im, comp):
    w, h = im.size
    fb = frame_box(im)
    if fb:
        l, t, r, b = fb; fw, fh = r - l, b - t; il, it, ir, ib = INSET[comp]
        return im.crop((round(l + fw * il), round(t + fh * it), round(r - fw * ir), round(b - fh * ib)))
    cl, ct, cr, cb = FALLBACK[comp]
    print("  no frame found, fallback crop")
    return im.crop((round(w * cl), round(h * ct), round(w * (1 - cr)), round(h * (1 - cb))))


def _edges(im, size):
    import numpy as np
    from PIL import ImageFilter
    g = im.convert("L").resize(size, Image.BILINEAR).filter(ImageFilter.FIND_EDGES)
    a = np.asarray(g).astype(float); a[: int(size[1] * 0.45)] = 0   # the landscape below the sky only
    return (a - a.mean()) / (a.std() + 1e-6)


def register(raw_im, night_crop):
    """The Qwen edits redraw the border (sometimes as a wide ornament band) and zoom the scene a little, so the
    painted frame cannot be trusted. Find the crop of the edit whose dunes, palms and houses best match the night
    plate (edge correlation, coarse grid then refinement). Pillow + numpy only."""
    import numpy as np
    asp = night_crop.width / night_crop.height
    size = (200, round(200 / asp))
    ref = _edges(night_crop, size)
    W, H = raw_im.size
    score = lambda b: (_edges(raw_im.crop(b), size) * ref).mean()
    best = None
    for wf in np.arange(0.78, 1.0, 0.01):
        w = W * wf; h = w / asp
        if h > H:
            continue
        for x0 in np.linspace(0, W - w, 15):
            for y0 in np.linspace(0, H - h, 15):
                sc = score((x0, y0, x0 + w, y0 + h))
                if best is None or sc > best[0]:
                    best = (sc, x0, y0, w)
    sc, x0, y0, w = best
    for _ in range(2):
        for dw in (-6, -3, 0, 3, 6):
            for dx in (-6, -3, 0, 3, 6):
                for dy in (-6, -3, 0, 3, 6):
                    ww = w + dw; hh = ww / asp; xx = x0 + dx; yy = y0 + dy
                    if xx < 0 or yy < 0 or xx + ww > W or yy + hh > H:
                        continue
                    s2 = score((xx, yy, xx + ww, yy + hh))
                    if s2 > sc:
                        sc, x0, y0, w = s2, xx, yy, ww
    print(f"  registered: box {[round(v) for v in (x0, y0, x0 + w, y0 + w / asp)]}, score {sc:.3f}")
    return raw_im.crop((x0, y0, x0 + w, y0 + w / asp))


def plates(raw: Path, out: Path, man: dict):
    for comp in ("land", "port"):
        night = None
        for st in STATES:
            src = raw / f"plate-{st}-{comp}.png"
            if not src.exists():
                print("  missing", src.name)
                continue
            im = Image.open(src).convert("RGB")
            if st in ("morning", "evening") and night is not None:
                im = register(im, night)
            else:
                im = crop_plate(im, comp)
                if st == "night":
                    night = im
                if st == "tent":   # the tent edits redraw a blue-and-gold rule a little inside the found frame: trim it
                    e = round(min(im.size) * 0.018)
                    im = im.crop((e, e, im.width - e, im.height - e))
            tw = PLATE_W[comp]
            if comp in man["world"]:
                tw, th = man["world"][comp]
                # same aspect as the world: centre crop (the tent is its own composition)
                a = tw / th
                if im.width / im.height > a:
                    nw = round(im.height * a); x0 = (im.width - nw) // 2; im = im.crop((x0, 0, x0 + nw, im.height))
                else:
                    nh = round(im.width / a); y0 = (im.height - nh) // 2; im = im.crop((0, y0, im.width, y0 + nh))
            else:
                th = round(im.height * tw / im.width)
                man["world"][comp] = [tw, th]
            im = im.resize((tw, th), Image.LANCZOS)
            im.save(out / f"plate-{st}-{comp}.webp", "WEBP", quality=74, method=6)


def moon_from_sun(raw: Path, out: Path, man: dict):
    """The moon, derived without a model from the approved sun: its plain disc only (the rays cut away by a circle),
    recoloured to a pale ivory-silver with the gouache texture kept faint. No craters, no patches: no face can form."""
    import numpy as np
    from PIL import ImageDraw, ImageFilter
    p = raw / "sun.cut.png"
    if not p.exists():
        return
    im = clean_alpha(Image.open(p).convert("RGBA"))
    im = im.crop(im.getchannel("A").getbbox())
    a = np.asarray(im).astype(float)
    H, W = a.shape[:2]; cy, cx = H / 2, W / 2
    yy, xx = np.mgrid[0:H, 0:W]; rr = np.hypot(yy - cy, xx - cx)
    # the disc edge: the radius where the orange disc ends (ray gaps start letting the background through)
    orange = (a[..., 0] > 180) & (a[..., 1] > 90) & (a[..., 1] < 200) & (a[..., 3] > 200)
    prof = [orange[(rr >= r) & (rr < r + 2)].mean() for r in range(0, int(min(cx, cy)))]
    R = next((r for r in range(int(min(cx, cy) * 0.4), len(prof)) if prof[r] < 0.6), int(min(cx, cy) * 0.6)) - 3
    # the sun's brushwork runs in rings round the centre (a target or eye on a pale disc), so it is blurred to a faint mottle
    lum = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(R_BLUR := 14))).astype(float)
    inside = rr <= R
    lo, hi = np.percentile(lum[inside], 5), np.percentile(lum[inside], 95)
    k = np.clip((lum - lo) / max(1, hi - lo), 0, 1) * 0.18 + 0.78             # only a faint mottle of the gouache
    shade = np.clip(1 - (rr / R) ** 3 * 0.25, 0, 1)                            # a soft cream shading at the rim
    ivory, silver = np.array([248, 244, 228]), np.array([170, 180, 205])
    rgb = (silver[None, None] + (ivory - silver)[None, None] * (k * shade)[..., None])
    alpha = Image.new("L", (W, H), 0)
    ImageDraw.Draw(alpha).ellipse((cx - R, cy - R, cx + R, cy + R), fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    moon = Image.fromarray(rgb.astype("uint8"), "RGB").convert("RGBA"); moon.putalpha(alpha)
    # the sun's thin gold outline, kept as a gold rim
    rim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(rim).ellipse((cx - R, cy - R, cx + R, cy + R), outline=(201, 160, 72, 255), width=max(2, R // 40))
    moon = Image.alpha_composite(moon, rim)
    save_sprite(moon, moon.getchannel("A").getbbox(), "moon", out, SPRITE_MAX["moon"], man)


def export(raw: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for name, crop in FLOOD_CUT.items():
        if (raw / f"{name}.png").exists():
            flood_cut(raw, name, crop)
    man = {"world": {}, "aspects": {}}
    plates(raw, out, man)
    moon_from_sun(raw, out, man)
    for name, mx in SPRITE_MAX.items():
        if name == "moon":
            continue
        p = raw / f"{name}.cut.png"
        if not p.exists():
            print("  missing", p.name)
            continue
        im = clean_alpha(Image.open(p).convert("RGBA"))
        save_sprite(im, im.getchannel("A").getbbox(), name, out, mx, man)
    (out / "manifest.json").write_text(json.dumps(man, indent=1))
    total = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"exported {len(list(out.glob('*.webp')))} webp, {total / 1024:.0f} KB")
