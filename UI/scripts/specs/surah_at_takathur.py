# -*- coding: utf-8 -*-
"""Content spec for Surah At-Takathur (102). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-at-takathur',
    desc='Learn Surah At-Takathur for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah At-Takathur',
    title_ar='سورة التكاثر',
    sub_en='Wanting More and More - التكاثر',
    sub_ar='التكاثر',
    icon='📦',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='pAwyBKcrdYY',
    video_intro_en='Eight verses about chasing more, and the one question waiting at the end — listen and repeat!',
    video_intro_ar='ثماني آيات عن السعي وراء المزيد، وسؤالٍ ينتظر في النهاية — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah At-Takathur',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة التكاثر',
    results_en='Say alhamdulillah for one thing you already have.',
    results_ar='قل الحمد لله على نعمة عندك بالفعل.',

    badges=[
        ('📿 8 Verses', '📿 ٨ آيات'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('🙏 Be Thankful for What You Have', '🙏 اشكر ما عندك'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah At-Takathur Special?', '🌟 لماذا سورة التكاثر مميزة؟'),
            body=[
                ('Surah At-Takathur is chapter number <strong>102</strong> of the Quran, with '
                 '<strong>8 verses</strong>.',
                 'سورة التكاثر هي السورة رقم <strong>١٠٢</strong> في القرآن، وفيها '
                 '<strong>٨ آيات</strong>.'),
                ('<em>"Takathur"</em> means <strong>wanting more and more</strong> — and especially '
                 'wanting more <em>than other people have</em>.',
                 '<em>"التكاثر"</em> هو <strong>طلب المزيد والمزيد</strong> — وخاصة أن يكون لك '
                 '<em>أكثر مما عند غيرك</em>.'),
                ('Every child knows this feeling. You are happy with your toy right up until you '
                 'see someone with a better one. The surah is about what that feeling does to you '
                 'if you let it lead.',
                 'وكل طفل يعرف هذا الشعور. تكون راضياً بلعبتك حتى ترى عند غيرك أحسن منها. '
                 'والسورة عمّا يصنعه بك هذا الشعور إن تركته يقودك.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('😵 The Word "Distracted"', '😵 معنى "ألهاكم"'),
            body=[
                ('The very first word, <em>alhakum</em>, means <strong>it distracted you</strong> — '
                 'it kept you busy with something small while something big went past.',
                 'أول كلمة، <em>ألهاكم</em>، معناها <strong>شغلكم</strong> — أشغلكم بالصغير حتى '
                 'فاتكم الكبير.'),
                ('Notice what the surah does <em>not</em> say. It does not say having things is '
                 'wrong. It says <strong>being distracted by them</strong> is.',
                 'وانظر إلى ما لم تقله السورة. لم تقل إن اقتناء الأشياء خطأ، بل قالت إن '
                 '<strong>الانشغال بها</strong> هو الخطأ.'),
                dict(items=[
                    ('📦 Having things is <strong>fine</strong>', '📦 أن تملك الأشياء <strong>لا بأس به</strong>'),
                    ('🏃 Chasing more <strong>never ends</strong>', '🏃 وطلب المزيد <strong>لا ينتهي</strong>'),
                    ('🙏 Being thankful <strong>does</strong>', '🙏 والشكر <strong>يُنهيه</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('⏳ Until You Reach the Graves', '⏳ حتى زرتم المقابر'),
            body=[
                ('The second verse says the chase carries on <strong>until you visit the graves</strong> '
                 '— that is, until life is over. Some of the Arabs used to count who had more, and '
                 'when they ran out of living relatives they counted the ones who had died.',
                 'وتقول الآية الثانية إن هذا السباق يمضي <strong>حتى زرتم المقابر</strong> — أي '
                 'حتى ينتهي العمر. وكان بعض العرب يتفاخرون بالعدد، فإذا فرغ الأحياء عدّوا موتاهم.'),
                ('The Quran uses the word <em>visit</em>. A visit is short, and you do not stay. '
                 'This whole life is the visit.',
                 'واستعمل القرآن كلمة <em>زرتم</em>. والزيارة قصيرة لا يُقام فيها. وهذه الحياة '
                 'كلها هي الزيارة.'),
            ],
            badges=[
                ('🏃 The chase is long', '🏃 السباق طويل'),
                ('⏳ The visit is short', '⏳ والزيارة قصيرة'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('🎁 The Question at the End', '🎁 السؤال في الختام'),
            body=[
                ('The last verse is the one to sit with: you will be asked about <em>an-na\'eem</em> '
                 '— <strong>the good things you were given</strong>.',
                 'والآية الأخيرة هي التي يُوقف عندها: لتُسألنّ عن <em>النعيم</em> — '
                 '<strong>الخير الذي أُعطيته</strong>.'),
                ('Not asked off, as if blessings were a trap. Asked <em>about</em> — what did you do '
                 'with them? Once, when the Prophet ﷺ and his companions had eaten dates and drunk '
                 'cool water, he told them this was among the blessings they would be asked about. '
                 'Dates and water.',
                 'ولا يُسأل عنها على أنها فخّ، بل يُسأل: ماذا صنعت بها؟ وقد أكل النبي ﷺ وأصحابه '
                 'تمراً وشربوا ماءً بارداً، فأخبرهم أن هذا من النعيم الذي يُسألون عنه. تمرٌ وماء.'),
                ('So the answer to <em>wanting more</em> is not having less. It is '
                 '<strong>noticing what you already have</strong>.',
                 'فليس جواب <em>طلب المزيد</em> أن تنقص، بل أن <strong>تنتبه لما عندك '
                 'بالفعل</strong>.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='أَلْهَاكُمُ التَّكَاثُرُ',
            tl='Alhakumut-takathur',
            tr_en='"Competing for more has distracted you,"',
            tr_ar='"ألهاكم التكاثر"',
            ex_en='One word for the whole problem: <strong>distracted</strong>. Busy with the small '
                  'thing while the big thing goes by unnoticed.',
            ex_ar='كلمة واحدة تجمع المشكلة: <strong>ألهاكم</strong>. انشغالٌ بالصغير حتى يمرّ '
                  'الكبير دون انتباه.',
        ),
        dict(
            ar='حَتَّىٰ زُرْتُمُ الْمَقَابِرَ',
            tl='Hatta zurtumul-maqabir',
            tr_en='"Until you reach the graves."',
            tr_ar='"حتى زرتم المقابر"',
            ex_en='The counting only stops when life does. And the word is <em>visit</em> — '
                  '<strong>nobody is staying here</strong>.',
            ex_ar='ولا يتوقف العدّ إلا بانتهاء العمر. والكلمة <em>زرتم</em> — '
                  '<strong>وما أحدٌ بمقيم</strong>.',
        ),
        dict(
            ar='كَلَّا سَوْفَ تَعْلَمُونَ',
            tl='Kalla sawfa ta\'lamoon',
            tr_en='"No! You are going to know."',
            tr_ar='"كلا سوف تعلمون"',
            ex_en='<em>Kalla</em> means <strong>stop — it is not like that</strong>. One day what '
                  'actually mattered will be obvious to everyone.',
            ex_ar='<em>كلا</em> أي <strong>كفّوا — ليس الأمر كذلك</strong>. وسيأتي يوم يتبيّن '
                  'فيه للجميع ما كان يستحق.',
        ),
        dict(
            ar='ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ',
            tl='Thumma kalla sawfa ta\'lamoon',
            tr_en='"Then no! You are going to know."',
            tr_ar='"ثم كلا سوف تعلمون"',
            ex_en='The <strong>same warning twice</strong>. When the Quran repeats a line, it is '
                  'because we are slow to hear it the first time.',
            ex_ar='<strong>التحذير نفسه مرتين</strong>. وإذا كرّر القرآن جملة فلأننا نبطئ عن '
                  'سماعها أول مرة.',
        ),
        dict(
            ar='كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ',
            tl='Kalla law ta\'lamoona \'ilmal-yaqeen',
            tr_en='"No! If only you knew with certain knowledge…"',
            tr_ar='"كلا لو تعلمون علم اليقين"',
            ex_en='The sentence <strong>stops without finishing</strong> — <em>if you really knew, '
                  'you would…</em> and then nothing. You fill in the rest yourself.',
            ex_ar='الجملة <strong>تقف ولا تتم</strong> — <em>لو تعلمون حقاً لَـ…</em> ثم لا شيء. '
                  'وأنت الذي تكمل.',
        ),
        dict(
            ar='لَتَرَوُنَّ الْجَحِيمَ',
            tl='Latarawunnal-jaheem',
            tr_en='"You will surely see the Blazing Fire."',
            tr_ar='"لترونّ الجحيم"',
            ex_en='Said once, plainly, as the Quran says it. The surah does not stay here — '
                  '<strong>it moves straight on to the question</strong>.',
            ex_ar='تُقال مرة واحدة صريحة كما قالها القرآن. ولا تقف السورة عندها — '
                  '<strong>بل تمضي إلى السؤال</strong>.',
        ),
        dict(
            ar='ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ',
            tl='Thumma latarawunnaha \'aynal-yaqeen',
            tr_en='"Then you will see it with the eye of certainty."',
            tr_ar='"ثم لترونّها عين اليقين"',
            ex_en='There is knowing something because you were told, and knowing it '
                  '<strong>because you are looking straight at it</strong>. This is the second kind.',
            ex_ar='هناك علمٌ بالخبر، وعلمٌ <strong>بأنك تنظر إليه بعينك</strong>. وهذا هو '
                  'الثاني.',
        ),
        dict(
            ar='ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ',
            tl='Thumma latus\'alunna yawma-idhin \'anin-na\'eem',
            tr_en='"Then you will surely be asked that Day about the blessings."',
            tr_ar='"ثم لتسألنّ يومئذ عن النعيم"',
            ex_en='The last word of the surah is <strong>blessings</strong> — the good you were '
                  'given. Cool water. A family. A body that works. '
                  '<strong>What did you do with it?</strong>',
            ex_ar='وآخر كلمة في السورة هي <strong>النعيم</strong> — الخير الذي أُعطيته. ماءٌ '
                  'بارد، وأهلٌ، وبدنٌ صحيح. <strong>فماذا صنعت به؟</strong>',
        ),
    ],

    quiz=[
        dict(
            q=('What does "Takathur" mean?', 'ماذا تعني كلمة "التكاثر"؟'),
            options=[
                ('Giving away everything that you own', 'أن تعطي كل ما تملك', False),
                ('Wanting more and more than others', 'طلب المزيد والمزيد أكثر من غيرك', True),
                ('Sharing your food with a neighbour', 'أن تشارك جارك طعامك', False),
                ('Learning to count up to a hundred', 'أن تتعلّم العدّ إلى المئة', False),
            ],
        ),
        dict(
            q=('What is the surah actually warning against?', 'مِمّ تحذّر السورة حقيقةً؟'),
            options=[
                ('Owning anything at all, ever', 'أن تملك شيئاً على الإطلاق', False),
                ('Letting the chase distract you', 'أن يشغلك السباق عمّا هو أهم', True),
                ('Working hard at school and at home', 'أن تجتهد في دراستك وبيتك', False),
                ('Playing games with your friends', 'أن تلعب مع أصحابك', False),
            ],
        ),
        dict(
            q=('Which word does the Quran use about the graves?',
               'أي كلمة استعملها القرآن عن المقابر؟'),
            options=[
                ('That you build them for yourselves', 'أنكم تبنونها لأنفسكم', False),
                ('That you visit them', 'أنكم تزورونها', True),
                ('That you run away from them', 'أنكم تفرّون منها', False),
                ('That you forget where they are', 'أنكم تنسون مواضعها', False),
            ],
        ),
        dict(
            q=('What will we be asked about on that Day?', 'عمّ نُسأل يوم القيامة في هذه السورة؟'),
            options=[
                ('The names of everyone we ever met', 'أسماء كل من قابلناهم', False),
                ('The blessings we were given', 'النعيم الذي أُعطيناه', True),
                ('How many things we managed to own', 'كم شيئاً استطعنا أن نملك', False),
                ('The distance we travelled in our lives', 'المسافة التي قطعناها في حياتنا', False),
            ],
        ),
    ],

    reflect_h_en='💬 Dates and Cool Water',
    reflect_h_ar='💬 تمرٌ وماء بارد',
    reflect=[
        ('It is reported that the Prophet ﷺ, after eating dates and drinking cool water with his '
         'companions, told them that this was among the blessings they would be asked about. Not '
         'palaces. Dates and water.',
         'رُوي أن النبي ﷺ لمّا أكل تمراً وشرب ماءً بارداً مع أصحابه أخبرهم أن هذا من النعيم الذي '
         'يُسألون عنه. لا قصوراً — بل تمراً وماء.'),
        ('That reframes the whole surah. If cool water counts as a blessing worth being asked '
         'about, then a child who has clean water, a warm bed and someone who loves them is already '
         'holding more than the person in verse 1 was chasing.',
         'وهذا يقلب معنى السورة كله. فإذا كان الماء البارد نعمة يُسأل عنها، فالطفل الذي عنده ماء '
         'نظيف وفراش دافئ ومن يحبه، قد ملك أكثر مما كان يسعى إليه صاحب الآية الأولى.'),
    ],

    facts=[
        ('It is surah number <strong>102</strong> in the Quran', 'هي السورة رقم <strong>١٠٢</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('The first word means <strong>it distracted you</strong>', 'وأول كلمة فيها معناها <strong>شغلكم</strong>'),
        ('The graves are something you <strong>visit</strong>', 'والمقابر شيء <strong>تزوره</strong>'),
        ('One warning is repeated <strong>word for word</strong>', 'وتحذيرٌ فيها تكرّر <strong>بحروفه</strong>'),
        ('It ends on the word <strong>blessings</strong>', 'وتختم بكلمة <strong>النعيم</strong>'),
    ],

    tips=[
        dict(icon='🔁', h=('The Repeated Verse', 'الآية المكرّرة'),
             p=('Verses 3 and 4 are the same but for one word at the front — learn them together.',
                'الآيتان ٣ و٤ سواء إلا كلمة في أولهما — احفظهما معاً.')),
        dict(icon='👁️', h=('Knowing, Then Seeing', 'علمٌ ثم رؤية'),
             p=('The surah climbs: you will know, then you will see, then you will be asked.',
                'ترتقي السورة: تعلمون، ثم ترون، ثم تُسألون.')),
        dict(icon='🙏', h=('End on the Gift', 'اختم بالنعمة'),
             p=('The final word is "blessings" — finish by naming one you have right now.',
                'آخر كلمة "النعيم" — فاختم بذكر نعمة عندك الآن.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='What is something you already have that you would really miss if it were gone?',
    ask_ar='ما الشيء الذي عندك الآن وستفتقده حقاً لو ذهب؟',
    recap_en='That is a blessing. Allah gave it to you, and it is worth saying thank you for.',
    recap_ar='تلك نعمة. أعطاكها الله، وهي تستحق أن تقول عليها الحمد لله.',

    prev='surah-al-humazah.html',
    prev_en='← Surah Al-Humazah',
    prev_ar='السابق: سورة الهمزة',
    next='surah-al-qariah.html',
    next_en='Surah Al-Qari\'ah →',
    next_ar='التالي: سورة القارعة',
)
