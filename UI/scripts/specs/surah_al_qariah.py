# -*- coding: utf-8 -*-
"""Content spec for Surah Al-Qari'ah (101). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-al-qariah',
    desc="Learn Surah Al-Qari'ah for kids: Arabic, transliteration, verse-by-verse meaning, "
         "fun facts, memorization tips and a quiz.",
    title_en="Surah Al-Qari'ah",
    title_ar='سورة القارعة',
    sub_en='The Striking Hour - القارعة',
    sub_ar='القارعة',
    icon='⚖️',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='ypST44Kg-ek',
    video_intro_en='Eleven verses, two pictures and one set of scales — listen and repeat!',
    video_intro_ar='إحدى عشرة آية، وصورتان، وميزان — استمع وردّد!',
    quiz_intro_en="Answer these questions about Surah Al-Qari'ah",
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة القارعة',
    results_en='Every good deed goes on the scale. Add one today.',
    results_ar='كل حسنة تُوضع في الميزان. فزِد اليوم واحدة.',

    badges=[
        ('📿 11 Verses', '📿 ١١ آية'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('⚖️ Deeds Are Weighed', '⚖️ الأعمال توزن'),
    ],

    intro=[
        dict(
            h2=("🌟 Why is Surah Al-Qari'ah Special?", '🌟 لماذا سورة القارعة مميزة؟'),
            body=[
                ("Surah Al-Qari'ah is chapter number <strong>101</strong> of the Quran, with "
                 '<strong>11 verses</strong>.',
                 'سورة القارعة هي السورة رقم <strong>١٠١</strong> في القرآن، وفيها '
                 '<strong>١١ آية</strong>.'),
                ('<em>"Al-Qari\'ah"</em> comes from a word meaning <strong>to knock or strike</strong>. '
                 'It is one of the names of the Last Day — the Day that knocks on everything at once.',
                 '<em>"القارعة"</em> من القرع، وهو <strong>الضرب الشديد</strong>. وهي اسم من أسماء '
                 'يوم القيامة — اليوم الذي يقرع كل شيء دفعة واحدة.'),
                ('What makes it a good surah for a child is not the Day itself. It is '
                 '<strong>the scales</strong> at the end, which turn something huge into something '
                 'a child can hold: what you do is weighed, so what you do matters.',
                 'وليس اليوم نفسه هو ما يجعلها سورة نافعة للطفل، بل <strong>الموازين</strong> في '
                 'آخرها، إذ تحوّل الأمر العظيم إلى ما يمسكه الطفل: عملك يُوزن، فعملك ذو قدر.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('🦋 Two Pictures You Will Not Forget', '🦋 صورتان لا تُنسيان'),
            body=[
                ('The Quran does not explain that Day with an argument. It gives you '
                 '<strong>two pictures</strong>, and lets them do the work.',
                 'لا يشرح القرآن ذلك اليوم بحجة، بل يعطيك <strong>صورتين</strong> ويدع '
                 'الصورتين تتكلمان.'),
                ('People will be like <strong>scattered moths</strong> — small, everywhere at once, '
                 'flying without a plan. And the mountains, the heaviest things you know, will be '
                 'like <strong>fluffed-up wool</strong>, light enough to blow away.',
                 'يكون الناس <strong>كالفراش المبثوث</strong> — صغاراً منتشرين يطيرون بلا وجهة. '
                 'وتكون الجبال، وهي أثقل ما تعرف، <strong>كالعهن المنفوش</strong>، خفيفة تطير '
                 'مع الريح.'),
                dict(items=[
                    ('🦋 People like <strong>scattered moths</strong>', '🦋 الناس <strong>كالفراش المبثوث</strong>'),
                    ('🏔️ Mountains like <strong>carded wool</strong>', '🏔️ والجبال <strong>كالعهن المنفوش</strong>'),
                    ('💫 Everything heavy becomes <strong>light</strong>', '💫 وكل ثقيل يصير <strong>خفيفاً</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('⚖️ The Scales', '⚖️ الموازين'),
            body=[
                ('Then the surah does something surprising. After making the mountains weigh '
                 'nothing, it says <strong>your deeds have weight</strong>.',
                 'ثم تصنع السورة أمراً عجيباً. بعد أن جعلت الجبال لا تزن شيئاً، تقول إن '
                 '<strong>لأعمالك وزناً</strong>.'),
                ('One person\'s scale is <em>heavy</em> — and he is in a life that pleases him. '
                 'Another\'s is <em>light</em>. The whole difference is what was put on it, a deed '
                 'at a time.',
                 'فهذا <em>ثقلت</em> موازينه فهو في عيشة راضية، وذاك <em>خفّت</em> موازينه. والفرق '
                 'كله فيما وُضع فيها، عملاً بعد عمل.'),
                ('So the biggest things in creation weigh nothing, and a kind word weighs something. '
                 'That is the lesson, and it fits in one sentence.',
                 'فأعظم ما في الخلق لا يزن شيئاً، والكلمة الطيبة تزن. وهذا هو الدرس، ويسعه سطر '
                 'واحد.'),
            ],
            badges=[
                ('🪶 Mountains: weightless', '🪶 الجبال: لا وزن لها'),
                ('⚖️ Good deeds: heavy', '⚖️ والحسنات: ثقيلة'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('🌱 What Goes On the Scale', '🌱 ماذا يُوضع في الميزان'),
            body=[
                ('The Prophet ﷺ said that <strong>good character</strong> is the heaviest thing '
                 'placed on the scale, and that even <strong>smiling at your brother</strong> is a '
                 'charity. Nothing there is out of a child\'s reach.',
                 'قال النبي ﷺ إن <strong>حسن الخلق</strong> أثقل ما يُوضع في الميزان، وإن '
                 '<strong>تبسّمك في وجه أخيك</strong> صدقة. وليس في ذلك ما يعجز عنه طفل.'),
                ('So this is not a surah to be frightened by. It is a surah that says: '
                 '<strong>the small good thing you did today had weight</strong>, and it was '
                 'written down.',
                 'فليست سورة تُخيف، بل سورة تقول: <strong>الخير الصغير الذي فعلته اليوم له '
                 'وزن</strong>، وقد كُتب.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='الْقَارِعَةُ',
            tl="Al-Qari'ah",
            tr_en='"The Striking Hour."',
            tr_ar='"القارعة"',
            ex_en='One word, standing alone. The surah opens by <strong>naming it and stopping</strong>, '
                  'the way you would say a name that needs no sentence around it.',
            ex_ar='كلمة واحدة وحدها. تفتتح السورة بـ<strong>تسميتها ثم تسكت</strong>، كما تذكر '
                  'اسماً لا يحتاج إلى جملة حوله.',
        ),
        dict(
            ar='مَا الْقَارِعَةُ',
            tl="Mal-Qari'ah",
            tr_en='"What is the Striking Hour?"',
            tr_ar='"ما القارعة"',
            ex_en='Now a question — and it is Allah asking it. The question itself is telling you '
                  '<strong>this is bigger than the word</strong>.',
            ex_ar='ثم سؤال — والسائل هو الله. والسؤال نفسه يخبرك أن '
                  '<strong>الأمر أعظم من الكلمة</strong>.',
        ),
        dict(
            ar='وَمَا أَدْرَاكَ مَا الْقَارِعَةُ',
            tl="Wa ma adraka mal-Qari'ah",
            tr_en='"And what can make you know what the Striking Hour is?"',
            tr_ar='"وما أدراك ما القارعة"',
            ex_en='Three verses, and the name has been said <strong>three times</strong>. The Quran '
                  'is slowing you down before it shows you anything.',
            ex_ar='ثلاث آيات، وقد ذُكر الاسم <strong>ثلاث مرات</strong>. يُبطئك القرآن قبل أن '
                  'يريك شيئاً.',
        ),
        dict(
            ar='يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ',
            tl='Yawma yakoonun-nasu kal-farashil-mabthooth',
            tr_en='"The Day people will be like scattered moths,"',
            tr_ar='"يوم يكون الناس كالفراش المبثوث"',
            ex_en='The first picture. Moths around a lamp at night — <strong>small, many, and going '
                  'in every direction</strong> at once.',
            ex_ar='الصورة الأولى. فراشٌ حول مصباح في الليل — <strong>صغار كثيرون يذهبون في كل '
                  'اتجاه</strong> في وقت واحد.',
        ),
        dict(
            ar='وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ',
            tl="Wa takoonul-jibalu kal-'ihnil-manfoosh",
            tr_en='"And the mountains will be like carded wool."',
            tr_ar='"وتكون الجبال كالعهن المنفوش"',
            ex_en='The second picture, and the stranger one. <em>Carded wool</em> is wool pulled '
                  'apart until it floats. <strong>The heaviest thing you know, gone light.</strong>',
            ex_ar='الصورة الثانية، وهي أعجب. و<em>العهن المنفوش</em> صوف نُفش حتى طار. '
                  '<strong>أثقل ما تعرف، وقد صار خفيفاً.</strong>',
        ),
        dict(
            ar='فَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ',
            tl='Fa-amma man thaqulat mawazeenuh',
            tr_en='"Then as for one whose scales are heavy,"',
            tr_ar='"فأما من ثقلت موازينه"',
            ex_en='And here is the turn. The mountains weigh nothing now — but '
                  '<strong>a person\'s deeds still weigh something</strong>.',
            ex_ar='وهنا المنعطف. فالجبال لا تزن شيئاً الآن — ومع ذلك '
                  '<strong>لأعمال الإنسان وزن</strong>.',
        ),
        dict(
            ar='فَهُوَ فِي عِيشَةٍ رَاضِيَةٍ',
            tl="Fahuwa fee 'eeshatir-radiyah",
            tr_en='"He will be in a pleasant life."',
            tr_ar='"فهو في عيشة راضية"',
            ex_en='The Arabic says the <em>life itself</em> is pleased. '
                  '<strong>A life with nothing left in it to wish were different.</strong>',
            ex_ar='تقول العربية إن <em>العيشة نفسها</em> راضية. '
                  '<strong>حياةٌ لم يبقَ فيها ما تتمنى لو كان غير ذلك.</strong>',
        ),
        dict(
            ar='وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ',
            tl='Wa amma man khaffat mawazeenuh',
            tr_en='"But as for one whose scales are light,"',
            tr_ar='"وأما من خفّت موازينه"',
            ex_en='Not someone who did nothing wrong and lost anyway — someone who '
                  '<strong>put too little on the scale</strong> while there was still time.',
            ex_ar='وليس من لم يخطئ ثم خسر، بل من <strong>لم يضع في الميزان ما يكفي</strong> '
                  'والوقت باقٍ.',
        ),
        dict(
            ar='فَأُمُّهُ هَاوِيَةٌ',
            tl='Fa-ummuhu hawiyah',
            tr_en='"His refuge will be an abyss."',
            tr_ar='"فأمه هاوية"',
            ex_en='The Arabic uses the word for the place you always return to. '
                  '<strong>What you kept choosing becomes where you end up.</strong>',
            ex_ar='استعملت العربية لفظ المرجع الذي تأوي إليه. '
                  '<strong>فما تُديم اختياره يصير مآلك.</strong>',
        ),
        dict(
            ar='وَمَا أَدْرَاكَ مَا هِيَهْ',
            tl='Wa ma adraka ma hiyah',
            tr_en='"And what can make you know what it is?"',
            tr_ar='"وما أدراك ما هيه"',
            ex_en='The question comes back, exactly as it did at the start. The surah '
                  '<strong>frames itself with the same words</strong>.',
            ex_ar='ويعود السؤال كما جاء في الأول. فالسورة '
                  '<strong>تُحيط نفسها باللفظ نفسه</strong>.',
        ),
        dict(
            ar='نَارٌ حَامِيَةٌ',
            tl='Narun hamiyah',
            tr_en='"A blazing Fire."',
            tr_ar='"نار حامية"',
            ex_en='Two words, and the surah ends. Said once, as the Quran says it — and the thing '
                  'to carry away is the verse before it: <strong>fill the scale while you can</strong>.',
            ex_ar='كلمتان، وتنتهي السورة. تُقال مرة واحدة كما قالها القرآن — والذي تحمله معك هو '
                  'ما قبلها: <strong>املأ الميزان ما دمت تستطيع</strong>.',
        ),
    ],

    quiz=[
        dict(
            q=('What does "Al-Qari\'ah" mean?', 'ماذا تعني كلمة "القارعة"؟'),
            options=[
                ('A long road through the desert', 'طريق طويل في الصحراء', False),
                ('The one that strikes and knocks', 'التي تقرع وتضرب بشدة', True),
                ('A gentle breeze before the rain', 'نسيم لطيف قبل المطر', False),
                ('The gate of a very large city', 'باب مدينة كبيرة', False),
            ],
        ),
        dict(
            q=('What will people be like on that Day?', 'بم يشبَّه الناس في ذلك اليوم؟'),
            options=[
                ('Like stones sitting very still', 'كالحجارة الساكنة لا تتحرك', False),
                ('Like scattered moths', 'كالفراش المبثوث', True),
                ('Like tall trees in a garden', 'كالأشجار الباسقة في بستان', False),
                ('Like ships crossing a wide sea', 'كالسفن تعبر بحراً واسعاً', False),
            ],
        ),
        dict(
            q=('What happens to the mountains?', 'ماذا يحدث للجبال؟'),
            options=[
                ('They grow taller than they were', 'تصير أعلى مما كانت', False),
                ('They become like fluffed-up wool', 'تصير كالعهن المنفوش', True),
                ('They turn into rivers of water', 'تتحول إلى أنهار من ماء', False),
                ('They stay exactly as they are', 'تبقى كما هي تماماً', False),
            ],
        ),
        dict(
            q=('What makes a person\'s scales heavy?', 'ما الذي يُثقل موازين الإنسان؟'),
            options=[
                ('Owning the largest house in town', 'أن يملك أكبر بيت في البلد', False),
                ('The good deeds they did', 'الأعمال الصالحة التي عملها', True),
                ('Being taller and stronger than others', 'أن يكون أطول وأقوى من غيره', False),
                ('Knowing the most people by name', 'أن يعرف أكثر الناس بأسمائهم', False),
            ],
        ),
    ],

    reflect_h_en='💬 The Heaviest Thing on the Scale',
    reflect_h_ar='💬 أثقل ما في الميزان',
    reflect=[
        ('The Prophet ﷺ said that nothing is placed on the scale heavier than good character, and '
         'he told his companions not to think little of any good deed — even meeting your brother '
         'with a cheerful face.',
         'قال النبي ﷺ إنه ما من شيء أثقل في الميزان من حسن الخلق، وقال لأصحابه: لا تحقرنّ من '
         'المعروف شيئاً، ولو أن تلقى أخاك بوجه طلق.'),
        ('So the surah that empties the mountains of their weight fills the scale with things a '
         'child can do before bedtime: telling the truth, sharing, and being easy to live with.',
         'فالسورة التي أذهبت وزن الجبال ملأت الميزان بما يستطيعه الطفل قبل أن ينام: الصدق، '
         'والمشاركة، وحسن العشرة.'),
    ],

    facts=[
        ('It is surah number <strong>101</strong> in the Quran', 'هي السورة رقم <strong>١٠١</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('<em>Al-Qari\'ah</em> is one of the <strong>names of the Last Day</strong>',
         '<em>القارعة</em> اسم من <strong>أسماء يوم القيامة</strong>'),
        ('The name is repeated <strong>three times</strong> at the start',
         'والاسم مكرّر <strong>ثلاث مرات</strong> في أولها'),
        ('<em>Carded wool</em> is wool <strong>pulled apart until it floats</strong>',
         '<em>العهن المنفوش</em> صوف <strong>نُفش حتى طار</strong>'),
        ('It is the <strong>scales</strong> that decide, not size', 'و<strong>الموازين</strong> هي الفيصل لا الحجم'),
    ],

    tips=[
        dict(icon='3️⃣', h=('Three of the Same', 'ثلاث متماثلة'),
             p=('The first three verses are all the same word, so the opening comes almost free.',
                'الآيات الثلاث الأولى كلمة واحدة، فيأتيك المطلع بلا كلفة تقريباً.')),
        dict(icon='🦋', h=('Two Pictures', 'صورتان'),
             p=('Moths, then wool. Hold the two images and verses 4 and 5 come back on their own.',
                'الفراش ثم الصوف. امسك الصورتين تعُد إليك الآيتان ٤ و٥ وحدهما.')),
        dict(icon='⚖️', h=('Heavy, Then Light', 'ثقيل ثم خفيف'),
             p=('Verses 6-9 are a matched pair: whoever is heavy… whoever is light…',
                'الآيات ٦-٩ زوجان متقابلان: من ثقلت… ومن خفّت…')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='If your good deeds today went on a scale, what would you put on it?',
    ask_ar='لو وُضعت حسناتك اليوم في ميزان، فماذا كنت ستضع فيه؟',
    recap_en='Mountains will weigh nothing that Day. A kind word will weigh something.',
    recap_ar='الجبال لا تزن شيئاً يومئذ. والكلمة الطيبة تزن.',

    prev='surah-at-takathur.html',
    prev_en='← Surah At-Takathur',
    prev_ar='السابق: سورة التكاثر',
    next='ayat-al-kursi.html',
    next_en='Ayat al-Kursi →',
    next_ar='التالي: آية الكرسي',
)
