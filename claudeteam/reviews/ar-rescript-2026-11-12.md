# Arabic re-script for five narration units (2026-11-12)

Author: arabic-language-reviewer. Status: **PROPOSAL, awaiting islamic-content-scholar**.
Nothing in the JSON or HTML has been edited. No audio generated.

Why: the owner heard all five Arabic takes (Fish S2-Pro clone) as bad. Common causes in the old
text: long sentences joined with commas, no tashkeel, ه/ح and ع/ء sitting side by side
(تهتز/هزة, اعترفا بخطئهما, يرحمهما), and jussive forms (يُطِع).

Method: short sentences (most under 8 words), full tashkeel, words picked to keep ه away from
ح and ع away from ء. All five pass `scripts/verify-no-recitation.py --text ... --lang ar`
("clean"; exit 0). As a control, the checker flags «رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي» (exit 1).

---

## 1. surah-az-zalzalah/ar/verse-1 (`final_ar`, ar-meaning-lines.json; also `data-ar` on the translation, surah-az-zalzalah.html:134)

- English: "When the earth is shaken with its final earthquake."
- Old: يومَ القيامة تهتزُّ الأرضُ هزةً شديدةً جداً.
- **New: يَوْمَ القِيَامَةِ، تَرْتَجُّ الأَرْضُ رَجًّا شَدِيدًا.**
- Source: al-Muyassar «إذا رُجَّت الأرض رجًّا شديدًا»; «يوم القيامة» from al-Mukhtasar. This is closer to al-Muyassar than the old line was.
- Voice: removes تهتز/هزة, the two words where Whisper heard ح for ه. ر-ج has no ه or ح.
- Scholar note: «الأرض رجًّا» also appears in 56:4 (only a 2-word overlap, under the limit). If you prefer a word the voice and the child both know, a backup is «يَوْمَ القِيَامَةِ، تَرْتَجِفُ الأَرْضُ رَجْفَةً شَدِيدَةً.» It also passes the checker in spirit, but I have not run it.

## 2. surah-at-tin/ar/verse-5 (`final_ar`; also surah-at-tin.html:193)

- English: "Then We returned him to the lowest of the low."
- Old: ثم إن لم يُطِع الإنسانُ اللهَ ويتَّبع رسلَه، يكون مصيرُه إلى النار.
- **New: ثُمَّ الإِنْسَانُ الَّذِي يَعْصِي اللهَ وَرُسُلَهُ، يَكُونُ مَصِيرُهُ إِلَى النَّارِ.**
- Source: al-Muyassar «ثم رددناه إلى النار إن لم يطع الله، ويتبع الرسل». "Disobeys Allah and His messengers" means the same as "does not obey Allah and follow the messengers". The line keeps the old line's al-Muyassar reading and narrator voice. It does not use "We".
- Voice: drops the jussive يُطِع and the إن لم + jussive pair. The indicative يَعْصِي follows الَّذِي, so ع has no hamza beside it.

## 3. prophet-musa slide 13, Musa's dua (`ar[13].script`, voice-scripts-data.json)

- English: "Here is a beautiful dua Prophet Musa made. Its words are written for you on the screen. It means: My Lord, open my chest for me, and make my task easy for me. He made this dua before facing Pharaoh. Learn the words with someone you love, and say it before something hard, like a test or speaking in class!"
- Old: هذا دعاء جميل دعا به النبي موسى: سأل الله أن يشرح له صدره، أي يملأ قلبه طمأنينة وشجاعة، وأن ييسّر له أمره، أي يسهّل عليه مهمته. دعا به قبل أن يواجه فرعون. تعلّم كلماته المكتوبة أمامك، وادعُ به قبل أي أمر صعب، مثل الامتحان أو التحدث أمام الصف!
- **New:**
  هَذَا دُعَاءٌ جَمِيلٌ لِلنَّبِيِّ مُوسَى. كَلِمَاتُهُ مَكْتُوبَةٌ لَكَ عَلَى الشَّاشَةِ. طَلَبَ مُوسَى مِنْ رَبِّهِ أَنْ يُوَسِّعَ صَدْرَهُ، وَيَمْلَأَ قَلْبَهُ شَجَاعَةً. وَطَلَبَ مِنْهُ أَنْ يُسَهِّلَ عَلَيْهِ مُهِمَّتَهُ. قَالَهُ مُوسَى قَبْلَ أَنْ يَلْقَى فِرْعَوْنَ. تَعَلَّمِ الكَلِمَاتِ مَعَ مَنْ تُحِبُّ. وَقُلْهَا قَبْلَ أَيِّ أَمْرٍ صَعْبٍ، مِثْلَ الِامْتِحَانِ، أَوِ الكَلَامِ أَمَامَ الصَّفِّ!
- The narrator gives the meaning in reported speech. Nothing is quoted from 20:25-26. «يُوَسِّعَ صَدْرَهُ» follows the tafsir wording «وسِّع لي صدري». I worked from memory because 20:25 is not in our local tafsir files, so **scholar, please confirm**. "Open my chest" then gets a child's explanation: «يَمْلَأَ قَلْبَهُ شَجَاعَةً». This matches the page's Arabic meaning line (story-prophet-musa.html:233).
- Parity: adds "with someone you love" (مَعَ مَنْ تُحِبُّ), which the old Arabic left out. Also mentions "on the screen".
- Voice: one long sentence with two «أي» glosses becomes seven short ones. Removes the cluster «يشرح له صدره». Cuts the repeated دعاء/دعا/ادعُ (ع beside ء). التحدث becomes الكلام, which drops a ح.

## 4. prophet-adam slide 7, the mistake (`ar[7].script`)

- English: "Shaytan whispered to Adam and Hawa and tricked them. They slipped and made a mistake: they ate from the forbidden tree. As soon as they did, they realized what they had done. Shaytan is always trying to trick us. We must be careful and say A'udhu billahi min ash-shaytan ir-rajim to seek protection from him."
- Old: وسوس الشيطان لآدم وحواء وخدعهما، فأزلّهما الشيطان فأخطآ وأكَلا من الشجرة المحرمة. وما إن أكَلا منها حتى أدرَكا ما فعلا. الشيطان يحاول دائماً خداعنا. يجب أن نكون حذرين ونقول أعوذ بالله من الشيطان الرجيم.
- **New:**
  وَسْوَسَ الشَّيْطَانُ لِآدَمَ وَحَوَّاءَ، وَخَدَعَهُمَا. فَوَقَعَا فِي خَطَأٍ، وَأَكَلَا مِنَ الشَّجَرَةِ المَمْنُوعَةِ. وَمُبَاشَرَةً، عَرَفَا مَا فَعَلَا. الشَّيْطَانُ يُحَاوِلُ دَائِمًا أَنْ يَخْدَعَنَا. يَجِبُ أَنْ نَكُونَ حَذِرِينَ، وَأَنْ نَقُولَ: أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ.
- Framing: Shaytan is the one who deceives. Adam and Hawa together "fell into a mistake". Nobody is blamed alone, and there is no "sin passed down".
- Voice: removes «فأزلّهما» (said twice by implication, and a cluster), «فأخطآ» (a hamza-alef-madda pile-up) and «المحرمة» (ح). The awkward «وما إن ... حتى» becomes «وَمُبَاشَرَةً».
- The isti'adha is kept as the dhikr formula (whitelisted). The checker passes.

## 5. prophet-adam slide 8, asking forgiveness (`ar[8].script`)

- English: "Adam and Hawa felt very sorry. They turned to Allah and said: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers. And SubhanAllah - Allah forgave them! Allah is the Most Merciful!"
- Old: شعر آدم وحواء بالندم الشديد. فتوجَّهَا إلى الله واعترَفَا بخطئهما، وسألاه أن يغفر لهما ويرحمهما. وسبحان الله - غفر الله لهما! الله أرحم الراحمين!
- **New:**
  نَدِمَ آدَمُ وَحَوَّاءُ نَدَمًا كَبِيرًا. فَرَجَعَا إِلَى رَبِّهِمَا، وَقَالَا إِنَّهُمَا ظَلَمَا نَفْسَيْهِمَا. وَطَلَبَا مِنَ اللهِ المَغْفِرَةَ وَالرَّحْمَةَ. وَسُبْحَانَ اللهِ، غَفَرَ اللهُ لَهُمَا! اللهُ أَرْحَمُ الرَّاحِمِينَ!
- Framing: both repent, and Allah forgives both. The dua of 7:23 is reported, not quoted. «ظَلَمَا نَفْسَيْهِمَا» brings back the "wronged ourselves" idea that the old Arabic had flattened to "admitted their mistake".
- Parity gap (deliberate): the clause "we will surely be among the losers" is still left out, as it was in the old Arabic. Adding it would mean either a near-quote (من الخاسرين) or another long clause. Scholar, please say whether you want it. A possible addition: «وَعَرَفَا أَنَّهُمَا يَخْسَرَانِ بِدُونِ رَحْمَتِهِ.»
- Voice: removes «واعترفا بخطئهما» (ع-ء-ه cluster), «وسألاه» (ء+ه) and «ويرحمهما» (ح beside ه). The dash before «غفر» becomes a comma, because the model reads dashes unevenly.

---

## 1b. surah-az-zalzalah/ar/verse-1, explanation (the `data-ar` of the `.verse-explanation` <p>, UI/surah-az-zalzalah.html:137; there is no JSON copy)

A verse take is recorded as the meaning line, then `<break time="0.5s" />`, then this explanation, with tags removed (narrate-s2pro.py `units()`).

- English: "Not an ordinary earthquake — <strong>its own</strong> earthquake, the one the earth was always going to have. The whole ground, everywhere, at once."
- Old: ليست زلزلة عادية، بل &lt;strong&gt;زلزالها هي&lt;/strong&gt;، الذي كان لا بد أن يأتي. الأرض كلها، في كل مكان، في وقت واحد.
- **New (page markup):** `لَيْسَ هَذَا زِلْزَالًا عَادِيًّا. <strong>إِنَّهُ زِلْزَالُ الأَرْضِ الأَخِيرُ</strong>، الَّذِي لَا بُدَّ أَنْ يَأْتِيَ. فَتَرْتَجُّ الأَرْضُ كُلُّهَا، فِي كُلِّ مَكَانٍ، فِي وَقْتٍ وَاحِدٍ.`
- Meaning: al-Mukhtasar says this is the great shaking that comes to the earth on the Day of Judgement. «الأَخِيرُ» carries the English "final" and "always going to have". «تَرْتَجُّ» repeats al-Muyassar's word from unit 1, which ties the meaning line and the explanation together.
- Voice: «زلزلة» and «زلزالها هي» were two different ز-ل-ز-ل forms in a row. The new text uses one form, «زِلْزَال». It also drops «هي» straight after «ـها», a ه-ه pile-up. The old sentence that ran on with «بل ... الذي كان» is now three short ones. There is still no ح anywhere.
- No ayah run: «زِلْزَالُ الأَرْضِ» is not the ayah's wording, which is «زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا». verify-no-recitation (tags stripped) prints "clean", exit 0.
- `<strong>` is kept around one complete phrase, so the inline markup still works when the language is switched.

## 2b. surah-at-tin/ar/verse-5, explanation (the `data-ar` of the `.verse-explanation` <p>, UI/surah-at-tin.html:196; there is no JSON copy)

- English: "A person given every gift can still throw it away by choosing badly. <strong>How you were made is a gift; what you do with it is your choice.</strong>"
- Old: ومن أُعطي كل هبة قد يضيّعها بسوء اختياره. &lt;strong&gt;فحُسنُ خِلقتك هبةٌ من الله، وما تصنعه بها اختيارك.&lt;/strong&gt;
- **New (page markup):** `قَدْ يَنَالُ الإِنْسَانُ نِعَمًا كَثِيرَةً، ثُمَّ يُضَيِّعُهَا إِذَا اخْتَارَ طَرِيقًا سَيِّئًا. <strong>خَلَقَكَ اللهُ فِي أَجْمَلِ صُورَةٍ، وَهَذِهِ هَدِيَّةٌ مِنْهُ. وَمَا تَفْعَلُهُ بِهَا هُوَ اخْتِيَارُكَ.</strong>`
- Meaning: «فِي أَجْمَلِ صُورَةٍ» echoes al-Muyassar on 95:4 ("in the best form"). The new text does not use the ayah's own «أَحْسَنِ تَقْوِيمٍ». The risk this verse warns about (losing the gifts by a bad choice) matches unit 2's "the one who disobeys".
- Voice: removes «حُسْنُ خِلْقَتِك», where ح, س, ن, خ and ل come in a rush. It drops the passive «أُعطي» after «ومن», a hamza-ع clash, and «بسوء اختياره», where a hamza meets a hamzat wasl. «هبة» becomes «هَدِيَّة», a word children know. Every sentence now has 8 words or fewer.
- No ayah run: verify-no-recitation (tags stripped) prints "clean", exit 0.
- `<strong>` still wraps the closing moral, as it does in the English.

---

## Out of scope, but flagged
- Both surah explanations are now covered by 1b and 2b above.
- When approved, update in step: `final_ar` in UI/scripts/data/tafsir/ar-meaning-lines.json and the matching `data-ar` in surah-az-zalzalah.html:134 and surah-at-tin.html:193. Do this together so the page and the audio say the same thing. For Adam, the on-page Arabic `scene8Text` / `scene9Text1` in UI/translations.js can stay as is (they are page text, not audio), or be brought in line later.

---

## Scholar verdict (2026-11-12)

Reviewer: islamic-content-scholar. Read-only review; only this section was added.

How I checked:
- Tafsir: local `UI/scripts/data/tafsir/arabic_moyassar.json` and `arabic_mokhtasar.json` for 99:1 and 95:4-6. For 20:25-26, 7:20-23 and 2:36-37 I fetched the QuranEnc API (`/translation/aya/arabic_moyassar/...` and `arabic_mokhtasar`).
- Recitation: ran `scripts/verify-no-recitation.py --text ... --lang ar` on every proposed text, on the two optional variants, on 1 and 1b joined as one take, and on my two corrections. All print "clean", exit 0. I also ran my own scan against quran-simple from api.alquran.cloud, normalised, looking for 3-word overlaps (stricter than the 4-word rule). Units 1, 1b, 2, 2b, 3 and 5 have **no** 3-word overlap with any ayah. Unit 4's only overlaps are «بالله من الشيطان» and «من الشيطان الرجيم» (16:98, 3:36), and both sit inside the whitelisted isti'adha.
- None of the units presents anything as Allah's own speech. None uses "We" in Allah's voice.

### Unit 1: az-Zalzalah 99:1, meaning line: **APPROVE**
`يَوْمَ القِيَامَةِ، تَرْتَجُّ الأَرْضُ رَجًّا شَدِيدًا.`
- Faithful. al-Muyassar 99:1 says «إذا رُجَّت الأرض رجًّا شديدًا», and al-Mukhtasar says «...الذي يحدث لها يوم القيامة». The line is closer to the tafsir than the old one.
- **56:4 question.** 56:4 is «إِذَا رُجَّتِ الْأَرْضُ رَجًّا». The shared part is two words, «الأرض رجا», and the verb form is different (تَرْتَجُّ, not رُجَّتِ). It is far under the 4-word limit, and it is al-Muyassar's own wording. Both ayat describe the same Day-of-Judgement shaking, so no wrong meaning comes in with it. Not a concern.
- **ترتجف backup question.** Also acceptable. It passes the checker; I ran it: clean, exit 0. It shares only the root with 73:14 «يَوْمَ تَرْجُفُ الْأَرْضُ», which is not a word run. Keep تَرْتَجُّ as the first choice, because it is al-Muyassar's word and it ties to unit 1b. Use the backup, as written, only if the clone still mispronounces تَرْتَجُّ: `يَوْمَ القِيَامَةِ، تَرْتَجِفُ الأَرْضُ رَجْفَةً شَدِيدَةً.` If you switch, change «فَتَرْتَجُّ» in 1b to «فَتَرْتَجِفُ» in the same commit, so the take stays consistent.

### Unit 1b: az-Zalzalah 99:1, explanation: **APPROVE**
- «لَا بُدَّ أَنْ يَأْتِيَ» states that the Hour is certain, which is sound aqeedah.
- «زِلْزَالُ الأَرْضِ الأَخِيرُ» is a fair gloss of the English "final" and of al-Mukhtasar's «التحريك الشديد الذي يحدث لها يوم القيامة». al-Muyassar links it to the earth bringing out its dead, which is the resurrection, so "the last" does not over-claim.
- Not the ayah's wording (verified above). Grammar is correct: «الأَخِيرُ» agrees with «زِلْزَالُ».

### Unit 2: at-Tin 95:5, meaning line: **APPROVE WITH CHANGE**
The problem is aqeedah and age. al-Muyassar says «إن لم يطع الله، ويتبع الرسل». In context, with 95:6 «إلا الذين آمنوا», that is the person who refuses the messengers: not following the message at all. The proposed «الَّذِي يَعْصِي اللهَ وَرُسُلَهُ» says to a child, "whoever disobeys Allah goes to the Fire". Every child (and every believer) disobeys sometimes. That reading pushes toward the Khawarij position that a sinner is destined for the Fire, and it frightens a young child for no reason. "يعصي" and "لم يطع ويتبع" are **not** the same meaning here. Keep al-Muyassar's two verbs in the indicative. That also removes the jussive يُطِع the voice struggled with:

`ثُمَّ الإِنْسَانُ الَّذِي لَا يُطِيعُ اللهَ، وَلَا يَتَّبِعُ رُسُلَهُ، يَكُونُ مَصِيرُهُ إِلَى النَّارِ.`

(verify-no-recitation: clean, exit 0. No ع-ء clash: the hamza of «اللهَ» is a hamzat wasl and drops in connected speech.)

### Unit 2b: at-Tin, explanation: **APPROVE WITH CHANGE**
One word. «أَجْمَلِ صُورَةٍ» narrows the tafsir to good looks. al-Muyassar 95:4 says «في أحسن صورة», and al-Mukhtasar says «في أعدل خلق وأفضل صورة»: balance and soundness of the whole creation, not prettiness. Telling every child "Allah made you in the most beautiful form" also invites the wrong comparison for a child who does not feel beautiful, or who has a visible difference. Use al-Mukhtasar's «أَفْضَلِ», which also has no ح, so the voice reason for avoiding «أحسن» still holds:

`قَدْ يَنَالُ الإِنْسَانُ نِعَمًا كَثِيرَةً، ثُمَّ يُضَيِّعُهَا إِذَا اخْتَارَ طَرِيقًا سَيِّئًا. <strong>خَلَقَكَ اللهُ فِي أَفْضَلِ صُورَةٍ، وَهَذِهِ هَدِيَّةٌ مِنْهُ. وَمَا تَفْعَلُهُ بِهَا هُوَ اخْتِيَارُكَ.</strong>`

(Tags stripped, verify-no-recitation: clean, exit 0. «فِي أَفْضَلِ صُورَةٍ» shares no 2-word run with 95:4 «فِي أَحْسَنِ تَقْوِيمٍ».)

### Unit 3: Musa slide 13, dua of Ta-Ha 20:25-26: **APPROVE**
- **«يُوَسِّعَ صَدْرَهُ» is confirmed.** al-Muyassar on 20:25 (QuranEnc, `arabic_moyassar/20/25`) reads «قال موسى: رب وسِّع لي صدري، وسَهِّل لي أمري...». al-Mukhtasar reads «رب، وسّع لي صدري لأتحمّل الأذى». «يُسَهِّلَ عَلَيْهِ مُهِمَّتَهُ» matches «سَهِّل لي أمري».
- «وَيَمْلَأَ قَلْبَهُ شَجَاعَةً» is a fair child's gloss: an "expanded chest" means ease, courage and the strength to bear hardship, which is al-Mukhtasar's «لأتحمّل الأذى». The subject of يُوَسِّعَ and يَمْلَأَ is «رَبِّهِ», which is correct.
- It is reported speech in the third person, and nothing is quoted. No 3-word overlap with any ayah.
- Adab: the story gives «عليه السلام» on a prophet's first mention, as with Nuh and Yusuf. «النَّبِيِّ مُوسَى» on slide 13 is respectful and fine.
- Telling the child to say the dua from the screen is the child's own du'a, which is good. The no-recitation rule binds the synthetic voice, not the child.

### Unit 4: Adam slide 7, the mistake: **APPROVE**
- Faithful. al-Muyassar 2:36 says «فأوقعهما الشيطان في الخطيئة: بأن وسوس لهما حتى أكلا من الشجرة», and al-Muyassar 7:20 says «فألقى الشيطان لآدم وحواء وسوسة». «فَوَقَعَا فِي خَطَأٍ» follows that wording directly.
- The framing is sound. Shaytan is the deceiver. Adam and Hawwa share the act equally («وَقَعَا», «أَكَلَا», «عَرَفَا»). Hawwa is not blamed alone, and nothing suggests inherited sin. "Mistake" is the right register for a prophet in a children's story.
- «وَمُبَاشَرَةً، عَرَفَا مَا فَعَلَا» is a sound way to put the 7:22 «فلما ذاقا الشجرة بدت لهما سوآتهما» for this age. Leaving out the uncovering is a deliberate, appropriate deferral.
- The isti'adha is the whitelisted dhikr formula, said as the child's own words («وَأَنْ نَقُولَ»). Fine.
- Optional, not required: «المَمْنُوعَةِ» could be «الَّتِي نَهَاهُمَا اللهُ عَنْهَا» to make clear who forbade it. The slide context already makes that clear, so I am not requiring the change.

### Unit 5: Adam slide 8, repentance and forgiveness: **APPROVE WITH CHANGE** (add the optional sentence)
- Faithful. al-Muyassar 7:23 says «قال آدم وحواء: ربنا ظلمنا أنفسنا بالأكل من الشجرة، وإن لم تغفر لنا وترحمنا لنكونن ممن أضاعوا حظهم». «قَالَا إِنَّهُمَا ظَلَمَا نَفْسَيْهِمَا» reports this and does not quote it: «ظلمنا أنفسنا» does not appear as a run.
- Both repent and both are forgiven. The Quran makes the du'a dual (قَالَا, 7:23). 2:37 names Adam's repentance being accepted. That both were forgiven is the standard Sunni understanding, and it is fine to state it to children. No original sin.
- **Optional sentence: yes, include it.** It is faithful to al-Muyassar's «ممن أضاعوا حظهم» and al-Mukhtasar's «لنكوننّ من الخاسرين بإضاعتنا حظنا». It restores the parity gap with the English. It also carries the actual lesson: complete reliance on Allah's mercy. It is not a near-quote: it avoids «من الخاسرين», and with the sentence included the checker still prints clean, exit 0, with no 3-word overlap. Final text:

`نَدِمَ آدَمُ وَحَوَّاءُ نَدَمًا كَبِيرًا. فَرَجَعَا إِلَى رَبِّهِمَا، وَقَالَا إِنَّهُمَا ظَلَمَا نَفْسَيْهِمَا. وَطَلَبَا مِنَ اللهِ المَغْفِرَةَ وَالرَّحْمَةَ. وَعَرَفَا أَنَّهُمَا يَخْسَرَانِ بِدُونِ رَحْمَتِهِ. وَسُبْحَانَ اللهِ، غَفَرَ اللهُ لَهُمَا! اللهُ أَرْحَمُ الرَّاحِمِينَ!`

### Summary
| Unit | Verdict |
|---|---|
| 1 | APPROVE (تَرْتَجُّ preferred; ترتجف backup acceptable, changed together with 1b) |
| 1b | APPROVE |
| 2 | APPROVE WITH CHANGE: «لَا يُطِيعُ اللهَ، وَلَا يَتَّبِعُ رُسُلَهُ», not «يَعْصِي» |
| 2b | APPROVE WITH CHANGE: «أَفْضَلِ صُورَةٍ», not «أَجْمَلِ صُورَةٍ» |
| 3 | APPROVE («يُوَسِّعَ صَدْرَهُ» confirmed against al-Muyassar 20:25) |
| 4 | APPROVE |
| 5 | APPROVE WITH CHANGE: add «وَعَرَفَا أَنَّهُمَا يَخْسَرَانِ بِدُونِ رَحْمَتِهِ.» |

Implementation note (agreeing with the author): update `final_ar` in `UI/scripts/data/tafsir/ar-meaning-lines.json` and the matching `data-ar` (surah-az-zalzalah.html:134 and :137, surah-at-tin.html:193 and :196) in one commit. Re-run `scripts/verify-no-recitation.py` (the full run, not only `--text`) before generating audio. After recording, transcribe each take and run `--transcripts` on the transcriptions, because a voice clone can mangle a word into something closer to an ayah.
