# Scripture marks review: every Quranic mark on the site (2026-11-19)

Reviewer: islamic-content-scholar. Requested by the owner: "did we review the verses from a
verified reference? — using the Islamic scholars."

**Verdict: APPROVE.** I checked 2,345 words of Quranic Arabic one mark at a time against the
Tanzil Hafs text. No mark anywhere changes the reading. Nothing is critical. Findings 1 and 2
(minor) were applied the same day.

## How I checked
- **Reference:** Tanzil `quran-simple` (fully pointed) and `quran-uthmani`, Hafs, verified
  against the Madinah mushaf. I downloaded them from api.alquran.cloud for all 21 surahs, 2:255,
  and every ayah quoted on the story pages (7:23, 21:69, 2:127, 20:12, 20:25, 20:26, 20:44,
  71:28, 12:92, 12:101). Nothing from the Quran Foundation API was used or stored.
- **Comparison script:** It took every line of Arabic with harakat in the 21 surah pages,
  Ayat al-Kursi and the 5 story pages, and lined each word up with its word in the mushaf. Then
  it compared the whole pointed word: every haraka, shadda, sukun, tanwin, hamza seat, wasla/alef
  form, alef maqsura and dagger alef. Any word that differed from `quran-simple` was also
  compared with the `quran-uthmani` word, and every such word was read by eye.
- **Coverage:** 525 segments and 2,345 words. All 613 surah words were compared in all three
  places on each page (verse cards, complete-surah block, illuminated frame), plus the 21
  Bismillah cards, Ayat al-Kursi in its three places, and the story quotes.
- **Encoding:** I also scanned for stray or invisible code points (ZWJ/ZWNJ, RLM, NBSP, BOM,
  tatweel, unusual Quranic marks) and checked that every line is stored NFC. All Quranic lines
  are clean NFC. The tatweels and the one ZWJ found are all in prose.

## Findings

| # | Severity | Where | Page had | Mushaf (simple / Uthmani) | Status |
|---|---|---|---|---|---|
| 1 | minor | `surah-al-asr.html` card 2, frame, complete block | `الْإِنسَانَ` | `الْإِنْسَانَ` / `ٱلْإِنسَٰنَ` | **Fixed** → `الْإِنْسَانَ` |
| 2 | minor | `ayat-al-kursi.html` card 4, frame, complete block | `عِندَهُ` | `عِنْدَهُ` / `عِندَهُۥٓ` | **Fixed** → `عِنْدَهُ` |
| 3 | note | Quran words quoted inside the Arabic explanations (Ash-Sharh, Ad-Duha, Al-Bayyinah, Az-Zalzalah, Al-Humazah, Al-Kawthar, Al-Falaq, Al-Adiyat, Ayat al-Kursi) | little or no pointing, modern tanwin (e.g. `فإن مع العسر يسراً`) | `فَإِنَّ مَعَ الْعُسْرِ يُسْرًا` | Open, optional. Every letter matches, and the fully pointed verse is on the same page. If wanted, point the whole ayah in `surah-az-zalzalah.html` and `surah-ash-sharh.html`, because the page asks the child to memorise those ayat. |

Why 1 and 2 were minor and not errors: both read exactly the same in Hafs (ikhfa of the nun).
They mixed two spellings. The sukun was dropped as in the Uthmani script, but the plain alef
and the missing silah waw come from the simple script, which every other word on those lines
follows.

**Differences that are acceptable** (each matches the Uthmani text exactly, so it is a valid
Hafs spelling):
- `مِن شَرِّ` / `وَمِن شَرِّ`: Al-Falaq, An-Nas.
- `يَكُن لَّهُ`: Al-Ikhlas.
- `مَن ذَا` and `بِشَيْءٍ مِّنْ عِلْمِهِ`: Ayat al-Kursi.
- `أَنفُسَنَا وَإِن لَّمْ`: the Adam story, and the same string in `interactive-story.js`.
- `أَنتَ`: the Ibrahim story.

The "[Uthmani spelling]" and "[marks differ]" lines from `verify-scripture.py` on Bayyinah,
Adiyat, Humazah, Asr, Nasr and Nas come only from waqf signs (ۚ ۖ ۗ) that the page leaves out.
Dropping waqf signs is acceptable.

## Frame titles (`UI/scripts/place-surah-plates.py` TITLES, plus Al-Fatiha and Al-Ikhlas)
All 22 titles are correctly pointed: correct case endings, a shadda on every sun-letter lam,
clean NFC, and no stray code points.
- `سُورَةُ قُرَيْشٍ`: the genitive tanwin is right, since Quraysh is fully declinable.
- `آيَةُ الكُرْسِيِّ`, `سُورَةُ الضُّحَى`: correct.
- `سُورَةُ الكَافِرُونَ`: correct; the name is kept as quoted, as in the mushaf heading.

The titles leave the sukun off the lam before moon letters (`الفَلَقِ`), while the verse text
writes it. That is a common modern convention, it is used the same way in every title, and
the titles are not Quran text. No change needed.

## Numbering
- **Al-Fatiha:** the Bismillah is ayah 1 with `۝١`. There are seven ayat, with `۝٧` on
  `صِرَاطَ الَّذِينَ ... وَلَا الضَّالِّينَ`. This is Hafs numbering. `آمِين` is on its own
  card and is not part of ayah 7.
- **The other 20 surahs:** the Bismillah is unnumbered, and the number of ayah marks equals
  the surah's ayah count.
- **Ayat al-Kursi:** the frame has no Bismillah and one mark, `۝٢٥٥`. The complete block has
  no Bismillah and keeps the mushaf's waqf signs. The page still has the Bismillah card from
  the surah template. Saying the Bismillah before reading from the middle of a surah is
  allowed. If a change is wanted, put the isti'adha before it, since that is the sunnah when
  starting to read (16:98).

## Ayat al-Kursi recitation cuts (`UI/recitation/husary-muallim/parts.json`)
- **Every cut is in a silence.** Each `from` is 0.2-0.5 s before the qari starts speaking, and
  each `to` falls inside a pause, so no word is clipped.
- **Every card boundary is at a mushaf waqf sign:** after `الْقَيُّومُ ۚ`, `نَوْمٌ ۚ`,
  `الْأَرْضِ ۗ`, `بِإِذْنِهِ ۚ`, `خَلْفَهُمْ ۖ`, `شَاءَ ۚ`, `وَالْأَرْضَ ۖ`, and the end of
  the ayah.
- **Card 1** holds `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ`, a pause, then `الْحَيُّ الْقَيُّومُ`.
  Stopping at `هُوَ` is a good stop with a complete meaning, and it is Husary's own teaching
  pause. Approved.
- **Card 8** holds `وَلَا يَئُودُهُ حِفْظُهُمَا`, a pause, then `وَهُوَ الْعَلِيُّ الْعَظِيمُ`.
  The mushaf has a waqf sign after `حِفْظُهُمَا`. Approved.
- **Note (UX, not a religious issue):** cards 1 and 8 each have a 4-second silence in the
  middle, where the qari leaves room for the child to repeat. A child may think playback has
  stopped.

## What passed ("verified")
Every one of these matches Tanzil Hafs mark for mark, apart from findings 1 and 2 (now fixed)
and the accepted Uthmani spellings above:
- Al-Fatiha and all 20 short surahs: every verse card, complete-surah block and illuminated
  frame, and the three agree with each other.
- All 21 Bismillah cards and frame Bismillah lines.
- Ayat al-Kursi (2:255): the 8 cards, the frame and the complete block.
- Story quotes: 7:23, 21:69, 2:127, 20:12, 20:44, 20:25-26, 71:28, 12:92, 12:101.
- Frame titles and frame numbering.
- Unicode: no stray or invisible code points in any Quranic text; all Quranic lines are NFC.
