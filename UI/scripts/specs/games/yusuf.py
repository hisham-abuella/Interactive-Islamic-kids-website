"""Art for game 02, Yusuf's Journey, the third painted game (2026-11-07).

Every prompt, seed and negative for every sprite is recorded here, as the scholar's art checklist
requires (claudeteam/reviews/game-islamic-review-2026-11-03.md, 3a.7). Read by
scripts/build-game-art.py. Human-readable copy: claudeteam/reviews/game-yusuf-art.md.

Rules carried by these prompts:
- STYLE and NEGATIVE are imported from specs/illustrations.py and used word for word, so the game
  matches the story plates exactly. The game list of 3a.3 is appended, as for Nuh and Musa.
- Things only (3a.1, gate-1 ruling 02): one journey landscape (hills, a road, desert, a river, palms, a
  storehouse), a well, a camel carrying bundles, a palm, a closed door, a sheaf of wheat, a sun disc and a
  full moon disc (no faces). No prophet, no person, no brothers, no household of the 'Aziz, no king, no
  crowd, no traveller. (Grain sacks and a toy block were rendered and rejected: see the rerolls below. The
  sacks ship as the Musa bundle; the "Your turn" blocks are UI-kit tiles.)
- Yusuf bans (gate-1 ruling 02 and the Musa lessons): no pharaonic temple, no pyramid, no obelisk, no
  statue or idol, no hieroglyphs; no crescent (a crescent beside stars can read as an emblem, 3b.3), no
  rays on the sun (an eye- or emblem-like orb is the risk), no faces on the sun or moon; no bars, grilles,
  crossbars, frames over the well or masts (no cross shapes, 3b.3); no dome (a dome over a building can
  read as a mosque, 3b.5); no crown, no seal, no throne.
- The eleven stars are never painted: the game draws exactly eleven soft lights itself, so the count in
  12:4 is always right (the story plate's note: the engine cannot count).

Kinds (as in musa.py):
- "plate":   full-bleed background, Z-Image Turbo, kept whole.
- "edit":    Qwen-Image-Edit 2511 applied to the plate named in `source`, so a state change keeps the
             composition, palette and light identical (day -> night, day -> hard years, day -> evening).
- "cutout":  Z-Image Turbo on a plain pale ground, then rembg (under the heavy lane), trim, fine ink
             outline, tint-match, WebP with alpha.
"""
import zlib

from specs.illustrations import NEGATIVE, STYLE  # noqa: F401  (STYLE is appended by build-game-art.py)

Z_MODEL = "z_image_turbo_1.0_q8p.ckpt"
EDIT_MODEL = "qwen_image_edit_2511_q8p.ckpt"

# Section 3a.3 game additions (as in nuh.py and musa.py), plus the Yusuf bans above.
GAME_NEGATIVE = (
    "figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, "
    "statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, "
    "serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, "
    "pyramid, pyramids, obelisk, sphinx, pharaonic temple, temple columns, hieroglyphs, colossus, "
    "crown, throne, seal, king, palace, "
    "crescent, crescent moon, sun rays, sunburst, eye, eyes, "
    "bars, grille, crossbar, cross beam, window bars, mast, dome, domes, cupola"
)
NEG = f"{NEGATIVE}, {GAME_NEGATIVE}"

# Appended to every cut-out source prompt so rembg has a clean edge to find.
ISOLATE = "single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow"


def seed(name: str) -> int:
    """Stable per-asset seed (crc32, like build-illustrations.py). Bump the suffix to reroll."""
    return zlib.crc32(f"game-yusuf/{name}".encode()) % 2_000_000


JOURNEY = (
    "a wide journey landscape seen from a high viewpoint like a manuscript map painting, in daylight: "
    "soft green hills with a few olive trees at the lower left, one pale winding sand road starts in the "
    "green hills at the lower left and curves across rolling golden desert dunes in the middle of the "
    "picture to a blue river at the right, on the river bank at the right stand tall date palms, green "
    "fields of ripe wheat and one long low flat-roofed mud-brick storehouse with a wide dark open doorway, "
    "a pale blue sky with a few soft clouds fills the top third, the road is empty, nothing on the road"
)
JOURNEY_TALL = (
    "a tall vertical journey landscape seen from a high viewpoint like a manuscript map painting, in daylight: "
    "soft green hills with a few olive trees fill the bottom of the picture, one pale winding sand road starts "
    "in the green hills at the bottom and curves up across rolling golden desert dunes in the middle of the "
    "picture to a blue river near the top, on the far river bank stand tall date palms, green fields of ripe "
    "wheat and one long low flat-roofed mud-brick storehouse with a wide dark open doorway, a pale blue sky "
    "with a few soft clouds fills the top fifth, the road is empty, nothing on the road"
)
KEEP = ("Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, "
        "palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same "
        "gold border. ")
NIGHT_EDIT = KEEP + (
    "Change only the time of day: it is now a quiet night. The sky is a deep plain cobalt blue with no stars, "
    "no moon and no sun in it. The land is in soft cool blue night shade. The road stays empty. No people, no text."
)
HARD_EDIT = KEEP + (
    "Change only the season: these are years of drought. The wheat fields by the river are now bare dry brown "
    "earth with no wheat, the hills are pale dry ochre instead of green, the river is narrower and lower, and the "
    "palms look dusty. The storehouse stays exactly as it is. The road stays empty. No people, no text."
)
EVENING_EDIT = KEEP + (
    "Change only the time of day: it is now a calm warm evening. The sky glows soft apricot, rose and pale gold "
    "near the horizon and deepens to soft blue above, and warm low light touches the palms and the storehouse. "
    "There is no sun disc, no moon and no stars. The road stays empty. No people, no text."
)

ASSETS = {
    # ---------- background plates: landscape (tablet, laptop) ----------
    "plate-day-land": dict(kind="plate", w=1344, h=896, prompt=JOURNEY),
    "plate-night-land": dict(kind="edit", w=1344, h=896, source="plate-day-land", prompt=NIGHT_EDIT),
    "plate-hard-land": dict(kind="edit", w=1344, h=896, source="plate-day-land", prompt=HARD_EDIT),
    "plate-eve-land": dict(kind="edit", w=1344, h=896, source="plate-day-land", prompt=EVENING_EDIT),
    # ---------- background plates: portrait (phone), composed on their own ----------
    "plate-day-port": dict(kind="plate", w=768, h=1408, prompt=JOURNEY_TALL),
    "plate-night-port": dict(kind="edit", w=768, h=1408, source="plate-day-port", prompt=NIGHT_EDIT),
    "plate-hard-port": dict(kind="edit", w=768, h=1408, source="plate-day-port", prompt=HARD_EDIT),
    "plate-eve-port": dict(kind="edit", w=768, h=1408, source="plate-day-port", prompt=EVENING_EDIT),

    # ---------- cut-outs: the story cards and the props they become ----------
    # the well (12:10, 12:15): stone only; no posts, beam, pulley or frame above it (a frame makes a cross)
    "well": dict(kind="cutout", w=1024, h=768, prompt=(
        "one low round desert well built of plain grey stone blocks with a dark round opening, a plain wooden "
        "bucket resting on its rim with a coil of rope, no posts, no beam, no frame and no roof above it, "
        + ISOLATE), neg_extra="well frame, pulley, posts, beam over the well, roof over the well, windlass"),
    # the travellers' caravan (12:19): a camel carrying bundles, never a rider
    "camel": dict(kind="cutout", w=1024, h=1024, prompt=(
        "one calm camel standing in side view, carrying two plain undyed cloth bundles tied on its back with "
        "rope, a plain woven blanket under them, no saddle seat, nobody on it, whole camel visible, "
        + ISOLATE), neg_extra="saddle seat, rider, person on the camel, howdah, patterned saddle cloth"),
    # Egypt: a date palm (no temple, gate-1 note 3)
    "palm": dict(kind="cutout", w=768, h=1024, prompt=(
        "one date palm tree with a slender gently curved trunk, a crown of green fronds and clusters of golden "
        "dates, whole tree visible, " + ISOLATE)),
    # the prison (12:35): a closed door, vertical planks only (a crossbar makes a cross)
    "door": dict(kind="cutout", w=768, h=1024, prompt=(
        "one closed round-arched wooden door made only of plain vertical planks, with one round iron ring "
        "handle, set in a small piece of plain mud-brick wall, no window, no grille, no crossbar, no hinges "
        "across the planks, " + ISOLATE), neg_extra="crossbar, horizontal brace, z brace, studs pattern, window, bars"),
    # the king's dream and the seven good years (12:43-49): a sheaf of wheat
    "sheaf": dict(kind="cutout", w=768, h=1024, prompt=(
        "one upright tied sheaf of ripe golden wheat with full ears at the top, tied in the middle with a "
        "plain straw band, " + ISOLATE)),
    # the brothers come for food (12:58-62): grain sacks, never the brothers
    "sack-full": dict(kind="cutout", w=768, h=768, prompt=(
        "one plump full sack of plain undyed burlap cloth, filled with wheat grain and tied at the top with "
        "a cord, standing upright, no pattern, no markings, " + ISOLATE)),
    "sack-empty": dict(kind="cutout", w=768, h=768, prompt=(
        "one empty sack of plain undyed burlap cloth lying limp and flat on its side, folded and crumpled, "
        "the open mouth at one end, no pattern, no markings, " + ISOLATE)),
    # the dream (12:4): a sun and a moon, plain discs with no face, no rays, no markings
    "sun": dict(kind="cutout", w=768, h=768, prompt=(
        "one plain round golden disc painted in flat gold leaf with a soft warm edge, smooth, no rays, no face, "
        "no markings, no pattern, " + ISOLATE), neg_extra="rays, flames, face, eyes, mouth, spiral, pattern, mosaic"),
    "moon": dict(kind="cutout", w=768, h=768, prompt=(
        "one plain round pale silver full moon disc painted in flat silver gouache, smooth, no face, no craters, "
        "no markings, " + ISOLATE), neg_extra="face, eyes, mouth, craters, crescent, pattern"),
    # "Your turn": a child's toy block (plain wood, no letters)
    "block": dict(kind="cutout", w=768, h=768, prompt=(
        "one plain wooden toy building block, a cube of smooth light wood painted soft turquoise, seen at a "
        "slight angle, no letters, no numbers, no pictures on it, " + ISOLATE),
        neg_extra="letters, numbers, alphabet block, pictures on the block, dice, dots"),
}

ASSETS["well"]["crop"] = 0.08
WELL_R1, WELL_R1_NEG = ASSETS["well"]["prompt"], ASSETS["well"]["neg_extra"]
ASSETS["camel"]["crop"] = 0.08
ASSETS["palm"]["crop"] = 0.08
ASSETS["door"]["crop"] = 0.08

# ---------- rejections and rerolls (claudeteam/reviews/game-yusuf-art.md, generation record) ----------

# r2: the first landscape master (seed 211655) lost the road behind the middle hill: it never reached the river or the
# storehouse, so the journey could not be walked along it (3b.10 in context). Rejected before any edit used it.
ASSETS["plate-day-land"].update(seed=seed("plate-day-land-r2"), prompt=(
    "a wide journey landscape seen from a high viewpoint like a flat Persian miniature map painting, in daylight: "
    "one pale sand road, clearly visible along its whole length, runs in gentle curves from soft green hills with "
    "a few olive trees in the bottom left corner, across low rolling golden desert dunes in the middle, all the "
    "way to a blue river on the right; on the river bank at the right stand tall date palms, green fields of ripe "
    "wheat and one long low flat-roofed mud-brick storehouse with a wide dark open doorway, and the road ends at "
    "the storehouse; a pale blue sky with a few soft clouds fills the top quarter; the road is empty, nothing on the road"))

# r3: r2 (seed 930772) ran the road as a straight highway off the bottom edge, away from the storehouse, and gave the
# storehouse a blue panelled window (a mullion could read as a cross, 3b.3). Rejected.
ASSETS["plate-day-land"].update(seed=seed("plate-day-land-r3"), prompt=(
    "a wide journey landscape seen from a high viewpoint like a flat Persian miniature map painting, in daylight: "
    "soft green hills with a few olive trees at the lower left; one narrow pale sand road winds like a gentle S "
    "from the green hills at the lower left, up and across low rolling golden desert dunes in the middle, and "
    "down to a blue river on the right; on the river bank at the right stand tall date palms, green fields of ripe "
    "wheat and one long low flat-roofed mud-brick storehouse with one wide dark open doorway and no windows; "
    "a pale blue sky with a few soft clouds fills the top quarter; the road is empty, nothing on the road"))


# ---- sprite rerolls after the self-check (3b), 2026-11-07. The plate STYLE's "stylized geometric forms" made the model
# put ornament on everything; the rerolls ask for bare surfaces and ban the motifs. ----
PLAIN = "no ornament, no motif, no pattern, no medallion, no star shape, no diamond shapes, no border band"
PLAIN_NEG = "ornament, motif, medallion, star motif, four-pointed star, diamond motif, quatrefoil, cross motif, rosette, border band, tile pattern, lattice, crosshatch"
# palm r2: r1 (seed 1423817) had a cross-hatched lattice trunk, rows of small X shapes (3b.3, the Musa lantern lesson).
ASSETS["palm"].update(seed=seed("palm-r2"), neg_extra=PLAIN_NEG + ", diamond trunk pattern", prompt=(
    "one date palm tree with a slender gently curved smooth brown trunk marked only by soft horizontal rings, a crown "
    "of green fronds and clusters of golden dates, whole tree visible, " + PLAIN + ", " + ISOLATE))
# door r2: r1 (seed 45629) was a double door whose centre seam and horizontal rail form a cross (3b.3).
ASSETS["door"].update(seed=seed("door-r2"), neg_extra=ASSETS["door"]["neg_extra"] + ", double door, two leaves, centre seam, panels, rails, " + PLAIN_NEG, prompt=(
    "one closed single-leaf round-arched wooden door of plain brown vertical planks, one round iron ring handle at the "
    "side, set in a small piece of plain mud-brick wall, no window, no panels, no rails, no crossbar, " + PLAIN + ", " + ISOLATE))
# sacks r2: r1 (seeds 630596, 596199) carried four-pointed star and diamond motifs that could read as a cross pattée (3b.3).
ASSETS["sack-full"].update(seed=seed("sack-full-r2"), neg_extra=PLAIN_NEG, prompt=(
    "one plump full sack of plain undyed beige burlap cloth, filled with wheat grain and tied at the top with a cord, "
    "standing upright, bare cloth, " + PLAIN + ", " + ISOLATE))
ASSETS["sack-empty"].update(seed=seed("sack-empty-r2"), neg_extra=PLAIN_NEG, prompt=(
    "one empty sack of plain undyed beige burlap cloth lying limp and flat on its side, folded and crumpled, the open "
    "mouth at one end, bare cloth, " + PLAIN + ", " + ISOLATE))
# sun r2: r1 (seed 717527) had a four-armed cross-like motif in its centre (3b.3).
ASSETS["sun"].update(seed=seed("sun-r2"), neg_extra=ASSETS["sun"]["neg_extra"] + ", " + PLAIN_NEG + ", plate, dish, coin", prompt=(
    "one plain round disc of smooth warm golden yellow gouache with a soft lighter centre, completely bare and even, "
    "no rays, no face, no markings, " + PLAIN + ", " + ISOLATE))
# moon r2: r1 (seed 942712) was a photographic moon with maria (a face-in-the-moon risk, 3b.1) inside an ornamental ring.
ASSETS["moon"].update(seed=seed("moon-r2"), neg_extra=ASSETS["moon"]["neg_extra"] + ", " + PLAIN_NEG + ", photograph of the moon, maria, dark patches, plate, dish, ring", prompt=(
    "one plain round disc of smooth pale silver-white gouache with a soft cool glow at its edge, completely bare and "
    "even, no craters, no dark patches, no face, no markings, " + PLAIN + ", " + ISOLATE))
# block r2: r1 (seed 696264) had a four-armed star motif on its face (3b.3).
ASSETS["block"].update(seed=seed("block-r2"), neg_extra=ASSETS["block"]["neg_extra"] + ", " + PLAIN_NEG, prompt=(
    "one plain wooden toy building block, a cube of smooth light wood painted plain soft turquoise on every face, seen "
    "at a slight angle, bare painted faces, " + PLAIN + ", no letters, no numbers, " + ISOLATE))

# well r2: r1 (seed 641594) is clean of crosses (the plank under the bucket reads as a bench), but its tiles carry a
# lozenge with a dark inner diamond that could read as an eye at play size (3b.2, the Nuh goat lesson). Rerolled plain.
ASSETS["well"].update(seed=seed("well-r2"), neg_extra=ASSETS["well"]["neg_extra"] + ", " + PLAIN_NEG + ", tiles, painted tiles", prompt=(
    "one low round desert well built of plain rough grey stone blocks with a dark round opening, a plain wooden bucket "
    "resting on its rim with a coil of rope, bare stone, no posts, no beam, no frame and no roof above it, " + PLAIN + ", " + ISOLATE))

# ---- r3, 2026-11-07: Z-Image Turbo does not honour the negative prompt, and the STYLE line ("Iznik turquoise and cobalt
# ... stylized geometric forms") puts a motif on every bare surface. r2 well (673807) again had eye-like tile lozenges;
# r2 sacks (441456, 761227) and block (1163988) again had four-pointed star motifs (3b.3). r3 leads with the material. ----
BARE = "completely undecorated, one single plain material and colour all over, nothing painted on it"
ASSETS["well"].update(seed=seed("well-r3"), prompt=(
    "a well made only of rough undecorated grey fieldstones, " + BARE + ": one low round desert well of piled grey stones "
    "with a dark round opening and a plain wooden bucket on its rim, no posts, no beam, no frame above it, " + ISOLATE))
ASSETS["sack-full"].update(seed=seed("sack-full-r3"), prompt=(
    "a sack made only of rough undyed beige burlap, " + BARE + ": one plump full grain sack tied at the top with a "
    "brown cord, a little wheat grain showing at the mouth, " + ISOLATE))
ASSETS["sack-empty"].update(seed=seed("sack-empty-r3"), prompt=(
    "a sack made only of rough undyed beige burlap, " + BARE + ": one empty grain sack lying limp and flat on its side, "
    "folded and crumpled, " + ISOLATE))
ASSETS["block"].update(seed=seed("block-r3"), prompt=(
    "a toy cube made only of smooth turquoise-painted wood, " + BARE + ": one wooden toy building block seen at a "
    "slight angle, every face the same flat turquoise, no letters, no numbers, " + ISOLATE))

# plate-hard-port r2: r1 (seed 418531) replaced the top of the gold border with a pointed arch full of arabesque, which
# reads as a mihrab or arched niche (3b.5, and a pseudo-script risk, 3b.4). Rejected; r2 pins the border.
ASSETS["plate-hard-port"].update(seed=seed("plate-hard-port-r2"), prompt=HARD_EDIT + (
    " Keep the plain thin gold rule border exactly as it is, straight on all four sides: do not add any arch, niche, "
    "ornamental frame or decorated border."))

# ---- outcome of r3, 2026-11-07. well r3 (933913) and sack-full r3 (1000038) again carried four-pointed star motifs.
# Decisions, instead of more seeds:
# - the well ships r1 (seed 641594): its tiles are plain diamonds with an inner diamond, the same ornament the scholar
#   accepted on the Musa bundle; listed as a question in game-yusuf-art.md (could the lozenge read as an eye?).
# - the sacks ship NO new image: the grain bags are the Musa `bundle` (scholar-approved 2026-11-06), copied by the export.
ASSETS["well"].update(seed=seed("well"), neg_extra=WELL_R1_NEG, prompt=WELL_R1)   # r1, the shipped render, exactly as sent
for _n in ("sack-full", "sack-empty"):
    ASSETS[_n]["kind"] = "derived"
    ASSETS[_n]["prompt"] = "(not shipped: r1-r3 all carried star motifs; the grain bags are the Musa bundle)"

# block r4: r3 (seed 1579458) became a girih tile with a four-pointed star at its centre (3b.3). The turquoise paint invites
# tile ornament, so r4 asks for bare unpainted wood.
ASSETS["block"].update(seed=seed("block-r4"), prompt=(
    "a toy cube of bare unpainted pale pine wood with soft natural wood grain, " + BARE + ": one wooden toy building "
    "block seen at a slight angle, rounded edges, no paint, no letters, no numbers, " + ISOLATE))

# plate-hard-port r3: r2 (seed 1947571) again curved the top into a patterned arch, and turned the lower road into a
# stream of water, breaking the composition (3b.10). r3 names the road and the river's place.
ASSETS["plate-hard-port"].update(seed=seed("plate-hard-port-r3"), prompt=HARD_EDIT + (
    " The winding road stays a pale dry sand road from the bottom of the picture up to the storehouse; the river stays "
    "only near the top, by the palms. Keep the plain thin gold rule border straight on all four sides: no arch, no "
    "niche, no ornamental band."))
# block r4 (seed 15201): bare wood, but one face carried a tile inlay of four diamonds around a centre (a cross arrangement,
# 3b.3). After four rerolls the painted block is dropped: the "Your turn" tower is built from UI-kit tiles on the
# parchment page (see game-yusuf-art.md). Not shipped.
ASSETS["block"]["kind"] = "derived"
ASSETS["block"]["prompt"] = "(not shipped: r1-r4 all carried a star or cross-arrangement motif; the tower uses UI-kit tiles)"


def items():
    for name, a in ASSETS.items():
        yield name, {**a, "seed": a.get("seed", seed(name))}
