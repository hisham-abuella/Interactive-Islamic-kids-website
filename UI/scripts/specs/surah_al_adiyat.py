# -*- coding: utf-8 -*-
"""Content spec for Surah Al-Adiyat (100). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-al-adiyat',
    desc='Learn Surah Al-Adiyat for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah Al-Adiyat',
    title_ar='سورة العاديات',
    sub_en='The Racing Horses - العاديات',
    sub_ar='العاديات',
    icon='🐎',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='cCtSs2Vx6fE',
    video_intro_en='Eleven verses that start at a gallop and end with a question — listen and repeat!',
    video_intro_ar='إحدى عشرة آية تبدأ بعَدْوِ الخيل وتنتهي بسؤال — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah Al-Adiyat',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة العاديات',
    results_en='Say alhamdulillah out loud for one thing right now.',
    results_ar='قل الحمد لله بصوتك على نعمة واحدة الآن.',

    badges=[
        ('📿 11 Verses', '📿 ١١ آية'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('🙏 Remember to Say Thank You', '🙏 لا تنسَ الشكر'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah Al-Adiyat Special?', '🌟 لماذا سورة العاديات مميزة؟'),
            body=[
                ('Surah Al-Adiyat is chapter number <strong>100</strong> of the Quran, with '
                 '<strong>11 verses</strong>.',
                 'سورة العاديات هي السورة رقم <strong>١٠٠</strong> في القرآن، وفيها '
                 '<strong>١١ آية</strong>.'),
                ('<em>"Al-Adiyat"</em> means <strong>the ones who run</strong> — horses at full '
                 'gallop. The surah opens with five verses of pure noise and movement.',
                 '<em>"العاديات"</em> هي <strong>الجاريات</strong> — الخيل تعدو بأقصى سرعتها. '
                 'وتفتتح السورة بخمس آيات كلها صوت وحركة.'),
                ('You can hear it before you understand it: the breathing, the sparks, the dust. '
                 'It is one of the most exciting openings in the whole Quran.',
                 'تسمعها قبل أن تفهمها: الأنفاس، والشرر، والغبار. وهي من أشد مطالع القرآن '
                 'حيويةً.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('🐎 Five Verses of Galloping', '🐎 خمس آيات من العَدْو'),
            body=[
                ('Each of the first five verses adds one more thing the horses are doing, in the '
                 'order it happens. Read them out loud and they move.',
                 'كل آية من الخمس الأولى تضيف شيئاً آخر تفعله الخيل، بترتيب وقوعه. اقرأها بصوتك '
                 'تجدها تتحرّك.'),
                ('The sparks in verse 2 are real: iron horseshoes striking stone at speed throw '
                 'actual sparks in the half-dark before dawn.',
                 'والشرر في الآية الثانية حقيقي: حوافر الخيل تضرب الحجر بسرعة فتقدح شرراً في '
                 'عتمة ما قبل الفجر.'),
                dict(items=[
                    ('💨 Running, <strong>breathing hard</strong>', '💨 تعدو <strong>ضابحة</strong>'),
                    ('✨ Hooves <strong>striking sparks</strong>', '✨ وحوافرها <strong>تقدح النار</strong>'),
                    ('🌅 Charging <strong>at dawn</strong>', '🌅 وتغير <strong>صبحاً</strong>'),
                    ('🌫️ Raising <strong>clouds of dust</strong>', '🌫️ فتثير <strong>النقع</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('↩️ And Then the Turn', '↩️ ثم الالتفاتة'),
            body=[
                ('After all that motion, verse 6 stops and says something completely different: '
                 '<strong>the human being is ungrateful to his Lord</strong>.',
                 'وبعد كل تلك الحركة تقف الآية السادسة لتقول شيئاً آخر تماماً: '
                 '<strong>إن الإنسان لربه لكنود</strong>.'),
                ('Why the horses first? Because a horse gives everything it has and asks for '
                 'nothing. Then the surah turns to us — who were given far more, and still forget '
                 'to say thank you.',
                 'ولماذا الخيل أولاً؟ لأن الفرس يبذل كل ما عنده ولا يطلب شيئاً. ثم تلتفت السورة '
                 'إلينا — ونحن أُعطينا أكثر، وننسى الشكر.'),
                ('<em>Kanood</em> is a strong word. It means someone who counts the one hard day '
                 'and forgets the hundred easy ones.',
                 'و<em>الكنود</em> كلمة شديدة. ومعناها من يعدّ اليوم الصعب الواحد وينسى المائة '
                 'يومٍ الهيّنة.'),
            ],
            badges=[
                ('🐎 The horse gives all', '🐎 الفرس يبذل كل شيء'),
                ('🙈 We forget to thank', '🙈 ونحن ننسى الشكر'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('❤️ What Is In the Hearts', '❤️ ما في الصدور'),
            body=[
                ('The ending is quiet after all the noise. One Day what is in the graves will be '
                 'scattered, and <strong>what is in the hearts will be brought out</strong>.',
                 'والخاتمة هادئة بعد كل ذلك الصخب. يوم يُبعثر ما في القبور، '
                 'و<strong>يُحصَّل ما في الصدور</strong>.'),
                ('Not only what we did — what we <em>meant</em>. The kindness done to be seen, and '
                 'the kindness nobody knew about, are not the same thing, and that Day tells them '
                 'apart.',
                 'ليس ما عملنا فقط، بل ما <em>نويناه</em>. فالمعروف الذي صُنع ليُرى، والمعروف الذي '
                 'لم يعلمه أحد، ليسا سواءً، وذلك اليوم يفرّق بينهما.'),
                ('And the last word is that <strong>Allah is fully aware of them</strong>. Not '
                 'angry — <em>aware</em>. He knows exactly what each person was carrying.',
                 'وآخر كلمة أن <strong>ربهم بهم يومئذ لخبير</strong>. لا غاضب — بل '
                 '<em>خبير</em>. يعلم تماماً ما كان يحمله كل إنسان.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='وَالْعَادِيَاتِ ضَبْحًا',
            tl='Wal-\'adiyati dabha',
            tr_en='"By the racers, panting,"',
            tr_ar='"والعاديات ضبحاً"',
            ex_en='Allah swears by galloping horses. <em>Dabh</em> is the sound of their breathing '
                  'as they run — <strong>you can hear the surah before you understand it</strong>.',
            ex_ar='يقسم الله بالخيل الجاريات. و<em>الضبح</em> صوت أنفاسها وهي تعدو — '
                  '<strong>فتسمع السورة قبل أن تفهمها</strong>.',
        ),
        dict(
            ar='فَالْمُورِيَاتِ قَدْحًا',
            tl='Fal-mooriyati qadha',
            tr_en='"striking sparks of fire,"',
            tr_ar='"فالموريات قدحاً"',
            ex_en='Iron hooves hitting stone at speed <strong>throw real sparks</strong> in the '
                  'dark. The Quran is describing something you could actually see.',
            ex_ar='الحوافر تضرب الحجر بسرعة <strong>فتقدح شرراً حقيقياً</strong> في الظلام. '
                  'يصف القرآن شيئاً كان يُرى بالعين.',
        ),
        dict(
            ar='فَالْمُغِيرَاتِ صُبْحًا',
            tl='Fal-mugheerati subha',
            tr_en='"charging at dawn,"',
            tr_ar='"فالمغيرات صبحاً"',
            ex_en='At first light. The three verses so far are in <strong>the order it happens</strong> '
                  '— running, sparking, arriving.',
            ex_ar='عند أول الضوء. والآيات الثلاث حتى الآن <strong>على ترتيب وقوعها</strong> — '
                  'عَدْوٌ، فقَدْحٌ، فوصول.',
        ),
        dict(
            ar='فَأَثَرْنَ بِهِ نَقْعًا',
            tl='Fa-atharna bihi naq\'a',
            tr_en='"stirring up clouds of dust,"',
            tr_ar='"فأثرن به نقعاً"',
            ex_en='So many hooves that the dust rises in a cloud. <strong>You can picture it '
                  'exactly</strong>, which is the point.',
            ex_ar='حوافر كثيرة حتى يثور الغبار سحابةً. <strong>تكاد تراها</strong>، وهذا هو '
                  'المقصود.',
        ),
        dict(
            ar='فَوَسَطْنَ بِهِ جَمْعًا',
            tl='Fawasatna bihi jam\'a',
            tr_en='"and plunging into the middle of the gathering."',
            tr_ar='"فوسطن به جمعاً"',
            ex_en='Right into the centre of it. Five verses, five stages, and '
                  '<strong>not one word wasted</strong>.',
            ex_ar='إلى وسطه تماماً. خمس آيات، وخمس مراحل، و<strong>لا كلمة زائدة</strong>.',
        ),
        dict(
            ar='إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ',
            tl='Innal-insana li-Rabbihi lakanood',
            tr_en='"Indeed, the human being is ungrateful to his Lord."',
            tr_ar='"إن الإنسان لربه لكنود"',
            ex_en='Here is the turn the whole opening was for. <em>Kanood</em> means someone who '
                  '<strong>remembers the one hard day and forgets the hundred good ones</strong>.',
            ex_ar='وهنا الالتفاتة التي سيق لها المطلع كله. و<em>الكنود</em> من '
                  '<strong>يذكر اليوم الصعب وينسى المائة يومٍ الطيبة</strong>.',
        ),
        dict(
            ar='وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ',
            tl='Wa innahu \'ala dhalika lashaheed',
            tr_en='"And he is a witness to that himself."',
            tr_ar='"وإنه على ذلك لشهيد"',
            ex_en='Deep down <strong>he knows it</strong>. Nobody has to tell you when you have '
                  'forgotten to be grateful — you can feel it.',
            ex_ar='وهو في قرارة نفسه <strong>يعلم ذلك</strong>. فلا يحتاج أحد أن يخبرك أنك '
                  'نسيت الشكر — تشعر به.',
        ),
        dict(
            ar='وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ',
            tl='Wa innahu lihubbil-khayri lashadeed',
            tr_en='"And he is intense in his love of wealth."',
            tr_ar='"وإنه لحب الخير لشديد"',
            ex_en='<em>Khayr</em> here means money and things. We love them <strong>hard</strong> '
                  '— and loving them that much is what crowds out the thank you.',
            ex_ar='و<em>الخير</em> هنا المال والمتاع. نحبه <strong>حباً شديداً</strong> — وهذا '
                  'الحب هو الذي يزاحم الشكر.',
        ),
        dict(
            ar='أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ',
            tl='Afala ya\'lamu idha bu\'thira ma fil-quboor',
            tr_en='"Does he not know that when what is in the graves is scattered,"',
            tr_ar='"أفلا يعلم إذا بعثر ما في القبور"',
            ex_en='A gentle question rather than a telling-off: <em>does he not realise?</em> '
                  '<strong>Everything hidden comes up</strong>.',
            ex_ar='سؤال رفيق لا تأنيب: <em>أفلا يعلم؟</em> '
                  '<strong>فكل مستور يظهر</strong>.',
        ),
        dict(
            ar='وَحُصِّلَ مَا فِي الصُّدُورِ',
            tl='Wa hussila ma fis-sudoor',
            tr_en='"and what is in the hearts is brought out,"',
            tr_ar='"وحُصّل ما في الصدور"',
            ex_en='Not just what we did — <strong>what we meant by it</strong>. The good done to be '
                  'seen and the good nobody knew about are told apart.',
            ex_ar='لا ما عملنا فقط، بل <strong>ما نويناه به</strong>. فيُفرّق بين معروفٍ صُنع '
                  'ليُرى ومعروفٍ لم يعلمه أحد.',
        ),
        dict(
            ar='إِنَّ رَبَّهُمْ بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ',
            tl='Inna Rabbahum bihim yawma-idhin lakhabeer',
            tr_en='"indeed their Lord is fully aware of them that Day."',
            tr_ar='"إن ربهم بهم يومئذ لخبير"',
            ex_en='The surah ends on <em>Khabeer</em> — <strong>the One who knows the inside of '
                  'things</strong>. He knew all along what each person was carrying.',
            ex_ar='تختم السورة بـ<em>خبير</em> — <strong>العليم ببواطن الأمور</strong>. وقد علم '
                  'من قبلُ ما يحمله كل إنسان.',
        ),
    ],

    quiz=[
        dict(
            q=('What is Allah swearing by at the start?', 'بماذا يقسم الله في أول السورة؟'),
            options=[
                ('Galloping horses', 'الخيل العادية', True),
                ('Ships crossing the wide sea', 'السفن تعبر البحر الواسع', False),
                ('Stars turning through the night', 'النجوم تدور في الليل', False),
                ('Rain falling on dry ground', 'المطر ينزل على الأرض اليابسة', False),
            ],
        ),
        dict(
            q=('What does "kanood" mean?', 'ماذا تعني كلمة "كنود"؟'),
            options=[
                ('Someone who runs very quickly', 'من يجري سريعاً', False),
                ('Someone who travels a long way', 'من يسافر بعيداً', False),
                ('Someone who forgets to be thankful', 'من ينسى الشكر لربه', True),
                ('Someone who sleeps through the dawn', 'من ينام عن الفجر', False),
            ],
        ),
        dict(
            q=('Why does the surah mention horses before people?',
               'لماذا ذكرت السورة الخيل قبل الناس؟'),
            options=[
                ('Because horses were worth a lot of money', 'لأن الخيل كانت غالية الثمن', False),
                ('Because horses can run faster than us', 'لأن الخيل أسرع منا', False),
                ('Because they were the first thing created', 'لأنها أول ما خُلق', False),
                ('A horse gives its all and asks for nothing', 'لأن الفرس يبذل كل شيء ولا يطلب شيئاً', True),
            ],
        ),
        dict(
            q=('What is brought out on that Day?', 'ماذا يُخرَج في ذلك اليوم؟'),
            options=[
                ('Only the things people said aloud', 'ما قاله الناس بألسنتهم فقط', False),
                ('What is in the hearts', 'ما في الصدور', True),
                ('The names of all the towns and cities', 'أسماء البلدان والمدن', False),
                ('Everything that was ever written down', 'كل ما كُتب في الكتب', False),
            ],
        ),
    ],

    reflect_h_en='💬 The Hundred Easy Days',
    reflect_h_ar='💬 المائة يومٍ الهيّنة',
    reflect=[
        ('It is a strange thing about people that one difficult afternoon can feel bigger than a '
         'whole month of ordinary, comfortable days. That is exactly what <em>kanood</em> names.',
         'ومن عجيب أمر الإنسان أن عصراً واحداً شاقاً قد يبدو أعظم في نفسه من شهر كامل من الأيام '
         'الهادئة. وهذا بعينه ما تسمّيه كلمة <em>كنود</em>.'),
        ('The cure the surah offers is not guilt. It is noticing: the horse that gave everything, '
         'and the Lord who gave you more than the horse ever had.',
         'وليس العلاج الذي تقدّمه السورة تأنيباً، بل انتباهاً: إلى الفرس الذي بذل كل شيء، وإلى '
         'الرب الذي أعطاك أكثر مما مُلك الفرس قط.'),
    ],

    facts=[
        ('It is surah number <strong>100</strong> in the Quran', 'هي السورة رقم <strong>١٠٠</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('The first five verses are all <strong>one picture</strong>', 'والآيات الخمس الأولى <strong>صورة واحدة</strong>'),
        ('<em>Dabh</em> is the <strong>sound of a horse breathing</strong>',
         '<em>الضبح</em> هو <strong>صوت أنفاس الفرس</strong>'),
        ('Hooves on stone <strong>really do strike sparks</strong>',
         'وحوافر الخيل على الحجر <strong>تقدح شرراً حقاً</strong>'),
        ('It ends on <em>Khabeer</em> — <strong>the All-Aware</strong>',
         'وتختم بـ<em>خبير</em> — <strong>العليم ببواطن الأمور</strong>'),
    ],

    tips=[
        dict(icon='5️⃣', h=('Five Then Six', 'خمسٌ ثم ست'),
             p=('Verses 1-5 are the horses. Verses 6-11 are us. Learn them as two halves.',
                'الآيات ١-٥ للخيل، والآيات ٦-١١ لنا. احفظها نصفين.')),
        dict(icon='🔊', h=('Read It Out Loud', 'اقرأها بصوتك'),
             p=('The opening is built from sounds, so it sticks far better spoken than read.',
                'المطلع مبنيٌّ على الأصوات، فيثبت بالنطق أكثر من القراءة الصامتة.')),
        dict(icon='🐎', h=('Follow the Horse', 'اتبع الفرس'),
             p=('Run, spark, arrive, dust, plunge — five pictures in the order they happen.',
                'عَدْوٌ، فشرر، فوصول، فغبار، فتوسّط — خمس صور بترتيب وقوعها.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='Can you name three good things from today, even small ones?',
    ask_ar='أتستطيع أن تذكر ثلاثة أمور طيبة من يومك، ولو كانت صغيرة؟',
    recap_en='That is what the surah is asking for. Noticing them is the thank you.',
    recap_ar='هذا ما تطلبه السورة. والانتباه إليها هو الشكر.',

    prev='surah-al-qariah.html',
    prev_en='← Surah Al-Qari\'ah',
    prev_ar='السابق: سورة القارعة',
    next='surah-al-bayyinah.html',
    next_en='Surah Al-Bayyinah →',
    next_ar='التالي: سورة البينة',
)
