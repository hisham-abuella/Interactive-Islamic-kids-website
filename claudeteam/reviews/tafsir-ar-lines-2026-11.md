# Arabic meaning lines for the surah verse cards: draft for the scholar (2026-11)

**Status: DRAFT. Nothing here is on a page or voiced.** `AR_VERSE_AUDIO` stays `false`, no
`data-ar` was changed and no audio was recorded. Every line waits for the islamic-content-scholar
(Round 3, Part 2 A, rule 8).

- **Why:** on every surah page and on Ayat al-Kursi, the Arabic "meaning" line (`.translation`
  `data-ar`) is the ayah itself, so a synthetic voice would recite it. Ruling:
  `claudeteam/reviews/site-fixes-scholar-confirm-2026-11-04.md`, Round 3, Part 2 A.
- **Scope:** 148 verse cards (141 ayat; Ayat al-Kursi is 8 cards). One line per card, plus one
  optional line for the basmala header (end of this file).
- **Sources:** al-Tafsir al-Muyassar is the main source and al-Mukhtasar the second, both fetched verbatim from QuranEnc by
  `UI/scripts/fetch-tafsir.py` into `UI/scripts/data/tafsir/` (credits and conditions in
  `SOURCES.md`). `english_mokhtasar` was fetched as a reference for the EN check.
- **Machine-readable copy:** `UI/scripts/data/tafsir/ar-meaning-lines.json` (per card: ref,
  unit, ayah, current EN and AR lines, Muyassar excerpt, Mukhtasar, proposed line, notes).

## How the lines were written

1. **Meaning only.** Each line comes from Muyassar. Where a line uses al-Mukhtasar, the notes
   say so. No details are added and no isra'iliyyat are used. Where Muyassar adds material a
   child does not need (a fiqh note, or a graphic detail of the Fire), it is left out, and the
   notes say so.
2. **No ayah wording.** The opening words that Muyassar quotes from the ayah are not copied.
   A single key word that the line explains may stay (الكوثر، القارعة، الحطمة، الفلق، الهاوية،
   الجحيم).
3. **Narrator's voice.** Lines are in the third person, or in the imperative to the listener as in
   the 108:2 model. No line uses «قال الله:» framing and no line uses quote marks. Lines with
   «قل» are given as indirect speech: «يأمر اللهُ النبيَّ ﷺ أن...».
4. **Child level.** Lines are 4 to 21 words long, 10.6 words on average, in everyday MSA with light tashkeel.
   Hard words are explained inside the sentence: «أي...».
5. **Attributes** follow Muyassar. Kursi 7 says that the Kursi is vaster than the heavens and the
   earth (not "knowledge", not "throne"), plus Muyassar's «ولا يعلم كيفيته إلا الله».
6. **Warning ayat** are plain, brief and not graphic. Each is tied to the deed it warns about,
   and where the surah has a reward ayah it follows the warning.
7. **Agreement with the EN line.** Every line was checked against the EN line on the same card.
   Where the EN line and Muyassar part ways, the notes say **EN CHECK**, and they are listed below.

**Continuation cards.** Where the EN line is a fragment that the next card completes (101:6, 101:8,
110:1-2), the AR line ends with a comma in the same way.

## Checker results (`UI/scripts/verify-no-recitation.py`)

- **Every proposed line, through `--text`:** 149 of 149 lines are clean (148 cards and the
  basmala header line).
- **Every line under its real unit name** (`<page>/ar/verse-<n>`, so that the per-unit whitelist
  scoping applies, for example Al-Fatiha 1 and 3), with the ﷺ substitution that `units()` makes:
  148 of 148 lines are clean.
- **Fixed while drafting:** 5 lines tripped the checker and were reworded.
  - 95:1: «بالتين والزيتون» is the whole ayah with one letter off.
  - 105:4: «عليهم حجارة من طين» is a 4-word run of 51:33.
  - Kursi 4: «بعد أن يأذن الله» is a 4-word run of 53:26.
  - Kursi 1: the line ended on «كل شيء». The explanation that follows opens with «لا إله إلا»,
    so together they made a run of 40:62. The line now ends on «بجلاله».
  - **108:1, the scholar's own model line:** «في الدنيا والآخرة ومن» is a 4-word run of 3:45.
    The proposal adds one word: «في الدنيا **وفي** الآخرة». **Scholar:** approve that form, or keep
    the verbatim model and add a unit-scoped whitelist entry for it.
- **Full voice unit** (proposed line + `<break>` + the card's existing AR explanation, as
  `units()` will build it): 145 of 148 are clean. The 3 hits come from the **existing
  explanations** and are there without the new line. They will fail the build as soon as
  `AR_VERSE_AUDIO` is turned on, so they need fixing before then:
  - `surah-fatiha/ar/verse-4`: the explanation has «ومالك يوم الدين». That is the ayah with one
    letter off (1:4).
  - `surah-al-kafirun/ar/verse-3`: the explanation has «والله يعلم ما في». That is a 4-word run of
    33:51 and 49:16, an ordinary phrase.
  - `surah-al-ikhlas/ar/verse-1`: the explanation has «واحد لا إله إلا هو», a 5-word run of
    2:163. Round 3 approved it as the tawhid formula. Since Round 4, two adjacent whitelist
    entries no longer combine, so the checker now flags it.

## Verses where the EN line and the tafsir part ways (EN may need fixing)

None of these contradicts the source outright. The AR line follows Muyassar in each case.

| Card | EN now | Muyassar / Mukhtasar | Suggestion |
|---|---|---|---|
| 94:7 | "So when you have finished, work on," | strive in **worship** once your worldly work is done | "So when you have finished, strive on in worship," |
| 99:7, 99:8 | "an atom's weight" | ذرّة = "a tiny ant" (both sources) | "the weight of a tiny ant" / "the smallest speck" |
| 104:9 | "In outstretched columns." | Muyassar: long **chains and shackles**; Mukhtasar: long **columns** | Scholar to choose. AR follows Mukhtasar (agrees with EN, not graphic); a Muyassar alternative is in the notes |
| 107:4 | "So woe to those who pray." | woe to those who pray **and are heedless of their prayer** (4-5 read together) | "So woe to those who pray carelessly," so that a child does not hear the card alone as a warning against praying |
| 101:9 | "His refuge will be an abyss." | his **abode** is Jahannam | minor: "His home will be the Abyss (Hell)." |
| 111:1 | "May the hands of Abu Lahab perish, and may he perish." | a statement that came true: «خسرت... وقد تحقق خسرانه» | minor; both readings are known, so EN may stay |
| 111:2 | "His wealth and what he earned" | «ما كسب» = his **children** | optional: "His wealth and his children did not help him." |
| 93:3 | "nor is He displeased with you" | «ما أبغضك» (nor hated you) | none needed |
| 113:4 | "those who blow on knots" | witches who blow on knots **to do magic** | optional |

Not a disagreement, for the record: `english_mokhtasar` renders Kursi as "Throne". The page's EN
says "Kursi", which is right, so the page needs no change.

## Lines I am unsure about (scholar, please rule)

1. **1:7.** Muyassar names al-maghdub 'alayhim and al-dallin (Jews and Christians, "and those
   like them"). The line keeps Muyassar's description of each group («مَن عرف الحقَّ وتركه»،
   «مَن ضلَّ عنه جهلاً») and leaves out the names. Is that an acceptable simplification?
2. **104:9:** follow Muyassar (chains) or Mukhtasar (columns)? See the table above.
3. **110:3.** Muyassar says the tasbih and istighfar are to prepare to meet his Lord, which
   points to the Prophet's ﷺ death. The line leaves this out, as the EN does. Add
   «استعداداً للقاء ربه»?
4. **Kursi 7.** The line leaves out Muyassar's definition «موضع قدمي الرب». It keeps
   «ولا يعلم كيفيته إلا الله». Is that right for 5-11 year olds?
5. **109:5.** The line keeps Muyassar's note that the ayah is about particular people whom Allah
   knew would not believe, so that a child does not take it as "no unbeliever can ever believe".
   It makes the line 21 words long. Keep the note or drop it?
6. **95:5.** The line takes Muyassar's view (the Fire, for whoever disobeys). Al-Mukhtasar gives old
   age first. Is a warning on this card right, or the gentler old-age reading?
7. **108:1:** the one-word change to the model line (see "Checker results").
8. **Fatiha 5-7.** The line uses the narrator's «نعبد الله... ونسأل الله...» ("we", talking about
   Allah) in place of Muyassar's direct address to Allah («إنا نخصك»), so that the line is not a
   dua said in the clone's voice. Confirm.

## The lines

### Al-Fatiha

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 1:1 | 1 | بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ | أبتدئ قراءة القرآن باسم الله مستعينا به، (اللهِ) علم على الرب -تبارك وتعالى- المعبود بحق دون سواه، وهو أخص أسماء الله تعالى، ولا يسمى به غيره سبحانه. (الرَّحْمَنِ) ذي الرحمة العامة الذي وسعت رحمته جميع الخلق، (الرَّحِيمِ) بالمؤمنين، وهما اسمان من أسمائه تعالى، يتضمنان إثبات صفة الرحمة لله تعالى كما يليق بجلاله. | **نبدأ قراءةَ القرآن باسم الله، ونطلب عونَه. واللهُ هو الرحمن الذي وسِعت رحمتُه كلَّ الخلق، وهو رحيمٌ بالمؤمنين.** | In the name of Allah, the Most Gracious, the Most Merciful | Muyassar first person «أبتدئ» rendered as «نبدأ» (narrator with the child). The two Names are kept apart, so the line is not the ayah. |
| 1:2 | 2 | الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ | الثناء على الله بصفاته التي كلُّها أوصاف كمال، وبنعمه الظاهرة والباطنة، الدينية والدنيوية، وفي ضمنه أَمْرٌ لعباده أن يحمدوه، فهو المستحق له وحده، وهو سبحانه المنشئ للخلق، القائم بأمورهم، المربي لجميع خلقه بنعمه، ولأوليائه بالإيمان والعمل الصالح. | **كلُّ الثناء والشكر لله وحده، فهو خالقُ جميع المخلوقات، والقائمُ بأمورهم، ويرعاهم بنِعَمه.** | All praise is for Allah, Lord of all worlds |  |
| 1:3 | 3 | الرَّحْمَٰنِ الرَّحِيمِ | (الرَّحْمَنِ) ذي الرحمة العامة الذي وسعت رحمته جميع الخلق، (الرَّحِيمِ) ، بالمؤمنين، وهما اسمان من أسماء الله تعالى. | **اللهُ واسعُ الرحمة، رحمتُه تشمل جميعَ الخلق، وهو رحيمٌ بالمؤمنين رحمةً خاصة.** | The Most Gracious, the Most Merciful | «رحمة خاصة» glosses Muyassar «الرحيم بالمؤمنين». |
| 1:4 | 4 | مَالِكِ يَوْمِ الدِّينِ | وهو سبحانه وحده مالك يوم القيامة، وهو يوم الجزاء على الأعمال … | **اللهُ وحده يملك يومَ القيامة، وهو يومُ الجزاء، حين يُجازي الناسَ على أعمالهم.** | Master of the Day of Judgment |  |
| 1:5 | 5 | إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ | إنا نخصك وحدك بالعبادة، ونستعين بك وحدك في جميع أمورنا … | **نعبدُ اللهَ وحده، ولا نطلب العونَ في أمورنا كلِّها إلا منه.** | You alone we worship, and You alone we ask for help | Narrator «we» speaking about Allah in the third person, not addressing Him (no dua framing). |
| 1:6 | 6 | اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ | دُلَّنا، وأرشدنا، ووفقنا إلى الطريق المستقيم، وثبتنا عليه حتى نلقاك، وهو الإسلام … | **ونسأل اللهَ أن يدلَّنا على الطريق المستقيم، وهو الإسلام، وأن يُثبِّتنا عليه.** | Guide us to the straight path |  |
| 1:7 | 7 | صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ | طريق الذين أنعمت عليهم من النبيين والصدِّيقين والشهداء والصالحين، فهم أهل الهداية والاستقامة، ولا تجعلنا ممن سلك طريق المغضوب عليهم، الذين عرفوا الحق ولم يعملوا به، وهم اليهود، ومن كان على شاكلتهم، والضالين، وهم الذين لم يهتدوا عن جهل منهم … | **وهو طريقُ الأنبياء والصالحين الذين أكرمهم الله بالهداية، لا طريقُ مَن عرف الحقَّ وتركه، ولا مَن ضلَّ عنه جهلاً.** | The path of those You have blessed, not of those who earned Your anger, nor of those who went astray | SCHOLAR: Muyassar names the two groups (اليهود، النصارى). The line keeps Muyassar's description of each and leaves the names out. Confirm, or rule that the names go in. Avoids «الذين أنعم الله عليهم» (4 words of 4:69). |

### Ad-Duha

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 93:1 | 1 | وَالضُّحَىٰ | أقسم الله بوقت الضحى، والمراد به النهار كله … | **يُقسم الله بوقت الضحى، أي بالنهار كلِّه.** | By the morning light. | Muyassar gives one entry for 93:1-3. EN "morning light" is narrower than Muyassar (the whole day); not a contradiction. |
| 93:2 | 2 | وَاللَّيْلِ إِذَا سَجَىٰ | … وبالليل إذا سكن بالخلق واشتد ظلامه … | **ويُقسم الله بالليل حين يسكن فيه الناس ويشتدُّ ظلامه.** | And by the night when it grows still. |  |
| 93:3 | 3 | مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ | … ما تركك -أيها النبي- ربك، وما أبغضك بإبطاء الوحي عنك | **ما ترك اللهُ النبيَّ ﷺ وما كرهه، حين تأخَّر عنه نزولُ الوحي.** | Your Lord has not left you, nor is He displeased with you. | Muyassar «أبغضك» (hated); EN has "displeased with". The line uses «كرهه» (as the scholar's 108:3 model does). Minor; EN may stay. |
| 93:4 | 4 | وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ | ولَلدَّار الآخرة خير لك من دار الدنيا … | **والدارُ الآخرة خيرٌ للنبيِّ ﷺ من هذه الدنيا.** | And the next life is better for you than this first one. | Muyassar gives one entry for 93:4-5. |
| 93:5 | 5 | وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ | … ولسوف يعطيك ربك -أيها النبي- مِن أنواع الإنعام في الآخرة، فترضى بذلك | **وسيعطيه اللهُ في الآخرة نِعَماً كثيرة، حتى يرضى.** | And your Lord is going to give you, until you are pleased. |  |
| 93:6 | 6 | أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ | ألم يَجِدْك من قبلُ يتيمًا مات أبوك وأنت حمل في بطن أمك، فآواك ورعاك … | **مات أبو النبيِّ ﷺ قبل أن يُولد، فكان يتيماً، فآواه اللهُ ورعاه.** | Did He not find you an orphan, and give you shelter? | Muyassar gives one entry for 93:6-8. «فآواه» is the single key word, explained by «ورعاه». |
| 93:7 | 7 | وَوَجَدَكَ ضَالًّا فَهَدَىٰ | … ووجدك لا تدري ما الكتاب ولا الإيمان، فعلَّمك ما لم تكن تعلم … | **وكان قبل الوحي لا يعرف الكتابَ والإيمان، فعلَّمه اللهُ وهداه.** | And find you not yet knowing the way, and guide you? | Avoids «ما الكتاب ولا الإيمان» (4 words of 42:52). EN "not yet knowing the way" agrees. |
| 93:8 | 8 | وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ | … ووجدك فقيرًا، فساق لك رزقك، وأغنى نفسك بالقناعة والصبر … | **وكان فقيراً، فرزقه اللهُ، وأغنى قلبَه بالقناعة والصبر.** | And find you in need, and make you rich enough? |  |
| 93:9 | 9 | فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ | فأما اليتيم فلا تُسِئْ معاملته … | **فلا تُسِئْ إلى اليتيم، ولا تعامله بقسوة.** | So as for the orphan, do not be harsh with him. | Muyassar gives one entry for 93:9-11. Imperative to the listener, as in the 108:2 model. |
| 93:10 | 10 | وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ | … وأما السائل فلا تزجره، بل أطعمه، واقض حاجته … | **ومَن جاءك يسأل فلا تزجره، بل أطعمه واقضِ حاجته.** | And as for the one who asks, do not turn him away harshly. |  |
| 93:11 | 11 | وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ | … وأما بنعمة ربك التي أسبغها عليك فتحدث بها | **وتحدَّثْ بنِعَم الله التي أعطاك إياها، شاكراً له.** | And as for the blessing of your Lord, speak about it. | «شاكراً له» from al-Mukhtasar («واشكر نعم الله عليك»). |

### Ash-Sharh

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 94:1 | 1 | أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ | ألم نوسع -أيها النبي- لك صدرك لشرائع الدين، والدعوة إلى الله، والاتصاف بمكارم الأخلاق … | **وسَّع اللهُ صدرَ النبيِّ ﷺ لأحكام الدين، والدعوة إلى الله، والأخلاق الكريمة.** | Did We not open up your chest for you? | Muyassar's question is rhetorical; the line gives it as the statement it means. |
| 94:2 | 2 | وَوَضَعْنَا عَنْكَ وِزْرَكَ | … وحططنا عنك بذلك حِمْلك … | **وأزال اللهُ عن النبيِّ ﷺ الحِملَ الثقيل الذي كان عليه.** | And take off from you your burden, |  |
| 94:3 | 3 | الَّذِي أَنْقَضَ ظَهْرَكَ | الذي أثقل ظهرك … | **ذلك الحِملُ الذي كان ثقيلاً على ظهره حتى أتعبه.** | the one that weighed down your back, | «أتعبه» from al-Mukhtasar («الذي أتعبك»). |
| 94:4 | 4 | وَرَفَعْنَا لَكَ ذِكْرَكَ | … وجعلناك -بما أنعمنا عليك من المكارم- في منزلة رفيعة عالية … | **ورفع اللهُ منزلةَ النبيِّ ﷺ عالياً، فصار اسمُه يُذكَر في الأذان والإقامة.** | And raise high your mention? | Adhan and iqama from al-Mukhtasar («فقد أصبحت تذكر في الأذان والإقامة»). |
| 94:5 | 5 | فَإِنَّ مَعَ الْعُسْرِ يُسْرًا | … فإن مع الضيق فرجًا … | **فمع الضيق والشدّة يأتي الفرج.** | So truly, with hardship comes ease. | Muyassar gives one entry for 94:5-6. |
| 94:6 | 6 | إِنَّ مَعَ الْعُسْرِ يُسْرًا | … إن مع الضيق فرجًا … | **ويؤكِّد اللهُ هذا الوعدَ مرةً ثانية، فالفرجُ يأتي مع الضيق.** | Truly, with hardship comes ease. | The same ayah twice: the line says that it is repeated, as an assurance. |
| 94:7 | 7 | فَإِذَا فَرَغْتَ فَانْصَبْ | فإذا فرغت من أمور الدنيا وأشغالها فَجِدَّ في العبادة … | **فإذا انتهيتَ من أعمالك وأشغالك في الدنيا، فاجتهِدْ في عبادة الله.** | So when you have finished, work on, | EN CHECK: EN "work on" does not say what the work is; Muyassar and al-Mukhtasar both say "strive in worship". Suggest EN "So when you have finished, strive on in worship,". |
| 94:8 | 8 | وَإِلَىٰ رَبِّكَ فَارْغَبْ | … وإلى ربك وحده فارغب فيما عنده | **واجعل رغبتك وأملك في الله وحده، وفيما عنده من الخير.** | And to your Lord turn with longing. |  |

### At-Tin

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 95:1 | 1 | وَالتِّينِ وَالزَّيْتُونِ | أَقْسم الله بالتين والزيتون، وهما من الثمار المشهورة … | **يُقسم اللهُ بالتين، ويُقسم بالزيتون، وهما من الثمار المعروفة.** | By the fig and the olive, | Muyassar gives one entry for 95:1-6. |
| 95:2 | 2 | وَطُورِ سِينِينَ | … وأقسم بجبل "طور سيناء" الذي كلَّم الله عليه موسى تكليمًا … | **ويُقسم بجبل الطور في سيناء، حيث كلَّم اللهُ موسى عليه السلام.** | And Mount Sinai, |  |
| 95:3 | 3 | وَهَٰذَا الْبَلَدِ الْأَمِينِ | … وأقسم بهذا البلد الأمين من كل خوف وهو "مكة" مهبط الإسلام … | **ويُقسم بمكة، البلدِ الآمن الذي نزل فيه الوحي.** | And this safe city, | Muyassar 95:1 has «مهبط الوحي», 95:3 has «مهبط الإسلام»; the line follows 95:1. |
| 95:4 | 4 | لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ | … لقد خلقنا الإنسان في أحسن صورة … | **خلق اللهُ الإنسانَ في أجمل صورة وأحسن هيئة.** | We certainly created the human being in the finest form. |  |
| 95:5 | 5 | ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ | … ثم رددناه إلى النار إن لم يطع الله، ويتبع الرسل … | **ثم يكون مصيرُ الإنسان إلى النار، إن لم يُطِع اللهَ ويتَّبع رسلَه.** | Then We returned him to the lowest of the low. | Muyassar's view (the Fire, for one who disobeys). Al-Mukhtasar puts old age first. EN "lowest of the low" fits both. Warning tied to deeds. |
| 95:6 | 6 | إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ | … لكن الذين آمنوا وعملوا الأعمال الصالحة لهم أجر عظيم غير مقطوع ولا منقوص | **أمّا المؤمنون الذين يعملون الأعمال الصالحة، فلهم ثوابٌ عظيم لا ينقطع ولا ينقص.** | Except those who believe and do good deeds — for them is a reward never cut off. | Avoids «إلا الذين آمنوا وعملوا» (4-word run). Pairs the reward with :5. |
| 95:7 | 7 | فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ | أيُّ شيء يحملك -أيها الإنسان- على أن تكذِّب بالبعث والجزاء مع وضوح الأدلة على قدرة الله تعالى على ذلك … | **فما الذي يجعل الإنسانَ يُكذِّب بيوم الحساب والجزاء، بعد هذه الأدلة الواضحة على قدرة الله؟** | So what makes you deny the Judgement after this? |  |
| 95:8 | 8 | أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ | أليس الله الذي جعل هذا اليوم للفصل بين الناس بأحكم الحاكمين في كل ما خلق؟ بلى. فهل يُترك الخلق سدى لا يؤمرون ولا يُنهون، ولا يثابون ولا يعاقبون؟ لا يصحُّ ذلك ولا يكون | **اللهُ هو أحكمُ الحاكمين وأعدلُهم، فلا يترك الناسَ دون حسابٍ وجزاء.** | Is Allah not the wisest of all judges? | «أعدلهم» from al-Mukhtasar. |

### Al-Bayyinah

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 98:1 | 1 | لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ | لم يكن الذين كفروا من اليهود والنصارى والمشركين تاركين كفرهم حتى تأتيهم العلامة التي وُعِدوا بها في الكتب السابقة | **الكفارُ من اليهود والنصارى والمشركين لم يكونوا ليتركوا كفرَهم، حتى يأتيهم الدليلُ الواضح الذي وُعِدوا به.** | Those who disbelieved among the People of the Book and the idolaters were not going to change until the clear proof came to them. | «الدليل الواضح» from al-Mukhtasar («برهان واضح»), to match EN "clear proof". |
| 98:2 | 2 | رَسُولٌ مِنَ اللَّهِ يَتْلُو صُحُفًا مُطَهَّرَةً | وهي رسول الله محمد صلى الله عليه وسلم، يتلو قرآنًا في صحف مطهرة | **وهذا الدليلُ هو النبيُّ محمد ﷺ، يقرأ عليهم القرآنَ مكتوباً في صحفٍ طاهرة.** | A Messenger from Allah, reciting purified pages, |  |
| 98:3 | 3 | فِيهَا كُتُبٌ قَيِّمَةٌ | في تلك الصحف أخبار صادقة وأوامر عادلة، تهدي إلى الحق وإلى صراط مستقيم | **في هذه الصحف أخبارٌ صادقة وأوامرُ عادلة، تهدي الناسَ إلى الحق.** | within which are upright writings. |  |
| 98:4 | 4 | وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِنْ بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ | وما اختلف الذين أوتوا الكتاب من اليهود والنصارى في كون محمد صلى الله عليه وسلم رسولا حقًا؛ لما يجدونه من نعته في كتابهم، إلا مِن بعد ما تبينوا أنه النبي الذي وُعِدوا به في التوراة والإنجيل، فكانوا مجتمعين على صحة نبوته، فلما بُعِث تفرقوا: فمنهم من آمن به، ومنهم من جحد نبوته بغياً وحسداً | **واليهودُ والنصارى لم يختلفوا في نبوّة محمد ﷺ إلا بعد أن عرفوا أنه النبيُّ الموعود، فآمن بعضُهم، وكفر بعضُهم حسداً.** | And those given the Book did not divide until after the clear proof came to them. | 22 words. |
| 98:5 | 5 | وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ وَذَٰلِكَ دِينُ الْقَيِّمَةِ | وما أمروا في سائر الشرائع إلا ليعبدوا الله وحده قاصدين بعبادتهم وجهه، مائلين عن الشرك إلى الإيمان، ويقيموا الصلاة، ويُؤَدُّوا الزكاة، وذلك هو دين الاستقامة، وهو الإسلام | **أمرهم اللهُ أن يعبدوه وحده بإخلاص، بعيداً عن الشرك، وأن يُصلُّوا ويُخرجوا الزكاة، وهذا هو الدين المستقيم، الإسلام.** | And they were commanded only to worship Allah, sincere to Him in religion, upright, and to establish prayer and give zakah — and that is the upright religion. |  |
| 98:6 | 6 | إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ | إن الذين كفروا من اليهود والنصارى والمشركين عقابهم نار جهنم خالدين فيها، أولئك هم أشد الخليقة شرا | **أمّا الكفارُ من اليهود والنصارى والمشركين، فعقابُهم نارُ جهنم يبقون فيها دائماً، وهم أسوأ الخلق.** | Indeed, those who disbelieved among the People of the Book and the idolaters will be in the Fire of Hell, abiding therein. Those are the worst of creation. | Warning ayah: plain, brief, not graphic; reward follows on cards 7-8. Avoids «من أهل الكتاب والمشركين» (4 words of 98:1, 98:6). |
| 98:7 | 7 | إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ | إن الذين صَدَّقوا الله واتبعوا رسوله وعملوا الصالحات، أولئك هم خير الخلق | **والذين آمنوا بالله، واتَّبعوا رسولَه، وعملوا الصالحات، هم خيرُ الخلق.** | Indeed, those who believe and do righteous deeds — those are the best of creation. |  |
| 98:8 | 8 | جَزَاؤُهُمْ عِنْدَ رَبِّهِمْ جَنَّاتُ عَدْنٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ ذَٰلِكَ لِمَنْ خَشِيَ رَبَّهُ | جزاؤهم عند ربهم يوم القيامة جنات إقامة واستقرار في منتهى الحسن، تجري من تحت قصورها الأنهار، خالدين فيها أبدًا، رضي الله عنهم فقبل أعمالهم الصالحة، ورضوا عنه بما أعدَّ لهم من أنواع الكرامات، ذلك الجزاء الحسن لمن خاف الله واجتنب معاصيه | **ثوابُهم في الآخرة جناتٌ تجري الأنهار تحت قصورها، يعيشون فيها دائماً، والله راضٍ عنهم وهم راضون عنه، وهذا لمن يخاف الله.** | Their reward with their Lord is gardens of perpetual residence beneath which rivers flow, abiding there forever. Allah is pleased with them and they are pleased with Him. That is for whoever fears his Lord. | 24 words. Avoids «رضي الله عنهم ورضوا عنه» (5-word run of this ayah). |

### Az-Zalzalah

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 99:1 | 1 | إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا | إذا رُجَّت الأرض رجًّا شديدًا … | **يومَ القيامة تهتزُّ الأرضُ هزةً شديدةً جداً.** | When the earth is shaken with its final earthquake. | Muyassar gives one entry for 99:1-3. «يوم القيامة» from al-Mukhtasar. |
| 99:2 | 2 | وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا | … وأخرجت ما في بطنها من موتى وكنوز … | **وتُخرج الأرضُ ما في باطنها من الموتى والكنوز.** | And the earth brings out its burdens. |  |
| 99:3 | 3 | وَقَالَ الْإِنْسَانُ مَا لَهَا | … وتساءل الإنسان فزعًا: ما الذي حدث لها … | **ويتساءل الإنسانُ خائفاً: ما الذي حدث للأرض؟** | And man says, 'What is wrong with it?' | The question is Muyassar's wording, not the ayah's. |
| 99:4 | 4 | يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا | يوم القيامة تخبر الأرض بما عُمل عليها من خير أو شر … | **في ذلك اليوم تُخبر الأرضُ بكل ما عمله الناسُ عليها من خيرٍ أو شر.** | That Day it will report its news. | Muyassar gives one entry for 99:4-5. |
| 99:5 | 5 | بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا | … وبأن الله سبحانه وتعالى أمرها بأن تخبر بما عُمل عليها | **لأنَّ اللهَ أمرها أن تُخبر بذلك.** | Because your Lord has inspired it. | EN "inspired it"; Muyassar "commanded it". Compatible. |
| 99:6 | 6 | يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ | يومئذ يرجع الناس عن موقف الحساب أصنافًا متفرقين؛ ليريهم الله ما عملوا من السيئات والحسنات، ويجازيهم عليها | **في ذلك اليوم يرجع الناسُ من موقف الحساب جماعاتٍ متفرقة، ليُريهم اللهُ أعمالَهم.** | That Day people will come forward in groups to be shown their deeds. |  |
| 99:7 | 7 | فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ | فمن يعمل وزن نملة صغيرة خيرًا، ير ثوابه في الآخرة … | **فمَن عمل خيراً ولو بوزن نملةٍ صغيرة، سيرى ثوابَه في الآخرة.** | So whoever does an atom's weight of good will see it. | EN CHECK: Muyassar and al-Mukhtasar give ذرّة as "a tiny ant"; EN says "an atom's weight". Not wrong as a common rendering, but it differs from the source the AR follows. Suggest EN "the weight of a tiny ant" or "the smallest speck". |
| 99:8 | 8 | وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ | … ومن يعمل وزن نملة صغيرة شرًا، ير عقابه في الآخرة | **ومَن عمل شرّاً ولو بوزن نملةٍ صغيرة، سيرى عقابَه في الآخرة.** | And whoever does an atom's weight of evil will see it. | Same EN note as 99:7. |

### Al-Adiyat

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 100:1 | 1 | وَالْعَادِيَاتِ ضَبْحًا | أقسم الله تعالى بالخيل الجاريات في سبيله نحو العدوِّ، حين يظهر صوتها من سرعة عَدْوِها … | **يُقسم اللهُ بالخيل التي تجري بسرعة في سبيله نحو العدوّ، حتى يُسمَع صوتُ أنفاسها.** | By the racers, panting, | «صوت أنفاسها» from al-Mukhtasar. EN "racers" does not say horses; not a contradiction. |
| 100:2 | 2 | فَالْمُورِيَاتِ قَدْحًا | فالخيل اللاتي تنقدح النار من صلابة حوافرها؛ من شدَّة عَدْوها | **وبالخيل التي تضرب الصخرَ بحوافرها، فتتطاير منه شراراتُ النار من شدة جريها.** | striking sparks of fire, | «الصخر» from al-Mukhtasar. |
| 100:3 | 3 | فَالْمُغِيرَاتِ صُبْحًا | فالخيل التي تغير بركبانها على الأعداء عند الصبح | **وبالخيل التي تهجم على الأعداء وقتَ الصباح.** | charging at dawn, |  |
| 100:4 | 4 | فَأَثَرْنَ بِهِ نَقْعًا | فهيَّجْنَ بهذا العَدْو غبارًا | **فتُثير بجريها الغبارَ في الهواء.** | stirring up clouds of dust, |  |
| 100:5 | 5 | فَوَسَطْنَ بِهِ جَمْعًا | فتوسَّطن بركبانهن جموع الأعداء | **فتدخل بفرسانها وسطَ جموع الأعداء.** | and plunging into the middle of the gathering. |  |
| 100:6 | 6 | إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ | إن الإنسان لِنعم ربه لَجحود … | **إنَّ الإنسانَ كثيرُ الجحود لنِعَم ربه، لا يشكرها.** | Indeed, the human being is ungrateful to his Lord. | Muyassar gives one entry for 100:6-8. |
| 100:7 | 7 | وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ | … وإنه بجحوده ذلك لمقر … | **وهو نفسُه يعرف ذلك ويُقِرُّ به.** | And he is a witness to that himself. |  |
| 100:8 | 8 | وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ | … وإنه لحب المال لشديد | **وهو يحبُّ المالَ حباً شديداً.** | And he is intense in his love of wealth. |  |
| 100:9 | 9 | أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ | أفلا يعلم الإنسان ما ينتظره إذا أخرج الله الأموات من القبور للحساب والجزاء … | **ألا يعلم الإنسانُ ما ينتظره، حين يُخرج اللهُ الموتى من قبورهم للحساب والجزاء؟** | Does he not know that when what is in the graves is scattered, |  |
| 100:10 | 10 | وَحُصِّلَ مَا فِي الصُّدُورِ | واستُخرج ما استتر في الصدور من خير أو شر | **ويُكشَف ما كان مخفيّاً في القلوب من خيرٍ أو شر.** | and what is in the hearts is brought out, |  |
| 100:11 | 11 | إِنَّ رَبَّهُمْ بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ | إن ربهم بهم وبأعمالهم يومئذ لخبير، لا يخفى عليه شيء من ذلك | **إنَّ اللهَ في ذلك اليوم خبيرٌ بالناس وبأعمالهم، أي يعلمها كلَّها، فلا يغيب عنه منها شيء.** | indeed their Lord is fully aware of them that Day. | Avoids «لا يخفى عليه شيء» (4 words of 3:5). |

### Al-Qariah

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 101:1 | 1 | الْقَارِعَةُ | الساعة التي تقرع قلوب الناس بأهوالها | **القارعةُ هي يومُ القيامة، سُمِّيت بذلك لأن أحداثها العظيمة تقرع قلوبَ الناس، أي تُفزعها.** | The Striking Hour. | Warning surah. «القارعة» is the single key word being explained (allowed). «يوم القيامة» from al-Mukhtasar 101:3. |
| 101:2 | 2 | مَا الْقَارِعَةُ | أيُّ شيء هذه القارعة … | **أيُّ شيءٍ هذه القارعة التي تُفزع القلوب؟** | What is the Striking Hour? | Not the 2-word ayah «ما القارعة». |
| 101:3 | 3 | وَمَا أَدْرَاكَ مَا الْقَارِعَةُ | وأيُّ شيء أعلمك بها … | **وأيُّ شيءٍ يُعلِمك بها؟ إنها يومُ القيامة العظيم.** | And what can make you know what the Striking Hour is? | «إنها يوم القيامة» from al-Mukhtasar. |
| 101:4 | 4 | يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ | في ذلك اليوم يكون الناس في كثرتهم وتفرقهم وحركتهم كالفراش المنتشر … | **في ذلك اليوم يكون الناسُ في كثرتهم وتفرُّقهم وحركتهم مثلَ الفَراش المنتشر.** | The Day people will be like scattered moths, | Muyassar's added clause on moths falling into flame is left out (not needed, and graphic for the age). |
| 101:5 | 5 | وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ | وتكون الجبال كالصوف متعدد الألوان الذي يُنْفَش باليد، فيصير هباء ويزول | **وتصير الجبالُ مثلَ الصوف الملوَّن المنفوش، خفيفةً، ثم تزول.** | And the mountains will be like carded wool. |  |
| 101:6 | 6 | فَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ | فأما من رجحت موازين حسناته … | **فأمّا مَن كانت حسناتُه أثقلَ في الميزان من سيئاته،** | Then as for one whose scales are heavy, | Muyassar gives one entry for 101:6-7. Ends with a comma: card 7 completes it, as the EN does. |
| 101:7 | 7 | فَهُوَ فِي عِيشَةٍ رَاضِيَةٍ | … فهو في حياة مرضية في الجنة | **فهو في حياةٍ سعيدة يرضاها، في الجنة.** | He will be in a pleasant life. |  |
| 101:8 | 8 | وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ | وأما من خفت موازين حسناته، ورجحت موازين سيئاته … | **وأمّا مَن كانت حسناتُه أخفَّ في الميزان، ورجحت سيئاتُه،** | But as for one whose scales are light, | Muyassar gives one entry for 101:8-9. Warning tied to deeds. |
| 101:9 | 9 | فَأُمُّهُ هَاوِيَةٌ | … فمأواه جهنم | **فمكانُه يومَ القيامة نارُ جهنم.** | His refuge will be an abyss. | EN CHECK (minor): EN "His refuge will be an abyss" is literal; Muyassar reads «أمّه هاوية» as "his abode is Jahannam". Suggest EN "His home will be the Abyss (Hell)". |
| 101:10 | 10 | وَمَا أَدْرَاكَ مَا هِيَهْ | وما أدراك -أيها الرسول- ما هذه الهاوية … | **وهل تعرف ما هذه الهاوية؟** | And what can make you know what it is? | Avoids the opening «وما أدراك ما». «الهاوية» is the key word. |
| 101:11 | 11 | نَارٌ حَامِيَةٌ | إنها نار قد حَمِيت من الوقود عليها | **إنها نارٌ شديدةُ الحرارة.** | A blazing Fire. | Plain and brief. Not the 2-word ayah «نار حامية». |

### At-Takathur

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 102:1 | 1 | أَلْهَاكُمُ التَّكَاثُرُ | شغلكم عن طاعة الله التفاخر بكثرة الأموال والأولاد | **انشغل الناسُ عن طاعة الله بالتفاخر بكثرة الأموال والأولاد.** | Competing for more has distracted you, | Third person, as rule 3 asks; Muyassar addresses "you". EN "has distracted you" agrees. |
| 102:2 | 2 | حَتَّىٰ زُرْتُمُ الْمَقَابِرَ | واستمر اشتغالكم بذلك إلى أن صرتم إلى المقابر، ودُفنتم فيها | **وبقُوا على ذلك حتى ماتوا ودُفنوا في القبور.** | Until you reach the graves. |  |
| 102:3 | 3 | كَلَّا سَوْفَ تَعْلَمُونَ | ما هكذا ينبغي أن يُلْهيكم التكاثر بالأموال، سوف تتبيَّنون أن الدار الآخرة خير لكم | **ما كان ينبغي أن يشغلهم ذلك، وسوف يعرفون أن الآخرة خيرٌ لهم.** | No! You are going to know. |  |
| 102:4 | 4 | ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ | ثم احذروا سوف تعلمون سوء عاقبة انشغالكم عنها | **ويُحذِّرهم اللهُ مرةً ثانية أنهم سيعرفون سوءَ عاقبة انشغالهم عن طاعته.** | Then no! You are going to know. |  |
| 102:5 | 5 | كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ | … لو تعلمون حق العلم لانزجرتم، ولبادرتم إلى إنقاذ أنفسكم من الهلاك … | **لو علموا علماً يقيناً أنهم سيُحاسَبون، لتركوا التفاخرَ، وأسرعوا إلى إنقاذ أنفسهم.** | No! If only you knew with certain knowledge… | Muyassar gives one entry for 102:5-8. «أنهم سيحاسبون» from al-Mukhtasar. |
| 102:6 | 6 | لَتَرَوُنَّ الْجَحِيمَ | … لتبصرُنَّ الجحيم … | **سيرون نارَ الجحيم يومَ القيامة.** | You will surely see the Blazing Fire. | Warning ayah: brief, not graphic. «الجحيم» is the key word. |
| 102:7 | 7 | ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ | … ثم لتبصرُنَّها دون ريب … | **ثم سيرونها بأعينهم رؤيةً يقينيةً لا شكَّ فيها.** | Then you will see it with the eye of certainty. |  |
| 102:8 | 8 | ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ | … ثم لتسألُنَّ يوم القيامة عن كل أنواع النعيم | **ثم يسألهم اللهُ يومَ القيامة عن كل النِّعَم التي أعطاهم إياها، كالصحة والمال.** | Then you will surely be asked that Day about the blessings. | Examples from al-Mukhtasar («من الصحة والغنى»). |

### Al-Asr

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 103:1 | 1 | وَالْعَصْرِ | أقسم الله بالدهر؛ لما فيه من عجائب قدرة الله الدالة على عظمته … | **يُقسم اللهُ بالزمن، لما فيه من عجائبَ تدلُّ على عظمته.** | By time! | Muyassar: الدهر (time), as EN "By time!". Al-Mukhtasar: the afternoon. Line follows Muyassar. |
| 103:2 | 2 | إِنَّ الْإِنسَانَ لَفِي خُسْرٍ | … على أن بني آدم لفي هلكة ونقصان … | **إنَّ بني آدم في خسارةٍ ونقصان.** | Indeed, mankind is in loss. | Card 3 gives the exception straight after. |
| 103:3 | 3 | إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ | إلا الذين آمنوا بالله وعملوا عملا صالحًا، وأوصى بعضهم بعضًا بالاستمساك بالحق، والعمل بطاعة الله، والصبر على ذلك | **إلا مَن آمن بالله، وعمل الصالحات، وأوصى غيرَه بالتمسُّك بالحق، وبالصبر على ذلك.** | Except those who believe, and do righteous deeds, and advise each other to truth, and advise each other to patience. |  |

### Al-Humazah

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 104:1 | 1 | وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ | شر وهلاك لكل مغتاب للناس، طعان فيهم | **الهلاكُ لكلِّ مَن يغتاب الناسَ ويَعيبهم ويطعن فيهم.** | Woe to every slanderer and backbiter. | Warning surah: tied to the deed (backbiting, mocking), brief. |
| 104:2 | 2 | الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ | الذي كان همُّه جمع المال وتعداده | **الذي كان همُّه أن يجمع المالَ ويَعُدَّه مرةً بعد مرة.** | Who gathers wealth and counts it over. |  |
| 104:3 | 3 | يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ | يظن أنه ضَمِنَ لنفسه بهذا المال الذي جمعه، الخلود في الدنيا والإفلات من الحساب | **يظنُّ أن مالَه سيُبقيه حيّاً في الدنيا، وينجّيه من الحساب.** | Thinking his wealth will make him live forever. |  |
| 104:4 | 4 | كَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ | ليس الأمر كما ظن، ليُطرحنَّ في النار التي تهشم كل ما يُلْقى فيها | **ليس الأمرُ كما ظنّ، بل سيُلقى في الحُطَمة، وهي نارٌ تُحطِّم كلَّ ما يُلقى فيها.** | No! He will surely be thrown into the Crusher. | «الحطمة» is the key word being explained (allowed by name in the scholar's rule 2). |
| 104:5 | 5 | وَمَا أَدْرَاكَ مَا الْحُطَمَةُ | وما أدراك -أيها الرسول- ما حقيقة النار … | **وهل تعرف ما حقيقةُ هذه النار؟** | And what can make you know what the Crusher is? |  |
| 104:6 | 6 | نَارُ اللَّهِ الْمُوقَدَةُ | إنها نار الله المشتعلة الشديدة اللهب … | **إنها نارُ الله المشتعلة، الشديدةُ الحرارة.** | The kindled Fire of Allah, | Not the 3-word ayah «نار الله الموقدة». |
| 104:7 | 7 | الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ | … التي من شدتها تنفُذ من الأجسام إلى القلوب | **ومن شدة حرِّها تصل إلى القلوب.** | Which rises over the hearts. | Kept short; «from the bodies» left out as graphic for the age. |
| 104:8 | 8 | إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ | إنها عليهم مطبَقة … | **وهي مُغلَقةٌ عليهم، فلا يستطيعون الخروج منها.** | It will be closed over them, | Muyassar gives one entry for 104:8-9. |
| 104:9 | 9 | فِي عَمَدٍ مُمَدَّدَةٍ | … في سلاسل وأغلال مطوَّلة؛ لئلا يخرجوا منها | **مُغلَقةٌ بأعمدةٍ طويلة ممدودة، حتى لا يخرجوا منها.** | In outstretched columns. | SCHOLAR + EN CHECK: Muyassar reads «عمد ممددة» as long chains and shackles; al-Mukhtasar as long columns («بعمد ممتدة طويلة»), which is what EN "outstretched columns" says. The line follows al-Mukhtasar so that it agrees with EN and stays non-graphic. Alternative on Muyassar: «وهم مقيَّدون فيها بسلاسل طويلة، حتى لا يخرجوا منها.» Scholar to choose. |

### Al-Fil

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 105:1 | 1 | أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ | ألم تعلم -أيها الرسول- كيف فعل ربك بأصحاب الفيل: أبرهة الحبشي وجيشه الذين أرادوا تدمير الكعبة المباركة … | **ألا تعلم ما فعله اللهُ بأبرهة وجيشه، أصحابِ الفيل، حين أرادوا هدمَ الكعبة؟** | Have you not seen how your Lord dealt with the companions of the elephant? | Rhetorical question to the listener, as Muyassar has it. EN "Have you not seen" agrees (Muyassar: "know"). |
| 105:2 | 2 | أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ | ألم يجعل ما دبَّروه من شر في إبطال وتضييع … | **لقد جعل اللهُ ما دبَّروه من شرٍّ يضيع ويفشل.** | Did He not make their plan go astray? |  |
| 105:3 | 3 | وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ | وبعث عليهم طيرًا في جماعات متتابعة … | **وأرسل اللهُ عليهم طيوراً كثيرة، تأتي جماعاتٍ وراءَ جماعات.** | And He sent against them birds in flocks. | Muyassar gives one entry for 105:3-4. |
| 105:4 | 4 | تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ | … تقذفهم بحجارة من طين متحجِّر | **فكانت الطيور تقذفهم بحجارةٍ من طينٍ متحجِّر، أي طينٍ صار صُلباً كالحجر.** | Striking them with stones of baked clay. | «سجيل» is explained but not said. |
| 105:5 | 5 | فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ | فجعلهم به محطمين كأوراق الزرع اليابسة التي أكلتها البهائم ثم رمت بها | **فجعلهم اللهُ محطَّمين، مثلَ أوراق الزرع اليابسة التي أكلتها الحيوانات.** | And He made them like eaten straw. |  |

### Quraysh

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 106:1 | 1 | لِإِيلَافِ قُرَيْشٍ | اعْجَبوا لإلف قريش، وأمنهم، واستقامة مصالحهم … | **انظروا إلى نعمة الله على قبيلة قريش، فقد عاشوا في أُلفةٍ وأمان، واستقامت أمورُهم.** | For the familiarity of the Quraysh. | «انظروا» for Muyassar «اعجبوا» (be amazed). EN "familiarity" agrees. |
| 106:2 | 2 | إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ | … وانتظام رحلتيهم في الشتاء إلى "اليمن"، وفي الصيف إلى "الشام"، وتيسير ذلك؛ لجلب ما يحتاجون إليه | **فقد اعتادوا رحلتين كلَّ عام: رحلةً في الشتاء إلى اليمن، ورحلةً في الصيف إلى الشام، ليجلبوا ما يحتاجون إليه.** | Their familiarity with the journey of winter and summer. | «كل عام» is implied by the two seasons; strike it if the scholar prefers. |
| 106:3 | 3 | فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ | فليشكروا، وليعبدوا رب هذا البيت الذي يعتزون به -وهو الكعبة-، وبسببه نالوا الشرف والرفعة، وليوحدوه ويخلصوا له العبادة | **فليشكروا اللهَ، وليعبدوه وحده، فهو ربُّ الكعبة التي نالوا بسببها الشرف.** | So let them worship the Lord of this House. |  |
| 106:4 | 4 | الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ | الذي أطعمهم من جوع شديد، وآمنهم من فزع وخوف عظيم | **فهو الذي أطعمهم بعد جوعٍ شديد، وأعطاهم الأمانَ بعد خوفٍ عظيم.** | Who has fed them against hunger and made them safe from fear. |  |

### Al-Ma'un

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 107:1 | 1 | أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ | أرأيت حال ذلك الذي يكذِّب بالبعث والجزاء … | **هل عرفتَ حالَ الذي يُكذِّب بيوم الحساب والجزاء؟** | Have you seen the one who denies the Judgment? |  |
| 107:2 | 2 | فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ | فذلك الذي يدفع اليتيم الذي مات أبوه وهو صغير بعنف وشدة عن حقه؛ لقساوة قلبه | **إنه الذي يدفع اليتيمَ بقسوة، ويمنعه حقَّه.** | That is the one who drives away the orphan. |  |
| 107:3 | 3 | وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ | ولا يحضُّ غيره على إطعام المحتاج الذي لا يملك ما يكفيه ويسد حاجته … | **ولا يحثُّ غيرَه على إطعام الفقير المحتاج.** | And does not encourage the feeding of the poor. |  |
| 107:4 | 4 | فَوَيْلٌ لِلْمُصَلِّينَ | فعذاب شديد للمصلين الذين هم عن صلاتهم لاهون … | **فالعذابُ الشديد لمصلّين لا يهتمّون بصلاتهم.** | So woe to those who pray. | Muyassar gives one entry for 107:4-5. The line names who is meant on this card, so that a child does not hear "woe to those who pray" alone. EN CHECK: EN "So woe to those who pray." alone can mislead a child; suggest "So woe to those who pray carelessly," (al-Mukhtasar also reads 4-5 together). |
| 107:5 | 5 | الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ | … لا يقيمونها على وجهها، ولا يؤدونها في وقتها | **فهم يغفلون عنها، فلا يُصلُّونها كما يجب، ولا في وقتها.** | Those who are heedless of their prayer. |  |
| 107:6 | 6 | الَّذِينَ هُمْ يُرَاءُونَ | الذين هم يتظاهرون بأعمال الخير مراءاة للناس | **وهم الذين يعملون الخيرَ ليراهم الناس، لا لله.** | Those who make a show of it. | «لا لله» from al-Mukhtasar («لا يخلصون العمل لله»). |
| 107:7 | 7 | وَيَمْنَعُونَ الْمَاعُونَ | ويمنعون إعارة ما لا تضر إعارته من الآنية وغيرها … | **ويمنعون غيرَهم من استعارة الأشياء البسيطة، كأواني البيت، مع أنها لا تضرُّهم.** | And they withhold small kindnesses. | EN "small kindnesses" agrees. |

### Al-Kawthar

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 108:1 | 1 | إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ | إنا أعطيناك -أيها النبي- الخير الكثير في الدنيا والآخرة، ومن ذلك نهر الكوثر في الجنة … | **أعطى اللهُ النبيَّ ﷺ خيراً كثيراً جداً في الدنيا وفي الآخرة، ومن هذا الخير نهرُ الكوثر في الجنة.** | Indeed, We have given you al-Kawthar (abundance). | SCHOLAR: the model line with ONE word added («وفي الآخرة» for «والآخرة»). Verbatim, it trips the checker: «في الدنيا والآخرة ومن» is a 4-word run of 3:45 (a common phrase, but the rule is mechanical). Approve this form, or whitelist the phrase for this unit. |
| 108:2 | 2 | فَصَلِّ لِرَبِّكَ وَانْحَرْ | فأخلص لربك صلاتك كلها، واذبح ذبيحتك له وعلى اسمه وحده | **فاشكر الله على هذا الخير: صلِّ له وحده، واذبح أضحيتك لله وحده.** | So pray to your Lord and sacrifice. | Scholar's model line, verbatim. |
| 108:3 | 3 | إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ | إن مبغضك ومبغض ما جئت به من الهدى والنور، هو المنقطع أثره، المقطوع من كل خير | **والذي يكره النبيَّ ﷺ هو المقطوع من كل خير.** | Indeed, the one who hates you — he is the one cut off. | Scholar's model line, verbatim. |

### Al-Kafirun

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 109:1 | 1 | قُلْ يَا أَيُّهَا الْكَافِرُونَ | قل -أيها الرسول- للذين كفروا بالله ورسوله: يا أيها الكافرون بالله | **يأمر اللهُ النبيَّ ﷺ أن يخاطب الذين كفروا بالله ورسوله.** | Say: O you who disbelieve! | Indirect speech: no «قل» framing, no vocative quote. |
| 109:2 | 2 | لَا أَعْبُدُ مَا تَعْبُدُونَ | لا أعبد ما تعبدون من الأصنام والآلهة الزائفة | **فيُخبرهم أنه لا يعبد الأصنامَ والآلهةَ الباطلة التي يعبدونها.** | I do not worship what you worship. |  |
| 109:3 | 3 | وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ | ولا أنتم عابدون ما أعبد من إله واحد، هو الله رب العالمين المستحق وحده للعبادة | **وأنهم لا يعبدون الإلهَ الواحد الذي يعبده، وهو اللهُ ربُّ العالمين.** | Nor are you worshippers of what I worship. |  |
| 109:4 | 4 | وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ | ولا أنا عابد ما عبدتم من الأصنام والآلهة الباطلة | **ولن يعبد النبيُّ ﷺ أبداً الأصنامَ التي عبدوها.** | Nor will I be a worshipper of what you worship. |  |
| 109:5 | 5 | وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ | ولا أنتم عابدون مستقبلا ما أعبد. وهذه الآية نزلت في أشخاص بأعيانهم من المشركين، قد علم الله أنهم لا يؤمنون أبدًا | **وهم كذلك لن يعبدوا في المستقبل الإلهَ الذي يعبده، وقد نزلت هذه الآية في أناسٍ معيَّنين علم اللهُ أنهم لن يؤمنوا.** | Nor will you be worshippers of what I worship. | Keeps Muyassar's note that the ayah is about particular people, so that a child does not read it as "no unbeliever can ever believe". Scholar may drop the second clause if he prefers a shorter line. |
| 109:6 | 6 | لَكُمْ دِينُكُمْ وَلِيَ دِينِ | لكم دينكم الذي أصررتم على اتباعه، ولي ديني الذي لا أبغي غيره | **لهم دينُهم الذي أصرّوا عليه، وللنبيِّ ﷺ دينُه الذي لا يريد غيرَه.** | For you is your religion, and for me is my religion. |  |

### An-Nasr

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 110:1 | 1 | إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ | إذا تمَّ لك -أيها الرسول- النصر على كفار قريش، وتم لك فتح «مكة … | **إذا نصر اللهُ نبيَّه ﷺ على كفار قريش، وفتح له مكة،** | When the help of Allah and the victory come. | Ends with a comma: cards 2-3 complete it, as the EN does. |
| 110:2 | 2 | وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا | ورأيت الكثير من الناس يدخلون في الإسلام جماعات جماعات | **ورأى الناسَ يُسلمون جماعاتٍ بعد جماعات،** | And you see the people entering the religion of Allah in crowds. |  |
| 110:3 | 3 | فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا | إذا وقع ذلك فتهيأ للقاء ربك بالإكثار من التسبيح بحمده والإكثار من استغفاره، إنه كان كثير التوبة على المسبحين والمستغفرين، يتوب عليهم ويرحمهم ويقبل توبتهم | **فليُكثِرْ من تسبيح الله وحمده، ومن طلب المغفرة منه، فالله يقبل توبةَ عباده كثيراً ويرحمهم.** | Then glorify the praises of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance. | SCHOLAR: Muyassar says this is to prepare to meet his Lord (the Prophet's approaching death). The line leaves that out, as the EN does. Confirm, or add «استعداداً للقاء ربه». |

### Al-Masad

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 111:1 | 1 | تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ | خسرت يدا أبي لهب وشقي بإيذائه رسول الله محمدا صلى الله عليه وسلم، وقد تحقق خسران أبي لهب | **خسر أبو لهب وخابت أعمالُه، لأنه كان يؤذي النبيَّ ﷺ، وقد تحقَّق خسرانُه.** | May the hands of Abu Lahab perish, and may he perish. | Warning surah, tied to the deed (harming the Prophet ﷺ). EN CHECK (minor): EN "May the hands ... perish" is a supplication; Muyassar reads it as a statement that came true ("he lost, and his loss came to pass"). Both are known readings; EN may stay. |
| 111:2 | 2 | مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ | ما أغنى عنه ماله وولده، فلن يَرُدَّا عنه شيئًا من عذاب الله إذا نزل به | **لم ينفعه مالُه ولا أولادُه، ولن يدفعوا عنه عقابَ الله.** | His wealth and what he earned did not help him. | EN CHECK (minor): Muyassar reads «ما كسب» as his children; EN "what he earned" is literal. Optional EN: "His wealth and his children did not help him." |
| 111:3 | 3 | سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ | سيدخل نارًا جهنم ذات اللَّهب المشتعل … | **وسيدخل يومَ القيامة ناراً مشتعلة، جزاءَ أذاه للنبيِّ ﷺ.** | He will enter a Fire of blazing flame. | «جزاء أذاه» ties the warning to the deed, from Muyassar 111:1. |
| 111:4 | 4 | وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ | … هو وامرأته التي كانت تحمل الشوك، فتطرحه في طريق النبي صلى الله عليه وسلم؛ لأذيَّته | **وستدخلها معه زوجتُه، التي كانت تحمل الشوك وترميه في طريق النبيِّ ﷺ لتؤذيه.** | And his wife, the carrier of firewood. | EN "carrier of firewood" is literal; the line gives Muyassar's meaning (thorns in his path). Compatible. |
| 111:5 | 5 | فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ | في عنقها حبل محكم الفَتْلِ مِن ليف شديد خشن … | **وفي عنقها حبلٌ قويٌّ مفتول من ليفٍ خشن.** | Around her neck is a rope of palm fibre. | Muyassar's description of what is done with the rope in the Fire is left out (not graphic, rule 6). |

### Al-Ikhlas

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 112:1 | 1 | قُلْ هُوَ اللَّهُ أَحَدٌ | قل -أيها الرسول-: هو الله المتفرد بالألوهية والربوبية والأسماء والصفات، لا يشاركه أحد فيها | **يأمر اللهُ النبيَّ ﷺ أن يُعلن أن الله واحدٌ لا شريك له، لا إلهَ غيره.** | Say: He is Allah, the One. | «لا إله غيره» from al-Mukhtasar. |
| 112:2 | 2 | اللَّهُ الصَّمَدُ | الله الذي كَمُل في صفات الشَّرَف والمجد والعظمة، الذي يقصده الخلائق في قضاء الحوائج والرغائب | **اللهُ هو الكاملُ في كل صفاته، وإليه يلجأ كلُّ الخلق ليقضي حاجاتهم.** | Allah, the Eternal Refuge. | Not the 2-word ayah «الله الصمد». |
| 112:3 | 3 | لَمْ يَلِدْ وَلَمْ يُولَدْ | ليس له ولد ولا والد ولا صاحبة | **ليس للهِ ولدٌ، وليس له والدٌ، ولا زوجة.** | He does not give birth, nor was He born. | «ولا زوجة» is Muyassar's «ولا صاحبة»; EN does not mention it but does not contradict it. |
| 112:4 | 4 | وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ | ولم يكن له مماثلا ولا مشابهًا أحد من خلقه، لا في أسمائه ولا في صفاته، ولا في أفعاله … | **ولا يُشبهه أحدٌ من خلقه، لا في أسمائه، ولا في صفاته، ولا في أفعاله.** | And there is none comparable to Him. |  |

### Al-Falaq

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 113:1 | 1 | قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ | قل -أيها الرسول-: أعوذ وأعتصم برب الفلق، وهو الصبح | **يأمر اللهُ النبيَّ ﷺ أن يحتمي ويستجير بربِّ الفلق، أي ربِّ الصبح.** | Say: I seek refuge in the Lord of the daybreak. | Indirect speech; «الفلق» is the key word, explained. |
| 113:2 | 2 | مِن شَرِّ مَا خَلَقَ | من شر جميع المخلوقات وأذاها | **يحتمي بالله من شرِّ كلِّ المخلوقات وأذاها.** | From the evil of what He created. | Avoids «من شر ما خلق». |
| 113:3 | 3 | وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ | ومن شر ليل شديد الظلمة إذا دخل وتغلغل، وما فيه من الشرور والمؤذيات | **ومن شرِّ الليل حين يشتدُّ ظلامُه، وما فيه من أشياءَ مؤذية.** | And from the evil of the darkness when it settles. |  |
| 113:4 | 4 | وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ | ومن شر الساحرات اللاتي ينفخن فيما يعقدن من عُقَد بقصد السحر | **ومن شرِّ الساحرات اللواتي ينفخن في العُقَد ليسحرن الناس.** | And from the evil of those who blow on knots. | EN CHECK (minor): EN "those who blow on knots" does not say why; optional EN "...blow on knots to do magic". |
| 113:5 | 5 | وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ | ومن شر حاسد مبغض للناس إذا حسدهم على ما وهبهم الله من نعم، وأراد زوالها عنهم … | **ومن شرِّ الحاسد الذي يكره ما أعطى اللهُ الناسَ من نِعَم، ويتمنّى زوالها.** | And from the evil of the envier when he envies. |  |

### An-Nas

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 114:1 | 1 | قُلْ أَعُوذُ بِرَبِّ النَّاسِ | قل -أيها الرسول-: أعوذ وأعتصم برب الناس، القادر وحده على ردِّ شر الوسواس | **يأمر اللهُ النبيَّ ﷺ أن يحتمي ويستجير بربِّ الناس، القادرِ وحده على دفع شرِّ الوسواس.** | Say: I seek refuge in the Lord of mankind. |  |
| 114:2 | 2 | مَلِكِ النَّاسِ | ملك الناس المتصرف في كل شؤونهم، الغنيِّ عنهم | **اللهُ هو المَلِك الذي يملك الناسَ جميعاً، ويُدبِّر كلَّ شؤونهم، ولا يحتاج إليهم.** | The King of mankind. | Avoids the 2-word ayah «ملك الناس». |
| 114:3 | 3 | إِلَٰهِ النَّاسِ | إله الناس الذي لا معبود بحق سواه | **وهو المعبودُ الحقُّ للناس، فلا يستحق العبادةَ أحدٌ سواه.** | The God of mankind. | Avoids the 2-word ayah «إله الناس». |
| 114:4 | 4 | مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ | من أذى الشيطان الذي يوسوس عند الغفلة، ويختفي عند ذكر الله | **من شرِّ الشيطان الذي يُوسوس للإنسان حين يغفل، ويختبئ حين يذكر الإنسانُ اللهَ.** | From the evil of the sneaking whisperer. | «الوسواس الخناس» explained, not said. |
| 114:5 | 5 | الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ | الذي يبثُّ الشر والشكوك في صدور الناس | **وهو الذي يُلقي الشرَّ والشكوكَ في قلوب الناس.** | Who whispers into the hearts of mankind. |  |
| 114:6 | 6 | مِنَ الْجِنَّةِ وَالنَّاسِ | من شياطين الجن والإنس | **وهذا الموسوِس يكون من شياطين الجن، ومن شياطين الإنس.** | From among the jinn and mankind. |  |

### Ayat al-Kursi (2:255)

| surah:ayah | card | the ayah (on screen) | al-Muyassar (verbatim) | proposed child line | current EN meaning line | notes |
|---|---|---|---|---|---|---|
| 2:255 | 1 | اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ | الله الذي لا يستحق الألوهية والعبودية إلا هو، الحيُّ الذي له جميع معاني الحياة الكاملة كما يليق بجلاله، القائم على كل شيء … | **اللهُ وحده يستحق العبادة، وهو القائمُ على كل شيء، الحيُّ حياةً كاملةً تليق بجلاله.** | Allah — there is no god except Him, the Ever-Living, the Sustainer of all. | Attributes affirmed as Muyassar does (rule 5). «الحي» kept as the key word. Does not use «لا إله إلا هو» here, since on this card it would be the ayah's own opening. Ends on «بجلاله»: ending on «كل شيء» made a run of 40:62 with the explanation's opening «لا إله إلا هو». |
| 2:255 | 2 | لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ | … لا تأخذه سِنَة أي: نعاس، ولا نوم … | **اللهُ لا ينعس ولا ينام أبداً.** | Neither drowsiness overtakes Him nor sleep. |  |
| 2:255 | 3 | لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ | … كل ما في السماوات وما في الأرض ملك له … | **يملك اللهُ وحده السماواتِ والأرضَ وكلَّ ما فيهما.** | To Him belongs whatever is in the heavens and whatever is on the earth. |  |
| 2:255 | 4 | مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ | … ولا يتجاسر أحد أن يشفع عنده إلا بإذنه … | **لا يستطيع أحدٌ أن يشفع عند الله، أي يطلب منه الخيرَ لغيره، إلا إذا أذِن اللهُ له.** | Who is there that can intercede with Him except by His permission? | «يشفع» explained inside the sentence (rule 4). |
| 2:255 | 5 | يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ | … يعلم ما بين أيدي الخلائق من الأمور المستقبلة، وما خلفهم من الأمور الماضية … | **يعلم اللهُ ما سيحدث للخلق في المستقبل، وما حدث لهم في الماضي.** | He knows what is before them and what is behind them. |  |
| 2:255 | 6 | وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ | … ولا يَطَّلعُ أحد من الخلق على شيء من علمه إلا بما أعلمه الله وأطلعه عليه … | **ولا يعرف أحدٌ من الخلق شيئاً من علم الله، إلا ما علَّمه اللهُ إياه.** | And they encompass nothing of His knowledge except what He wills. |  |
| 2:255 | 7 | وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ | … وسع كرسيه السماوات والأرض، والكرسي: هو موضع قدمي الرب -جل جلاله- ولا يعلم كيفيته إلا الله سبحانه … | **كرسيُّ الله أوسعُ من السماوات والأرض، ولا يعلم كيفيَّتَه إلا الله.** | His Kursi extends over the heavens and the earth. | As the scholar ruled: the Kursi is vaster than the heavens and the earth; not "knowledge", not "throne". «ولا يعلم كيفيته إلا الله» is Muyassar's own guard against likening. Muyassar's definition («موضع قدمي الرب») is left out for the age; SCHOLAR to confirm. NB english_mokhtasar renders Kursi as "Throne"; EN on the page says "Kursi", which is right. |
| 2:255 | 8 | وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ | … ولا يثقله سبحانه حفظهما، وهو العلي بذاته وصفاته على جميع مخلوقاته، الجامع لجميع صفات العظمة والكبرياء … | **ولا يُتعبه حفظُ السماوات والأرض، وهو العليُّ فوق جميع خلقه، العظيمُ الذي له كلُّ صفات العظمة.** | And their protection does not tire Him. And He is the Most High, the Most Great. | Attributes as Muyassar (العلو above all creation; all attributes of greatness). |

## Basmala header (optional, not a verse card)

On the 20 non-Fatiha pages and on Ayat al-Kursi, the basmala header also shows «بسم الله الرحمن
الرحيم» as its "translation". It is not voiced. The scholar's NOTE in Round 3, 2 A asks for the same
treatment. Proposed line, the same on every page (clean under the checker):

**نبدأ قراءةَ السورة باسم الله، ونطلب عونَه، وهو الرحمن الذي وسِعت رحمتُه كلَّ الخلق، الرحيمُ بالمؤمنين.**

On Ayat al-Kursi, «السورة» would need to be «الآية».

## Next steps (after approval only)

1. Put each approved line into the `data-ar` of its card's `.translation`, in the same commit
   for the 22 pages. The vowelled ayah stays on the card above it.
2. Fix the 3 explanation hits listed above, then run `verify-no-recitation.py` with
   `AR_VERSE_AUDIO = true` in a working copy: it must pass.
3. Turn the flag on, render the 148 AR verse mp3s through `ram-gate`, run the Whisper sweep with
   `--transcripts`, and install.
4. Add the credit line from `UI/scripts/data/tafsir/SOURCES.md` to the surah pages.
