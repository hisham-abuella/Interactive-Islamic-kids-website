# Game graphics research: making the learning games look professional (2026-11-03)

Research agent report. No repo files edited except this one. Scope: replace the prototype games in `UI/mockups/games/` (01-nuh-ark, 07-ayah-lanterns, 08-al-fil-seek), which the owner judged "very bad UI and graphics".

**Diagnosis:** the mockups are built from CSS shapes, emoji-like glyphs and flat panels. The engine isn't the problem. The art is: there are no painted layers, no light, and no motion system. The fix is mostly art direction and pipeline, plus a small motion toolkit.

## 1. Recommended stack

**Primary: DOM + SVG + CSS for the scene, GSAP 3.13+ (vendored) for motion, painted WebP layers from Draw Things.**
- These games involve tapping and dragging a few objects (planks, animals, lanterns, stars), and they carry a lot of bilingual text. In the DOM, Arabic shaping, `dir="rtl"`, real `<button>`s, focus, screen readers and the existing `styles.css` tokens all work for free. Canvas text and RTL handling are weak in every engine.
- GSAP is now 100% free, including SplitText, MorphSVG, DrawSVG, Physics2D, Draggable/Inertia and CustomEase, and that covers commercial use ([gsap.com/blog/3-13](https://gsap.com/blog/3-13/), [Codrops demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)). It ships as plain UMD files (`gsap.min.js` ~70 KB plus the plugins you pick), so you vendor them under `UI/vendor/gsap/`. No build step. The licence is GSAP's "standard no-charge" licence, not MIT. That's fine for this site, but keep the licence file next to it.
- Draggable gives touch drag, snapping (`liveSnap`) and hit tests. Inertia gives the flick. MotionPath handles the ark floating and birds flying. DrawSVG makes gold girih lines draw themselves for the reward moment.

**Fallback: PixiJS v8 (`pixi.min.js`, MIT, single vendorable file, about 244 KB gzip per [depscope](https://depscope.dev/pkg/npm/pixi.js)).** Use it only for a scene that needs hundreds of moving sprites or a shader: rain over the flood, the sea parting, a night sky full of stars. Put it in one `<canvas>` *behind* a DOM HUD, so text and buttons stay DOM. Pixi has TilingSprite (cheap parallax), DisplacementFilter (water ripple) and an AccessibilitySystem ([docs index](https://pixijs.download/release/docs/llms.txt)).

**Not chosen:**
- **Phaser 4** (MIT, `phaser.min.js` 1.29 MB / 345 KB gzip; new Filter system and `setLighting(true)`, per [github.com/phaserjs/phaser](https://github.com/phaserjs/phaser)). It's a full framework with scenes, loaders and its own UI. That's overkill here and pushes text into canvas. Pick it only if a future game becomes a real arcade game. A 2026 comparison rated Phaser more stable than Kaplay and Excalibur, which showed jitter on Safari ([phaser.io news](https://phaser.io/news/2026/04/phaser-vs-kaplay-vs-excalibur-2d-web-game-framework), [JSLegendDev](https://jslegenddev.substack.com/p/i-tried-3-web-game-frameworks-so)). That matters because iPad means Safari.
- **Kaplay / Excalibur:** easy to learn but jam-oriented, and their default look is pixel art.
- **Rive / dotLottie:** both need a WASM runtime (dotLottie's is ~500 KB, fetched from a CDN by default and only self-hostable via `setWasmUrl` per the [LottieFiles wiki](https://github.com/LottieFiles/dotlottie-web/wiki/CSP-and-WASM-Self%E2%80%90Hosting-Guide); the Rive wasm version must match its package, per [rive.app/docs/runtimes/web](https://rive.app/docs/runtimes/web/)). Both also need an external authoring tool. Too much pipeline for one father's site.
- **matter.js / planck:** real physics isn't needed. Springs and GSAP Physics2D fake bobbing and falling more calmly.
- **Howler** (MIT, ~10 KB) is optional. A 40-line Web Audio helper does the job: unlock on the first tap, decode once, play with gain.

## 2. Art-direction brief: "Illuminated diorama"

Principles taken from well-regarded kids' and calm games (no characters or art copied):
- **Toy, not test.** Toca Boca: "We don't make games, we make toys" ([GamesBeat](https://gamesbeat.com/how-toca-boca-got-100m-mobile-downloads-by-putting-kids-first/), [Motionographer](https://motionographer.com/2016/04/27/the-design-process-behind-toca-bocas-infectious-apps/)). Everything you touch reacts, even when it isn't the "right" answer.
- **Test with kids early.** Sago Mini playtests about monthly and counts success as kids role-playing the scene ([Cooney Center](https://joanganzcooneycenter.org/2018/01/11/podcast-transcript-the-app-fairy-talks-to-sago-mini/)). Here, that means the son.
- **Every frame worth framing.** Monument Valley designed each frame "worthy of public display": one geometric language, a restrained palette, few details, and Middle Eastern architecture among its influences ([Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_(game))). Alba, Gris and Old Man's Journey add soft directional light, depth by atmospheric haze, and storytelling through landscape rather than faces. That last point fits the no-depiction rule well.
- **Characterless storytelling.** Story is told through objects, light, weather, footprints, the ark, lanterns and animals. Miraj uses animal narrators ([App Store](https://apps.apple.com/US/app/id1222528421)). Here, animals may appear in the story's own setting, but never stand in for a prophet.

**Palette (one colour, one job):**
- Parchment `#FBF6EA` / `--parchment-deep` is the world's paper.
- Turquoise `#17877F` means "you can touch this" (action).
- Gold `#C08A2E` / `--gold-light` means light and reward only.
- Cobalt `#24508C` is for Quran and ayah elements only.
- Ink `#14383A` is for text and outlines.

Scene paintings keep to a limited warm palette: dusk apricot, sand, olive, Iznik blue water. Night scenes use deep cobalt, never black. No pure `#fff` or `#000` anywhere.

**Light:** one warm key light from the top-start corner, mirrored in RTL. Add a soft radial "lamp" glow (CSS `radial-gradient`, `mix-blend-mode: soft-light`) and a parchment vignette. Atmospheric haze grows with distance: the far layer gets lower contrast and a bluer tint.

**Layers (each scene has 4-5):**
1. Sky as a CSS gradient, no image.
2. A far painted silhouette (mountains or city) with alpha.
3. A mid painted ground or water.
4. Near interactive props as separate sprites.
5. A foreground frame: girih arch edges, leaves or reeds, partly cropped, which gives depth.

Parallax is under 8 px of drift, driven by drag or by a slow idle sway, never by device tilt.

**Motion:**
- Springs, not linear tweens.
- Every interactive prop has a deliberate rest pose and one slow idle cue: a breathe at 1.02 scale over 4-6 s, or a lantern swaying 1.5 degrees.
- Squash and stretch on landing (0.92 / 1.06, 180 ms).
- Things feel like their material: wood thunks, it doesn't wobble.
- Nothing loops faster than 3 s. Reduced motion means the rest pose plus opacity fades.

**UI kit:**
- **Buttons:** at least 64 px for 5-year-olds (stricter than the 48 dp in [Google's playables guidance](https://developers.google.com/youtube/gaming/playables/certification/best_practices_design)). Turquoise face, a 4-6 px darker "lip" below, 1px gold hairline. On press, `translateY(4px)` removes the lip (tactile), with a soft tick sound. Pill or girih-cornered shapes, with icon plus word.
- **Panels:** parchment card, 1px `--rule-strong` hairline, one warm shadow, corner ornament (8-fold star) in gold stroke. Use a 9-slice frame via `border-image` from one painted PNG.
- **HUD:** minimal, in the corners, safe-area aware. Progress shows as gold beads or stars filling (not numbers or timers). Home and Parent buttons sit in the top-end corner, sound top-start. No score pressure and no countdowns.
- **Typography:** Baloo 2 for titles, Nunito for UI, Amiri or Noto Naskh for Arabic and ayat. Vendor the woff2 files locally (no Google Fonts CDN). Kids' copy at 22-28 px.
- **Reward moment:** dim the scene to 60% and bring the lamp up. A gold shamsa draws itself (DrawSVG, 1.2 s), then 8-12 slow gold motes rise (not confetti), then a soft chime and one praise line ("MashaAllah, you kept going like the ark builder", EN/AR). It ends on a calm still frame, not a loop.
- **Transitions:** cross-fade with a 12-16 px drift, or a "page turn" (clip-path wipe in the reading direction, so it mirrors in RTL), 400-600 ms. The View Transitions API is fine where supported.

## 3. Art pipeline, step by step

1. **Style bible:** extend `UI/scripts/specs/illustrations.py` with a `GAME_STYLE` suffix, e.g. "storybook gouache, Iznik and illuminated-manuscript palette, soft warm top-left light, gentle haze, no people, no faces, no text". Keep the existing `NEGATIVE` and add "person, face, hands, figure, letters, watermark".
2. **New script `UI/scripts/build-game-art.py`.** Unlike `build-illustrations.py`, which hardcodes `/opt/homebrew/bin/draw-things-cli`, call the gated shim `~/.local/bin/draw-things-cli`. Fix the old script too. Use the same Z-Image Turbo model and stable `crc32` seeds per asset.
3. **Backgrounds:** generate the far and mid layers wide, e.g. 1536x640 (multiples of 64), with a prompt ending "...isolated on a plain flat pale grey background" for the silhouette layers. The sky stays CSS.
4. **Props and sprites:** one prop per render at 768x768 on a flat pale background ("single object, centered, plain background, no shadow").
5. **Cut-outs:** `rembg` is installed (`/opt/homebrew/bin/rembg`). Run it with `isnet-general-use` (light), or `birefnet-general` for best edges (~930 MB model, ~20 s per image per [remove-background-local](https://www.pkgstats.com/pkg:remove-background-local)). It's a local model, so wrap it as `ram-gate run --heavy -- rembg p in/ out/`, and never run it while Draw Things is busy. Run the whole batch per step: generate everything, then cut everything. The macOS Finder "Remove Background" quick action works for one-offs ([Apple discussion](https://discussions.apple.com/thread/255168160)).
6. **Clean-up (Pillow, no model):** trim alpha, feather the edge by 1 px, add a 2-3 px parchment-tinted rim (sticker-on-page feel), and colour-match each prop to the palette with a small curve or tint so props from different seeds look like one set.
7. **Export:** WebP with alpha, q78. Props at 2x their display size (e.g. 320 px wide), layers 1920 px wide. Budget: ≤1.5 MB per game in total and ≤25 sprites. Separate files are fine at this count (HTTP from `python -m http.server`). A packed atlas is only worth it for Pixi scenes (free-tex-packer).
8. **Review gate:** a contact sheet per game, checked by the father and the islamic-content-scholar (no figures or faces slipped in). Regenerate with a new seed rather than retouching.

**CC0 assets:** Kenney is CC0 ([kenney.nl/support](https://kenney.nl/support)), but its flat vector or pixel style clashes with painted plates. Use it only for UI sound effects (Kenney "Interface Sounds", CC0) and maybe neutral particle textures. game-icons.net is CC BY 3.0 and Quaternius is 3D, so neither fits. OpenGameArt has mixed licences, so avoid it.

## 4. Techniques (vanilla first)

1. **One shared rAF loop that sleeps** (Hairline principle, [llms.txt](https://hairline.lucasmarkes.com/llms.txt)): `const live=new Set(); function tick(t){live.forEach(f=>f(t)||live.delete(f)); raf=live.size?requestAnimationFrame(tick):0}`. Add a function to wake the loop. It stops when everything is at rest, which saves battery.
2. **Spring helper:** `v+=(-k*(x-target)-c*v)*dt; x+=v*dt` with k≈170 and c≈26 (gentle). Done when `|v|<.01`.
3. **Parallax layers:** `layer.style.transform=translate3d(${dx*depth}px,0,0)` with depth 0.15/0.4/1, in one rAF. Use `will-change: transform` on 3-4 layers only.
4. **Tactile button:** `box-shadow:0 5px 0 var(--turquoise-deep)`, and on `:active` use `translateY(5px); box-shadow:0 0 0`. Add `touch-action:manipulation`.
5. **Drag with snap:** GSAP `Draggable.create(el,{bounds:scene,onRelease(){ if(this.hitTest(slot,'50%')) gsap.to(el,{x:sx,y:sy,ease:'back.out(1.6)'}) else gsap.to(el,{x:0,y:0,ease:'elastic.out(1,.6)'}) }})`. Without GSAP, use Pointer Events with `setPointerCapture`.
6. **Squash on land:** `gsap.timeline().to(el,{scaleY:.9,scaleX:1.08,duration:.08}).to(el,{scale:1,ease:'elastic.out(1,.5)',duration:.5})`. Set transform-origin at the bottom.
7. **Idle breathe:** CSS `@keyframes breathe{50%{transform:scale(1.02)}}` over 5 s, with a staggered `animation-delay` per prop so they never pulse in sync.
8. **Light pool / spotlight on the target:** an overlay `radial-gradient(circle at var(--x) var(--y), transparent 90px, rgba(20,56,58,.45) 260px)`. Use it for hints instead of arrows.
9. **Gold motes:** 10 absolutely positioned spans with random drift via `gsap.to(..,{y:-120,x:'random(-30,30)',opacity:0,duration:'random(2,3.5)'})`. Or Pixi ParticleContainer in the fallback.
10. **DrawSVG reward:** `gsap.from('#shamsa path',{drawSVG:0,stagger:.08,duration:1.2})`. Vanilla: `stroke-dasharray` / `dashoffset` from `getTotalLength()`.
11. **Water and wave:** SVG `<feTurbulence>` + `<feDisplacementMap>` animated very slowly (baseFrequency changes over 8 s), or Pixi DisplacementFilter.
12. **RTL-aware motion:** `const dir=document.dir==='rtl'?-1:1`, and multiply every x travel, wipe direction and parallax sign by it.
13. **Reduced motion:** `matchMedia('(prefers-reduced-motion: reduce)')` sets `gsap.globalTimeline.timeScale(20)` or skips to end states. The CSS rule disables idle keyframes.
14. **Sound design:** a Web Audio unlock on the first `pointerdown`. Pre-decoded short sounds: soft wood tap, page rustle, chime. Gain at or below 0.4, small random detune (`playbackRate 0.95-1.05`) so repeated taps don't feel mechanical. There's a mute toggle, and narration ducks the effects.
15. **Gentle juice only:** take squash, tween easing, trails and sound from "Juice it or lose it" (Jonasson and Purho, 2012; [summary](https://gamejuice.pages.dev/articles/juice-it-or-lose-it-lessons)). Skip screenshake, hit-stop and flashing. "The Art of Screenshake" (Nijman) is for action games; at bedtime, use at most a 2 px ark nudge.

## 5. Aceternity / Refero effects mapped to game UI

- **Menus:** Focus Cards for the game picker (dim siblings), a Card Spotlight as a candle sheen on the selected card, and a Refero warm-paper panel style (hairlines over shadows).
- **HUD:** an animated tab pill for EN/AR, and Text Generate (word-by-word fade) for instruction lines, synced with narration.
- **Transitions:** View Transitions from the game card into the game, and a Compare slider for "before and after" (the dry land and then the flood; the empty ark and then the full ark).
- **Reward:** a static Lamp glow plus the DrawSVG shamsa.
- **Avoid:** meteors, beams, sparkles, aurora, vortex, magnetic buttons and anything that loops quickly (consistent with `ui-reference-research-2026-11-03.md`).

## 6. Pitfalls

- **Unifying CSS-drawn art with painted plates.** It reads as "prototype". Every visible object should be painted, or be a single-weight gold or ink line ornament, never a mix of emoji, CSS blobs and photos.
- **Inconsistent sprites from random seeds.** Lock the style suffix, palette correction and light direction, and generate a whole set in one session.
- **AI artefacts:** figures or faces creeping into crowds, garbled pseudo-Arabic text on banners, extra animal legs. Prompt "no text" and review every asset.
- **Canvas text for Arabic.** Keep all words in the DOM.
- **WASM runtimes (Rive or dotLottie) and ES modules.** Anything that silently fetches from a CDN breaks the offline rule.
- **Too much motion:** many simultaneous idles, fast loops, confetti, shake. That's not calm, and it hurts reduced-motion users.
- **Small or near-edge targets, hover-only cues, drag-only interactions.** Always offer a tap-to-select then tap-to-place alternative, which also helps keyboard and switch users.
- **Running `rembg` or the Draw Things engine outside the RAM gate, or both at once.** `build-illustrations.py` currently bypasses the shim; fix that when touching it.
- **Heavy assets:** unoptimised PNGs at 1-2 MB each will stall an iPad. Stay within the WebP budgets above.
- **Timers, scores, fail states and losing sounds.** These games are co-op bedtime play, so no pressure mechanics.

Additional sources: [Phaser 4 sizes](https://github.com/phaserjs/phaser), [PixiJS docs](https://pixijs.download/release/docs/llms.txt), [Rive web runtime](https://rive.app/docs/runtimes/web/), [Toca Boca design process](https://motionographer.com/2016/04/27/the-design-process-behind-toca-bocas-infectious-apps/), [HEIHEI games guidelines (touch + mouse)](https://www.nzonair.govt.nz/documents/719/HEIHEI_Games_2023_Guidelines.pdf), [juicy-breakout lessons](https://gamejuice.pages.dev/resources/juice-it-or-lose-it), [CoreML RMBG-2.0](https://b-61j.pages.dev/sihai0506/rmbg2.0-coreml).
