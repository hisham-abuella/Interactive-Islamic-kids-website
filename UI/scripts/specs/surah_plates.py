"""Story plates for the surah pages, one above each group of verses.

Same rules as the story plates in `illustrations.py`, plus the ones a surah
adds:

- No people, ever — not prophets, angels, crowds or riders.
- Nothing that depicts Allah, His Throne or Kursi, or the unseen. Where a
  surah speaks of these, the plate uses the Quran's own imagery (moths, carded
  wool, rivers beneath trees) or a plain object, never a literal picture.
  Ayat al-Kursi is shown through the heavens and the earth — there is no
  throne or chair anywhere in it.
- No Kaaba, mosque or dome: Quraysh and At-Tin show Makkah's valley as hills.
- Verses about the Fire, the graves and the Scales get no plate at all.
- No writing. The engine cannot spell Arabic, and garbled Quranic text is not
  acceptable. Al-Fatiha and Al-Ikhlas have no plates here; they get an
  illuminated frame with the real text typeset inside it instead. Al-Ikhlas
  in particular has no picture, because any picture risks reading as a
  likeness.

Keys are the verse number a plate sits above (`data-verse` on the page); the
first plate also serves as the page's hero. Rendered by
`scripts/build-illustrations.py --surahs` into images/surahs/<slug>/.
"""

# slug -> {first verse of the group: prompt}
PLATES = {
    "surah-al-falaq": {
        1: "the first light of daybreak splitting a dark night sky over quiet hills, "
           "a bright seam of gold opening along the horizon",
        3: "darkness settling over rolling hills at night, one small house with a single lit "
           "doorway glowing warm and safe, deep blue sky with a few stars",
    },
    "surah-an-nas": {
        1: "a quiet village of mud-brick houses under a deep starry sky, soft lamplight in the "
           "windows, peaceful and safe",
        4: "a closed wooden shutter at night with wind swirling dust and leaves against it, "
           "and inside the window a lantern flame burning perfectly steady and bright",
        6: "the same quiet village of mud-brick houses in fresh golden morning light, "
           "birds on the rooftops, clear sky",
    },
    "surah-al-kawthar": {
        1: 'a flat manuscript miniature painting of an overflowing spring pouring into a wide clear river with golden banks, fruit trees heavy with fruit along both sides, ducks on the water, abundance everywhere',
        2: 'a flat manuscript miniature painting of a woven prayer mat laid on clean sand beside a plain desert tent at dawn, a healthy white sheep resting peacefully nearby',
        3: "a dry withered branch cut off and lying on the ground beside a tall flourishing "
           "green tree full of leaves and fruit",
    },
    "surah-al-asr": {
        1: "the arc of the sun's path across a wide desert sky from sunrise to sunset, "
           "an ornate brass hourglass standing on the sand in the foreground",
        2: "sand slipping through an hourglass, and a line of footprints on a beach "
           "being washed away by the tide",
        3: "a well-tended walled garden full of fruit trees, a clear water channel, "
           "baskets of picked fruit, everything flourishing",
    },
    "surah-an-nasr": {
        1: "great wooden city gates thrown wide open at sunrise, light pouring through, "
           "palm trees on either side",
        2: 'a flat manuscript miniature painting of many trails of camel hoofprints in the sand converging from every direction toward a great open city gate, an empty landscape with no animals and nobody in it',
        3: 'a Persian miniature painting, flat and frontal with no perspective, of a small patterned rug laid inside a tall arched niche of blue tiles at dusk, a string of prayer beads resting on it, a lamp hanging above',
    },
    "surah-al-kafirun": {
        1: 'a flat manuscript miniature painting of two unpaved sandy footpaths parting at a fork in a desert valley in a Y shape, each winding toward its own distant hill',
        6: "two separate small houses on two separate hills, each with its own lamp glowing "
           "in the window, a wide peaceful dusk sky",
    },
    "surah-al-maun": {
        1: "a shut wooden door in a mud-brick wall at dusk, a small empty bowl on the step "
           "outside it",
        4: 'a Persian miniature painting, flat and frontal with no perspective, of a rolled-up rug lying forgotten in the dusty corner of a bare room with a plain arched doorway, cobwebs, a single shaft of light',
        7: "an open doorway of a warm home in morning light, a cooking pot, a water jug and "
           "a small salt jar set out on the doorstep ready to lend",
    },
    "surah-quraysh": {
        1: 'a flat manuscript miniature painting of a winter trading camp in grey-blue desert hills, camels kneeling and resting unloaded, bundles, spice sacks and clay jars stacked beside them, an empty camp',
        2: 'a flat manuscript miniature painting of a close view of camels kneeling under olive trees in a green summer pasture, bales of cloth stacked beside them, only the camels and the bales',
        3: "the quiet rocky hills of a desert valley at dusk, no buildings, a calm violet sky",
        4: "a low table spread with flatbread, dates and a jug of milk, sheep grazing safely "
           "in a green field behind",
    },
    "surah-al-masad": {
        1: "scattered gold coins and a cracked, empty wooden treasure chest lying on bare ground",
        4: "a bundle of thorny firewood tied up and lying across a narrow desert path",
        5: "a coil of twisted rough palm-fibre rope lying at the foot of a date palm",
    },
    "surah-al-fil": {
        1: "a great elephant kneeling down on a desert road, refusing to go any further, "
           "rocky hills ahead",
        2: "an abandoned desert camp of empty tents, scattered spears on the sand, "
           "everything left behind",
        3: "flocks of small birds filling the sky in waves over desert hills",
        4: "small round pebbles of baked red clay falling like rain from flocks of birds "
           "across the sky",
        5: "a field of chewed, scattered straw and chaff blowing across the bare ground",
    },
    "surah-al-humazah": {
        1: "white feathers from a split cushion scattering on the wind across the flat roofs of "
           "a mud-brick village, drifting far away beyond reach",
        2: "stacks of gold coins counted into neat towers on a table beside a tall brass "
           "hourglass with its sand running out",
    },
    "surah-at-takathur": {
        1: 'a flat manuscript miniature painting of a towering heap of gold treasure chests, jewels and coins piled higher and higher until it fills the picture, a still life',
        8: "a single simple clay cup of cool water and a few dates on a cloth in the shade "
           "of a palm tree",
    },
    "surah-al-qariah": {
        1: 'a flat manuscript miniature painting of a vast sky of towering swirling storm clouds rolling over a wide empty plain, awe-inspiring but not frightening, plain clouds only',
        4: "hundreds of moths scattered and fluttering in every direction through the air",
        5: "great mountains drifting apart into soft floating tufts of coloured carded wool",
        6: "a peaceful garden of fruit trees and gentle streams in warm light, "
           "calm and content",
    },
    "surah-az-zalzalah": {
        1: "cracked dry earth with rocks tumbling down a hillside, dust rising, "
           "dramatic but not frightening",
        2: "a cutaway of the earth with gemstones and gold rising up out of the ground",
        4: "a cutaway of layered earth holding old footprints and buried keepsakes in its "
           "layers, like pages of a book",
        7: "a single tiny ant beside a single sprouting seed on the ground, a close-up "
           "seen from very low down",
    },
    "surah-al-adiyat": {
        1: "riderless horses galloping at full speed, no saddles, bright sparks flying where "
           "their hooves strike the stones",
        3: "dawn over a desert plain with a great cloud of dust rising behind galloping "
           "horses with no riders",
        6: "a single horse resting loyally in a well-kept stable, a full trough of grain "
           "and water, warm light",
    },
    "surah-al-bayyinah": {
        1: 'a flat manuscript miniature painting of two closed rolled parchment scrolls with gold end caps resting on a carved wooden stand in a niche, lit by a soft shaft of sunlight',
        4: 'a Persian miniature painting, flat and frontal with no perspective, of a wide desert plain seen from a hilltop, one sandy caravan track that branches at a single point into several separate sandy tracks spreading out across the plain toward different distant hills',
        5: 'a Persian miniature painting, flat and frontal with no perspective, of a small patterned rug on the plain clay floor of a sunny courtyard, a clay bowl of grain for charity set beside it, potted plants and a fig tree, plain walls',
        7: "a lush garden with clear rivers flowing beneath the trees, fruit and flowers, "
           "golden light",
    },
    "surah-ad-duha": {
        1: "bright morning sunshine spreading over a green palm oasis and still water",
        2: "the same oasis under a calm deep-blue night sky, stars and quiet water",
        6: "a sheltering desert tent with a warm lantern glowing at its open door, night",
        7: "a single bright star shining over a desert path that leads clearly across the dunes",
        8: "an overflowing basket of dates and fruit in warm sunlight",
        9: "an open doorway with a bowl of food and a jug of water set out for anyone in need",
    },
    "surah-ash-sharh": {
        1: "a narrow rocky canyon opening out into a wide sunlit green valley",
        2: "a camel resting at ease, its heavy load of bundles set down on the sand beside it",
        5: "a steep rocky climb leading up to a clear spring and a green date palm at the top",
        7: 'a Persian miniature painting, flat and frontal with no perspective, of a small patterned rug on a flat clay rooftop at evening, potted plants along the parapet, palm trees and a rose and gold sky beyond',
    },
    "surah-at-tin": {
        1: "a fig tree and an olive tree side by side, heavy with ripe figs and olives",
        2: "the granite peaks of Mount Sinai at sunrise, rose and gold light on the rock",
        3: "a peaceful rocky desert valley among bare hills, no buildings, calm and safe, "
           "soft evening light",
        6: "an orchard full of ripe fruit trees, baskets brimming over, golden light",
    },
    "ayat-al-kursi": {
        1: "a flat manuscript miniature painting of a mountain lake at sunrise, deer drinking at the water's edge, flocks of birds in the sky, wildflowers in the foreground, untouched wilderness",
        2: 'a flat manuscript miniature painting of a landscape asleep under a deep starry night sky, quiet sleeping village rooftops, a still sea and dark mountains',
        5: "a line of footprints behind and an open path ahead across wide desert dunes",
        7: "a vast star-filled sky over the curve of the earth, the heavens stretching beyond "
           "sight, no throne, no chair, no structure",
    },
}


def all_plates():
    """(slug, verse, prompt) for every plate, in page order."""
    for slug, plates in PLATES.items():
        for verse in sorted(plates):
            yield slug, verse, plates[verse]
