# -*- coding: utf-8 -*-
"""Content spec for Surah Al-Humazah (104). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-al-humazah',
    desc='Learn Surah Al-Humazah for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah Al-Humazah',
    title_ar='سورة الهمزة',
    sub_en='The Slanderer - الهمزة',
    sub_ar='الهمزة',
    icon='🗣️',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='dRQVBCKiGz4',
    video_intro_en='Nine verses about words that hurt, and why they are never worth it — listen and repeat!',
    video_intro_ar='تسع آيات عن الكلمات التي تجرح، ولماذا لا تستحق أبداً — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah Al-Humazah',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة الهمزة',
    results_en='Use your words to build someone up today.',
    results_ar='اجعل كلامك اليوم يبني أحداً لا يهدمه.',

    badges=[
        ('📿 9 Verses', '📿 ٩ آيات'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('💬 Words Matter', '💬 الكلمة أمانة'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah Al-Humazah Special?', '🌟 لماذا سورة الهمزة مميزة؟'),
            body=[
                ('Surah Al-Humazah is chapter number <strong>104</strong> of the Quran, with '
                 '<strong>9 verses</strong>.',
                 'سورة الهمزة هي السورة رقم <strong>١٠٤</strong> في القرآن، وفيها '
                 '<strong>٩ آيات</strong>.'),
                ('It is about something children meet long before they meet anything else in this '
                 'part of the Quran: <strong>being made fun of</strong>, and making fun of others.',
                 'وهي عن أمر يعرفه الأطفال قبل أن يعرفوا سواه: <strong>أن يُسخر منك</strong>، وأن '
                 'تسخر من غيرك.'),
                ('Two words open it. A <em>humazah</em> is someone who tears people down to their '
                 'face — a gesture, a look, a laugh. A <em>lumazah</em> does it behind their back, '
                 'with a nickname or a whisper.',
                 'تبدأ بكلمتين. <em>الهمزة</em> من ينال من الناس في وجوههم — بإشارة أو نظرة أو '
                 'ضحكة. و<em>اللمزة</em> من يفعلها من ورائهم، بلقب أو همسة.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('💬 The Quran Takes Mockery Seriously', '💬 القرآن يأخذ السخرية على محمل الجدّ'),
            body=[
                ('Grown-ups often say <em>"they were only joking"</em>. Allah gave a whole surah to '
                 'this, which tells you how seriously He takes it.',
                 'كثيراً ما يقول الكبار <em>"إنما كانوا يمزحون"</em>. وقد أفرد الله لهذا سورة '
                 'كاملة، وفي ذلك ما يدلّك على قدر خطره عنده.'),
                ('A person who mocks is not brave and is not funny. Usually they are trying to feel '
                 'bigger by making someone else feel smaller — which never actually works.',
                 'والساخر ليس شجاعاً ولا ظريفاً. وإنما يريد غالباً أن يعظُم بتصغير غيره — وهذا لا '
                 'ينفعه أبداً.'),
                dict(items=[
                    ('👁️ <strong>Humazah</strong> — to their face', '👁️ <strong>الهمزة</strong> — في الوجه'),
                    ('🤫 <strong>Lumazah</strong> — behind their back', '🤫 <strong>اللمزة</strong> — من الخلف'),
                    ('💔 Both <strong>leave a mark</strong>', '💔 وكلاهما <strong>يترك أثراً</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('🪙 Counting It Over and Over', '🪙 يعدّه ويعيد عدّه'),
            body=[
                ('The next verses describe the same person: he gathers money and <em>counts it, and '
                 'counts it again</em>. The Arabic repeats on purpose — you can picture him going '
                 'back to it.',
                 'وتصف الآيات التالية هذا الرجل نفسه: يجمع المال <em>ويعدّه ويعيد عدّه</em>. '
                 'وتكرار العربية مقصود — حتى لتكاد تراه يعود إليه.'),
                ('And he <strong>thinks his money will make him last forever</strong>. That is the '
                 'link the surah is drawing: the person who looks down on others is usually the '
                 'person who thinks what he owns makes him better than them.',
                 'و<strong>يحسب أن ماله يخلّده</strong>. وهذا هو الرابط الذي تعقده السورة: من '
                 'يحتقر الناس هو غالباً من يظن أن ما يملكه يجعله خيراً منهم.'),
                ('It does not. Money is a thing Allah lent you, and lending is not the same as '
                 'owning.',
                 'وليس كذلك. فالمال شيء أعارك الله إياه، والعارية ليست ملكاً.'),
            ],
            badges=[
                ('🪙 He gathers it', '🪙 يجمعه'),
                ('🔢 He counts it', '🔢 ويعدّه'),
                ('⏳ It does not last', '⏳ ولا يبقى له'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('❤️ The Verse That Explains Everything', '❤️ الآية التي تفسّر كل شيء'),
            body=[
                ('The surah names a fire that <strong>reaches the hearts</strong>. Of everything it '
                 'could have said, it points at the heart.',
                 'وتذكر السورة ناراً <strong>تطّلع على الأفئدة</strong>. ومن بين كل ما كان يمكن أن '
                 'يُقال، أشارت إلى القلب.'),
                ('That is exactly where mockery lands. It is not the ears that a cruel nickname '
                 'hurts. So the surah answers the heart with the heart, and then stops — it does '
                 'not linger there.',
                 'وهذا موضع وقوع السخرية تماماً. فليست الأذن هي التي يجرحها اللقب القبيح. فقابلت '
                 'السورة القلب بالقلب ثم وقفت — ولم تُطِل.'),
                ('What a child should take away is not fear. It is this: <strong>your words reach '
                 'people\'s hearts, so choose them like they matter</strong>.',
                 'وليس الذي يأخذه الطفل خوفاً، بل هذا: <strong>كلامك يصل إلى قلوب الناس، فاخترْه '
                 'وأنت تعلم قدره</strong>.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ',
            tl='Waylul-likulli humazatil-lumazah',
            tr_en='"Woe to every slanderer and backbiter."',
            tr_ar='"ويل لكل همزة لمزة"',
            ex_en='Two kinds of unkind talk, named together: <strong>to someone\'s face</strong>, '
                  'and <strong>behind their back</strong>. The surah opens by refusing to treat '
                  'either as harmless.',
            ex_ar='نوعان من سوء القول، ذُكرا معاً: <strong>في الوجه</strong>، '
                  'و<strong>من وراء الظهر</strong>. وتفتتح السورة برفض أن يُعدّ أيّهما هيّناً.',
        ),
        dict(
            ar='الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ',
            tl='Alladhee jama\'a malanw-wa \'addadah',
            tr_en='"Who gathers wealth and counts it over."',
            tr_ar='"الذي جمع مالاً وعدّده"',
            ex_en='Gathering is not the problem — <strong>counting it over and over</strong> is. '
                  'His treasure has become the thing he thinks about most.',
            ex_ar='ليست المشكلة في الجمع، بل في أن <strong>يعدّه ويعيد عدّه</strong>. فقد صار '
                  'ماله أكثر ما يشغل قلبه.',
        ),
        dict(
            ar='يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ',
            tl='Yahsabu anna malahu akhladah',
            tr_en='"Thinking his wealth will make him live forever."',
            tr_ar='"يحسب أن ماله أخلده"',
            ex_en='He does not say it out loud — he just <em>lives</em> as if it were true. '
                  '<strong>No amount of anything keeps a person here.</strong>',
            ex_ar='لا يقولها بلسانه، لكنه <em>يعيش</em> كأنها حق. '
                  '<strong>ولا شيء يُبقي الإنسان في الدنيا مهما كثر.</strong>',
        ),
        dict(
            ar='كَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ',
            tl='Kalla layunbadhanna fil-hutamah',
            tr_en='"No! He will surely be thrown into the Crusher."',
            tr_ar='"كلا لينبذنّ في الحطمة"',
            ex_en='<em>Kalla</em> means <strong>no — that is not how it is</strong>. The word for '
                  'the Fire here means "the thing that breaks what is put in it".',
            ex_ar='<em>كلا</em> أي <strong>ليس الأمر كما ظنّ</strong>. واسم النار هنا معناه '
                  '"التي تحطم ما أُلقي فيها".',
        ),
        dict(
            ar='وَمَا أَدْرَاكَ مَا الْحُطَمَةُ',
            tl='Wa ma adraka mal-hutamah',
            tr_en='"And what can make you know what the Crusher is?"',
            tr_ar='"وما أدراك ما الحطمة"',
            ex_en='The Quran asks a question to make you stop and listen. It means: '
                  '<strong>this is beyond what you can picture</strong>.',
            ex_ar='يسأل القرآن ليوقفك ويستمع قلبك. ومعناه: '
                  '<strong>هذا فوق ما تتصوّره</strong>.',
        ),
        dict(
            ar='نَارُ اللَّهِ الْمُوقَدَةُ',
            tl='Narul-lahil-mooqadah',
            tr_en='"The kindled Fire of Allah,"',
            tr_ar='"نار الله الموقدة"',
            ex_en='It is named plainly, once, the way the Quran names it — and the surah does not '
                  'linger on it. <strong>The point is the choice that leads there.</strong>',
            ex_ar='تُسمّى صريحة، مرة واحدة، كما سمّاها القرآن — ولا تطيل السورة عندها. '
                  '<strong>فالمقصود هو الاختيار المؤدّي إليها.</strong>',
        ),
        dict(
            ar='الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ',
            tl='Allatee tattali\'u \'alal-af-idah',
            tr_en='"Which rises over the hearts."',
            tr_ar='"التي تطّلع على الأفئدة"',
            ex_en='Of all the words available, Allah chose <strong>the hearts</strong> — because '
                  'that is exactly where mocking words land in the person you aim them at.',
            ex_ar='ومن بين كل الألفاظ اختار الله <strong>الأفئدة</strong> — لأنها موضع وقوع '
                  'كلمة السخرية من الذي وجّهتها إليه.',
        ),
        dict(
            ar='إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ',
            tl='Innaha \'alayhim mu\'sadah',
            tr_en='"It will be closed over them,"',
            tr_ar='"إنها عليهم مؤصدة"',
            ex_en='Shut, like a door with no handle on the inside. A picture of '
                  '<strong>a choice that cannot be taken back later</strong>.',
            ex_ar='مغلقة، كباب لا مقبض له من الداخل. صورة '
                  '<strong>لاختيار لا يمكن الرجوع فيه بعد فوات الأوان</strong>.',
        ),
        dict(
            ar='فِي عَمَدٍ مُمَدَّدَةٍ',
            tl='Fee \'amadim-mumaddadah',
            tr_en='"In outstretched columns."',
            tr_ar='"في عمد ممدّدة"',
            ex_en='The surah ends here. It began with a person mocking someone weaker — and the '
                  'whole of it is a warning to <strong>never be that person</strong>.',
            ex_ar='وتنتهي السورة هنا. بدأت برجل يسخر ممن هو أضعف منه — وهي كلها تحذير من '
                  '<strong>أن تكون ذلك الرجل</strong>.',
        ),
    ],

    quiz=[
        dict(
            q=('What is this surah warning us about?', 'مِمّ تحذّرنا هذه السورة؟'),
            options=[
                ('Sleeping in and missing the morning', 'النوم عن الصباح وتفويته', False),
                ('Mocking people and speaking badly of them', 'السخرية من الناس والوقيعة فيهم', True),
                ('Travelling far away from your family', 'السفر بعيداً عن الأهل', False),
                ('Forgetting where you put your things', 'نسيان مواضع الأشياء', False),
            ],
        ),
        dict(
            q=('What is the difference between humazah and lumazah?',
               'ما الفرق بين الهمزة واللمزة؟'),
            options=[
                ('One is loud and the other is quiet', 'أحدهما بصوت عالٍ والآخر بصوت خافت', False),
                ('To their face, and behind their back', 'في الوجه، ومن وراء الظهر', True),
                ('One is a child and one is a grown-up', 'أحدهما طفل والآخر كبير', False),
                ('One happens at home, one at the market', 'أحدهما في البيت والآخر في السوق', False),
            ],
        ),
        dict(
            q=('What did the man wrongly think about his wealth?',
               'ماذا ظنّ الرجل في ماله خطأً؟'),
            options=[
                ('That he had not gathered enough of it yet', 'أنه لم يجمع منه ما يكفي بعد', False),
                ('That it would make him live forever', 'أنه يخلّده فلا يموت', True),
                ('That someone was going to steal it', 'أن أحداً سيسرقه منه', False),
                ('That he should give all of it away', 'أن عليه أن ينفقه كله', False),
            ],
        ),
        dict(
            q=('Why is it meaningful that the Fire reaches the hearts?',
               'لماذا كان ذكر أنها تطّلع على الأفئدة ذا معنى؟'),
            options=[
                ('Because hearts are the strongest part of us', 'لأن القلب أقوى ما فينا', False),
                ('Because that is where hurtful words land', 'لأن الكلمة الجارحة تقع هناك', True),
                ('Because it means the Fire is quite small', 'لأن ذلك يدل على صغر النار', False),
                ('Because only grown-up hearts are counted', 'لأن قلوب الكبار وحدها تُحسب', False),
            ],
        ),
    ],

    reflect_h_en='💬 "They Were Only Joking"',
    reflect_h_ar='💬 "إنما كانوا يمزحون"',
    reflect=[
        ('The Prophet ﷺ taught that a Muslim is someone other people are safe from — safe from his '
         'hand, and safe from his tongue. The tongue is named right beside the hand, as something '
         'that can do the same kind of damage.',
         'علّم النبي ﷺ أن المسلم من سلم الناس منه — من يده ولسانه. فذُكر اللسان إلى جانب اليد، '
         'لأنه يجرح مثل جرحها.'),
        ('So when a child says a nickname was only a joke, the question worth asking is not whether '
         'it was funny. It is whether the other person is still safe from you.',
         'فإذا قال الطفل إن اللقب كان مزاحاً، فليس السؤال أكان مضحكاً، بل أما زال صاحبه '
         'يأمنك.'),
    ],

    facts=[
        ('It is surah number <strong>104</strong> in the Quran', 'هي السورة رقم <strong>١٠٤</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('It names <strong>two</strong> kinds of hurtful talk', 'وتذكر <strong>نوعين</strong> من سوء القول'),
        ('<em>Addadah</em> means he <strong>counted it repeatedly</strong>',
         '<em>عدّده</em> أي <strong>أحصاه مرة بعد مرة</strong>'),
        ('The Fire here is named <strong>the Crusher</strong>', 'وسُمّيت النار هنا <strong>الحطمة</strong>'),
        ('Every verse ends on the same <strong>-ah</strong> sound', 'وكل آية تنتهي بالحرف <strong>نفسه</strong>'),
    ],

    tips=[
        dict(icon='🎵', h=('It Almost Rhymes Itself', 'تكاد تُقفّي نفسها'),
             p=('Nearly every verse ends on the same sound, so one verse pulls the next along.',
                'تكاد كل آية تنتهي بالفاصلة نفسها، فتجرّ الآية أختها.')),
        dict(icon='2️⃣', h=('Two Halves', 'نصفان'),
             p=('Verses 1-3 describe the person. Verses 4-9 answer what he thought.',
                'الآيات ١-٣ تصف الرجل، والآيات ٤-٩ ترد على ظنّه.')),
        dict(icon='❓', h=('Listen for the Question', 'أنصت للسؤال'),
             p=('"What can make you know…" sits in the middle and splits the surah in two.',
                '"وما أدراك ما…" في الوسط تماماً، تقسم السورة نصفين.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='Has anyone ever called you a name that stayed with you? How did it feel?',
    ask_ar='هل ناداك أحد يوماً بلقب بقي في نفسك؟ كيف كان شعورك؟',
    recap_en='Your words reach people\'s hearts. That is why Allah gave them a whole surah.',
    recap_ar='كلامك يصل إلى قلوب الناس. ولذلك أفرد الله له سورة كاملة.',

    prev='surah-at-tin.html',
    prev_en='← Surah At-Tin',
    prev_ar='السابق: سورة التين',
    next='surah-at-takathur.html',
    next_en='Surah At-Takathur →',
    next_ar='التالي: سورة التكاثر',
)
