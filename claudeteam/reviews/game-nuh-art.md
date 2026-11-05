# Game 01, Nuh and the Ark: art list and prompts (scholar gate 2a)

Owner: `kids-game-designer`, 2026-11-04. Status: **pending scholar 2a** (see the self-check at the end;
no scholar agent could be spawned from this session). The owner approved local image generation
for the Nuh game only (2026-11-04), so the batch was rendered after this self-check. Nothing here
is used on a linked page until the scholar signs off both 2a (prompts) and 2b (contact sheet).

- Source of truth for prompts and seeds: `UI/scripts/specs/games/nuh.py` (this file is generated
  from it). Renderer: `UI/scripts/build-game-art.py nuh gen|cut|export`.
- `STYLE` and `NEGATIVE` are imported from `UI/scripts/specs/illustrations.py` and used word for
  word. The game additions to the negative are section 3a.3 of the scholar's checklist, the Nuh
  bans of 3a.4, and "mast, sail, yardarm, rigging" (a mast with a yard reads as a cross, 3b.3).
- Seeds are `crc32("game-nuh/<asset>") % 2,000,000`, stable across runs. A rejected asset is
  regenerated with a new seed (recorded below), never retouched.
- Models: Z-Image Turbo 1.0 (q8p) for plates and cut-out sources; Qwen-Image-Edit 2511 (q8p) for the
  state changes, so dry, flood and Judi keep the same composition, palette and light.
- Pipeline: Draw Things through `~/.local/bin/draw-things-cli` (RAM gate, heavy lane, one job at a
  time) -> rembg `isnet-general-use` from Python under `ram-gate run --heavy`, never beside Draw
  Things -> Pillow: crop the painted border, trim, 2 px dark-ink outline (miniature idiom, not a
  sticker rim), light tint-match to the plates' parchment, WebP. Raw outputs: `UI/art-raw/nuh/`
  (gitignored). Shipped: `UI/images/games/nuh/`, budget 1.5 MB, at most 25 sprites.

## The scene and its layers

| Layer (back to front) | Asset | Shipped size |
|---|---|---|
| Sky, far mountains, valley, Judi (one painted plate per state) | `plate-{dry,flood,judi}-{land,port}` | 1240 px wide (landscape), 690 px (portrait) |
| Mockers: two plain tents in the plate + DOM lantern-light glows | (painted into the dry plate) | - |
| The ark, plank by plank: frame under, finished ark revealed row by row | `ark-frame`, `ark-whole` | 1100 px wide, shared bbox |
| Plank to drag, the timber pile, the mallet | `plank`, `timber-pile`, `mallet` | 440 / 460 / 240 px |
| Animals, one sprite per kind (a pair = the same sprite twice, one mirrored) | `animal-*` (10 kinds) | 340 px longest side |
| Rain, splashes, the water's moving surface, gold motes | PixiJS, procedural (no image) | - |
| Foreground: reeds cropped at the corners | `reeds` | 420 px tall |
| Frame: gold rule and girih corners | inline SVG line ornament (no image) | - |

Not generated (by rule): any person or figure, the mockers themselves, the dove, the olive leaf,
the rainbow, any text. The UI frame ornaments are hand-drawn SVG line work, not image-model output.

## Negative prompt (every asset)

> people, person, human, human figure, man, woman, child, baby, face, portrait, silhouette of a person, hands, crowd, angel, deity, idol statue of a person, rider, riders, riding, mounted figure, passenger, traveller, robed figure, anthropomorphic sun, sun with a face, moon with a face, face in the sky, text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, rainbow, rainbows, prismatic arc, kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, star and crescent emblem, religious symbol, flag, banner with an emblem, blurry, low quality, letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, artist signature, monogram, seal, faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, human figures, silhouettes, standing stones, hooded figures, face in the rock, pareidolia, book, books, open book, mushaf, scroll, scrolls, parchment roll, prayer rug, prayer mat, kaaba, cube building, black cube, blood, red droplets, splatter, mihrab, prayer niche, arched niche, inscription band, figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, dove, pigeon, white bird, olive branch, olive leaf, leaf in beak, mast, sail, yardarm, rigging

## Assets

### `plate-dry-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1815221**.
- Ships as: WebP 1240 px wide (land) / 690 px (port), gold rule border cropped.
- Prompt (exactly as sent):

  > a wide quiet valley of dry golden sand far from any sea, low rolling sandy hills on the left with two small plain cloth tents and two tiny glowing lantern lights beside them, a distant range of soft blue mountains, one tall broad mountain with a green rounded top rising on the right, a wide open stretch of flat empty ground across the lower middle, a few olive-green shrubs, a calm apricot and pale turquoise sky with a few stylized gold-edged clouds, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-flood-land`
- Kind: edit; edits `plate-dry-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **374280**.
- Ships as: same as its master plate.
- Prompt (exactly as sent):

  > Change only the weather and the water. Keep the exact same composition, mountains, palette, style and gold border. The valley is now completely flooded by a calm deep sea of Iznik turquoise and cobalt blue water with stylized curling gold-edged waves, the water reaching high up the mountains. The tents, the shrubs and the low hills are gone, hidden deep under the water, nothing is left floating on the surface. Heavy slate-blue rain clouds fill the sky, soft grey-blue light. No boat, no people, no birds, no tents, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-judi-land`
- Kind: edit; edits `plate-dry-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **1900257**.
- Ships as: same as its master plate.
- Prompt (exactly as sent):

  > Keep the exact same composition, palette, style and gold border. The flood water is going down and lies calm and still, deep turquoise with gentle stylized ripples. The tall mountain with the green rounded top now rises out of the water as a green island peak with a flat grassy shoulder. The rain has stopped, the clouds are parting and soft warm golden morning light spreads across a clearing pale sky. No boat, no people, no birds, no rainbow, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-dry-port`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1024673**.
- Ships as: WebP 1240 px wide (land) / 690 px (port), gold rule border cropped.
- Prompt (exactly as sent):

  > a tall vertical view of a quiet valley of dry golden sand far from any sea, a calm apricot and pale turquoise sky with stylized gold-edged clouds filling the upper third, a distant range of soft blue mountains, one tall broad mountain with a green rounded top in the upper middle, low sandy hills on the left with two small plain cloth tents and two tiny glowing lantern lights, a wide open stretch of flat empty ground filling the lower half, a few olive-green shrubs, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-flood-port`
- Kind: edit; edits `plate-dry-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **1526343**.
- Ships as: same as its master plate.
- Prompt (exactly as sent):

  > Change only the weather and the water. Keep the exact same composition, mountains, palette, style and gold border. The valley is now completely flooded by a calm deep sea of Iznik turquoise and cobalt blue water with stylized curling gold-edged waves, the water reaching high up the mountains. The tents, the shrubs and the low hills are gone, hidden deep under the water, nothing is left floating on the surface. Heavy slate-blue rain clouds fill the sky, soft grey-blue light. No boat, no people, no birds, no tents, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-judi-port`
- Kind: edit; edits `plate-dry-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **720525**.
- Ships as: same as its master plate.
- Prompt (exactly as sent):

  > Keep the tall mountain exactly as it is in the picture, with the same low flat green cap of grass painted directly on its peak; nothing at all sits above the peak, no ball, no sphere, no orb, no dome. Keep the same mountain shapes, clouds, palette, gold-outlined manuscript style and border. Keep the exact same composition, palette, style and gold border. The flood water is going down and lies calm and still, deep turquoise with gentle stylized ripples. The tall mountain with the green rounded top now rises out of the water as a green island peak with a flat grassy shoulder. The rain has stopped, the clouds are parting and soft warm golden morning light spreads across a clearing pale sky. No boat, no people, no birds, no rainbow, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `ark-whole`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x768, seed **464644**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > a great wooden ark seen exactly from the side, a long gently curved hull of warm brown horizontal planks, a band of turquoise and cobalt diamond ornaments along the hull, a simple wooden cabin house with small square windows on the deck, no mast, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `ark-frame`
- Kind: cutedit; edits `ark-whole`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x768, seed **439046**.
- Ships as: WebP with alpha, same bbox as ark-whole.
- Prompt (exactly as sent):

  > Show the same ark unfinished, at the same size and position: only the long wooden keel and the curved wooden ribs of the hull frame standing on the plain background, no planks on the sides, no cabin, no ornaments. Keep the same style and plain pale cream background. No people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plank`
- Not generated. (derived: a strip of the hull planking of ark-whole) Three generated planks were rejected (see the record below).

### `timber-pile`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **783404**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > a low untidy pile of long rough planks of plain unpainted raw brown timber and a few round logs with pale cut ends, seen from the side, no paint, no pattern, no decoration, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `mallet`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **4938**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one wooden carpenter's mallet with a short handle, lying diagonally, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `reeds`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **597466**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > a clump of tall slender desert grasses and reeds with a few small turquoise flowers, growing upward, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-elephant`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1392711**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one elephant standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-lion`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1533622**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one lion with a golden mane standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-camel`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1564924**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one camel with one hump standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-sheep`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **485251**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one woolly sheep standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-giraffe`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1557890**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one giraffe standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-rabbit`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1759509**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one dark brown wild rabbit with soft natural fur that is brown all over, including its belly and chest, no markings or emblems standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-tortoise`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **280803**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one tortoise standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-hoopoe`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1834573**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one hoopoe bird with a crest, perched on the ground standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-cow`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1304956**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one cow standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `animal-goat`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **887926**.
- Ships as: WebP with alpha, trimmed, 2 px ink outline.
- Prompt (exactly as sent):

  > one pure white goat with soft white fur all over, clean white legs with no markings, small light hooves, no saddle cloth, no collar, no ornaments standing calmly in side view, whole body visible, gentle and friendly, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

## Self-check against section 3a (prompt rules), by `kids-game-designer`, 2026-11-04

Marked **pending scholar 2a**: the scholar must confirm this, and their verdict is final.

| 3a rule | Check |
|---|---|
| 1. Things, never beings with agency | Pass. Subjects: a valley, mountains, weather, water, wood, a mallet, reeds, tents, ten ordinary animals. No prophet, person, crowd, "builder", traveller or guardian is named in any prompt. |
| 2. Nothing for Allah or a stand-in | Pass. Light is written as plain light ("soft warm golden morning light"). No "divine", "heavenly", beam, eye, hand or throne. |
| 3. STYLE and NEGATIVE unchanged, plus the game list | Pass. Both imported word for word from `specs/illustrations.py`. The full 3a.3 game list is appended, with "figure" added on its own (the base has "human figure"). |
| 4. Nuh bans: no dove with a leaf, no rainbow | Pass. "dove, pigeon, white bird, olive branch, olive leaf, leaf in beak" and the base "rainbow, rainbows, prismatic arc" are in the negative. The only bird is a hoopoe, standing on the ground. The Judi edit says "no birds, no rainbow". |
| 5. No Ka'bah, mushaf or Quran text generated | Pass. None is prompted. The dua is live HTML text copied from the story page. |
| 6. Modesty | Pass. The only fabric is "two small plain cloth tents". |
| 7. Every prompt, seed and negative recorded | Pass. `specs/games/nuh.py` and this file. |
| 8. Gated shim, one job at a time, owner go-ahead | Pass. Owner approved Nuh only. All renders through `~/.local/bin/draw-things-cli`; rembg under `ram-gate run --heavy`, never beside Draw Things. |

Two extra precautions taken in the prompts:
- The ark prompt says "no mast" and the negative bans "mast, sail, yardarm, rigging", because a
  mast with a yard reads as a cross (3b.3).
- The mockers are only "two small plain cloth tents and two tiny glowing lantern lights", as the
  gate-1 ruling asked. In the flood state the tents must be gone under the water, not floating
  (no hint of drowning, 3b.7).

Questions for the scholar:
1. **The hoopoe.** It is the only bird. It is chosen because it is not a dove and is a familiar
   Quranic bird (27:20). Is it acceptable in Nuh's story, where it has no role, or would you prefer
   a non-Quranic bird (a sparrow, a partridge) so that no association is implied?
2. **Mirroring.** In Arabic the whole painted world is mirrored left to right (the light comes from
   the top-start corner). Nothing in these plates has writing or an emblem that mirroring could
   change, but 3b.10 asks for a mirrored check, so the RTL screenshots are in the build evidence.

## Generation record (2026-11-04)

Every render went through `~/.local/bin/draw-things-cli` (heavy lane, RAM gate), one at a time.
rembg ran once, under `ram-gate run --heavy`, while no Draw Things job was alive. The full log is
in `UI/art-raw/nuh/gen-log.txt` (gitignored).

| Asset | Result |
|---|---|
| 2 master plates (Z-Image) | 44-48 s each. Accepted. The engine's small corner marks near the bottom edge (text-like) fall inside the cropped border and are cut away. |
| `plate-flood-land` | First render (seed 299091) **rejected**: the two tents float in the flood, which hints at the mockers drowning (3b.7). Rerolled with a stronger prompt (seed 374280): accepted. |
| `plate-judi-land`, `plate-flood-port`, `ark-frame` (Qwen edits) | 13-16 min each. Accepted. |
| `plate-judi-port` | r1 (seed 542965) **rejected**: the mountain became a flat peak with a round green ball on top, the style went flat, and it no longer registered. r2 (seed 1724955) **rejected after scholar review**: a round green ball still sat on the peak above the resting ark (could read as a dome or an orb). r3 (seed 720525, with "the same low flat green cap ... nothing above the peak" and a per-asset negative "ball, sphere, orb, globe, dome"): the peak keeps the dry plate's green cap. Accepted. |
| `plank` | Three renders **rejected** (seeds 1567920, 1880328, 442654): each came back with an ornament inlay panel whose arabesque could read as script (3b.4). Not generated now: cut from the plain hull planking of `ark-whole`. |
| `timber-pile` | First render (seed 1406322) **rejected**: an ornamented box that read like a book cover with pseudo-script swirls (3b.4, 3b.5). Reroll (seed 783404) accepted. |
| `animal-rabbit` | First render (seed 574950) **rejected**: an eight-spoked wheel emblem on its hip could read as a religious wheel (3b.3). Second (seed 1900931) **rejected**: its pale belly could not be separated from the cream ground, leaving a bite-shaped gap (3b.9). Third, brown all over (seed 1759509): accepted. |
| Other 8 animals, `ark-whole`, `mallet`, `reeds` | About 23 s each. Accepted. |
| `animal-goat` | r1 (seed 1374833) **rejected by the scholar (2b MUST)**: glossy black knee orbs with a catch-light read as eyes. Not retouched. r2 (1734851) and r3 (1395925) **rejected** at full size before cut-out: dark knee patches, still eye-like. r4 (887926, "pure white goat ... clean white legs with no markings", negatives for knee spots): shipped. r5 (254816) and r6 (1199066, shaggy goat) tried and **rejected** for darker knee marks. The model ties goats to knee calluses: r4 still has two faint, soft brown smudges on the front knees (no black, no gloss, no catch-light, about 3 px in play). Flagged for the scholar's re-check; fallback is to swap the kind (deer or horse). |

Clean-up notes (no retouching of content):
- rembg dropped the sheep's white face against the cream ground (3b.9: an animal that looks wrong).
  The sheep and rabbit are cut with a model-free flood fill from the image edges (unioned with the
  rembg mask where one exists).
- **Sky clean-up, `plate-judi-land` (scholar 2b SHOULD 2, 2026-11-04):** a faint dotted residue of
  the engine's corner mark at about x 1207-1233, y 50-77 (plus two specks above) is refilled, in the
  export step, with the row-by-row sky colour sampled just left of the box x 1185-1240, y 14-84,
  feathered at the edges (`SKY_FILL` in `specs/games/nuh_export.py`). Empty sky only; no painted
  content is touched.
- The Qwen frame edit drew the ark frame a little smaller and lower than the finished ark. It is
  registered in the export by fitting its bounds to the finished hull.

## Contact-sheet self-check against section 3b (pending scholar 2b)

Sheet: `claudeteam/reviews/game-nuh-contact-sheet.png` (6 plates; 16 sprites, each on a light and a dark
ground). Reviewed at thumbnail and at 100%, and in context in the game at 1180x820 and 390x844 in EN and
mirrored AR (screenshots in the build evidence).

| 3b check | Result |
|---|---|
| 1. Any face or figure | None. The only faces are the animals' own, calm, in profile. No figure in a doorway or window: the cabin windows are dark squares. The tents are empty; the lantern on a post in the portrait plate was checked at 100% and is a lantern, not a figure. |
| 2. Anything for Allah, an angel or Shaytan | None. The reward shamsa (SVG, not generated) has a rosette centre, not concentric circles, so it cannot read as an eye in the sky. |
| 3. Symbols of other faiths | None after rejections: the rabbit with a wheel emblem was rejected. The ark has no mast or yard. Mirrored AR checked: no cross appears. |
| 4. Text-like glyphs | None visible. Rejected: three ornamented planks and the book-like pile. The engine's corner marks are outside the crop. The faint stipple in the top-end corner of `plate-judi-land` (ruled not script by the scholar) is filled with plain sky (see clean-up notes). |
| 5. Ka'bah, mosque, minaret, mushaf | None. |
| 6. Immodesty | None (no human form). |
| 7. Violence or fear | None. The flood has no bodies or drowning forms, and the first flood plate with floating tents was rejected. |
| 8. Biblical details | No dove, no olive leaf, no rainbow. |
| 9. Anatomy | All ten animals whole and correct after the sheep and rabbit cut-out fixes and the rabbit reroll. |
| 10. In context, both sizes, RTL | Checked in the play-through screenshots. |

Known art shortfalls (not religious): the portrait Judi plate adds a green island in the water, which the
phone layout uses as the ark's resting place (the landscape ark rests on the peak itself); the decorated
animals (patterned cow, giraffe and lion) follow the plate STYLE's ornament and are more whimsical than
the story plates' animals.

Sign-off line (to be completed by the scholar):
`Art gate: prompts reviewed <date> (scholar); contact sheet reviewed <date> (scholar) - 22 sprites
approved, 0 rejected and regenerated after review` (designer self-check: 22 shipped; 8 renders rejected
and regenerated or replaced before review).

## Scholar review 2026-11-04 and the fixes applied
- 2a PASS. `bikini, bare shoulders` added to `GAME_NEGATIVE` (`nuh.py`), as the 3a.3 list requires.
- 2b MUST: goat regenerated (above). SHOULD: `plate-judi-land` sky filled; `plate-judi-port` regenerated (r3).
- Re-check needed by the scholar: `animal-goat.webp` (r4) and the shamsa medallion. Contact sheet:
  `claudeteam/reviews/game-nuh-contact-sheet.png` (regenerated 2026-11-04 after the fixes).
