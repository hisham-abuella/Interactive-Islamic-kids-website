# -*- coding: utf-8 -*-
"""Content spec for Surah Al-Bayyinah (98). Fed to surah-page-template.py."""

SPEC = dict(
    slug='surah-al-bayyinah',
    desc='Learn Surah Al-Bayyinah for kids: Arabic, transliteration, verse-by-verse meaning, '
         'fun facts, memorization tips and a quiz.',
    title_en='Surah Al-Bayyinah',
    title_ar='سورة البينة',
    sub_en='The Clear Proof - البينة',
    sub_ar='البينة',
    icon='📖',
    bismillah_ar='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    video='tEpGxIETOAY',
    video_intro_en='Eight longer verses, and the simplest description of our religion — listen and repeat!',
    video_intro_ar='ثماني آيات أطول، وفيها أبسط وصف لديننا — استمع وردّد!',
    quiz_intro_en='Answer these questions about Surah Al-Bayyinah',
    quiz_intro_ar='أجب عن هذه الأسئلة عن سورة البينة',
    results_en='Allah pleased with them, and they pleased with Him. That is the whole hope.',
    results_ar='رضي الله عنهم ورضوا عنه. هذا هو الرجاء كله.',

    badges=[
        ('📿 8 Verses', '📿 ٨ آيات'),
        ('🕌 Madani Surah', '🕌 سورة مدنية'),
        ('💎 The Religion, Simply Put', '💎 الدين في سطر'),
    ],

    intro=[
        dict(
            h2=('🌟 Why is Surah Al-Bayyinah Special?', '🌟 لماذا سورة البينة مميزة؟'),
            body=[
                ('Surah Al-Bayyinah is chapter number <strong>98</strong> of the Quran, with '
                 '<strong>8 verses</strong> — longer ones than the surahs around it.',
                 'سورة البينة هي السورة رقم <strong>٩٨</strong> في القرآن، وفيها '
                 '<strong>٨ آيات</strong> أطول من آيات السور المجاورة.'),
                ('<em>"Al-Bayyinah"</em> means <strong>the clear proof</strong> — something so plain '
                 'that nobody can say they did not understand.',
                 '<em>"البينة"</em> هي <strong>الحجة الواضحة</strong> — ما يَبِينُ حتى لا يستطيع '
                 'أحد أن يقول لم أفهم.'),
                ('It holds one verse that sums up the whole religion in a single line. If a child '
                 'learns nothing else from this surah, verse 5 is the one.',
                 'وفيها آية تجمع الدين كله في سطر واحد. فإن لم يحفظ الطفل من هذه السورة غيرها، '
                 'فلتكن الآية الخامسة.'),
            ],
        ),
        dict(
            cls='intro-card highlight',
            h2=('📖 What the Clear Proof Was', '📖 ما هي البينة'),
            body=[
                ('The surah answers its own question in verse 2: the clear proof is '
                 '<strong>a Messenger from Allah</strong>, reciting pure pages.',
                 'تجيب السورة عن سؤالها في الآية الثانية: البينة هي '
                 '<strong>رسول من الله</strong> يتلو صحفاً مطهرة.'),
                ('Not a sign in the sky. Not a miracle you had to travel to see. '
                 '<strong>A person, reading aloud</strong> — the same words a child is learning on '
                 'this page.',
                 'لا آية في السماء، ولا معجزة تُسافر إليها. بل '
                 '<strong>إنسان يقرأ بصوته</strong> — الكلمات نفسها التي يتعلمها الطفل في هذه '
                 'الصفحة.'),
                dict(items=[
                    ('👤 A <strong>Messenger</strong>', '👤 <strong>رسول</strong>'),
                    ('📄 Reciting <strong>pure pages</strong>', '📄 يتلو <strong>صحفاً مطهرة</strong>'),
                    ('✨ Holding <strong>upright writings</strong>', '✨ فيها <strong>كتب قيّمة</strong>'),
                ]),
            ],
        ),
        dict(
            cls='story-card special',
            h2=('💎 The Verse That Holds Everything', '💎 الآية التي تجمع كل شيء'),
            body=[
                ('Verse 5 says people were commanded to do only this: <strong>worship Allah with a '
                 'sincere heart, keep up the prayer, and give zakah</strong>. And then: '
                 '<em>that is the upright religion</em>.',
                 'تقول الآية الخامسة إنهم ما أُمروا إلا بهذا: <strong>أن يعبدوا الله مخلصين له '
                 'الدين، ويقيموا الصلاة، ويؤتوا الزكاة</strong>. ثم: <em>وذلك دين القيّمة</em>.'),
                ('Notice the first thing on the list is not an action at all — it is '
                 '<em>sincerity</em>. Doing it because it is Allah you are doing it for, not '
                 'because someone is watching.',
                 'وانظر إلى أول ما في القائمة، فليس عملاً أصلاً، بل <em>الإخلاص</em>. أن تعمل لأن '
                 'الله هو الذي تعمل له، لا لأن أحداً يراك.'),
                ('So the religion is not complicated. It is: mean it, pray, and give.',
                 'فالدين ليس معقداً. إنه: أخلِص، وصلِّ، وأعطِ.'),
            ],
            badges=[
                ('💚 Mean it', '💚 أخلِص'),
                ('🕌 Pray', '🕌 وصلِّ'),
                ('🤲 Give', '🤲 وأعطِ'),
            ],
        ),
        dict(
            cls='story-card healing',
            h2=('🌊 The Best of Creation', '🌊 خير البرية'),
            body=[
                ('The surah names two outcomes. Those who rejected the proof <em>after</em> it '
                 'reached them clearly — the Fire is stated once, as the Quran states it. This is '
                 'about <strong>a choice people made</strong> when the truth was already plain to '
                 'them, not about anyone\'s family or people.',
                 'وتذكر السورة مآلين. فمن ردّ البينة <em>بعد</em> أن جاءته واضحة — والنار تُذكر '
                 'مرة واحدة كما ذكرها القرآن. والكلام عن <strong>اختيارٍ اختاروه</strong> وقد '
                 'استبان لهم الحق، لا عن قومٍ بأعيانهم ولا عن نسب.'),
                ('And then the other side, which is where the surah rests: those who believe and do '
                 'good are <strong>the best of creation</strong>. Their reward is gardens with '
                 'rivers running underneath, forever.',
                 'ثم الجانب الآخر، وعنده تستقر السورة: الذين آمنوا وعملوا الصالحات هم '
                 '<strong>خير البرية</strong>. وجزاؤهم جنات عدن تجري من تحتها الأنهار خالدين '
                 'فيها أبداً.'),
                ('The last line is the most beautiful thing in it: <strong>Allah is pleased with '
                 'them, and they are pleased with Him</strong>. It goes both ways.',
                 'وآخر سطر فيها أجمل ما فيها: <strong>رضي الله عنهم ورضوا عنه</strong>. رضا '
                 'من الجهتين.'),
            ],
        ),
    ],

    verses=[
        dict(
            ar='لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ',
            tl='Lam yakunil-ladheena kafaroo min ahlil-kitabi wal-mushrikeena munfakkeena hatta ta\'tiyahumul-bayyinah',
            tr_en='"Those who disbelieved among the People of the Book and the idolaters were not '
                  'going to change until the clear proof came to them."',
            tr_ar='"لم يكن الذين كفروا من أهل الكتاب والمشركين منفكين حتى تأتيهم البينة"',
            ex_en='People were stuck where they were. Allah did not leave them there — '
                  '<strong>He sent something clear enough to move them</strong>.',
            ex_ar='كان الناس واقفين حيث هم، فلم يتركهم الله كذلك — '
                  '<strong>بل أرسل ما يَبِينُ فيتحرّكون به</strong>.',
        ),
        dict(
            ar='رَسُولٌ مِنَ اللَّهِ يَتْلُو صُحُفًا مُطَهَّرَةً',
            tl='Rasoolum-minal-lahi yatloo suhufam-mutahharah',
            tr_en='"A Messenger from Allah, reciting purified pages,"',
            tr_ar='"رسول من الله يتلو صحفاً مطهرة"',
            ex_en='This is what the clear proof turned out to be: <strong>a person reading aloud</strong>. '
                  '<em>Purified</em> means nothing false ever got into them.',
            ex_ar='وهذه هي البينة: <strong>إنسان يتلو بصوته</strong>. و<em>مطهرة</em> أي لم يدخلها '
                  'باطل قط.',
        ),
        dict(
            ar='فِيهَا كُتُبٌ قَيِّمَةٌ',
            tl='Feeha kutubun qayyimah',
            tr_en='"within which are upright writings."',
            tr_ar='"فيها كتب قيّمة"',
            ex_en='<em>Qayyimah</em> means <strong>straight, standing upright</strong> — writings '
                  'that hold you up rather than lead you sideways.',
            ex_ar='و<em>القيّمة</em> أي <strong>المستقيمة القائمة</strong> — كتب تقيمك ولا '
                  'تميل بك.',
        ),
        dict(
            ar='وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِنْ بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ',
            tl='Wa ma tafarraqal-ladheena ootul-kitaba illa mim ba\'di ma ja\'at-humul-bayyinah',
            tr_en='"And those given the Book did not divide until after the clear proof came to them."',
            tr_ar='"وما تفرق الذين أوتوا الكتاب إلا من بعد ما جاءتهم البينة"',
            ex_en='A sad note: they split <strong>after</strong> it became clear, not before. '
                  'Knowing the right thing and still arguing is an old human habit.',
            ex_ar='ملحظ محزن: تفرقوا <strong>بعد</strong> أن استبان الأمر لا قبله. فمعرفة الحق '
                  'ثم الاختلاف عادة قديمة في الناس.',
        ),
        dict(
            ar='وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ وَذَٰلِكَ دِينُ الْقَيِّمَةِ',
            tl='Wa ma umiroo illa liya\'budul-laha mukhliseena lahud-deena hunafa\'a wa yuqeemus-salata wa yu\'tuz-zakah wa dhalika deenul-qayyimah',
            tr_en='"And they were commanded only to worship Allah, sincere to Him in religion, '
                  'upright, and to establish prayer and give zakah — and that is the upright religion."',
            tr_ar='"وما أمروا إلا ليعبدوا الله مخلصين له الدين حنفاء ويقيموا الصلاة ويؤتوا الزكاة وذلك دين القيّمة"',
            ex_en='<strong>The whole religion in one verse.</strong> Mean it, pray, give. And the '
                  'first of the three is the one nobody else can see.',
            ex_ar='<strong>الدين كله في آية.</strong> إخلاصٌ، وصلاةٌ، وزكاة. وأولها هو الذي '
                  'لا يراه أحد سواه.',
        ),
        dict(
            ar='إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ',
            tl='Innal-ladheena kafaroo min ahlil-kitabi wal-mushrikeena fee nari jahannama khalideena feeha ula\'ika hum sharrul-bariyyah',
            tr_en='"Indeed, those who disbelieved among the People of the Book and the idolaters '
                  'will be in the Fire of Hell, abiding therein. Those are the worst of creation."',
            tr_ar='"إن الذين كفروا من أهل الكتاب والمشركين في نار جهنم خالدين فيها أولئك هم شر البرية"',
            ex_en='Said once, as the Quran says it. It is about <strong>those who turned the proof '
                  'away after seeing it clearly</strong> — a choice, not a family a person was born '
                  'into.',
            ex_ar='تُقال مرة واحدة كما قالها القرآن. والكلام عمّن <strong>ردّ البينة بعد أن '
                  'رآها واضحة</strong> — اختيارٌ، لا نسبٌ وُلد فيه المرء.',
        ),
        dict(
            ar='إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ',
            tl='Innal-ladheena amanoo wa \'amilus-salihati ula\'ika hum khayrul-bariyyah',
            tr_en='"Indeed, those who believe and do righteous deeds — those are the best of creation."',
            tr_ar='"إن الذين آمنوا وعملوا الصالحات أولئك هم خير البرية"',
            ex_en='<strong>The best of everything Allah made.</strong> Not the strongest or the '
                  'richest — the ones who believed and then acted like it.',
            ex_ar='<strong>خير كل ما خلق الله.</strong> لا الأقوى ولا الأغنى — بل من آمن ثم '
                  'عمل بمقتضى إيمانه.',
        ),
        dict(
            ar='جَزَاؤُهُمْ عِنْدَ رَبِّهِمْ جَنَّاتُ عَدْنٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ ذَٰلِكَ لِمَنْ خَشِيَ رَبَّهُ',
            tl='Jaza\'uhum \'inda Rabbihim jannatu \'adnin tajree min tahtihal-anharu khalideena feeha abada radiyal-lahu \'anhum wa radoo \'anhu dhalika liman khashiya Rabbah',
            tr_en='"Their reward with their Lord is gardens of perpetual residence beneath which '
                  'rivers flow, abiding there forever. Allah is pleased with them and they are '
                  'pleased with Him. That is for whoever fears his Lord."',
            tr_ar='"جزاؤهم عند ربهم جنات عدن تجري من تحتها الأنهار خالدين فيها أبداً رضي الله عنهم ورضوا عنه ذلك لمن خشي ربه"',
            ex_en='The loveliest ending. <strong>He is pleased with them, and they are pleased with '
                  'Him</strong> — it goes both ways, and nothing is left wanting on either side.',
            ex_ar='أجمل خاتمة. <strong>رضي عنهم ورضوا عنه</strong> — رضاً من الجهتين، لم يبقَ '
                  'عند أحدهما ما يتمناه.',
        ),
    ],

    quiz=[
        dict(
            q=('What does "Al-Bayyinah" mean?', 'ماذا تعني كلمة "البينة"؟'),
            options=[
                ('A long and difficult journey', 'رحلة طويلة شاقة', False),
                ('A house built out of stone', 'بيت مبني من الحجر', False),
                ('The clear proof', 'الحجة الواضحة', True),
                ('A gift given in the morning', 'هدية تُعطى في الصباح', False),
            ],
        ),
        dict(
            q=('What did the clear proof turn out to be?', 'ما الذي كانت البينة؟'),
            options=[
                ('A Messenger reciting pure pages', 'رسول يتلو صحفاً مطهرة', True),
                ('A great light filling the whole sky', 'نور عظيم يملأ السماء', False),
                ('A mountain that moved from its place', 'جبل انتقل من مكانه', False),
                ('A book that fell down from the clouds', 'كتاب نزل من بين الغيوم', False),
            ],
        ),
        dict(
            q=('What three things does verse 5 command?', 'بأي ثلاثة أمور تأمر الآية الخامسة؟'),
            options=[
                ('Reading, writing and learning by heart', 'القراءة والكتابة والحفظ', False),
                ('Travelling, trading and building', 'السفر والتجارة والبناء', False),
                ('Fasting, resting and staying silent', 'الصيام والراحة والصمت', False),
                ('Sincere worship, prayer, and zakah', 'الإخلاص في العبادة والصلاة والزكاة', True),
            ],
        ),
        dict(
            q=('How does the surah describe the reward at the end?',
               'كيف تصف السورة الجزاء في آخرها؟'),
            options=[
                ('That they will be given a great many things', 'أنهم يُعطون أشياء كثيرة', False),
                ('Allah pleased with them, and they with Him', 'رضي الله عنهم ورضوا عنه', True),
                ('That they will finally be allowed to rest', 'أنهم يُؤذن لهم بالراحة أخيراً', False),
                ('That everyone will know their names', 'أن الناس جميعاً يعرفون أسماءهم', False),
            ],
        ),
    ],

    reflect_h_en='💬 Sincerity Comes First',
    reflect_h_ar='💬 الإخلاص أولاً',
    reflect=[
        ('It is worth sitting with the order in verse 5. Prayer and zakah are things other people '
         'can see you doing. Sincerity is not. And it is named first.',
         'ويحسن الوقوف عند ترتيب الآية الخامسة. فالصلاة والزكاة يراهما الناس منك، والإخلاص لا '
         'يُرى. ومع ذلك ذُكر أولاً.'),
        ('The Prophet ﷺ taught that actions are judged by their intentions. This verse is where a '
         'child can first meet that idea: the same good deed can be worth everything or very '
         'little, depending on who you did it for.',
         'وقد علّم النبي ﷺ أن الأعمال بالنيات. وعند هذه الآية يلقى الطفل هذا المعنى أول مرة: '
         'فالعمل الواحد قد يساوي كل شيء أو لا يساوي شيئاً، بحسب من عملتَه له.'),
    ],

    facts=[
        ('It is surah number <strong>98</strong> in the Quran', 'هي السورة رقم <strong>٩٨</strong> في القرآن'),
        ('It is a <strong>Madani</strong> surah, revealed after the Hijrah',
         'هي سورة <strong>مدنية</strong>، نزلت بعد الهجرة'),
        ('Its verses are <strong>longer</strong> than its neighbours\'',
         'وآياتها <strong>أطول</strong> من آيات جاراتها'),
        ('Verse 5 sums up <strong>the whole religion</strong>', 'والآية ٥ تجمع <strong>الدين كله</strong>'),
        ('<em>Bariyyah</em> means <strong>everything Allah created</strong>',
         '<em>البرية</em> تعني <strong>كل ما خلق الله</strong>'),
        ('It ends with <strong>pleasure on both sides</strong>', 'وتختم بـ<strong>رضاً من الجهتين</strong>'),
    ],

    tips=[
        dict(icon='5️⃣', h=('Start With Verse 5', 'ابدأ بالآية الخامسة'),
             p=('It is the heart of the surah and the one you will use most. Learn it first.',
                'هي قلب السورة وأكثرها استعمالاً. فاحفظها أولاً.')),
        dict(icon='🐢', h=('Slower Than the Others', 'أبطأ من غيرها'),
             p=('These verses are long, so take one a day rather than the whole surah at once.',
                'آياتها طويلة، فخذ آية في اليوم بدل السورة كلها دفعة واحدة.')),
        dict(icon='⚖️', h=('A Matched Pair', 'آيتان متقابلتان'),
             p=('Verses 6 and 7 mirror each other: worst of creation, then best of creation.',
                'الآيتان ٦ و٧ متقابلتان: شر البرية، ثم خير البرية.')),
        dict(icon='🤲', h=('Make Dua', 'ادعُ الله'),
             p=('Ask Allah to help you memorize and understand His words.',
                'اطلب من الله أن يعينك على حفظ كلامه وفهمه.')),
    ],

    ask_en='If nobody ever knew about a good thing you did, would you still want to do it?',
    ask_ar='لو لم يعلم أحد أبداً بالخير الذي تفعله، أكنت تحب أن تفعله؟',
    recap_en='That feeling is what verse 5 calls sincerity, and Allah put it first.',
    recap_ar='ذلك الشعور هو ما تسمّيه الآية الخامسة إخلاصاً، وقد قدّمه الله أولاً.',

    prev='surah-al-adiyat.html',
    prev_en='← Surah Al-Adiyat',
    prev_ar='السابق: سورة العاديات',
    next='ayat-al-kursi.html',
    next_en='Ayat al-Kursi →',
    next_ar='التالي: آية الكرسي',
)
