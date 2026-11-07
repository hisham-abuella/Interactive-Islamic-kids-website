# Tafsir reference text: sources and credits

Fetched by `UI/scripts/fetch-tafsir.py` from the QuranEnc.com API (Encyclopedia of the
Noble Quran, https://quranenc.com). The text in these files is **unchanged**: each ayah's
entry is the API's result object as received. It is kept as a **reference** for the team
and the islamic-content-scholar. The site does not show or voice it; the site's Arabic
meaning lines are the team's own short child-level sentences based on it, approved by
the scholar (`claudeteam/reviews/tafsir-ar-lines-2026-11.md`).

Ayat: Al-Fatiha, 2:255 and the 20 short surahs on the site (141 ayat).

| File | Work | Publisher | Version | Retrieved | Browse |
|---|---|---|---|---|---|
| `arabic_moyassar.json` | التفسير الميسر | al-Tafsir al-Muyassar, King Fahd Glorious Quran Printing Complex (مجمع الملك فهد لطباعة المصحف الشريف) | not published by the QuranEnc API; retrieved 2026-11-06 | 2026-11-06 | https://quranenc.com/en/browse/arabic_moyassar |
| `arabic_mokhtasar.json` | المختصر في تفسير القرآن الكريم | al-Mukhtasar fi Tafsir al-Quran al-Karim, Tafsir Center for Quranic Studies (مركز تفسير للدراسات القرآنية) | not published by the QuranEnc API; retrieved 2026-11-06 | 2026-11-06 | https://quranenc.com/en/browse/arabic_mokhtasar |
| `english_mokhtasar.json` | The Abridged Explanation of the Quran | al-Mukhtasar in English, Tafsir Center for Quranic Studies | not published by the QuranEnc API; retrieved 2026-11-06 | 2026-11-06 | https://quranenc.com/en/browse/english_mokhtasar |

## Credit to show on the site

«المعنى مبسَّط اعتماداً على التفسير الميسر (مجمع الملك فهد لطباعة المصحف الشريف) والمختصر في تفسير القرآن الكريم (مركز تفسير للدراسات القرآنية)، والنص من موقع موسوعة القرآن الكريم QuranEnc.com»

"Meanings simplified from al-Tafsir al-Muyassar (King Fahd Complex) and al-Mukhtasar fi
Tafsir al-Quran (Tafsir Center for Quranic Studies); text via QuranEnc.com."

## Conditions of use (QuranEnc.com)

QuranEnc.com: "Contents of the translations can be downloaded and re-published" on these conditions: 1. no modification, addition or deletion of the content; 2. clearly referring to the publisher and the source (QuranEnc.com); 3. mentioning the version number when re-publishing; 4. keeping the transcript information inside the document; 5. notifying the source (QuranEnc.com) of any note on the translation; 6. updating the translation according to the latest version issued from the source; 7. no inappropriate advertisements when displaying the content.

## Version

QuranEnc's `/translations/list` endpoint did not list `arabic_moyassar`,
`arabic_mokhtasar` or `english_mokhtasar` when fetched, so the API gives no version
number for them; the retrieval date stands in for it, as the sources review advised.
Ask QuranEnc for the version number if the verbatim text is ever shown on the site.
Notes on the text go to QuranEnc (condition 5); notes on the Mukhtasar may also go to
almokhtasar@tafsir.net.
