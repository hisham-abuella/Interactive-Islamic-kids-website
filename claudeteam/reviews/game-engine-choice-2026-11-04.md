# Game engine choice for the painted games (kids-game-designer, 2026-11-04)

Owner's question: should the games use one of Phaser, GDevelop, Excalibur.js, melonJS, LittleJS
or PixiJS? Decided for the flagship (01 Nuh and the Ark), and meant to hold for the other nine
unless a game proves otherwise.

## Decision

**A hybrid: painted DOM planes and a DOM HUD, with PixiJS v8 for one atmosphere canvas.**
- **Painted scene planes** (sky-and-land plates, the ark, animals, timber, reeds) are `<img>`
  WebP layers in the DOM, inside one fixed-size stage that is scaled to fit the screen.
  State changes (dry valley, flood, Judi) are opacity crossfades between matched plates.
- **The interactive pieces** (plank, animals, mallet, ark) are DOM elements with real
  `<button>`/`role` semantics, pointer drag, tap-to-select, keyboard and screen-reader labels.
- **All words** (narration ribbon, buttons, pause card, dua) are DOM text, so Arabic shapes
  correctly and `dir="rtl"` mirrors the layout.
- **PixiJS v8** (MIT, `UI/vendor/pixi/pixi.min.js`) draws one transparent `<canvas>` above the
  props with `pointer-events: none`. It renders only what DOM and CSS do badly:
  - a few hundred soft rain streaks and splash rings;
  - the water's moving surface, made from a copy of the painted flood plate run through a
    `DisplacementFilter`, so the painted waves shimmer instead of sliding;
  - the slow gold motes of the reward moment.
- **If WebGL is missing or Pixi fails to start, the game still plays:** the canvas is
  decoration only, the painted plates already show rain clouds and water, and a CSS fallback
  takes the rain. Reduced motion and bedtime mode stop the canvas (one still frame).

No GSAP. A ~60-line spring and rAF helper does the motion (critique, point 5). Revisit only if
a later game needs MotionPath or DrawSVG.

## How each candidate scored

| | Licence | Ships as one local file, no build | Size (min / gzip) | Text and Arabic | Fit here |
|---|---|---|---|---|---|
| **PixiJS 8.22** | MIT | Yes, `pixi.min.js` IIFE, global `PIXI`, works from `file://` | 841 KB / 237 KB | Canvas text only, so we don't use it for words | **Chosen, as a renderer only** |
| Phaser 4.2 | MIT | Yes, `phaser.min.js` | 1.38 MB / 355 KB | Text in canvas; its own scene, input and UI system | Overkill; pushes UI into canvas |
| Excalibur 0.32 | BSD-2 | Yes, `excalibur.min.js` | 574 KB / 148 KB | Canvas text | Jam and pixel-art oriented; reported Safari jitter |
| melonJS 20.12 | MIT | **No**: ESM only (`build/index.js`); needs a server or bundler, not `file://` | 2.69 MB / 672 KB unminified | Canvas text | Tile-map and physics engine; heaviest |
| LittleJS 1.29 | MIT | Yes, `littlejs.min.js` | 515 KB / 159 KB | Canvas text, bitmap fonts | Built for tiny pixel-art arcade games |
| GDevelop | MIT (Core, GDJS, IDE); name and logo trademarked | **No**: an editor that exports a bundled game | Export includes its own Pixi runtime | Canvas text | A no-code tool, not a library; we would lose the site's hand-written HTML |

Sizes are measured from the npm packages downloaded on 2026-11-04. The GDevelop licence was
read from `LICENSE.md` in `4ian/GDevelop`.

## Why the hybrid, against our constraints

1. **Offline, vendored, no build step.** One IIFE file in `UI/vendor/pixi/` with its LICENSE.
   No CDN, no WASM, no ES modules, so it also works from `file://`. melonJS (ESM only) and
   GDevelop (export pipeline) fail this test.
2. **Arabic and RTL.** Canvas text is weak at Arabic shaping and bidi in every one of these
   engines, and the site already has a working `data-ar` system. All words therefore stay in
   the DOM. That takes away the main reason to adopt a full framework (Phaser, Excalibur,
   melonJS, LittleJS, GDevelop): their scene, UI and text systems would go unused, or be
   fought against.
3. **Accessibility.** DOM pieces get focus, `aria-label`, keyboard and tap-to-select for free.
   A canvas-first engine needs a shadow DOM to reach the same point (Pixi's AccessibilitySystem
   does this, and we don't need it because nothing interactive is in the canvas).
4. **Does it actually look better?** The art is what fixes the look (the critique, problem 1).
   An engine adds only three things this scene really needs: hundreds of soft rain streaks at
   60 fps, a water surface that ripples the *painted* waves, and additive-light motes. CSS can
   fake rain as a striped gradient (the "barcode" the critique rejected) and SVG
   `feDisplacementMap` over a large image is slow on iPad Safari. Pixi does both on the GPU.
   That is a visible improvement, and Pixi is the only candidate that is a pure renderer, so
   we take exactly that and nothing else.
5. **Safari and iPad performance.** Pixi v8 runs on WebGL2 (WebGPU is opt-in, and we keep it
   off). One canvas, a few hundred sprites and one filter is light work. The shared loop
   sleeps when nothing moves, and the canvas stops in reduced-motion and bedtime modes.
6. **Weight.** 237 KB gzip, loaded once and cached, and only by game pages. A static site
   served by a plain server may not gzip; the raw 841 KB is still acceptable for a game page,
   but this is the main cost of the choice. If it proves too heavy on the family iPad, the
   fallback path (Canvas 2D rain, no displacement) is already written into the design.

## Rules for the other nine games
- Default: painted DOM planes plus the DOM HUD, with no canvas.
- Add the Pixi atmosphere canvas only when a scene needs mass particles or moving water
  (03 Musa's sea, 04 Ibrahim's night sky, 08 Al-Fil's birds).
- Nothing interactive and no text inside the canvas, ever.
