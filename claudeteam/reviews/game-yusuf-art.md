# Game 02, Yusuf's Journey: art list, prompts, seeds and rejects

Owner: `kids-game-designer`, 2026-11-07. Status: **pending scholar gates 2-3** (2a prompts, 2b contact sheet,
3 build). This file is the designer's self-check only. The images were rendered under the owner's standing
approval of the painted-games direction. Nothing here is linked from the story or the hub until the scholar
signs off 2a, 2b and 3.

- Source of truth for prompts and seeds: `UI/scripts/specs/games/yusuf.py`. Renderer:
  `UI/scripts/build-game-art.py yusuf gen|cut|export`; export rules: `UI/scripts/specs/games/yusuf_export.py`.
- `STYLE` and `NEGATIVE` are imported from `UI/scripts/specs/illustrations.py` and used **word for word**.
  The game additions are:
  - the full 3a.3 list (with `bikini, bare shoulders`);
  - the gate-1 bans for 02 (no pharaonic temple, pyramid, obelisk, sphinx, hieroglyphs, statue or idol; no crown,
    throne, seal, king or palace);
  - the lessons from Nuh and Musa (no crescent, no sun rays, no eyes; no bars, grille, crossbar or mast; no dome).
- Seeds are `crc32("game-yusuf/<asset>") % 2,000,000`. A rejected render is rerolled with a new seed (suffix `-r2`,
  `-r3`, ...), never retouched.
- Models:
  - Z-Image Turbo 1.0 (q8p) for the two master plates and every cut-out source.
  - Qwen-Image-Edit 2511 (q8p) for every state change, so night, drought and evening keep the day master's
    composition (checked by 50/50 blends: no doubling).
- Pipeline:
  - Draw Things only through `~/.local/bin/draw-things-cli`: RAM gate plus heavy lane, one job at a time. The lane
    was shared with the Ibrahim agent's renders and a Voicebox queue. `ram-gate status` was checked first;
    `RAMGATE_DISABLE` was never used.
  - Then rembg `isnet-general-use`, once, under `ram-gate run --heavy`, while no Draw Things job was alive.
  - Then a Pillow export (no model):
    - each plate is cropped relative to its own painted gold rule, with an inset wide enough to drop the patterned
      band the drought and evening edits painted inside it;
    - cut-outs are trimmed and get a 2 px dark-ink outline and a light parchment tint;
    - everything is written as WebP.
- Raw renders: `UI/art-raw/yusuf/` (gitignored); rejects are kept in `UI/art-raw/yusuf/rejected/`.
- Models were never left loaded: `draw-things-cli` exits after each job (shim), and rembg ran in its own process and
  exited.

## The scene and its layers

| Layer (back to front) | Asset | Notes |
|---|---|---|
| The journey landscape: hills, road, dunes, river, palms, fields, storehouse. One painted plate per state, landscape and portrait | `plate-{day,night,hard,eve}-{land,port}` | 1440 px wide (landscape; the granary beat zooms in), 760 px (portrait) |
| River shimmer, gold motes, falling grain | PixiJS, procedural (no image) | decoration only; the game is whole without it |
| The dream: eleven soft lights the child kindles (exactly eleven, drawn by the game, 12:4), then the sun and the moon | DOM glows (no image) + `sun`, `moon` | plain discs, no face, no rays; shown again at "his dream came true" |
| The road: glowing stones and gold dots for the way so far | DOM (no image) | |
| The props the story cards become, on their stones | `well`, `camel`, `palm`, `door`, `sheaf` | also the card pictures in the tray |
| The travellers who come for food (the brothers are never drawn) | `camel` (twice, flipped to walk) | |
| The harvest and the grain bags | `sheaf` (x7), `bundle` (x10) | `bundle` is the Musa sprite the scholar approved on 2026-11-06, copied byte for byte |
| Foreground: a palm cropped at the start corner | `palm` | |
| Frame: gold rule and girih corners; the reward shamsa | inline SVG (no image) | the shamsa is the one approved on Nuh (solid ivory disc) |
| "Your turn" tower | UI-kit tiles (CSS, no image) on the parchment page | see 3b note on the block |

**Not generated, by rule:** Yusuf, Ya'qub, the brothers, the 'Aziz's household, the king, or any person or figure;
any temple, idol, crown or seal; any text. 12:92 and the dua 12:101 are live HTML text copied from the story page.
The episode with the 'Aziz's wife is omitted entirely: there is no image, line or prop for it.

## Generation record (2026-11-07)

**34 finished renders: 15 kept and shipped (8 plates, 7 sprites) and 19 rejected (4 plates, 15 sprites).** Rejects
are kept in `art-raw/yusuf/rejected/`. Full log: `UI/art-raw/yusuf/gen-log.txt`. The night-land edit finished
after its queue script was stopped, so its line is missing from the log; the file is dated 01:55, seed 1253478.
Two queued jobs timed out waiting for the shared lane and never rendered; they are not counted.

| Asset | Result |
|---|---|
| `plate-day-land` | r1 (211655) **rejected**: the road vanished behind the middle hill and never reached Egypt, so the journey could not be laid along it (3b.10 in context). r2 (930772) **rejected**: a straight highway off the bottom edge, and a blue panelled storehouse window (mullion risk, 3b.3). r3 (85698): accepted. The road climbs from the bottom into the dunes; the stones then cross the dunes to the river. |
| `plate-day-port` (1340627) | Accepted first time: the road winds from the hills at the bottom to the river, palms and storehouse at the top. |
| (all plates) | **Record (scholar 2a, 2026-11-07):** the storehouse was prompted "long low flat-roofed", but it rendered with a gabled roof in every plate. That is acceptable: no finial, no steeple, no cross. |
| `plate-night-land`, `plate-night-port` | Accepted. Plain cobalt sky with no stars, moon or sun (the game draws exactly eleven lights). |
| `plate-hard-land` (807159) | Accepted. The edit painted a patterned blue band inside the gold rule; the export's wider inset crops it off for every state, so registration holds. |
| `plate-hard-port` | r1 (418531) **rejected**: the top of the border became a pointed arch full of arabesque, which reads as a mihrab or niche (3b.5) and is a pseudo-script risk (3b.4). r2 (1947571) **rejected**: an arched top again, and the lower road turned into a stream (composition broken). r3 (seed in the asset list below): accepted. The fields are bare and brown and the river runs in a narrow channel with a plain zigzag rope edge (checked at 100%: no glyphs). The hills stay green, a milder drought than the landscape plate. |
| `plate-eve-land`, `plate-eve-port` | Accepted: warm evening sky, no sun disc, no moon, no stars. |
| `well` | r1 (641594): **shipped, with a question** (see below). r2 (673807) **rejected**: tile lozenges with a dark inner diamond, which could read as eyes (3b.2). r3 (933913) **rejected**: four-pointed star inlays (3b.3). The plank under the bucket reads as a bench, not a cross. |
| `camel` (253294) | Accepted: two plain bundles on a patterned blanket, no rider, no seat, calm face. |
| `palm` | r1 (1423817) **rejected**: a cross-hatched lattice trunk, rows of small X shapes (3b.3, the Musa lantern lesson). r2: accepted, smooth ringed trunk. rembg tore the fronds, so it is cut by the edge flood fill unioned with rembg's mask. |
| `door` | r1 (45629) **rejected**: a double door whose centre seam and horizontal rail make a cross (3b.3). r2: accepted. **Record corrected (scholar 2a, 2026-11-07):** although the prompt asked for a single leaf, the render is a pair of leaves with one centre seam and a centred ring; it has no rail, so no cross. rembg dropped the brown door leaf and left an empty decorated arch, which would read as a niche (3b.5), so it is cut by the edge flood fill. |
| `sheaf` (768580) | Accepted. |
| `sun` | r1 (717527) **rejected**: a four-armed cross-like motif at the centre (3b.3). r2: accepted, a plain gold disc with a ring of small diamonds, no face and no rays. Its soft edge defeats rembg, so it is cut by a circle fitted to its gold pixels (a cut; no painted pixel changed). |
| `moon` | r1 (942712) **rejected**: a photographic moon with maria (a face-in-the-moon risk, 3b.1) inside an ornamental ring. r2: accepted, a plain pale disc with a zigzag rim. rembg had cut it hollow (a ring, which could read as an eye), so it is cut by the edge flood fill. |
| `sack-full`, `sack-empty` | r1, r2 and r3 (sack-full) all **rejected**: four-pointed star and diamond-cluster motifs (3b.3). **Not shipped.** The grain bags are the Musa `bundle` the scholar approved: slack and pale when empty, plump when full. |
| `block` | r1-r4 all **rejected**: four-pointed stars, a girih star, and a four-diamond cross arrangement (3b.3). **Not shipped.** The "Your turn" tower uses UI-kit tiles on the parchment page (see 3b). |

**Finding for the pipeline:** Z-Image Turbo appears not to honour the negative prompt: every reroll kept the motif
its negative banned. The STYLE line's "stylized geometric forms" and "Iznik turquoise and cobalt" then put a star
or lozenge on every bare surface. For small props, choose objects whose surfaces carry no panel (trees, sheaves,
animals), or reuse an approved sprite.

Export (Pillow, no model): `UI/images/games/yusuf/`, **16 WebP, 683 KB** (8 plates, 8 sprites, one of them the Musa
bundle) plus `manifest.json`. The budget is 1.5 MB and about 25 sprites.
## Negative prompt (every asset)

> people, person, human, human figure, man, woman, child, baby, face, portrait, silhouette of a person, hands, crowd, angel, deity, idol statue of a person, rider, riders, riding, mounted figure, passenger, traveller, robed figure, anthropomorphic sun, sun with a face, moon with a face, face in the sky, text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, rainbow, rainbows, prismatic arc, kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, star and crescent emblem, religious symbol, flag, banner with an emblem, blurry, low quality, letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, artist signature, monogram, seal, faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, human figures, silhouettes, standing stones, hooded figures, face in the rock, pareidolia, book, books, open book, mushaf, scroll, scrolls, parchment roll, prayer rug, prayer mat, kaaba, cube building, black cube, blood, red droplets, splatter, mihrab, prayer niche, arched niche, inscription band, figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, pyramid, pyramids, obelisk, sphinx, pharaonic temple, temple columns, hieroglyphs, colossus, crown, throne, seal, king, palace, crescent, crescent moon, sun rays, sunburst, eye, eyes, bars, grille, crossbar, cross beam, window bars, mast, dome, domes, cupola

Per-asset additions (`neg_extra`) are listed with each asset. Note: Z-Image Turbo appears not to honour the
negative prompt (the sprite rerolls below kept the motifs it bans), so every ban that matters is also in the prompt.

## Assets (as shipped; rejected renders are in the generation record)

### `plate-day-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **85698**.
- Prompt (exactly as sent):

  > a wide journey landscape seen from a high viewpoint like a flat Persian miniature map painting, in daylight: soft green hills with a few olive trees at the lower left; one narrow pale sand road winds like a gentle S from the green hills at the lower left, up and across low rolling golden desert dunes in the middle, and down to a blue river on the right; on the river bank at the right stand tall date palms, green fields of ripe wheat and one long low flat-roofed mud-brick storehouse with one wide dark open doorway and no windows; a pale blue sky with a few soft clouds fills the top quarter; the road is empty, nothing on the road, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-night-land`
- Kind: edit; edits `plate-day-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **1253478**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the time of day: it is now a quiet night. The sky is a deep plain cobalt blue with no stars, no moon and no sun in it. The land is in soft cool blue night shade. The road stays empty. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-hard-land`
- Kind: edit; edits `plate-day-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **807159**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the season: these are years of drought. The wheat fields by the river are now bare dry brown earth with no wheat, the hills are pale dry ochre instead of green, the river is narrower and lower, and the palms look dusty. The storehouse stays exactly as it is. The road stays empty. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-eve-land`
- Kind: edit; edits `plate-day-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **738809**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the time of day: it is now a calm warm evening. The sky glows soft apricot, rose and pale gold near the horizon and deepens to soft blue above, and warm low light touches the palms and the storehouse. There is no sun disc, no moon and no stars. The road stays empty. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-day-port`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1340627**.
- Prompt (exactly as sent):

  > a tall vertical journey landscape seen from a high viewpoint like a manuscript map painting, in daylight: soft green hills with a few olive trees fill the bottom of the picture, one pale winding sand road starts in the green hills at the bottom and curves up across rolling golden desert dunes in the middle of the picture to a blue river near the top, on the far river bank stand tall date palms, green fields of ripe wheat and one long low flat-roofed mud-brick storehouse with a wide dark open doorway, a pale blue sky with a few soft clouds fills the top fifth, the road is empty, nothing on the road, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-night-port`
- Kind: edit; edits `plate-day-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **176498**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the time of day: it is now a quiet night. The sky is a deep plain cobalt blue with no stars, no moon and no sun in it. The land is in soft cool blue night shade. The road stays empty. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-hard-port`
- Kind: edit; edits `plate-day-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **129061**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the season: these are years of drought. The wheat fields by the river are now bare dry brown earth with no wheat, the hills are pale dry ochre instead of green, the river is narrower and lower, and the palms look dusty. The storehouse stays exactly as it is. The road stays empty. No people, no text. The winding road stays a pale dry sand road from the bottom of the picture up to the storehouse; the river stays only near the top, by the palms. Keep the plain thin gold rule border straight on all four sides: no arch, no niche, no ornamental band., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-eve-port`
- Kind: edit; edits `plate-day-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **286061**.
- Prompt (exactly as sent):

  > Keep the exact same composition: the same hills, the same winding road, the same dunes, the same river, palms, fields and storehouse, in the same places, with the same gouache manuscript style and the same gold border. Change only the time of day: it is now a calm warm evening. The sky glows soft apricot, rose and pale gold near the horizon and deepens to soft blue above, and warm low light touches the palms and the storehouse. There is no sun disc, no moon and no stars. The road stays empty. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `well`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **641594**.
- Negative additions: well frame, pulley, posts, beam over the well, roof over the well, windlass
- Prompt (exactly as sent):

  > one low round desert well built of plain grey stone blocks with a dark round opening, a plain wooden bucket resting on its rim with a coil of rope, no posts, no beam, no frame and no roof above it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `camel`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x1024, seed **253294**.
- Negative additions: saddle seat, rider, person on the camel, howdah, patterned saddle cloth
- Prompt (exactly as sent):

  > one calm camel standing in side view, carrying two plain undyed cloth bundles tied on its back with rope, a plain woven blanket under them, no saddle seat, nobody on it, whole camel visible, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `palm`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **1915378**.
- Negative additions: ornament, motif, medallion, star motif, four-pointed star, diamond motif, quatrefoil, cross motif, rosette, border band, tile pattern, lattice, crosshatch, diamond trunk pattern
- Prompt (exactly as sent):

  > one date palm tree with a slender gently curved smooth brown trunk marked only by soft horizontal rings, a crown of green fronds and clusters of golden dates, whole tree visible, no ornament, no motif, no pattern, no medallion, no star shape, no diamond shapes, no border band, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `door`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **747590**.
- Negative additions: crossbar, horizontal brace, z brace, studs pattern, window, bars, double door, two leaves, centre seam, panels, rails, ornament, motif, medallion, star motif, four-pointed star, diamond motif, quatrefoil, cross motif, rosette, border band, tile pattern, lattice, crosshatch
- Prompt (exactly as sent):

  > one closed single-leaf round-arched wooden door of plain brown vertical planks, one round iron ring handle at the side, set in a small piece of plain mud-brick wall, no window, no panels, no rails, no crossbar, no ornament, no motif, no pattern, no medallion, no star shape, no diamond shapes, no border band, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `sheaf`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **768580**.
- Prompt (exactly as sent):

  > one upright tied sheaf of ripe golden wheat with full ears at the top, tied in the middle with a plain straw band, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `sack-full`
- **Not shipped.** (not shipped: r1-r3 all carried star motifs; the grain bags are the Musa bundle)

### `sack-empty`
- **Not shipped.** (not shipped: r1-r3 all carried star motifs; the grain bags are the Musa bundle)

### `sun`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **929525**.
- Negative additions: rays, flames, face, eyes, mouth, spiral, pattern, mosaic, ornament, motif, medallion, star motif, four-pointed star, diamond motif, quatrefoil, cross motif, rosette, border band, tile pattern, lattice, crosshatch, plate, dish, coin
- Prompt (exactly as sent):

  > one plain round disc of smooth warm golden yellow gouache with a soft lighter centre, completely bare and even, no rays, no face, no markings, no ornament, no motif, no pattern, no medallion, no star shape, no diamond shapes, no border band, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `moon`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **151346**.
- Negative additions: face, eyes, mouth, craters, crescent, pattern, ornament, motif, medallion, star motif, four-pointed star, diamond motif, quatrefoil, cross motif, rosette, border band, tile pattern, lattice, crosshatch, photograph of the moon, maria, dark patches, plate, dish, ring
- Prompt (exactly as sent):

  > one plain round disc of smooth pale silver-white gouache with a soft cool glow at its edge, completely bare and even, no craters, no dark patches, no face, no markings, no ornament, no motif, no pattern, no medallion, no star shape, no diamond shapes, no border band, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `block`
- **Not shipped.** (not shipped: r1-r4 all carried a star or cross-arrangement motif; the tower uses UI-kit tiles)


## Self-check against section 3a (prompt rules), by `kids-game-designer`, 2026-11-07

Marked **pending scholar gate 2a**; the scholar's verdict is final.

| 3a rule | Check |
|---|---|
| 1. Things, never beings with agency | Pass. Subjects: a landscape (hills, road, dunes, river, palms, fields, a storehouse), a well, a camel carrying bundles (prompted "nobody on it"), a palm, a closed door, a sheaf, sacks, a sun disc, a moon disc, a toy block. No prophet, person, brother, king, household, crowd or traveller is prompted. |
| 2. Nothing for Allah or a stand-in | Pass. No light, beam, eye, hand, throne or "divine" anything. The sun and moon are prompted as plain discs with no face, no rays and no markings. |
| 3. STYLE and NEGATIVE unchanged, plus the game list | Pass. Both imported word for word; the full 3a.3 list appended (with `bikini, bare shoulders`). |
| 4. Story bans (gate-1 02) | Pass. No pharaonic temple, pyramid, obelisk, sphinx, hieroglyphs, statue, idol, crown, throne, seal, king or palace, in the negative and in the prompts (Egypt is a river, palms, fields and a plain storehouse (prompted flat-roofed; it rendered with a gabled roof: no finial, no steeple, no cross)). Nothing of the 'Aziz's household or the seduction episode is prompted or shown. |
| 5. No Ka'bah, mushaf or Quran text generated | Pass. 12:92 and 12:101 are live HTML text copied from `story-prophet-yusuf.html`. |
| 6. Modesty | Pass. No clothing or human form; the only cloth is bundles, sacks and a camel blanket. |
| 7. Every prompt, seed and negative recorded | Pass. `specs/games/yusuf.py` and the asset list below (exact prompts as sent, rejected seeds in the generation record). |
| 8. Gated shim, one job at a time, owner go-ahead | Pass. Owner's standing approval of the painted-games direction; `ram-gate status` checked; never `RAMGATE_DISABLE`; rembg only while Draw Things was idle. |

## Contact-sheet self-check against section 3b (pending scholar gate 2b)

Sheet: `claudeteam/reviews/game-yusuf-contact-sheet.png`: 8 plates, then 8 sprites, each on a light and a dark ground.
Reviewed at thumbnail and at 100%, and in context in the play-through screenshots at 1180x820 and 390x844, EN and
mirrored AR.

| 3b check | Result |
|---|---|
| 1. Any face or figure | None. The roads, fields and storehouse doorways are empty in every state. The camel has a plain animal face. The moon has no maria (r1 rejected for that). |
| 2. Anything for Allah, an angel or Shaytan | None. The sun and moon are plain discs. The hollow-ring cut of the moon (eye-like) was replaced by a solid cut. The shamsa is the ivory-disc medallion approved on Nuh. |
| 3. Symbols of other faiths | None after the rejections: lattice palm, double door with a rail, four-armed sun motif, star sacks and star blocks all rejected. Mirrored AR checked: no cross appears. The road meeting the river makes no cross. |
| 4. Text-like glyphs | None. The hard-port river edge is a zigzag rope band, checked at 100%. The well, camel blanket, door arch and bundle carry diamond ornament only. |
| 5. Ka'bah, mosque, minaret, mushaf, niche | None after the rejections: two hard-port renders with an arched top (mihrab-like) rejected; the door's empty-arch cut replaced by the whole door. |
| 6. Immodesty | None (no human form). |
| 7. Violence or fear | None. The well is a plain stone well in daylight; nothing is shown in it. |
| 8. Biblical or Israiliyyat details | None prompted or visible (no coat of many colours, no wolf, no blood on a shirt). |
| 9. Anatomy | The camel is whole and correct. The palm's torn fronds from rembg were fixed by the cut method, not by retouching. |
| 10. In context, both sizes, RTL | Checked in the play-through screenshots (tablet and phone, EN and AR). |

**Questions for the scholar**
1. **The well's tiles (`well`, r1).** The band of tiles carries diamonds with an inner diamond, and a centre lozenge
   with a four-lobed blue shape. I read it as Ottoman tile ornament, like the Musa bundle's diamonds, but please
   rule on whether the centre lozenge reads as a cross or an eye at play size (about 100 px on the tablet). Fallback:
   a plain stone well from a new seed. All three renders so far added a tile band.
2. **The sun and moon of the dream.** They appear with the eleven lights after the child kindles them, and again at
   "his dream came true", never moving towards anything and never "bowing". The story page's note on the bow is
   shown both times. Is this acceptable? Or should the sun and moon stay out, with the eleven lights only?
3. **The bundle reused as the brothers' grain bags.** It is the Musa sprite you approved, copied byte for byte.
   Empty is the same image slack and pale (CSS scale and filter), full is the image as approved.
4. **The "Your turn" blocks as UI-kit tiles.** Four painted block renders all carried a star or cross-arrangement
   motif, so the tower is built from tactile turquoise tiles on the parchment page: no image and no motif. This
   departs from "no CSS shapes beside paintings"; it is on the UI page, not in the scene. It is also a call for the
   owner.
5. **Mirroring.** In Arabic the whole painted world is mirrored left to right, as approved for images with no
   writing or sacred place.

Sign-off line (to be completed by the scholar):
`Art gate: prompts reviewed <date> (scholar); contact sheet reviewed <date> (scholar) - 16 images approved,
M rejected and regenerated after review` (designer self-check: 16 shipped, one of them the approved Musa bundle;
19 renders rejected before review).
