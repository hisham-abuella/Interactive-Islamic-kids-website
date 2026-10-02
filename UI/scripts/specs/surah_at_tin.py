# -*- coding: utf-8 -*-
"""Content spec for Surah At-Tin (95). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-at-tin',
    desc='Learn Surah At-Tin for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah At-Tin',
    title_ar='سورة التين',
    sub_en='The Fig - التين',
    sub_ar='التين',
    icon='🫒',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='3YCJ1bs2BUs',
    video_intro_en='Eight verses that begin with fruit and end with the wisest of all judges — listen and repeat!',
    video_intro_ar='ثماني آيات تبدأ بالثمر وتنتهي بأحكم الحاكمين — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah At-Tin',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة التين',
    results_en='Allah made you in the finest form. Live like someone worth that.',
    results_ar='خلقك الله في أحسن تقويم. فعش كما يليق بذلك.',

    badges=[
        ('📿 8 Verses', '📿 ٨ آيات'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('✨ Made in the Finest Form', '✨ في أحسن تقويم'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah At-Tin Special?', '🌟 لماذا سورة التين مميزة؟'),
            body=[
                ('Surah At-Tin is chapter number <strong>95</strong> of the Quran, with '
                 '<strong>8 verses</strong>.',
                 'سورة التين هي السورة رقم <strong>٩٥</strong> في القرآن، وفيها '
                 '<strong>٨ آيات</strong>.'),
                ('It is the only surah that opens by swearing an oath by <strong>two fruits</strong> '
                 '— the fig and the olive.',
                 'وهي السورة الوحيدة التي تبدأ بالقسم بـ<strong>ثمرتين</strong> — التين والزيتون.'),
                ('Then it tells you the most encouraging thing anyone can hear about themselves: of '
                 'everything Allah made, <strong>you were made in the finest form</strong>.',
                 'ثم تخبرك بأجمل ما يمكن أن يُقال عنك: من بين كل ما خلق الله، '
                 '<strong>خُلقت أنت في أحسن تقويم</strong>.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('🗺️ Four Things Worth Swearing By', '🗺️ أربعة أقسم الله بها'),
            body=[
                ('The fig, the olive, Mount Sinai, and the safe city — Makkah. Two of them you can '
                 'eat; two of them you can stand on.',
                 'التين والزيتون وطور سينين والبلد الأمين — مكة. اثنان تأكلهما، واثنان تقف عليهما.'),
                ('Many scholars said the last two are places where Allah spoke to His prophets: '
                 'Sinai, where Musa عليه السلام heard Him, and Makkah, where the Quran came down to '
                 'Muhammad ﷺ.',
                 'وقال كثير من العلماء إن الأخيرين موضعان كلّم الله فيهما أنبياءه: طور سينين حيث '
                 'كلّم موسى عليه السلام، ومكة حيث نزل القرآن على محمد ﷺ.'),
                dict(items=[
                    ('🫐 The <strong>fig</strong> — sweet and full of goodness', '🫐 <strong>التين</strong> — حلوٌ نافع'),
                    ('🫒 The <strong>olive</strong> — food, oil and light', '🫒 <strong>الزيتون</strong> — طعامٌ وزيتٌ وضياء'),
                    ('⛰️ <strong>Mount Sinai</strong> — where Musa عليه السلام was spoken to', '⛰️ <strong>طور سينين</strong> — حيث كُلّم موسى عليه السلام'),
                    ('🕋 <strong>The safe city</strong> — Makkah', '🕋 <strong>البلد الأمين</strong> — مكة'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('✨ Made in the Finest Form', '✨ في أحسن تقويم'),
            body=[
                ('<em>Ahsani taqweem</em> means <strong>the best possible shape and balance</strong>. '
                 'Look at what you were given: hands that can write, a tongue that can comfort, a '
                 'mind that can choose.',
                 '<em>أحسن تقويم</em> معناه <strong>أحسن صورة وأتم اعتدال</strong>. انظر إلى ما '
                 'أُعطيت: يدان تكتبان، ولسانٌ يواسي، وعقلٌ يختار.'),
                ('Animals are beautiful too, but you were given something extra: you can decide what '
                 'kind of person to be. That is the gift — and the test.',
                 'والحيوان جميل أيضاً، لكنك أُعطيت زيادة: أن تقرر أي إنسان تكون. تلك هي الهبة — '
                 'وهي الاختبار.'),
            ],
            badges=[
                ('🧠 A mind that chooses', '🧠 عقلٌ يختار'),
                ('❤️ A heart that feels', '❤️ وقلبٌ يشعر'),
                ('🤲 Hands that can help', '🤲 ويدان تنفعان'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('⬇️ And What We Can Do With It', '⬇️ وماذا نصنع بها'),
            body=[
                ('The next verse is honest: a person given all that can still sink to '
                 '<strong>the lowest of the low</strong>. Being made beautifully does not '
                 'automatically make you good.',
                 'ثم تصدُقك الآية التالية: من أُعطي ذلك كله قد يهوي إلى <strong>أسفل '
                 'سافلين</strong>. فحسن الخلقة لا يجعلك صالحاً وحده.'),
                ('And then the way out, in one line: <strong>except those who believe and do good</strong>. '
                 'Faith and good deeds together — that is what keeps a person up where they were made '
                 'to be.',
                 'ثم يأتي المخرج في سطر واحد: <strong>إلا الذين آمنوا وعملوا الصالحات</strong>. '
                 'إيمانٌ وعملٌ معاً — بهما يبقى الإنسان في المكان الذي خُلق له.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='وَالتِّينِ وَالزَّيْتُونِ',
            tl='Wat-teeni waz-zaytoon',
            tr_en='"By the fig and the olive,"',
            tr_ar='"والتين والزيتون"',
            ex_en='Allah swears by two ordinary fruits. When Allah swears by something, He is telling '
                  'you to <strong>look at it properly</strong> — even a fig is a sign.',
            ex_ar='يقسم الله بثمرتين مألوفتين. وإذا أقسم الله بشيء فإنه يدعوك '
                  'أن <strong>تتأمله حق التأمل</strong> — فحتى التينة آية.',
        ),
        dict(
            ar='وَطُورِ سِينِينَ',
            tl='Wa Toori Seeneen',
            tr_en='"And Mount Sinai,"',
            tr_ar='"وطور سينين"',
            ex_en='The mountain where Allah spoke to <strong>Prophet Musa عليه السلام</strong>. A '
                  'plain rocky hill, made great by what happened on it.',
            ex_ar='الجبل الذي كلّم الله عنده <strong>نبيه موسى عليه السلام</strong>. جبلٌ صخري '
                  'عادي، عظُم بما جرى عليه.',
        ),
        dict(
            ar='وَهَٰذَا الْبَلَدِ الْأَمِينِ',
            tl='Wa hadhal-baladil-ameen',
            tr_en='"And this safe city,"',
            tr_ar='"وهذا البلد الأمين"',
            ex_en='Makkah, where the Kaaba stands. It is called <strong>safe</strong> because no one '
                  'is to be harmed there — not even the birds and the trees.',
            ex_ar='مكة، حيث الكعبة. وسُمّيت <strong>أميناً</strong> لأنه لا يُؤذى فيها أحد — ولا '
                  'حتى طيرها وشجرها.',
        ),
        dict(
            ar='لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
            tl='Laqad khalaqnal-insana fee ahsani taqweem',
            tr_en='"We certainly created the human being in the finest form."',
            tr_ar='"لقد خلقنا الإنسان في أحسن تقويم"',
            ex_en='This is what all four oaths were leading to. You were made '
                  '<strong>upright, balanced and complete</strong> — the finest of Allah\'s making.',
            ex_ar='وهذا ما ساقت إليه الأقسام الأربعة. خُلقت <strong>معتدلاً قائماً تاماً</strong> '
                  '— أحسن ما خلق الله.',
        ),
        dict(
            ar='ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ',
            tl='Thumma radadnahu asfala safileen',
            tr_en='"Then We returned him to the lowest of the low."',
            tr_ar='"ثم رددناه أسفل سافلين"',
            ex_en='A person given every gift can still throw it away by choosing badly. '
                  '<strong>How you were made is a gift; what you do with it is your choice.</strong>',
            ex_ar='ومن أُعطي كل هبة قد يضيّعها بسوء اختياره. <strong>خلقتك هبة، وما تصنعه بها '
                  'اختيارك.</strong>',
        ),
        dict(
            ar='إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ',
            tl='Illal-ladheena amanoo wa \'amilus-salihati falahum ajrun ghayru mamnoon',
            tr_en='"Except those who believe and do good deeds — for them is a reward never cut off."',
            tr_ar='"إلا الذين آمنوا وعملوا الصالحات فلهم أجر غير ممنون"',
            ex_en='The way out, and it takes <strong>both</strong>: believing <em>and</em> doing. '
                  'And their reward <strong>never runs out</strong> — it is not the kind that stops.',
            ex_ar='وهذا هو المخرج، ولا بد فيه من <strong>الاثنين</strong>: إيمانٌ <em>وعمل</em>. '
                  'وأجرهم <strong>لا ينقطع</strong> — ليس مما يفنى.',
        ),
        dict(
            ar='فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ',
            tl='Fama yukadhdhibuka ba\'du bid-deen',
            tr_en='"So what makes you deny the Judgement after this?"',
            tr_ar='"فما يكذّبك بعد بالدين"',
            ex_en='After seeing how carefully you were made — what could still make you think there '
                  'is <strong>no Day when it all matters</strong>?',
            ex_ar='بعد أن رأيت كيف أُحسن خلقك — فما الذي يجعلك تظن أنه '
                  '<strong>لا يوم يُحاسب فيه</strong>؟',
        ),
        dict(
            ar='أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ',
            tl='Alaysal-lahu bi-ahkamil-hakimeen',
            tr_en='"Is Allah not the wisest of all judges?"',
            tr_ar='"أليس الله بأحكم الحاكمين"',
            ex_en='The surah ends with a question you already know the answer to. Allah judges '
                  '<strong>perfectly and fairly</strong> — nobody is wronged, and nothing is missed.',
            ex_ar='تختم السورة بسؤال تعرف جوابه. فالله يحكم <strong>بالعدل التام</strong> — لا '
                  'يُظلم أحد، ولا يفوته شيء.',
        ),
    ],

    quiz=[
        dict(
            q=('Which two fruits does the surah begin with?', 'بأي ثمرتين تبدأ السورة؟'),
            options=[
                ('The date and the pomegranate', 'التمر والرمّان', False),
                ('The fig and the olive', 'التين والزيتون', True),
                ('The grape and the apple', 'العنب والتفاح', False),
                ('The banana and the melon', 'الموز والبطيخ', False),
            ],
        ),
        dict(
            q=('Which safe city does the surah swear by?', 'بأي بلد أمين تقسم السورة؟'),
            options=[
                ('Madinah, the city of the Prophet ﷺ', 'المدينة، مدينة النبي ﷺ', False),
                ('Makkah, where the Kaaba stands', 'مكة، حيث الكعبة', True),
                ('Jerusalem, with the far mosque', 'القدس، وفيها المسجد الأقصى', False),
                ('Taif, in the mountains nearby', 'الطائف، في الجبال القريبة', False),
            ],
        ),
        dict(
            q=('What does "the finest form" tell us about people?',
               'ماذا يخبرنا "أحسن تقويم" عن الإنسان؟'),
            options=[
                ('That only some people were made well', 'أن بعض الناس فقط أُحسن خلقهم', False),
                ('That Allah made us beautifully and completely', 'أن الله خلقنا في أتم صورة وأجملها', True),
                ('That we are exactly the same as animals', 'أننا مثل الحيوانات تماماً', False),
                ('That how we look is the only thing that matters', 'أن الشكل وحده هو المهم', False),
            ],
        ),
        dict(
            q=('Who keeps the reward that is never cut off?', 'من له الأجر الذي لا ينقطع؟'),
            options=[
                ('Anyone who was born in a good family', 'كل من وُلد في بيت صالح', False),
                ('Those who believe and do good deeds', 'الذين آمنوا وعملوا الصالحات', True),
                ('People who are stronger than others', 'من كانوا أقوى من غيرهم', False),
                ('Those who have travelled a great deal', 'من سافروا كثيراً في الأرض', False),
            ],
        ),
    ],

    reflect_h_en='💬 A Gift and a Choice',
    reflect_h_ar='💬 هبةٌ واختيار',
    reflect=[
        ('Verse 4 and verse 5 sit right next to each other on purpose. One says how wonderfully you '
         'were made. The next says how far a person can fall anyway. Both are true, and the surah '
         'refuses to hide either.',
         'جاءت الآية الرابعة والخامسة متجاورتين عن قصد. تقول الأولى كم أُحسن خلقك، وتقول الثانية '
         'كم يمكن أن يهوي الإنسان مع ذلك. وكلتاهما حق، والسورة لا تخفي واحدة منهما.'),
        ('Then verse 6 gives the answer, and it is not complicated: believe, and do good. That is '
         'what a child can actually hold on to tonight.',
         'ثم تعطي الآية السادسة الجواب، وهو غير معقّد: آمِن، واعمل صالحاً. وهذا ما يستطيع الطفل '
         'أن يمسك به الليلة.'),
    ],

    facts=[
        ('It is surah number <strong>95</strong> in the Quran', 'هي السورة رقم <strong>٩٥</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('It is the only surah that swears by <strong>fruit</strong>',
         'وهي السورة الوحيدة التي أقسم الله فيها بـ<strong>ثمر</strong>'),
        ('The <strong>olive</strong> gives food, oil and light', '<strong>الزيتون</strong> طعامٌ وزيتٌ وضياء'),
        ('<em>Mount Sinai</em> is where <strong>Musa عليه السلام</strong> was spoken to',
         '<em>طور سينين</em> حيث كُلّم <strong>موسى عليه السلام</strong>'),
        ('It ends with a <strong>question</strong>, not a statement', 'وتختم بـ<strong>سؤال</strong> لا بخبر'),
    ],

    tips=[
        dict(icon='4️⃣', h=('Four Then Four', 'أربعٌ ثم أربع'),
             p=('The first four verses are the oaths. The last four are what they were for.',
                'الآيات الأربع الأولى أقسام، والأربع الأخيرة جوابها.')),
        dict(icon='🫒', h=('Start at the Table', 'ابدأ من المائدة'),
             p=('A fig and an olive are things you can hold, so verse 1 sticks before the rest.',
                'التينة والزيتونة شيئان تمسكهما، فتثبت الآية الأولى قبل غيرها.')),
        dict(icon='🎵', h=('Listen for the Ending', 'أنصت للفواصل'),
             p=('Almost every verse here ends on the same -een sound, which carries you along.',
                'تكاد كل آية تنتهي بالنون الساكنة بعد ياء، فتحملك الفواصل من آية إلى أخرى.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='Allah made you in the finest form — what is one good thing you can do with it today?',
    ask_ar='خلقك الله في أحسن تقويم — فما الخير الذي تصنعه بها اليوم؟',
    recap_en='You were made beautifully. Believing and doing good is how you stay that way.',
    recap_ar='خُلقت في أحسن صورة. وبالإيمان والعمل الصالح تبقى كذلك.',

    prev='surah-ash-sharh.html',
    prev_en='← Surah Ash-Sharh',
    prev_ar='السابق: سورة الشرح',
    next='surah-al-humazah.html',
    next_en='Surah Al-Humazah →',
    next_ar='التالي: سورة الهمزة',
)
