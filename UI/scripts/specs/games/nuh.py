"""Art for game 01, Nuh and the Ark (flagship painted rebuild, 2026-11-04).

Every prompt, seed and negative for every sprite is recorded here, as the scholar's
art checklist requires (claudeteam/reviews/game-islamic-review-2026-11-03.md, 3a.7).
Read by scripts/build-game-art.py. Human-readable copy: claudeteam/reviews/game-nuh-art.md.

Rules carried by these prompts:
- STYLE and NEGATIVE are imported from specs/illustrations.py and used word for word,
  so the game matches the story plates exactly.
- Things only: landscape, weather, wood, tents, animals. No being with agency is ever
  prompted for (3a.1). No prophet, no person, no crowd, no "builder".
- Nuh-specific bans (3a.4): no dove, no olive leaf, no rainbow. The ark rests on Judi (11:44).
- The ark is prompted with no mast, sail or yard: a mast with a yard reads as a cross (3b.3).
- The mockers are only ever two small plain tents with lantern-light (scholar 01 fix 2).

Kinds:
- "plate":   full-bleed background, Z-Image Turbo, kept whole.
- "edit":    Qwen-Image-Edit 2511 applied to the plate named in `source`, so a state
             change keeps the composition, palette and light identical.
- "cutout":  Z-Image Turbo on a plain pale ground, then rembg (under the heavy lane),
             trim, fine ink outline, tint-match, WebP with alpha.
- "cutedit": a Qwen edit of a cut-out source (same framing), then cut out the same way.
"""
import zlib

from specs.illustrations import NEGATIVE, STYLE

Z_MODEL = "z_image_turbo_1.0_q8p.ckpt"
EDIT_MODEL = "qwen_image_edit_2511_q8p.ckpt"

# Section 3a.3 game additions, plus the Nuh bans (3a.4) and the ark's no-mast rule.
GAME_NEGATIVE = (
    "figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, "
    "statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, "
    "serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, "
    "dove, pigeon, white bird, olive branch, olive leaf, leaf in beak, "
    "mast, sail, yardarm, rigging"
)
NEG = f"{NEGATIVE}, {GAME_NEGATIVE}"

# Appended to every cut-out source prompt so rembg has a clean edge to find.
ISOLATE = "single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow"


def seed(name: str) -> int:
    """Stable per-asset seed (crc32, like build-illustrations.py). Bump the suffix to reroll."""
    return zlib.crc32(f"game-nuh/{name}".encode()) % 2_000_000


VALLEY = (
    "a wide quiet valley of dry golden sand far from any sea, low rolling sandy hills on the left "
    "with two small plain cloth tents and two tiny glowing lantern lights beside them, "
    "a distant range of soft blue mountains, one tall broad mountain with a green rounded top "
    "rising on the right, a wide open stretch of flat empty ground across the lower middle, "
    "a few olive-green shrubs, a calm apricot and pale turquoise sky with a few stylized "
    "gold-edged clouds"
)
VALLEY_TALL = (
    "a tall vertical view of a quiet valley of dry golden sand far from any sea, a calm apricot "
    "and pale turquoise sky with stylized gold-edged clouds filling the upper third, a distant "
    "range of soft blue mountains, one tall broad mountain with a green rounded top in the upper "
    "middle, low sandy hills on the left with two small plain cloth tents and two tiny glowing "
    "lantern lights, a wide open stretch of flat empty ground filling the lower half, "
    "a few olive-green shrubs"
)
FLOOD_EDIT = (
    "Change only the weather and the water. Keep the exact same composition, mountains, palette, "
    "style and gold border. The valley is now completely flooded by a calm deep sea of Iznik "
    "turquoise and cobalt blue water with stylized curling gold-edged waves, the water reaching "
    "high up the mountains. The tents, the shrubs and the low hills are gone, hidden deep under "
    "the water, nothing is left floating on the surface. Heavy slate-blue rain clouds fill the "
    "sky, soft grey-blue light. No boat, no people, no birds, no tents, no text."
)
JUDI_EDIT = (
    "Keep the exact same composition, palette, style and gold border. The flood water is going "
    "down and lies calm and still, deep turquoise with gentle stylized ripples. The tall mountain "
    "with the green rounded top now rises out of the water as a green island peak with a flat "
    "grassy shoulder. The rain has stopped, the clouds are parting and soft warm golden morning "
    "light spreads across a clearing pale sky. No boat, no people, no birds, no rainbow, no text."
)

ASSETS = {
    # ---------- background plates: landscape (tablet, laptop) ----------
    "plate-dry-land": dict(kind="plate", w=1344, h=896, prompt=VALLEY),
    # r2: the first render (seed 299091) left the two tents floating in the flood; rejected (3b.7).
    "plate-flood-land": dict(kind="edit", w=1344, h=896, source="plate-dry-land", prompt=FLOOD_EDIT,
                             seed=seed("plate-flood-land-r2")),
    "plate-judi-land": dict(kind="edit", w=1344, h=896, source="plate-dry-land", prompt=JUDI_EDIT),
    # ---------- background plates: portrait (phone), composed on their own ----------
    "plate-dry-port": dict(kind="plate", w=768, h=1408, prompt=VALLEY_TALL),
    "plate-flood-port": dict(kind="edit", w=768, h=1408, source="plate-dry-port", prompt=FLOOD_EDIT),
    # r2: the first render (seed 542965) changed the mountain into a flat peak with a round green ball
    # on top and lost the manuscript style, so it did not register with the other portrait states.
    # r3 (scholar 2b SHOULD, 2026-11-04): r2 (seed 1724955) still had a round green ball on the peak,
    # right above the resting ark, which could read as a dome or an orb. Rejected.
    "plate-judi-port": dict(kind="edit", w=768, h=1408, source="plate-dry-port", seed=seed("plate-judi-port-r3"),
        neg_extra="ball, sphere, orb, globe, dome, round green ball on the peak", prompt=(
        "Keep the tall mountain exactly as it is in the picture, with the same low flat green cap of "
        "grass painted directly on its peak; nothing at all sits above the peak, no ball, no sphere, "
        "no orb, no dome. Keep the same mountain shapes, clouds, palette, gold-outlined manuscript "
        "style and border. " + JUDI_EDIT)),

    # ---------- the ark, plank by plank: one finished ark, one frame edited from it ----------
    "ark-whole": dict(kind="cutout", w=1344, h=768, prompt=(
        "a great wooden ark seen exactly from the side, a long gently curved hull of warm brown "
        "horizontal planks, a band of turquoise and cobalt diamond ornaments along the hull, "
        "a simple wooden cabin house with small square windows on the deck, no mast, " + ISOLATE)),
    "ark-frame": dict(kind="cutedit", w=1344, h=768, source="ark-whole", prompt=(
        "Show the same ark unfinished, at the same size and position: only the long wooden keel "
        "and the curved wooden ribs of the hull frame standing on the plain background, no planks "
        "on the sides, no cabin, no ornaments. Keep the same style and plain pale cream background. "
        "No people, no text.")),
    # The loose plank is NOT generated. Three renders (seeds 1567920, 1880328, 442654) all came back
    # with an ornamental inlay panel, because STYLE pulls every long board towards illumination; the
    # arabesque could read as script (3b.4). All three rejected. The plank is instead cut by
    # nuh_export.py from the plain hull planking of the approved `ark-whole`, so it is the ark's own wood.
    "plank": dict(kind="derived", w=0, h=0, source="ark-whole", prompt="(derived: a strip of the hull planking of ark-whole)"),
    # r2: the first pile (seed 1406322) was an ornamented box that read like a book cover with
    # pseudo-script swirls (3b.4, 3b.5). Rejected.
    "timber-pile": dict(kind="cutout", w=1024, h=768, seed=seed("timber-pile-r2"), prompt=(
        "a low untidy pile of long rough planks of plain unpainted raw brown timber and a few round "
        "logs with pale cut ends, seen from the side, no paint, no pattern, no decoration, " + ISOLATE)),
    "mallet": dict(kind="cutout", w=768, h=768, prompt=(
        "one wooden carpenter's mallet with a short handle, lying diagonally, " + ISOLATE)),
    "reeds": dict(kind="cutout", w=768, h=1024, prompt=(
        "a clump of tall slender desert grasses and reeds with a few small turquoise flowers, "
        "growing upward, " + ISOLATE)),

    # ---------- animals: one of each kind; a pair is the same sprite twice, one mirrored ----------
    **{f"animal-{k}": dict(kind="cutout", w=768, h=768, prompt=(
        f"one {desc} standing calmly in side view, whole body visible, gentle and friendly, " + ISOLATE))
       for k, desc in {
           "elephant": "elephant",
           "lion": "lion with a golden mane",
           "camel": "camel with one hump",
           "sheep": "woolly sheep",
           "giraffe": "giraffe",
           "rabbit": "dark brown wild rabbit with soft natural fur that is brown all over, including its belly and chest, no markings or emblems",
           "tortoise": "tortoise",
           "hoopoe": "hoopoe bird with a crest, perched on the ground",
           "cow": "cow",
           "goat": "pure white goat with soft white fur all over, clean white legs with no markings, small light hooves, no saddle cloth, no collar, no ornaments",
       }.items()},
}


# r2: the first rabbit (seed 574950) had an eight-spoked wheel emblem on its hip that could read as
# a religious wheel (3b.3), and was painted turquoise. Rejected.
ASSETS["animal-rabbit"]["seed"] = seed("animal-rabbit-r3")
# r3: r2 (seed 1900931) had a pale cream belly that no cut-out method could separate from the cream
# ground, leaving a bite-shaped gap (3b.9). Rejected.
# These two came with their own painted frame; crop further in before cutting out.
ASSETS["animal-rabbit"]["crop"] = 0.13
ASSETS["animal-goat"]["crop"] = 0.08
# r2 (scholar 2b MUST, 2026-11-04): the first goat (seed 1374833) had a glossy black round orb with a
# white catch-light on each front knee, reading as eyes on the legs (3b.2, 3b.9). Rejected, not retouched.
# r3: r2 (seed 1734851) still had a black oval patch ringed in tan on each front knee (eye-like).
# Rejected before cut-out, at full size.
# r4: r3 (seed 1395925) again had dark callus rings with a highlight on the knees (eye-like). Rejected
# at full size. The model ties "goat" to dark knee calluses, so r4 asks for an all-white goat.
ASSETS["animal-goat"]["seed"] = seed("animal-goat-r4")
# Shipped: r4 (seed 887926). Two more seeds were tried and rejected because their knee marks were darker:
# r5 (seed 254816, white goat, sharp dark knee spots) and r6 (seed 1199066, shaggy white goat, prompt
# "long-haired shaggy white goat whose long soft fur hangs down over its knees ...", knee spots again).
# r4 still has two faint, soft brown smudges on the front knees (no black, no gloss, no catch-light);
# flagged for the scholar's re-check. Fallback if not accepted: swap the kind (deer or horse).
ASSETS["animal-goat"]["neg_extra"] = "dark spots on the legs, black knee patches, knee calluses, eye spots, eyes on the legs, round markings"


def items():
    for name, a in ASSETS.items():
        yield name, {**a, "seed": a.get("seed", seed(name))}
