# -*- coding: utf-8 -*-
"""Content spec for Surah Ash-Sharh (94). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-ash-sharh',
    desc='Learn Surah Ash-Sharh for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah Ash-Sharh',
    title_ar='سورة الشرح',
    sub_en='The Opening Up - الشرح',
    sub_ar='الشرح',
    icon='💚',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='Sqgmb20Pqas',
    video_intro_en='Eight short verses with one promise repeated twice — listen and repeat!',
    video_intro_ar='ثماني آيات قصيرة فيها وعدٌ يتكرّر مرتين — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah Ash-Sharh',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة الشرح',
    results_en='With hardship comes ease. Allah said it twice so you would believe it.',
    results_ar='إن مع العسر يسراً. قالها الله مرتين لتطمئن.',

    badges=[
        ('📿 8 Verses', '📿 ٨ آيات'),
        ('🕌 Makki Surah', '🕌 سورة مكية'),
        ('💚 Ease After Hardship', '💚 اليسر بعد العسر'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah Ash-Sharh Special?', '🌟 لماذا سورة الشرح مميزة؟'),
            body=[
                ('Surah Ash-Sharh is chapter number <strong>94</strong> of the Quran, with '
                 '<strong>8 verses</strong>.',
                 'سورة الشرح هي السورة رقم <strong>٩٤</strong> في القرآن، وفيها '
                 '<strong>٨ آيات</strong>.'),
                ('<em>"Sharh"</em> means <strong>to open something up and make it wide</strong> — '
                 'the way a tight, worried chest suddenly feels roomy again when good news arrives.',
                 '<em>"الشرح"</em> معناه <strong>التوسيع والانفتاح</strong> — كما ينفرج الصدر '
                 'الضيق المهموم فجأة حين يأتيه الخبر السار.'),
                ('It came down straight after Surah Ad-Duha, and carries on the same conversation: '
                 'Allah comforting His Prophet ﷺ.',
                 'نزلت بعد سورة الضحى مباشرة، وهي تكمل الحديث نفسه: طمأنة الله لنبيه ﷺ.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('🎒 The Weight Taken Off His Back', '🎒 الحمل الذي وُضع عن ظهره'),
            body=[
                ('The surah pictures worry as <strong>a heavy bag</strong> — so heavy it bends your '
                 'back. And it says Allah <em>lifted it off</em>.',
                 'تصوّر السورة الهمّ <strong>حِملاً ثقيلاً</strong> ينقض الظهر من ثقله. ثم تقول '
                 'إن الله <em>وضعه عنه</em>.'),
                ('Then it adds something no one could have arranged: Allah <strong>raised his '
                 'mention</strong>. Every call to prayer on earth still says his name beside '
                 "Allah's, more than fourteen centuries later.",
                 'ثم تضيف ما لا يقدر عليه أحد: <strong>ورفعنا لك ذكرك</strong>. فما زال كل أذان '
                 'في الأرض يذكر اسمه بعد اسم الله، بعد أكثر من أربعة عشر قرناً.'),
                dict(items=[
                    ('💚 A chest <strong>opened wide</strong>', '💚 صدرٌ <strong>منشرح</strong>'),
                    ('🎒 A weight <strong>lifted off</strong>', '🎒 وحِملٌ <strong>موضوع</strong>'),
                    ('📣 A name <strong>raised high</strong>', '📣 وذكرٌ <strong>مرفوع</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('🔁 The Line Said Twice', '🔁 الآية التي قيلت مرتين'),
            body=[
                ('<strong>"With hardship comes ease."</strong> And then again, immediately: '
                 '<strong>"With hardship comes ease."</strong>',
                 '<strong>"فإن مع العسر يسراً"</strong>. ثم مباشرة: '
                 '<strong>"إن مع العسر يسراً"</strong>.'),
                ('The Quran does not repeat things by accident. Saying it twice is how you comfort '
                 'someone who is really struggling — you say it, and then you say it again so they '
                 'hear it.',
                 'ولا يكرّر القرآن شيئاً عبثاً. وتكرارها مرتين هو ما تفعله حين تطمئن من يشقّ عليه '
                 'الأمر — تقولها، ثم تعيدها ليسمعها حقاً.'),
                ('Notice the word: <em>with</em> hardship, not only after it. The ease is already on '
                 'its way while the hard part is still happening.',
                 'وانظر إلى الكلمة: <em>مع</em> العسر، لا بعده فقط. فاليسر في طريقه إليك والعسر '
                 'ما زال قائماً.'),
            ],
            badges=[
                ('😣 The hard thing', '😣 العسر'),
                ('🤝 comes <em>with</em>', '🤝 ومعه'),
                ('😌 the easy thing', '😌 اليسر'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('💪 What To Do When It Passes', '💪 ماذا تفعل إذا انقضى'),
            body=[
                ('The last two verses are a surprise. When you finish, do not just flop down — '
                 '<strong>start the next good thing</strong>, and turn to your Lord wanting Him.',
                 'الآيتان الأخيرتان مفاجئة. إذا فرغت فلا تلقِ بنفسك فحسب — '
                 '<strong>فانصب للعمل التالي</strong>، وارغب إلى ربك.'),
                ('So the surah begins with rest and ends with work. Allah gives you ease, and you '
                 'use the ease for something good.',
                 'فتبدأ السورة بالراحة وتنتهي بالعمل. يمنحك الله اليسر، فتستعمله في الخير.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
            tl='Alam nashrah laka sadrak',
            tr_en='"Did We not open up your chest for you?"',
            tr_ar='"ألم نشرح لك صدرك"',
            ex_en='When you are worried, your chest feels tight. Allah asks: did We not '
                  '<strong>make it wide and calm again</strong>? It is a question that is really a '
                  'reminder.',
            ex_ar='إذا اغتممت ضاق صدرك. فيسأل الله: ألم <strong>نوسّعه ونطمئنه</strong>؟ وهو سؤال '
                  'معناه التذكير.',
        ),
        dict(
            ar='وَوَضَعْنَا عَنْكَ وِزْرَكَ',
            tl='Wa wada\'na \'anka wizrak',
            tr_en='"And take off from you your burden,"',
            tr_ar='"ووضعنا عنك وزرك"',
            ex_en='A <em>wizr</em> is a load you carry. Allah <strong>set it down</strong> for him — '
                  'he did not have to keep holding it.',
            ex_ar='و<em>الوزر</em> هو الحمل الذي تحمله. وقد <strong>وضعه الله عنه</strong> فلم '
                  'يعد مضطراً لحمله.',
        ),
        dict(
            ar='الَّذِي أَنْقَضَ ظَهْرَكَ',
            tl='Alladhee anqada zahrak',
            tr_en='"the one that weighed down your back,"',
            tr_ar='"الذي أنقض ظهرك"',
            ex_en='So heavy you could hear it, the way an overloaded back creaks. Allah '
                  '<strong>knew exactly how heavy it was</strong>.',
            ex_ar='ثقيل حتى ليكاد يُسمع له صوت، كما ينقض الظهر المثقل. والله '
                  '<strong>يعلم مقدار ثقله تماماً</strong>.',
        ),
        dict(
            ar='وَرَفَعْنَا لَكَ ذِكْرَكَ',
            tl='Wa rafa\'na laka dhikrak',
            tr_en='"And raise high your mention?"',
            tr_ar='"ورفعنا لك ذكرك"',
            ex_en='People were mocking his name. Allah answered by lifting it: his name is said in '
                  'the <strong>adhan and in every prayer</strong>, all over the world, every day.',
            ex_ar='كانوا يسخرون من اسمه، فرفعه الله: فاسمه يُذكر في <strong>الأذان وفي كل '
                  'صلاة</strong>، في الأرض كلها، كل يوم.',
        ),
        dict(
            ar='فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
            tl='Fa-inna ma\'al-\'usri yusra',
            tr_en='"So truly, with hardship comes ease."',
            tr_ar='"فإن مع العسر يسراً"',
            ex_en='The promise of the surah. Not <em>after</em> the hard thing only — '
                  '<strong>with</strong> it. Help is already travelling towards you.',
            ex_ar='وعد السورة. ليس <em>بعد</em> العسر فقط، بل <strong>معه</strong>. فالفرج في '
                  'طريقه إليك من الآن.',
        ),
        dict(
            ar='إِنَّ مَعَ الْعُسْرِ يُسْرًا',
            tl='Inna ma\'al-\'usri yusra',
            tr_en='"Truly, with hardship comes ease."',
            tr_ar='"إن مع العسر يسراً"',
            ex_en='The <strong>same sentence again</strong>. Allah repeats it so that the person who '
                  'is hurting does not have to wonder whether they heard it right.',
            ex_ar='<strong>الجملة نفسها مرة أخرى</strong>. يكرّرها الله حتى لا يشك المهموم في '
                  'أنه سمعها.',
        ),
        dict(
            ar='فَإِذَا فَرَغْتَ فَانْصَبْ',
            tl='Fa-idha faraghta fansab',
            tr_en='"So when you have finished, work on,"',
            tr_ar='"فإذا فرغت فانصب"',
            ex_en='When one task is done, <strong>get up for the next good one</strong>. Finished '
                  'your homework? Then help at home. A believer keeps going.',
            ex_ar='إذا فرغت من عمل <strong>فانهض إلى الذي بعده</strong>. أنهيت واجبك؟ فأعِن في '
                  'البيت. والمؤمن لا يتوقف عن الخير.',
        ),
        dict(
            ar='وَإِلَىٰ رَبِّكَ فَارْغَبْ',
            tl='Wa ila Rabbika farghab',
            tr_en='"And to your Lord turn with longing."',
            tr_ar='"وإلى ربك فارغب"',
            ex_en='And want <strong>Him</strong> most of all. Do the work, then hand it to Allah and '
                  'ask Him — He is the one you were doing it for.',
            ex_ar='وارغب في <strong>ربك</strong> قبل كل شيء. اعمل، ثم فوّض الأمر إليه واسأله — '
                  'فهو الذي عملت من أجله.',
        ),
    ],

    quiz=[
        dict(
            q=('What does "Sharh" mean?', 'ماذا تعني كلمة "الشرح"؟'),
            options=[
                ('Closing something up tightly', 'إغلاق الشيء وإحكامه', False),
                ('Opening something up and widening it', 'فتح الشيء وتوسيعه', True),
                ('Carrying a load a long way', 'حمل الشيء الثقيل مسافة طويلة', False),
                ('Counting something very carefully', 'عدّ الشيء بدقة وحرص', False),
            ],
        ),
        dict(
            q=('Which sentence is repeated twice in this surah?',
               'أي جملة تكرّرت مرتين في هذه السورة؟'),
            options=[
                ('"And raise high your mention"', '"ورفعنا لك ذكرك"', False),
                ('"With hardship comes ease"', '"إن مع العسر يسراً"', True),
                ('"And to your Lord turn with longing"', '"وإلى ربك فارغب"', False),
                ('"Did We not open up your chest?"', '"ألم نشرح لك صدرك"', False),
            ],
        ),
        dict(
            q=('How did Allah raise the Prophet\'s ﷺ mention?',
               'كيف رفع الله ذكر النبي ﷺ؟'),
            options=[
                ('By writing his name on the mountains', 'بأن كتب اسمه على الجبال', False),
                ('His name is said in the adhan and in prayer', 'فاسمه يُذكر في الأذان والصلاة', True),
                ('By making him the richest man in Makkah', 'بأن جعله أغنى رجل في مكة', False),
                ('By teaching every bird to call his name', 'بأن علّم كل طائر أن ينادي باسمه', False),
            ],
        ),
        dict(
            q=('What should you do when you finish something?',
               'ماذا تفعل إذا فرغت من عمل؟'),
            options=[
                ('Tell everyone around you about it first', 'أن تخبر من حولك به أولاً', False),
                ('Start the next good thing and ask Allah', 'أن تنهض إلى خير آخر وترغب إلى الله', True),
                ('Stop doing anything for the whole day', 'أن تتوقف عن كل عمل بقية اليوم', False),
                ('Wait for somebody else to begin first', 'أن تنتظر غيرك حتى يبدأ قبلك', False),
            ],
        ),
    ],

    reflect_h_en='💬 Said Twice on Purpose',
    reflect_h_ar='💬 تكرارٌ مقصود',
    reflect=[
        ('There is a well-known saying among the early Muslims about these two verses: one hardship '
         'will never overcome two eases — because the hard thing is mentioned with "the", the same '
         'one both times, while the ease is mentioned without it, so it could be any ease, twice over.',
         'وقد اشتهر عن السلف في هاتين الآيتين قولهم: لن يغلب عسرٌ يسرين — لأن العسر جاء معرّفاً '
         'فهو واحد في الموضعين، وجاء اليسر منكّراً فهو يسرٌ بعد يسر.'),
        ('You do not need the grammar to feel it. Allah said the good news twice, and He does not '
         'waste a word.',
         'ولست محتاجاً إلى النحو لتشعر بها. قال الله البشرى مرتين، وهو لا يضع كلمة عبثاً.'),
    ],

    facts=[
        ('It is surah number <strong>94</strong> in the Quran', 'هي السورة رقم <strong>٩٤</strong> في القرآن'),
        ('It is a <strong>Makki</strong> surah, revealed before the Hijrah',
         'هي سورة <strong>مكية</strong>، نزلت قبل الهجرة'),
        ('It continues straight on from <strong>Surah Ad-Duha</strong>',
         'وهي متصلة بـ<strong>سورة الضحى</strong> قبلها'),
        ('One sentence is repeated <strong>word for word</strong>', 'وفيها جملة تكرّرت <strong>بحروفها</strong>'),
        ('It says ease comes <strong>with</strong> hardship, not only after',
         'وتقول إن اليسر <strong>مع</strong> العسر لا بعده فقط'),
        ('It ends by telling us to <strong>keep going</strong>', 'وتختم بأن <strong>ننهض للعمل</strong>'),
    ],

    tips=[
        dict(icon='🔁', h=('The Free Verse', 'الآية المجانية'),
             p=('Verses 5 and 6 are almost identical, so learning one gives you the other.',
                'الآيتان ٥ و٦ تكادان تتطابقان، فحفظ إحداهما يعطيك الأخرى.')),
        dict(icon='📏', h=('Very Short Lines', 'آيات قصيرة جداً'),
             p=('Most verses here are only three or four words — one of the easiest surahs to hold.',
                'أكثر آياتها ثلاث أو أربع كلمات — من أسهل السور حفظاً.')),
        dict(icon='🎒', h=('Picture the Bag', 'تخيّل الحقيبة'),
             p=('A heavy bag lifted off your shoulders is the whole first half in one image.',
                'حقيبة ثقيلة تُرفع عن كتفيك: صورة تجمع النصف الأول كله.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='What is one hard thing you finished, that felt easier once you had started?',
    ask_ar='ما الأمر الصعب الذي أنجزته، فوجدته أهون بعد أن بدأت؟',
    recap_en='Allah promised twice: the ease is coming with it, not long after it.',
    recap_ar='وعد الله مرتين: اليسر قادم معه، لا بعده بزمن طويل.',

    prev='surah-ad-duha.html',
    prev_en='← Surah Ad-Duha',
    prev_ar='السابق: سورة الضحى',
    next='surah-at-tin.html',
    next_en='Surah At-Tin →',
    next_ar='التالي: سورة التين',
)
