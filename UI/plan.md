# Islamic Kids Website - Content Plan

## Current Content (Completed)

### Stories (with voice narration EN + AR)
- [x] Prophet Adam
- [x] Prophet Ibrahim
- [x] Prophet Nuh
- [x] Prophet Yusuf
- [x] Prophet Musa (audio generated 2026-09-05, EN + AR)

### Surahs / Verses
- [x] Surah Al-Fatiha (no voice narration yet)
- [x] Ayat al-Kursi - Al-Baqarah 255 (no voice narration yet)
- [x] Surah Al-Ikhlas (112) (no voice narration yet)
- [x] Surah Al-Falaq (113) (no voice narration yet)
- [x] Surah An-Nas (114) (no voice narration yet)
- [x] Surah Al-Kawthar (108) (no voice narration yet)
- [x] Surah Al-Asr (103) (no voice narration yet)
- [x] Surah An-Nasr (110) (no voice narration yet)
- [x] Surah Al-Kafirun (109) (no voice narration yet)
- [x] Surah Al-Maun (107) (no voice narration yet)
- [x] Surah Quraysh (106) (no voice narration yet)
- [x] Surah Al-Masad (111) (no voice narration yet)

---

## Planned Stories

### Phase 1 - Major Prophets
- [ ] Prophet Isa (Jesus) - Miraculous birth, speaking as a baby, healing the sick
- [ ] Prophet Muhammad ﷺ - Birth, childhood, first revelation, Isra & Mi'raj, kindness to others

### Phase 2 - More Prophets
- [ ] Prophet Sulayman (Solomon) - Talking to animals, the Queen of Sheba, the ants
- [ ] Prophet Dawud (David) - Defeating Goliath, the Psalms (Zabur), beautiful voice
- [ ] Prophet Yunus (Jonah) - The whale, dua in darkness, patience
- [ ] Prophet Ismail (Ishmael) - The sacrifice, building the Kaaba with Ibrahim, ZamZam water
- [ ] Prophet Ayyub (Job) - Patience through illness, never losing faith

### Phase 3 - Additional Prophets
- [ ] Prophet Idris (Enoch) - First to write with a pen, raised to the heavens
- [ ] Prophet Salih - The she-camel miracle, the people of Thamud
- [ ] Prophet Hud - The people of 'Ad, the great wind
- [ ] Prophet Shuayb - Honesty in trade, the people of Madyan
- [ ] Prophet Lut (Lot) - Standing against wrongdoing

---

## Planned Surahs (Short Surahs - Juz Amma)

### Phase 1 - Most Common (Kids learn these first)
- [x] Surah Al-Falaq (113) - 5 verses - The Daybreak
- [x] Surah An-Nas (114) - 6 verses - Mankind
- [x] Surah Al-Kawthar (108) - 3 verses - Abundance (shortest surah)
- [x] Surah Al-Asr (103) - 3 verses - Time

### Phase 2 - Short & Essential
- [x] Surah An-Nasr (110) - 3 verses - Divine Support
- [x] Surah Al-Masad (111) - 5 verses - The Palm Fiber
- [x] Surah Al-Kafirun (109) - 6 verses - The Disbelievers
- [x] Surah Al-Maun (107) - 7 verses - Small Kindnesses
- [x] Surah Quraysh (106) - 4 verses - The Quraysh

### Phase 3 - Slightly Longer
- [ ] Surah Al-Fil (105) - 5 verses - The Elephant
- [ ] Surah Al-Humazah (104) - 9 verses - The Backbiter
- [ ] Surah At-Takathur (102) - 8 verses - Competition in Worldly Increase
- [ ] Surah Al-Qari'ah (101) - 11 verses - The Striking Hour
- [ ] Surah Al-Adiyat (100) - 11 verses - The War Horses
- [ ] Surah Az-Zalzalah (99) - 8 verses - The Earthquake
- [ ] Surah Al-Bayyinah (98) - 8 verses - The Clear Evidence
- [ ] Surah At-Tin (95) - 8 verses - The Fig
- [ ] Surah Ash-Sharh (94) - 8 verses - The Relief
- [ ] Surah Ad-Duha (93) - 11 verses - The Morning Hours

### Phase 4 - Longer Surahs from Juz Amma
- [ ] Surah Al-A'la (87) - 19 verses - The Most High
- [ ] Surah At-Tariq (86) - 17 verses - The Night Comer
- [ ] Surah Al-Buruj (85) - 22 verses - The Great Stars
- [ ] Surah Al-Inshiqaq (84) - 25 verses - The Splitting Open
- [ ] Surah Al-Mutaffifin (83) - 36 verses - The Defrauders
- [ ] Surah Al-Infitar (82) - 19 verses - The Cleaving
- [ ] Surah At-Takwir (81) - 29 verses - The Overthrowing
- [ ] Surah Abasa (80) - 42 verses - He Frowned
- [ ] Surah An-Naba (78) - 40 verses - The Tidings

---

## Each Surah Page Includes
- Introduction (why this surah is special)
- Verse-by-verse breakdown (Arabic, transliteration, translation, kid-friendly explanation)
- Complete surah display
- Fun facts
- Quiz (3-4 questions)
- Learn to recite video (YouTube embed)
- Memorization tips
- Voice narration (EN + AR) via ElevenLabs

## Each Story Page Includes
- Interactive slides with illustrations
- Bilingual support (EN/AR toggle)
- Voice narration (EN + AR) via ElevenLabs
- Interactive quiz with stars
- Dua from the story
- Bonus video
- Drag-and-drop or matching activities

---

## Site Structure Notes
- `quran.html` is the Quran hub page - add every new surah/verse card here
- Root `../index.html` is only a redirect to `UI/index.html`; keep all edits in `UI/`
- New story pages need: an entry in `voice-scripts.js` AND `scripts/voice-scripts-data.json`,
  plus `AudioNarration.init('<story-id>')` at the bottom of the page
- Slide indices for narration count: `.story-scene`, `.mini-quiz`, `.lesson-box`, `.dua-box`,
  then the quiz intro, each quiz card, the results card, and the video section

---

## Pending Audio Generation
- [x] prophet-musa (EN + AR) - generated 2026-09-05
- [ ] All surah pages (fatiha, ayat-al-kursi, al-ikhlas, al-falaq, an-nas, al-kawthar,
      al-asr, an-nasr, al-kafirun, al-maun, quraysh) - no narration system on surah
      pages yet

---

## Technical Notes
- Voice narration uses ElevenLabs TTS (paid plan - 30k chars/month)
- Audio stored in `audio/{story-id}/{lang}/slide-{n}.mp3`
- Voice scripts stored in `scripts/voice-scripts-data.json`
- Web Speech API fallback when audio files unavailable
- All pages support RTL for Arabic
