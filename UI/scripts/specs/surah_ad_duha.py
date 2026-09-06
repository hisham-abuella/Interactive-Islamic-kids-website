# -*- coding: utf-8 -*-
"""Content spec for Surah Ad-Duha (93). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-ad-duha',
    desc='Learn Surah Ad-Duha for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah Ad-Duha',
    title_ar='سورة الضحى',
    sub_en='The Morning Light - الضحى',
    sub_ar='الضحى',
    icon='🌅',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='ycB6o_WxERA',
    video_intro_en='Eleven verses of comfort, from morning light to a promise — listen and repeat!',
    video_intro_ar='إحدى عشرة آية من الطمأنينة، من ضوء الضحى إلى وعدٍ جميل — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah Ad-Duha',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة الضحى',
    results_en='Allah has not forgotten you. He never does.',
    results_ar='لم ينسك الله. ولن ينساك أبداً.',

    badges=[
        ('📿 11 Verses', '📿 ١١ آية'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('🌅 A Promise of Comfort', '🌅 وعدٌ بالطمأنينة'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah Ad-Duha Special?', '🌟 لماذا سورة الضحى مميزة؟'),
            body=[
                ('Surah Ad-Duha is chapter number <strong>93</strong> of the Quran, with '
                 '<strong>11 verses</strong>.',
                 'سورة الضحى هي السورة رقم <strong>٩٣</strong> في القرآن، وفيها '
                 '<strong>١١ آية</strong>.'),
                ('<em>"Ad-Duha"</em> is the <strong>bright morning light</strong> — that hour when '
                 'the sun is well up and the whole world is warm and clear.',
                 '<em>"الضحى"</em> هو <strong>ضوء الصباح</strong> — تلك الساعة التي ترتفع فيها '
                 'الشمس فيصير العالم كله دافئاً واضحاً.'),
                ('Allah begins by swearing an oath by that light, and by the quiet night — and then '
                 'says something to His Prophet ﷺ that anyone who has ever felt alone needs to hear.',
                 'يبدأ الله بالقسم بذلك الضوء وبالليل الساكن، ثم يقول لنبيه ﷺ كلمةً يحتاج أن '
                 'يسمعها كل من شعر يوماً بالوحدة.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('🕊️ The Day the Words Stopped', '🕊️ اليوم الذي توقّف فيه الوحي'),
            body=[
                ('For a while, no revelation came to the Prophet ﷺ. No new verses. Just silence. '
                 'People who disliked him started saying his Lord had left him.',
                 'مضت مدة لم ينزل فيها الوحي على النبي ﷺ. لا آيات جديدة. صمت فقط. فقال من '
                 'يكرهونه إن ربه قد تركه.'),
                ('Then this surah came down, and the very first thing it says is: <strong>your Lord '
                 'has not left you, and He is not angry with you</strong>.',
                 'فنزلت هذه السورة، وأول ما فيها: <strong>ما ودّعك ربك وما قلى</strong> — أي ما '
                 'تركك ولا غضب عليك.'),
                dict(items=[
                    ('🌅 The morning <strong>always</strong> comes', '🌅 الصباح <strong>آتٍ</strong> لا محالة'),
                    ('🌙 Even the quiet night is <strong>from Him</strong>', '🌙 وحتى الليل الساكن <strong>منه سبحانه</strong>'),
                    ('💛 Silence is <strong>not</strong> abandonment', '💛 والصمت <strong>ليس</strong> تركاً'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('🤲 Three Things He Already Did for You', '🤲 ثلاثة أعطاكها الله من قبل'),
            body=[
                ('Instead of only promising the future, Allah reminds His Prophet ﷺ of his own past. '
                 'You were an orphan — He sheltered you. You did not yet know the way — He guided '
                 'you. You had little — He gave you enough.',
                 'بدل أن يعده بالمستقبل فقط، يذكّر الله نبيه ﷺ بماضيه هو. كنت يتيماً فآواك، ولم '
                 'تكن تعرف الطريق فهداك، وكنت فقيراً فأغناك.'),
                ('It is a beautiful way to comfort someone: <em>look at what has already been done '
                 'for you</em>. The One who carried you then is the same One carrying you now.',
                 'وهي أجمل طريقة للطمأنة: <em>انظر إلى ما صُنع بك من قبل</em>. فالذي حملك حينها '
                 'هو الذي يحملك الآن.'),
            ],
            badges=[
                ('🏠 An orphan — sheltered', '🏠 يتيماً — فآوى'),
                ('🧭 Not knowing — guided', '🧭 ضالاً — فهدى'),
                ('🌾 In need — made rich enough', '🌾 عائلاً — فأغنى'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('💝 And Then: Pass It On', '💝 ثم: أعطِ كما أُعطيت'),
            body=[
                ('The surah does not stop at comfort. It turns it into work. You were an orphan, so '
                 '<strong>never be harsh with an orphan</strong>. You were in need, so <strong>never '
                 'push away someone who asks</strong>. You were given, so <strong>talk about what '
                 'you were given</strong>.',
                 'ولا تقف السورة عند الطمأنة، بل تجعلها عملاً. كنت يتيماً، فـ<strong>لا تقهر '
                 'يتيماً</strong>. وكنت محتاجاً، فـ<strong>لا تنهر سائلاً</strong>. وأُعطيت، '
                 'فـ<strong>حدّث بنعمة ربك</strong>.'),
                ('That is the whole shape of the surah: Allah was kind to you, so be kind with '
                 'someone else.',
                 'وهذا هو بناء السورة كله: أحسن الله إليك، فأحسِن إلى غيرك.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='وَالضُّحَىٰ',
            tl='Wad-duha',
            tr_en='"By the morning light."',
            tr_ar='"والضحى"',
            ex_en='Allah swears by the bright part of the morning — the warm, clear light after the '
                  'sun has climbed. A picture of things being <strong>good again</strong>.',
            ex_ar='يقسم الله بضوء الصباح المرتفع — الضوء الدافئ الواضح بعد ارتفاع الشمس. صورةٌ '
                  'لعودة الأمور <strong>إلى الخير</strong>.',
        ),
        dict(
            ar='وَاللَّيْلِ إِذَا سَجَىٰ',
            tl='Wal-layli idha saja',
            tr_en='"And by the night when it grows still."',
            tr_ar='"والليل إذا سجى"',
            ex_en='And by the night — not a scary night, a <strong>calm</strong> one, gone quiet and '
                  'settled. Both the light and the dark belong to Allah.',
            ex_ar='ويقسم بالليل — لا ليلاً مخيفاً، بل ليلاً <strong>هادئاً</strong> قد سكن واستقرّ. '
                  'فالنور والظلمة كلاهما لله.',
        ),
        dict(
            ar='مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
            tl='Ma wadda\'aka Rabbuka wa ma qala',
            tr_en='"Your Lord has not left you, nor is He displeased with you."',
            tr_ar='"ما ودّعك ربك وما قلى"',
            ex_en='Here is the answer to the whole worry. He has <strong>not</strong> said goodbye, '
                  'and He is <strong>not</strong> angry. Two fears, both put to rest in one line.',
            ex_ar='وهنا جواب القلق كله. ما <strong>ودّعك</strong>، وما <strong>غضب عليك</strong>. '
                  'خوفان يطمئن عليهما في سطر واحد.',
        ),
        dict(
            ar='وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ',
            tl='Wa lal-akhiratu khayrul-laka minal-ula',
            tr_en='"And the next life is better for you than this first one."',
            tr_ar='"وللآخرة خير لك من الأولى"',
            ex_en='Whatever is hard right now is the <em>first</em> part. What comes after is better '
                  '— and it lasts.',
            ex_ar='فما يشقّ عليك الآن هو <em>الأولى</em>، وما بعدها خير منها — وهي باقية.',
        ),
        dict(
            ar='وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
            tl='Wa lasawfa yu\'teeka Rabbuka fatarda',
            tr_en='"And your Lord is going to give you, until you are pleased."',
            tr_ar='"ولسوف يعطيك ربك فترضى"',
            ex_en='Not just "He will give you" — He will keep giving <strong>until you are happy '
                  'with it</strong>. Some scholars called this the most hopeful verse in the Quran.',
            ex_ar='ليس "سيعطيك" فحسب، بل يعطيك <strong>حتى ترضى</strong>. وقد سمّى بعض العلماء هذه '
                  'الآية أرجى آية في القرآن.',
        ),
        dict(
            ar='أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ',
            tl='Alam yajidka yateeman fa-awa',
            tr_en='"Did He not find you an orphan, and give you shelter?"',
            tr_ar='"ألم يجدك يتيماً فآوى"',
            ex_en='The Prophet ﷺ lost his father before he was born and his mother when he was six. '
                  'And Allah <strong>made a home for him</strong> every single time.',
            ex_ar='فقد النبي ﷺ أباه قبل أن يولد، وأمه وهو ابن ست سنين. ومع ذلك <strong>هيّأ الله '
                  'له مأوى</strong> في كل مرة.',
        ),
        dict(
            ar='وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
            tl='Wa wajadaka dallan fahada',
            tr_en='"And find you not yet knowing the way, and guide you?"',
            tr_ar='"ووجدك ضالاً فهدى"',
            ex_en='Before the Quran came, he did not yet know all that Allah would teach him. Then '
                  'Allah <strong>showed him the way</strong> — and through him, showed everyone.',
            ex_ar='قبل نزول القرآن لم يكن يعلم ما سيعلّمه الله إياه، فـ<strong>هداه الله</strong> '
                  '— وهدى به الناس جميعاً.',
        ),
        dict(
            ar='وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ',
            tl='Wa wajadaka \'a-ilan fa-aghna',
            tr_en='"And find you in need, and make you rich enough?"',
            tr_ar='"ووجدك عائلاً فأغنى"',
            ex_en='He had little, and Allah gave him enough. The real richness the Prophet ﷺ taught '
                  'about was <strong>a heart that is content</strong>.',
            ex_ar='كان قليل ذات اليد فأغناه الله. والغنى الحقيقي الذي علّمه النبي ﷺ هو '
                  '<strong>غنى القلب</strong>.',
        ),
        dict(
            ar='فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ',
            tl='Fa-ammal-yateema fala taqhar',
            tr_en='"So as for the orphan, do not be harsh with him."',
            tr_ar='"فأما اليتيم فلا تقهر"',
            ex_en='You know what it feels like — so never make a child who has lost a parent feel '
                  'small. <strong>Be gentle with them, always.</strong>',
            ex_ar='أنت تعرف هذا الشعور — فلا تُشعر طفلاً فقد أباه أو أمه بالضعف أبداً. '
                  '<strong>كن رفيقاً به دائماً.</strong>',
        ),
        dict(
            ar='وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ',
            tl='Wa ammas-sa-ila fala tanhar',
            tr_en='"And as for the one who asks, do not turn him away harshly."',
            tr_ar='"وأما السائل فلا تنهر"',
            ex_en='Whether someone asks for help or asks a question, <strong>do not snap at them</strong>. '
                  'If you have nothing to give, give a kind word.',
            ex_ar='سواء سألك أحد حاجة أو سألك سؤالاً، <strong>فلا تنهره</strong>. وإن لم تجد ما '
                  'تعطيه، فأعطه كلمة طيبة.',
        ),
        dict(
            ar='وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
            tl='Wa amma bini\'mati Rabbika fahaddith',
            tr_en='"And as for the blessing of your Lord, speak about it."',
            tr_ar='"وأما بنعمة ربك فحدّث"',
            ex_en='Talk about the good Allah has given you — not to show off, but to '
                  '<strong>thank Him out loud</strong> so others remember Him too.',
            ex_ar='تحدّث بما أنعم الله به عليك — لا فخراً، بل <strong>شكراً بصوت مسموع</strong> '
                  'ليتذكّر غيرك ربه أيضاً.',
        ),
    ],

    quiz=[
        dict(
            q=('What does "Ad-Duha" mean?', 'ماذا تعني كلمة "الضحى"؟'),
            options=[
                ('The last hour before sunset', 'آخر ساعة قبل غروب الشمس', False),
                ('The bright light of morning', 'ضوء الصباح حين ترتفع الشمس', True),
                ('The middle of a rainy night', 'منتصف ليلة ماطرة', False),
                ('The first star to appear', 'أول نجم يظهر في السماء', False),
            ],
        ),
        dict(
            q=('Why was this surah revealed?', 'لماذا نزلت هذه السورة؟'),
            options=[
                ('To announce a long journey ahead', 'لتعلن عن سفر طويل قادم', False),
                ('To comfort the Prophet ﷺ when revelation paused',
                 'لتطمئن النبي ﷺ حين توقّف الوحي', True),
                ('To describe the gardens of Paradise', 'لتصف حدائق الجنة ونعيمها', False),
                ('To teach the times of the five prayers', 'لتعلّم أوقات الصلوات الخمس', False),
            ],
        ),
        dict(
            q=('What three things does Allah remind the Prophet ﷺ of?',
               'بأي ثلاثة أمور يذكّر الله نبيه ﷺ؟'),
            options=[
                ('Sheltered, guided, and given enough', 'آواه وهداه وأغناه', True),
                ('The moon, the stars and the sunrise', 'القمر والنجوم وشروق الشمس', False),
                ('Reading, writing and counting well', 'القراءة والكتابة والحساب', False),
                ('Three journeys he made as a young man', 'ثلاث رحلات سافرها في شبابه', False),
            ],
        ),
        dict(
            q=('What does the surah tell us to do for others?', 'بماذا تأمرنا السورة تجاه غيرنا؟'),
            options=[
                ('Keep every blessing entirely to ourselves', 'أن نحتفظ بكل نعمة لأنفسنا وحدنا', False),
                ('Be gentle with orphans and those who ask', 'أن نرفق باليتيم وبمن يسألنا', True),
                ('Speak only to people we already know', 'ألا نكلّم إلا من نعرفهم من قبل', False),
                ('Wait until we are grown to help anyone', 'أن ننتظر حتى نكبر لنساعد أحداً', False),
            ],
        ),
    ],

    reflect_h_en='💬 The Most Hopeful Verse',
    reflect_h_ar='💬 أرجى آية',
    reflect=[
        ('When the Prophet ﷺ was told <em>"your Lord is going to give you, until you are pleased,"</em> '
         'it was a promise with no limit put on it. He would not simply be given something — he would '
         'be given until nothing was missing.',
         'حين قيل للنبي ﷺ <em>"ولسوف يعطيك ربك فترضى"</em> كان وعداً بلا حدّ. لم يكن سيُعطى شيئاً '
         'فحسب، بل يُعطى حتى لا يبقى شيء ينقصه.'),
        ('For a child, the lesson is smaller and just as real: a hard day is not Allah forgetting '
         'you. The morning is coming.',
         'وللطفل درس أصغر وصادق مثله: اليوم الصعب ليس نسياناً من الله. فالصباح آتٍ.'),
    ],

    facts=[
        ('It is surah number <strong>93</strong> in the Quran', 'هي السورة رقم <strong>٩٣</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('It came after a <strong>pause</strong> in revelation', 'نزلت بعد <strong>فترة</strong> انقطع فيها الوحي'),
        ('<em>Duha</em> is the <strong>late-morning</strong> light', '<em>الضحى</em> هو ضوء <strong>وقت الصباح المرتفع</strong>'),
        ('There is a <strong>voluntary prayer</strong> named after it', 'وهناك <strong>صلاة نافلة</strong> باسمها'),
        ('It moves from <strong>comfort</strong> to <strong>kindness</strong>', 'تنتقل من <strong>الطمأنة</strong> إلى <strong>الإحسان</strong>'),
    ],

    tips=[
        dict(icon='2️⃣', h=('Two Halves', 'نصفان'),
             p=('Verses 1-8 are Allah speaking about His care. Verses 9-11 are what to do about it.',
                'الآيات ١-٨ عن رعاية الله، والآيات ٩-١١ عمّا نفعله نحن.')),
        dict(icon='🔁', h=('Three That Rhyme', 'ثلاث متشابهات'),
             p=('Verses 6, 7 and 8 all follow the same shape: He found you… so He gave you…',
                'الآيات ٦ و٧ و٨ على نسق واحد: وجدك… فأعطاك…')),
        dict(icon='🌅', h=('Learn It at Sunrise', 'احفظها عند الشروق'),
             p=('Read it in the morning light it is named after, and the meaning arrives with it.',
                'اقرأها في ضوء الصباح الذي سُمّيت به، فيأتيك المعنى معه.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='When was a time you felt sad, and something good came right after?',
    ask_ar='متى شعرت بالحزن ثم جاءك بعده خير مباشرة؟',
    recap_en='Allah did not forget you then, and He has not forgotten you now.',
    recap_ar='لم ينسك الله حينها، ولم ينسك الآن.',

    prev='surah-az-zalzalah.html',
    prev_en='← Surah Az-Zalzalah',
    prev_ar='السابق: سورة الزلزلة',
    next='surah-ash-sharh.html',
    next_en='Surah Ash-Sharh →',
    next_ar='التالي: سورة الشرح',
)
