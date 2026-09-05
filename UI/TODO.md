# Islamic Kids — TODO

What is true, and what is left. This file merges the original UI-polish backlog with the findings
of the full-site team review of **2026-09-03** (`ceo`, `islamic-content-scholar`,
`arabic-language-reviewer`, `link-integrity-auditor` + `audio-narration-engineer`,
`accessibility-auditor` + `frontend-lead`, `kids-learning-designer`).

Full evidence with `file:line` citations is in `claudeteam/log_chat/*.log`.

**What this project is:** a father reading Islamic stories and Quran to his own son, at home, with
full control over what his son sees. Priorities below are ranked by what *that* father and *that*
son would actually notice.

---

## Verified correct — the assurance side

Worth stating plainly, because it is the point of the whole exercise:

- **The scripture is sound.** Every verse card and every complete-surah block across all 10 short
  surahs diffs *exactly* against `api.alquran.cloud` simple-script text. Ayat al-Kursi's 8
  phrase-cards concatenate to an exact match of 2:255. No critical or major findings.
- **Al-Fatiha now follows the standard Hafs counting** — Bismillah is verse 1, the final verse is
  whole, the badge says 7. Verified and holding.
- **All 10 hadith trace to authentic sources** (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i) with
  faithful paraphrases. No fabricated or misattributed hadith.
- **Aqeedah is sound** — the Kursi explanation, Al-Ikhlas's negations, and the Ibrahim
  star/moon/sun episode are all consistent with mainstream Sunni tafsir.
- **All 16 YouTube embeds are live** as of 2026-09-03 (re-check every pass — three died before).
- **Narration scripts are consistent**: for adam/ibrahim/nuh/yusuf, slide count == EN count ==
  AR count == audio file count, exactly. `voice-scripts.js` and `scripts/voice-scripts-data.json`
  agree.
- **The Arabic is trustworthy** — natural, warm MSA with correct dual agreement and consistent
  terminology; nested inline markup round-trips; no hardcoded English left in the JS.

---

## Fixed in this pass (2026-09-03)

- [x] **Al-Fatiha joined the Quran ring.** It dead-ended to Home/Stories; the first surah a child
      learns was outside the chain. Both chains are now complete and symmetric (verified).
- [x] **Story chain repaired.** Nuh and Musa both pointed "next" to Yusuf, so Musa was unreachable
      by the chain. Order now matches the hub: adam → ibrahim → nuh → yusuf → musa.
- [x] **`ٱقْرَأْ` hero contrast.** `--gold` on parchment was 2.82:1, failing even the 3:1 large-text
      bar. Now `--gold-text` at 5.06:1.
- [x] **30 Arabic strings in `translations.js`** had punctuation hard-coded at the *front*
      (`!اضغط...`) as an RTL workaround. Moved to the end.
- [x] **`data-ar` / `data-i18n` conflict** on the Adam page: 9 elements carried both, so the older
      system clobbered the newer value on every switch. `data-ar` removed from those 9.
- [x] Prophet Yaqub given his honorific in visible text.
- [x] `class="hadith"` mislabels corrected with `.quran-quote` (a Quranic verse) and
      `.scholar-quote` (an athar of ash-Shafi'i), documented in `surah.css`.

---

## P0 — do next

**Quiz bilingual audit (2026-09-03): 63 questions / 252 options reviewed in both languages.**
Parity is 100% — 60 questions carry `data-ar`, the 3 on the Adam page are covered by `data-i18n`.
Every question has exactly one correct option and no duplicate choices, and the correct answer is
the same answer in both languages throughout. Fixed in that pass:
- Three "what does X mean?" questions answered themselves once the page was Arabic
  (`ماذا تعني كلمة "الفاتحة"؟` → `الفاتحة`). Al-Fatiha, Al-Falaq and An-Nas now use real glosses,
  and near-synonym distractors ("The Closing"/"The End") were replaced in both languages.
- `surah-al-maun.html` glossed the distractor "The Daybreak" as `الفلق` (a surah name) instead of
  `الصبح` (the meaning).
- `surah-al-asr.html` Q2 asked what Allah swears by ("Time") — the same answer as Q1, so it was
  free once Q1 was answered. Replaced with a question on the surah's core message.


- [x] ~~**Quiz answers are guessable from length.**~~ Fixed 2026-09-04. Was 39 of 63 (62%) with
      the correct answer strictly longest, against 25% expected by chance. Now **2 of 63 (3%)
      longest and 5 (8%) shortest, with 89% mid-range** — neither extreme is a usable signal, and
      the tell was checked in both directions so it is not merely inverted. 70 distractors were
      rewritten across both languages, lengthened into more plausible wrong answers rather than
      trimming correct ones, which would have cost teaching value.
      The handful left are deliberate: gaps of 1–2 characters that no child could exploit, and
      fixed terms like "Ameen" and one-word meanings like "Time" that cannot be padded without
      damaging them.

- [ ] **Prophet Musa has no narration audio.** 20 EN + 20 AR scripts exist and
      `AudioNarration.init('prophet-musa')` is correct, but `audio/prophet-musa/` does not exist,
      so it silently falls back to Web Speech. Fix:
      `node scripts/generate-audio-elevenlabs.js prophet-musa en` then `... ar`.
- [x] ~~**Scroll-reveal hides content with no fallback.**~~ Fixed 2026-09-03. `surah.js` now only
      hides cards when it can guarantee something will bring them back (IntersectionObserver
      present and reduced-motion not requested), and a new `@media print` block forces
      `opacity: 1 !important`, which beats the inline style. Printing a surah to read aloud now
      works whether or not the page was scrolled. Both paths verified in a browser.
- [x] ~~Decide the YouTube question.~~ **Decided 2026-09-03: keep YouTube for now, revisit later.**
      Moved to P2 below. Do not re-open this in a review — it is a known, accepted risk, not an
      oversight.

---

## P1 — soon

**Learning**
- [x] ~~**Staged memorization ("training wheels")**~~ — built 2026-09-05 on all 11 Quran pages.
      **Read** shows everything, **Practice** drops the transliteration, **Recite** leaves only the
      Arabic with the meaning one tap away. The stage is remembered per surah, so a child who has
      moved on does not land back on Read every night. Verified each stage in a browser.
      Note: in Arabic mode Read and Practice look the same, because transliteration is already
      hidden there by design — an Arabic reader does not need it.
- [x] ~~**Progress state on the Quran hub**~~ — built 2026-09-05. Every surah card carries a state
      the child sets themselves (not started → learning → memorized), with a counter and a
      "pick up where you left off" link to the surah currently being learned. Stored on the device
      only; no account, nothing leaves the browser. Also removed the stale "NEW" ribbons, which
      were on two arbitrary cards and are now redundant. Verified in a browser, including that
      tapping a badge inside a card link does not navigate.
- [x] ~~**Ayat al-Kursi sat at position 2**~~ — moved to last, as a graduation piece, 2026-09-05.
      Hub card order and the full prev/next chain were rewritten together and verified symmetric:
      Fatiha → Al-Ikhlas → Al-Falaq → An-Nas → Al-Kawthar → Al-Asr → An-Nasr → Al-Kafirun →
      Al-Maun → Quraysh → Ayat al-Kursi.
- [x] ~~**Parent affordances**~~ — built 2026-09-05. Every surah page now ends with a card written
      to the adult, not the child: one **question to ask** at the pause and one **line to finish
      with**, both specific to that surah and in both languages. The resume point is covered by the
      memorization map's "pick up where you left off" link.

**Accessibility**
- [x] ~~`.nav-toggle` ~34×27px, `.lang-toggle-btn` ~37px~~ — both now 44px (lang button measured
      at 82×44 in-browser). Fixed 2026-09-03.
- [x] ~~Fullscreen button had `title` but no `aria-label`~~ — now labelled, and translated via a
      new `fullscreenToggle` key. Fixed 2026-09-03.

- [x] ~~Two `<h1>`s per page~~ — the site wordmark is now a `<span class="logo-text">` on all 19
      pages, so each page has exactly one `<h1>`, its own title. Fixed 2026-09-03.
- [x] ~~`prefers-reduced-motion` missed the scroll-reveal opacity~~ — now part of the guard above.
      Fixed 2026-09-03.
- [x] ~~No `aria-hidden` anywhere~~ — 344 ornamental elements silenced across all 19 pages
      (floating stars, crescent, section icons, scene illustrations). `verse-number` and
      `fact-number` were deliberately left announced: they carry real information. Fixed 2026-09-04.

**Frontend**
- [x] ~~**325 hardcoded hex values** across the four page-type sheets~~ — 303 tokenised
      2026-09-04, leaving 22 (the reserved red, plus true one-offs). Ten recurring shades that had
      no token gained one: `--card`, `--gold-ink`, `--gold-ink-strong`, `--gold-wash`,
      `--parchment-warm`, `--rule-warm`, `--cobalt-deep`, `--cobalt-mid`, `--cobalt-pale`,
      `--cobalt-wash`. Every replacement was hex → token of the identical value; verified in a
      browser that computed colours are unchanged and no token is undefined.
- [x] ~~`surah.css` has zero `html[lang="ar"]` overrides~~ — the "34 LTR-assuming rules" was an
      overcount; only 4 were directional and 3 needed mirroring. `.intro-card`,
      `.intro-card.highlight` and `.did-you-know` now flip their accent stripe to the reading
      edge (the rest were already covered cross-file by `stories.css`). Verified by toggling
      language in a browser. Fixed 2026-09-04.
- [x] ~~`.lang-toggle-btn` defined twice~~ — the `stories.css` copy is deleted, so the control no
      longer diverges by page type and the 44px target applies everywhere. Fixed 2026-09-04.

**Bilingual**
- [x] ~~Narration does not react to a mid-slide language switch~~ — `audio-narration.js` now
      listens for `languageChanged` and, if narration is playing, restarts the current slide in
      the new language. Fixed 2026-09-04.
- [x] ~~`index.html` hero CTAs had no `data-ar`~~ — "Start a story" / "Learn a surah" now
      translated. Fixed 2026-09-03.
- [x] ~~Arabic nav labels lost their direction arrows~~ — 8 story nav labels now carry an arrow
      pointing the RTL way. Fixed 2026-09-04.
- [x] ~~Double-escaped entities inside `data-ar`~~ — 3 fixed across `index.html` and
      `ayat-al-kursi.html`. Fixed 2026-09-03.
- [x] ~~Quiz score used a Western digit beside Arabic-Indic totals ("أجبت 3 من ٤")~~ — the score
      is now converted to Arabic-Indic when the page is in Arabic. Fixed 2026-09-03.
- [x] ~~Prophet honorifics missing from visible text~~ — Adam and Ibrahim now carry them in their
      visible titles, in both languages. All five story pages are consistent. Fixed 2026-09-04.

**Read-aloud**
- [x] ~~Rewrite the sentences that trip a parent reading aloud~~ — Al-Fatiha's verse 7
      explanation is now four short sentences, and Al-Maun's rhetorical aside became a real
      **"Ask your child:"** prompt with a line break — the first instance of the parent
      affordance below. Fixed 2026-09-04.
- [x] ~~`ayat-al-kursi.html` presented a scholarly-disputed hadith with full certainty~~ — now
      "It is also reported that…" with a one-line note that scholars differ, in both languages.
      Fixed 2026-09-04.

---

## P2 — content roadmap

See `plan.md` for the full list. Immediate:

- [ ] **Revisit the YouTube dependency** (decided 2026-09-03: keep for now). All 16 pages embed
      videos the owner does not control, on plain `youtube.com/embed` with no `rel=0`, no
      `modestbranding`, not `youtube-nocookie.com` — so a child gets end-screen recommendations
      from any channel, a "Watch on YouTube" escape, and ads. Three have already died silently.
      *Ranked options when revisited:* (1) drop video and lean on the site's own ElevenLabs
      narration — `ceo` recommendation; (2) self-host the video; (3) the father records his own
      narration; (4) `youtube-nocookie.com` + `rel=0` — a ~10-minute bandage that reduces
      recommendations and tracking but stops neither deletion nor ads.
      **Meanwhile:** re-check all 16 embeds every review pass — they rot without warning.

- [x] ~~**Surah Al-Masad (111)**~~ — built 2026-09-05, completing Phase 2. Framed around
      *choice* rather than punishment: Abu Lahab had wealth and was the Prophet's own uncle, and
      none of it helped him because of what he chose. The fire is stated once, as the Quran states
      it, without dwelling. Arabic verified verse-by-verse against alquran.cloud; embed checked
      live; chain and hub updated (Quraysh → Al-Masad → Ayat al-Kursi).
- [ ] **Narration for surah pages.** The feature does not exist there at all. Now more feasible
      since Arabic text exists — needs EN/AR scripts, `surah-<id>` keys in both script stores,
      ElevenLabs generation, and `init()` calls. The pipeline itself needs no changes.
- [ ] Phase 3 surahs: Al-Fil, Al-Humazah, At-Takathur, and the rest of Juz Amma.
- [ ] Phase 1 stories: Prophet Isa, Prophet Muhammad ﷺ.

---

## P3 — original UI backlog

Carried over from the previous version of this file. Completed items are kept for the record.

- [x] Fullscreen mode, slide transitions, larger nav buttons, progress indicator, slide counter
- [x] Animated backgrounds, floating controls, swipe gestures, exit button
- [ ] **Scene-specific themes** — different colours per scene (creation = earth tones,
      Jannah = green/gold)
- [ ] **Character illustrations** instead of emojis
- [x] ~~**Reading mode toggle**~~ — shipped 2026-09-05 as a **bedtime mode** rather than a
      light/dark/sepia switcher, because the real use case is reading aloud in a dim room. A moon
      button in the navbar of all 20 pages dims the parchment to a warm, low-blue ground; the
      choice persists per device. Every text/background pair was measured: body 8.77:1, verse
      Arabic 11.25:1, translation 13.79:1, Quranic text 9.42:1.
- [x] ~~**Auto-advance option**~~ — built 2026-09-05. A ⏭ toggle in the narration control bar; when
      on, the story turns its own page 1.2s after a slide's narration ends, so a child too young to
      read never has to tap. Off by default, remembered per device, and cancelled if playback is
      stopped by hand. Verified in a browser that it advances when on and stays put when off.

---

## Regressions caught after shipping

- **2026-09-05 — the LTR safety net forced Quranic text left-to-right in Arabic mode.**
  The net added on 2026-09-03 targeted `p:not([data-ar])` so untranslated English would not be
  right-aligned. Quranic verses carry no `data-ar` *by design* — scripture is not translated — so
  they matched it, and `.arabic` / `.arabic-full` / `.arabic-large` computed to
  `direction: ltr; text-align: left` whenever the page was in Arabic. The sacred text was being
  rendered in the wrong reading direction on all 11 Quran pages.
  Fixed by excluding the scripture classes from the net and pinning them to `direction: rtl`
  unconditionally. Verified: verse, complete-surah and bismillah all compute `rtl` in **both**
  languages now, identical in each.
  *Lesson: `:not([data-ar])` is not a safe proxy for "untranslated" — some content is deliberately
  never translated. Any future rule keyed on the absence of `data-ar` must exclude scripture.*

## Known false positives — do not re-chase

Each of these was reported by a checker and disproved on inspection. Recorded so the next pass does
not spend time on them:

- **`.arabic-full` contrast is fine.** Reported as 1.86:1 by pairing it with `.verse-card`'s cream
  background. It only ever renders inside `.full-surah-card`, whose background is `var(--ink)`
  (#14383A), giving **6.70:1 — passes AA**.
- **`//gc.zgo.at/count.js` is not a broken link.** It is the protocol-relative GoatCounter tag.
- **The Adam page is not untranslated.** It uses the older `data-i18n` path, so a checker that
  simulates only `data-ar` reports it as English. Verified translating correctly in a browser.
- **Regex extractors miss nested inline markup** (`<em><strong>`), reporting translated strings as
  missing. Check by simulating the switch, not by attribute presence.
