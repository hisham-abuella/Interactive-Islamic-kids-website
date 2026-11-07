"""Art for game 04, Ibrahim: Stars and Guests, the third painted game (2026-11-07).

Every prompt, seed and negative for every sprite is recorded here, as the scholar's art checklist
requires (claudeteam/reviews/game-islamic-review-2026-11-03.md, 3a.7). Read by
scripts/build-game-art.py. Human-readable copy: claudeteam/reviews/game-ibrahim-art.md.

Rules carried by these prompts:
- STYLE and NEGATIVE are imported from specs/illustrations.py and used word for word, so the game
  matches the story plates exactly. The game list of 3a.3 is appended (as for Nuh and Musa).
- Things only (3a.1): the desert, dunes, palms, a far town of plain houses, the sky, a tent, a mat,
  cushions, a platter of food, bread, the moon and the sun as plain discs. No prophet, no person, no
  guest, no angel, no crowd.
- Ibrahim bans (3a.4 and the gate-1 rulings for 04): no guests (they are never drawn, not even as
  places set at a table), no fire with a figure in it (the fire is not in this game at all), no idols,
  statues or figures, no temple or ziggurat, no Ka'bah (never generated).
- The sun, the moon and the stars have NO faces (owner brief, scholar gate 1): "face, eyes, mouth"
  sit in every negative, and the bodies are separate cut-outs on a plain ground, so a face cannot hide in
  a busy sky. The plates are prompted with no moon and no sun disc, so the only bodies on screen are
  the reviewed cut-outs.
- Nothing shows food being eaten (gate 1, 04 fix 2): the platter is always whole.
- Lessons from Nuh and Musa: no crossed tent poles or X-shaped bars, no lattice or window mullions,
  no marks or squiggles on the sand, no eye-like glossy orbs.

Kinds (as in nuh.py):
- "plate":   full-bleed background, Z-Image Turbo, kept whole.
- "edit":    Qwen-Image-Edit 2511 applied to the plate named in `source`, so the time of day changes
             over the same landscape (night -> morning -> evening).
- "cutout":  Z-Image Turbo on a plain ground, then rembg (under the heavy lane), trim, fine ink
             outline, tint-match, WebP with alpha.
"""
import zlib

from specs.illustrations import NEGATIVE, STYLE  # noqa: F401  (STYLE is appended by build-game-art.py)

Z_MODEL = "z_image_turbo_1.0_q8p.ckpt"
EDIT_MODEL = "qwen_image_edit_2511_q8p.ckpt"

# Section 3a.3 game additions (as in nuh.py and musa.py), plus the Ibrahim bans of 3a.4 and gate 1 (04).
GAME_NEGATIVE = (
    "figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, "
    "statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, "
    "serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, "
    "statues, idols, figurines, carved figures, pedestal with a statue, ziggurat, temple tower, altar, "
    "fire, bonfire, flames, axe, "
    "guests, diners, place settings, cups, goblets, "
    "face, eyes, mouth, nose, smile, facial features, "
    "crossed poles, x shape, lattice, window bars, mullions"
)
NEG = f"{NEGATIVE}, {GAME_NEGATIVE}"
# plates never carry a body in the sky: the moon and the sun are the reviewed cut-outs
NO_BODIES = "moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet"

# Appended to every cut-out source prompt so rembg has a clean edge to find.
ISOLATE = "single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow"
# the moon is pale: a dark plain ground gives the cut a clean edge
ISOLATE_DARK = "single object centred on a plain flat dark navy blue background, nothing else in the picture, no stars, no clouds"


def seed(name: str) -> int:
    """Stable per-asset seed (crc32, like build-illustrations.py). Bump the suffix to reroll."""
    return zlib.crc32(f"game-ibrahim/{name}".encode()) % 2_000_000


DESERT = (
    "a wide quiet desert at night seen like a manuscript painting, smooth low rolling dunes of pale sand "
    "fill the bottom third of the picture, a few date palms stand at the far left and far right edges, "
    "a small far-off town of plain low flat-roofed mud-brick houses with tiny warm glowing doorways sits on "
    "the horizon in the middle distance, no towers and no domes, "
    "a huge deep cobalt blue night sky fills the upper two thirds, scattered small gold dot stars, "
    "the middle of the sky is open and empty, the sand is smooth and clean with no marks"
)
DESERT_TALL = (
    "a tall vertical view of a quiet desert at night seen like a manuscript painting, smooth low rolling "
    "dunes of pale sand fill the bottom quarter of the picture, one date palm at the left edge and one at "
    "the right edge, a small far-off town of plain low flat-roofed mud-brick houses with tiny warm glowing "
    "doorways sits on the horizon, no towers and no domes, "
    "a huge deep cobalt blue night sky fills the upper two thirds, scattered small gold dot stars, "
    "the middle of the sky is open and empty, the sand is smooth and clean with no marks"
)
MORNING_EDIT = (
    "Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only "
    "the time of day: it is now a clear bright morning soon after sunrise. The sky is pale turquoise high "
    "up and soft gold and apricot near the horizon, the stars are gone, and warm morning light falls on the "
    "dunes, the palms and the houses. The sky stays open and empty: no sun disc, no moon, no clouds in the "
    "middle, no birds, no people, no text."
)
EVENING_EDIT = (
    "Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only "
    "the time of day: it is now calm evening just after sunset. The sky glows soft rose, apricot and violet "
    "near the horizon and deepens to dusky blue above, with a few faint first gold stars, and the doorways "
    "of the far houses glow warm. The sky stays open and empty: no sun disc, no moon, no people, no text."
)
TENT = (
    "the open front of one large wide desert tent of dark brown woven goat-hair cloth held up by several "
    "straight upright wooden poles, a long flat sloping roof, seen from outside in soft daylight, the shaded "
    "inside is visible: a long low striped woven floor mat with a row of plain round cushions along the "
    "back wall, the mat is empty, at the right side of the tent a plain undyed cloth curtain hangs over the "
    "way to the inner part of the tent, two plain clay pots, pale smooth sand in front of the tent, a date "
    "palm and open desert behind under a calm pale turquoise sky, no food, no animals"
)
TENT_TALL = (
    "a tall vertical view of the open front of one large desert tent of dark brown woven goat-hair cloth held "
    "up by straight upright wooden poles, seen from outside in soft daylight, a calm pale turquoise sky and "
    "a date palm above the tent roof, the shaded inside is visible: a low striped woven floor mat with a row "
    "of plain round cushions along the back wall, the mat is empty, at the right side a plain undyed cloth "
    "curtain hangs over the way to the inner part of the tent, two plain clay pots, a wide stretch of pale "
    "smooth sand in front of the tent fills the bottom third, no food, no animals"
)

ASSETS = {
    # ---------- the sky round: one desert, three times of day (landscape, then portrait) ----------
    "plate-night-land": dict(kind="plate", w=1344, h=896, prompt=DESERT, neg_extra=NO_BODIES),
    "plate-morning-land": dict(kind="edit", w=1344, h=896, source="plate-night-land", prompt=MORNING_EDIT, neg_extra=NO_BODIES),
    "plate-evening-land": dict(kind="edit", w=1344, h=896, source="plate-night-land", prompt=EVENING_EDIT, neg_extra=NO_BODIES),
    "plate-night-port": dict(kind="plate", w=768, h=1408, prompt=DESERT_TALL, neg_extra=NO_BODIES),
    "plate-morning-port": dict(kind="edit", w=768, h=1408, source="plate-night-port", prompt=MORNING_EDIT, neg_extra=NO_BODIES),
    "plate-evening-port": dict(kind="edit", w=768, h=1408, source="plate-night-port", prompt=EVENING_EDIT, neg_extra=NO_BODIES),
    # ---------- the guests round: Ibrahim's tent (the guests are never drawn) ----------
    "plate-tent-land": dict(kind="plate", w=1344, h=896, prompt=TENT, neg_extra=NO_BODIES),
    "plate-tent-port": dict(kind="plate", w=768, h=1408, prompt=TENT_TALL, neg_extra=NO_BODIES),

    # ---------- cut-outs ----------
    # the moon and the sun: plain discs, NO faces (owner brief; 3b.1). Full moon only: a crescent beside the
    # painted stars could read as an emblem (3b.3).
    "moon": dict(kind="cutout", w=1024, h=1024, neg_extra="crescent, crescent moon, stars, clouds", prompt=(
        "one full round moon in flat manuscript painting style, a plain pale silver and ivory disc with a few "
        "soft grey-blue gouache patches, a thin gold outline, a completely plain surface with no face, no eyes "
        "and no mouth, " + ISOLATE_DARK)),
    "sun": dict(kind="cutout", w=1024, h=1024, neg_extra="clouds, sky", prompt=(
        "one round golden sun in flat manuscript painting style, a plain warm gold and orange disc ringed by "
        "many small pointed gold rays of equal length, a completely plain disc with no face, no eyes and no "
        "mouth, " + ISOLATE_DARK)),
    # the best food (51:26 "a fat calf", 11:69 "roasted"): a roasted meal on a platter, never shown being eaten
    "platter": dict(kind="cutout", w=1024, h=768, neg_extra="head, skull, bones, raw meat, knife, fork, cutlery, hands", prompt=(
        "one large round shallow brass serving platter piled with a generous golden-brown roasted meat feast "
        "on a bed of yellow rice, glossy and warm, garnished with a few green herbs, whole and untouched, seen "
        "from slightly above, " + ISOLATE)),
    # the poor choice (a kind thing, just not the best): a small dry crust on a plain plate
    "bread": dict(kind="cutout", w=768, h=768, prompt=(
        "one small dry crust of flat bread on a small plain unpainted clay plate, simple, " + ISOLATE)),
    # foreground framing, cropped at the corners of the desert
    "palm": dict(kind="cutout", w=768, h=1024, prompt=(
        "one date palm tree with a slender gently curved trunk and a crown of green fronds, whole tree "
        "visible, " + ISOLATE)),
}
ASSETS["palm"]["crop"] = 0.08


def items():
    for name, a in ASSETS.items():
        yield name, {**a, "seed": a.get("seed", seed(name))}


# ---------- rejections and rerolls (claudeteam/reviews/game-ibrahim-art.md, generation record) ----------
TENT_NEG = ("crossed sticks, crossed poles, crossbar, cross beam, stakes, pegs, x shape, footprints, tracks, holes in the sand, "
            "marks on the sand, rope ties across a pole")
TENT_CLEAN = (", every pole is one plain straight upright pole with nothing tied across it, no ropes, "
              "the sand is smooth and clean with no marks, no footprints and no holes")
# r2: the first landscape tent (seed 1358775) had a short crossbar tied at the top of the centre pole and two stakes
# crossing in an X at the foot of the front pole (3b.3), and dark hollows in the sand that could read as footprints
# (3b.1). Rejected.
ASSETS["plate-tent-land"].update(seed=seed("plate-tent-land-r2"), neg_extra=NO_BODIES + ", " + TENT_NEG, prompt=TENT + TENT_CLEAN)
# r2: the first portrait tent (seed 373667) had large oval hollows in the sand in front that could read as footprints
# (3b.1), and no painted gold rule (so it did not match the other plates). Rejected.
ASSETS["plate-tent-port"].update(seed=seed("plate-tent-port-r2"), neg_extra=NO_BODIES + ", " + TENT_NEG, prompt=TENT_TALL + TENT_CLEAN)
# r2: the first moon (seed 683121) was a photoreal moon with real maria; the dark patches and a round crater give the
# old "face in the moon" pareidolia and an eye-like ring (3b.1, 3b.2), and it is out of the manuscript style. Rejected.
ASSETS["moon"].update(seed=seed("moon-r2"), neg_extra="crescent, crescent moon, stars, clouds, craters, maria, dark patches, spots, photorealistic moon, nasa photo", prompt=(
    "one full round moon in flat Persian manuscript painting style, a flat smooth pale ivory and silver disc with only a "
    "very soft cream shading near its edge, a thin gold outline, no craters, no spots, no patches, no markings at all, "
    "no face, " + ISOLATE_DARK))
# r2: the first sun (seed 875106) is clean (no face), but its four longest rays point straight up, down, left and right,
# so the ray pattern reads as a compass cross (3b.3; the Nuh and Musa lesson: no cross shapes). Rejected.
ASSETS["sun"].update(seed=seed("sun-r2"), neg_extra="clouds, sky, compass rose, long rays, cardinal rays, cross shape, star shape", prompt=(
    "one round golden sun in flat Persian manuscript painting style, a plain warm gold and orange disc with a thin gold "
    "outline, ringed by a soft even crown of many small short rounded gold flame-like rays, all exactly the same small "
    "size all the way round, a completely plain disc with no face, no eyes and no mouth, " + ISOLATE_DARK))
# r2: the first platter (seed 1401174) showed cut meat with round ringed cross-sections that read as rows of eyes
# (3b.2; the Nuh goat lesson: no eye-like orbs). Rejected; the reroll asks for one whole roast with no cut faces.
ASSETS["platter"].update(seed=seed("platter-r2"), neg_extra="head, skull, bones, raw meat, knife, fork, cutlery, hands, slices, cut meat, cross-section, rings, marrow, round pieces", prompt=(
    "one large round shallow brass serving platter with a plain gold rim, holding one big whole golden-brown roasted joint "
    "of meat with a crisp glossy skin, no slices and no cut faces, resting on a bed of yellow rice with a few green herbs, "
    "warm and appetising, whole and untouched, seen from slightly above, " + ISOLATE))
# r2: the first bread (seed 1804768) carried a large blue four-armed motif on the bread that is a cross (3b.3). Rejected.
ASSETS["bread"].update(seed=seed("bread-r2"), neg_extra="pattern, motif, ornament, decoration, painted design, glaze, cross", prompt=(
    "one small dry broken crust of plain brown flat bread lying on a small plain unpainted terracotta clay plate, bare "
    "bread with no pattern and no decoration, simple, " + ISOLATE))
# The palm (seed 1815872) was rendered and passes 3b, but both desert plates already paint palms at their edges, so a
# foreground palm only cluttered the frame: not shipped (images/games/ibrahim has no palm). Kept here as a record.
ASSETS["palm"]["kind"] = "derived"
ASSETS["palm"]["prompt"] = "(not shipped: the plates already have palms; rendered once, seed 1815872, see above)"

# ---------- second review of the arrivals (2026-11-07) ----------
# r3: the second portrait tent (seed 1034882) showed the inner frame of the tent as upright poles crossed by
# horizontal rails (several small crosses, 3b.3), two poles meeting in a tied X at the front left, and paired oval
# hollows in the sand that read as footprints (3b.1). Rejected. r3 hides the frame behind plain cloth.
ASSETS["plate-tent-port"].update(seed=seed("plate-tent-port-r3"), neg_extra=NO_BODIES + ", " + TENT_NEG + ", rails, frame inside the tent, grid, footprint, prints", prompt=(
    TENT_TALL + ", the inside of the tent is lined with plain dark cloth so no poles or rails show inside, "
    "the front is held up by two plain straight upright poles only, no ropes, the sand in front is smooth, clean and "
    "completely unmarked"))
# r2: the first portrait evening edit (seed 1868268) redrew the border as a pointed arch with ornament in its
# spandrels over the sky: a mihrab-like niche (in NEGATIVE; 3b.5 spirit). Rejected; the reroll keeps a plain border.
ASSETS["plate-evening-port"].update(seed=seed("plate-evening-port-r2"), prompt=EVENING_EDIT + (
    " Keep the plain straight rectangular gold rule border exactly as it is: no arch, no ornament in the corners."))
# r3: the second platter (seed 736641) is a joint with a pink cut end round a dark bone ring that can read as an eye
# (3b.2). Rejected; r3 asks for a rounded roast with no cut end and no bone showing.
ASSETS["platter"].update(seed=seed("platter-r3"), neg_extra=ASSETS["platter"]["neg_extra"] + ", bone, cut end, ham hock, drumstick", prompt=(
    "one large round shallow brass serving platter with a plain gold rim, holding one big rounded golden-brown roast "
    "with a crisp glossy skin all over, no bone showing and no cut end, resting on a bed of yellow rice with a few green "
    "herbs, warm and appetising, whole and untouched, seen from slightly above, " + ISOLATE))
# r3: the second bread (seed 1856991) has a bite taken out of it (gate 1: nothing shows food being eaten) and the
# render added a tile panel with cross-like quatrefoils above the plate (3b.3). Rejected.
ASSETS["bread"].update(seed=seed("bread-r3"), neg_extra=ASSETS["bread"]["neg_extra"] + ", bite, bitten, bite mark, crumbs, tile, panel, border ornament", prompt=(
    "one small whole round dry crust of plain brown flat bread, unbroken with smooth edges, lying on a small plain "
    "unpainted terracotta clay plate, nothing else in the picture, " + ISOLATE))
# The moon is NOT rendered again: two Z-Image moons (seeds 683121, 1128661) were photoreal with maria that give the
# "face in the moon" pareidolia (3b.1). The shipped moon is derived without a model from the approved sun r2: its plain
# disc only (no rays), recoloured to pale ivory-silver in the export step (ibrahim_export.moon_from_sun). One hand.
ASSETS["moon"]["kind"] = "derived"
ASSETS["moon"]["prompt"] = "(derived in the export from the sun r2 disc; renders 683121 and 1128661 rejected, see above)"
# r3: the second portrait evening (seed 1909000) has no arch, but redrew the border as a cartouche with arabesque
# scrollwork in all four corners, which the crop cannot avoid; scrollwork beside the sky is the "script-like squiggle"
# risk (3b.4). Rejected. r3 asks for the plain rule of the night master.
ASSETS["plate-evening-port"].update(seed=seed("plate-evening-port-r3"),
    neg_extra=NO_BODIES + ", ornament, ornamental border, scrollwork, arabesque, corner ornament, arch, cartouche frame, vines",
    prompt=EVENING_EDIT + (" Keep the border exactly as it is now: one thin plain straight gold rule, with no ornament, "
                           "no scrollwork, no curved corners and no arch."))
# r4: the third portrait tent (seed 242580) carries a painted pseudo-signature in the bottom-right corner (3b.4) and
# rows of small oval dents in the sand that read as footprints (3b.1). Rejected.
ASSETS["plate-tent-port"].update(seed=seed("plate-tent-port-r4"), prompt=ASSETS["plate-tent-port"]["prompt"] + (
    ", the sand is one smooth even pale colour like a calm painted surface, with no dents, no pebbles, no dots and "
    "no writing in any corner"))
# r4: the third bread (seed 1656777) is again a round loaf painted with a large blue four-lobed medallion that reads as
# a cross (3b.3). The model decorates any round bread. Rejected; r4 asks for an irregular torn piece.
ASSETS["bread"].update(seed=seed("bread-r4"), neg_extra=ASSETS["bread"]["neg_extra"] + ", round loaf, disc, medallion, quatrefoil, flower, star, blue",
    prompt=("one small torn piece of plain dry brown bread with rough uneven edges, plain crust colour only, lying on a "
            "small plain unpainted terracotta clay plate, " + ISOLATE))
# r5: the fourth bread (seed 1600746) became a slice of toast painted with a blue panel of stars and crescents
# (a star-and-crescent emblem, 3b.3). Rejected. The plate STYLE's "Iznik turquoise and cobalt ... gold leaf" makes the
# model decorate any flat bread surface, so r5 asks for a small round roll with a plain baked crust.
ASSETS["bread"].update(seed=seed("bread-r5"), neg_extra=ASSETS["bread"]["neg_extra"] + ", toast, slice, crescent, stars, painted bread, tile, enamel",
    prompt=("one small hard dry bread roll with a plain golden-brown baked crust and a few cracks, no pattern and no "
            "colour on it, lying on a small plain unpainted terracotta clay plate, " + ISOLATE))
# r6: the fifth bread (seed 1030268) is a roll again painted with a blue-and-gold eight-petal rosette with a round
# centre (3b.2/3b.3 risk). Rejected. r6 asks for a few small broken crumbs and crusts, so there is no surface to paint.
ASSETS["bread"].update(seed=seed("bread-r6"), neg_extra=ASSETS["bread"]["neg_extra"] + ", rosette, roll, bun, loaf, whole bread",
    prompt=("three small broken pieces of hard dry bread crust, brown and plain, lying in a small plain unpainted "
            "terracotta clay dish, " + ISOLATE))
# r7: the sixth bread (seed 471110) has three crusts each painted with a turquoise panel and a blue almond with a dot:
# eyes (3b.2). Rejected. Six Z-Image renders all painted the bread, so r7 is a Qwen edit of the approved platter
# (same tray, same hand): only the food changes, to one small plain dry crust. The two dishes then differ only in what
# is on them, which is the lesson.
ASSETS["bread"] = dict(kind="cutedit", w=1024, h=768, source="platter", seed=seed("bread-r7"),
    neg_extra="pattern, motif, ornament on the bread, painted bread, eye, eyes, rosette, crescent, star",
    prompt=("Keep the exact same brass platter, its rim, the plain pale background, the light, the angle and the style. "
            "Change only the food: remove the roast and the rice completely. Now the platter holds only one small "
            "plain dry crust of brown bread in the middle, and the rest of the platter is empty and bare. The bread is "
            "plain brown with no pattern and no colour on it."))
# r8: the seventh bread (seed 480720, the first platter edit) kept the tray well, but the bread is a round roll
# scored with an X across its top (3b.3). Rejected. r8 asks for an unscored, irregular dry heel of bread.
ASSETS["bread"].update(seed=seed("bread-r8"),
    neg_extra=ASSETS["bread"]["neg_extra"] + ", scored bread, cut marks, slashes, x, cross, roll, bun",
    prompt=("Keep the exact same brass platter, its rim, the plain pale background, the light, the angle and the style. "
            "Change only the food: remove the roast and the rice completely. Now the platter holds only one small, "
            "irregular, dry heel of dark brown bread lying on its side near the middle, with a smooth plain crust and no "
            "cuts, marks or lines on it; the rest of the platter is empty and bare."))

# ---------- scholar gate 2b (2026-11-07): both tent plates rejected ----------
MOTIF_NEG = ("eye motif, evil eye, nazar, concentric lozenge, lozenge with a dot, diamond medallion, medallion, roof "
             "ornament, crossbar on the pole, rail across the pole, frame rails, script, inscription, script-like marks, "
             "border pattern, fringe, hem pattern, footprints, paired dents")
# The approved source of the landscape edit: the r2 render (seed 126676) kept as an input only (never shipped).
ASSETS["plate-tent-land-src126676"] = dict(kind="derived", w=1344, h=896,
    prompt="(input only: the r2 tent render, seed 126676, whose rope crosses the inner back pole; see below)")
# r3 (scholar 2b MUST 2): in seed 126676 the guy rope from the roof-corner knot runs THROUGH the inner back pole at about
# x 635, y 275 and the pole rises ~8 px above it: a small cross. Regenerated as a recorded Qwen edit of that render that
# removes the rope (the scholar allowed this in place of a new seed); everything else is kept.
ASSETS["plate-tent-land"] = dict(kind="edit", w=1344, h=896, source="plate-tent-land-src126676", seed=seed("plate-tent-land-r3"),
    neg_extra=NO_BODIES + ", " + TENT_NEG + ", " + MOTIF_NEG,
    prompt=("Keep the exact same tent, palm, mat, cushions, clay pots, sand, sky, colours, style and gold border. Remove "
            "every rope and cord stretched between the poles under the roof: no line crosses or touches any pole. Each "
            "pole is one plain straight upright pole with nothing across it and nothing tied to it. Change nothing else."))
# r5 (scholar 2b MUST 1): seed 1120183 had two stacked concentric blue lozenges on the roof, the upper with a round
# "pupil" (the nazar / evil-eye form, 3b.2-3), an inner centre pole crossed by a frame rail and rising above it (3b.3),
# and a column of script-like marks on the curtain band and a looped hem (3b.4). New seed, plain roof and curtain.
ASSETS["plate-tent-port"].update(seed=seed("plate-tent-port-r5"),
    neg_extra=NO_BODIES + ", " + TENT_NEG + ", " + MOTIF_NEG + ", rails, frame inside the tent, grid",
    prompt=(TENT_TALL + ", the tent roof is plain dark woven cloth with no medallion, no diamond and no motif, the curtain "
            "is plain undyed cloth with no border, no fringe and no pattern on its hem, the inside of the tent is lined "
            "with plain dark cloth so no poles, frame or rails show inside, the front is held up by two plain straight "
            "upright poles only, no ropes, the sand in front is smooth, clean and completely unmarked, "
            "no writing in any corner"))
# r6: the r5 render (seed 1400481) fixed the inside (no poles or rails) but again put a concentric diamond medallion on
# the roof (3b.2), a band of small X marks along the eave (3b.3), a striped fringe on the curtain hem, and a pseudo-
# signature in the bottom-right corner (3b.4). Z-Image ignores these negatives, so r6 is a recorded Qwen edit of that
# render (as the scholar allowed for the landscape tent) that only takes the ornaments and the corner writing away.
ASSETS["plate-tent-port-src1400481"] = dict(kind="derived", w=768, h=1408,
    prompt="(input only: the r5 tent render, seed 1400481; rejected as it stands, see below)")
ASSETS["plate-tent-port"] = dict(kind="edit", w=768, h=1408, source="plate-tent-port-src1400481", seed=seed("plate-tent-port-r6"),
    neg_extra=NO_BODIES + ", " + TENT_NEG + ", " + MOTIF_NEG,
    prompt=("Keep the exact same tent shape, poles, palm, cushions, striped floor mat, clay pots, sand, sky, colours, style "
            "and gold border. Make the whole tent roof plain dark woven cloth: remove the diamond on the roof completely. "
            "Make the band along the edge of the roof plain dark cloth with no pattern and no marks. Make the curtain plain "
            "undyed cloth with no striped edge and no fringe. Remove the small writing in the bottom-right corner, so the "
            "corner is plain sand. Change nothing else."))
# r7: the r6 edit (seed 761115) is clean (plain roof, plain band, plain curtain, no writing), but at both front poles
# the eave band crosses the pole and the pole top rises ~30 px above it (the Musa rule: the stem never rises above the
# bar, 3b.3), and small white cord loops hang beside the poles (a glyph-like shape at play size, 3b.4 when in doubt).
# r7 edits r6 once more: the poles end under the band, and the loops go.
ASSETS["plate-tent-port-src761115"] = dict(kind="derived", w=768, h=1408,
    prompt="(input only: the r6 edit, seed 761115; rejected as it stands, see below)")
ASSETS["plate-tent-port"] = dict(kind="edit", w=768, h=1408, source="plate-tent-port-src761115", seed=seed("plate-tent-port-r7"),
    neg_extra=NO_BODIES + ", " + TENT_NEG + ", " + MOTIF_NEG + ", pole above the band, pole tip, finial, hanging cords, loops",
    prompt=("Keep the exact same picture: the tent, the plain roof, the plain turquoise band along the eave, the curtain, "
            "the cushions, the floor mat, the clay pots, the palm, the sand, the sky, the colours, the style and the gold "
            "border. Change only the two front poles: each pole now stops just under the turquoise band and does not rise "
            "above it, and there are no cords, loops or ties hanging beside the poles. The two long guy ropes going down "
            "to the sand at the sides stay. Change nothing else."))
# r8: the r7 edit (seed 178573) washed the sky and the sand to flat cream and turned both front poles into columns of
# blue chevrons and lozenges (3b.2-3 risk, and off-composition). Rejected. r8 edits r6 again with a single, narrow change.
ASSETS["plate-tent-port"].update(seed=seed("plate-tent-port-r8"),
    neg_extra=NO_BODIES + ", " + TENT_NEG + ", " + MOTIF_NEG + ", pole above the band, pole tip, finial, columns, pillars, chevrons, cream sky, blank background",
    prompt=("Keep everything exactly as it is: the turquoise sky, the palm, the dark tent, the plain turquoise band, the "
            "curtain, the cushions, the mat, the clay pots, the golden sand and the gold border. Make only one small change: "
            "the two plain wooden front poles are a little shorter, so each pole ends at the lower edge of the turquoise "
            "band and nothing of the pole shows above the band. The poles stay plain round wood."))
