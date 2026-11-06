// Stories Interactive JavaScript

var childName = '';

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a saved name
    childName = localStorage.getItem('islamicKidsName') || '';

    // v2: no name prompt. The child's name is an optional setting (reader
    // settings sheet, Home settings); with none, nothing is personalised.
    if (childName) {
        personalizeStory();
    }

    markFeedbackRegions();
    initializeProgress();
    initializeMiniQuizzes();
    initializeFinalQuiz();
    initializeModeButtons();
    initializeSoundEffects();
    initializeSlideMode();
    initializeFullscreenMode();
    initializeBackgroundAnimations();
});

// Quiz and activity feedback is announced politely when it changes (v2, a11y).
// Set here, not in the HTML, so the quiz markup the checkers parse is untouched.
function markFeedbackRegions() {
    document.querySelectorAll('.quiz-feedback, .choice-feedback, .emotion-feedback, .activity-feedback')
        .forEach(function (el) { el.setAttribute('role', 'status'); });
}

function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// Look up a translated string, falling back to the English text if the
// translations layer has not loaded (stories.js also runs on its own).
function t(key, fallback) {
    if (window.i18n && typeof window.i18n.getText === 'function') {
        var v = window.i18n.getText(key);
        if (v && v !== key) return v;
    }
    return fallback;
}

function personalizeStory() {
    // Update welcome message if exists
    const welcomeElements = document.querySelectorAll('.personalized-name');
    welcomeElements.forEach(el => {
        el.textContent = childName;
    });

    // Add personalized greeting to story header
    const storyHeader = document.querySelector('.story-header');
    if (storyHeader && !document.querySelector('.personal-greeting')) {
        const greeting = document.createElement('div');
        greeting.className = 'personal-greeting';
        greeting.textContent = t('welcomeGreeting', '👋 Welcome, {name}! Enjoy this story!').replace('{name}', childName);
        storyHeader.insertBefore(greeting, storyHeader.firstChild);
    }

    // Update quiz results with name
    const quizResults = document.getElementById('quizResults');
    if (quizResults) {
        const resultsContent = quizResults.querySelector('.results-content h2');
        if (resultsContent && !resultsContent.dataset.personalized) {
            resultsContent.textContent = t('congratsName', 'Congratulations, {name}!').replace('{name}', childName);
            resultsContent.dataset.personalized = 'true';
        }
    }
}

// Progress Bar (only for classic scroll mode)
function initializeProgress() {
    const storyContent = document.getElementById('storyContent');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');

    if (!storyContent || !progressBar) return;

    // Skip scroll-based progress if using slide mode
    if (!storyContent.classList.contains('classic-scroll')) {
        return;
    }

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = storyContent.offsetHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const scrollPercent = Math.max(0, Math.min((scrollTop / docHeight) * 100, 100));

        progressBar.style.width = scrollPercent + '%';
        if (progressText) {
            var pct = Math.round(scrollPercent);
            progressText.textContent = document.documentElement.lang === 'ar'
                ? '٪' + pct.toLocaleString('ar-EG') + ' مكتمل'
                : pct + '% Complete';
        }
    });
}

// Mini Quizzes (during story)
function initializeMiniQuizzes() {
    const miniQuizzes = document.querySelectorAll('.mini-quiz');

    miniQuizzes.forEach(quiz => {
        setupMiniQuiz(quiz);
    });
}

function setupMiniQuiz(quiz) {
    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('.quiz-feedback');

    options.forEach(option => {
        option.addEventListener('click', function() {
            // Prevent multiple answers if already answered correctly
            if (quiz.classList.contains('answered-correct')) return;
            if (this.getAttribute('aria-disabled') === 'true') return;

            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                // Mark as correctly answered
                quiz.classList.add('answered-correct');
                this.classList.add('correct');
                feedback.textContent = t('feedbackCorrect', '🎉 Correct! Great job!');
                feedback.className = 'quiz-feedback correct';
                playSound('correct');
                createConfetti(quiz);

                // Disable all options
                options.forEach(opt => opt.setAttribute('aria-disabled', 'true'));   // aria-disabled keeps focus on the button (v2)
            } else {
                this.classList.add('incorrect');
                showRetryFeedback(feedback, 'mini', quiz);
                playSound('incorrect');

                // Disable only this wrong option
                this.setAttribute('aria-disabled', 'true');
            }
        });
    });
}

function showRetryFeedback(feedback, type, quizElement) {
    // Clear existing content
    feedback.textContent = '';
    feedback.className = 'quiz-feedback incorrect';

    // Create message
    const message = document.createElement('span');
    message.textContent = t('feedbackTryAgain', '💪 Not quite! Try again! ');
    feedback.appendChild(message);

    // Create line break
    feedback.appendChild(document.createElement('br'));

    // Create retry button
    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = t('retryButton', '🔄 Try Again');
    retryBtn.addEventListener('click', function() {
        if (type === 'mini') {
            resetMiniQuiz(quizElement);
        } else {
            resetFinalQuizCard(quizElement);
        }
    });
    feedback.appendChild(retryBtn);
}

function resetMiniQuiz(quiz) {
    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('.quiz-feedback');

    // Reset all wrong options
    options.forEach(opt => {
        if (opt.getAttribute('data-correct') !== 'true') {
            opt.classList.remove('incorrect');
            opt.removeAttribute('aria-disabled');
        }
    });

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    focusFirstOpen(options);
}

// The retry button that had focus is removed by a reset; put focus on the
// first answer that can still be chosen instead of losing it to <body>.
function focusFirstOpen(options) {
    for (var i = 0; i < options.length; i++) {
        if (options[i].getAttribute('aria-disabled') !== 'true') { options[i].focus(); return; }
    }
}

// Final Quiz
let score = 0;

function initializeFinalQuiz() {
    const quizCards = document.querySelectorAll('.final-quiz-section .quiz-card');

    quizCards.forEach((card, index) => {
        setupFinalQuizCard(card, index);
    });
}

function setupFinalQuizCard(card, index) {
    const options = card.querySelectorAll('.quiz-option');
    const feedback = card.querySelector('.quiz-feedback');

    options.forEach(option => {
        option.addEventListener('click', function() {
            // Prevent if already answered correctly
            if (card.classList.contains('answered-correct')) return;
            if (this.getAttribute('aria-disabled') === 'true') return;

            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                card.classList.add('answered-correct');
                card.dataset.cardIndex = index;
                this.classList.add('correct');
                feedback.textContent = t('feedbackCorrectAlt', '🎉 Correct! Well done!');
                feedback.className = 'quiz-feedback correct';
                score++;
                playSound('correct');
                createConfetti(card);

                // Disable all options
                options.forEach(opt => opt.setAttribute('aria-disabled', 'true'));   // aria-disabled keeps focus on the button (v2)

                // Move to next question after delay
                setTimeout(() => {
                    showNextQuestion(index);
                }, 1500);
            } else {
                this.classList.add('incorrect');
                card.dataset.cardIndex = index;
                showRetryFeedback(feedback, 'final', card);
                playSound('incorrect');

                // Disable only this wrong option
                this.setAttribute('aria-disabled', 'true');
            }
        });
    });
}

function resetFinalQuizCard(card) {
    const options = card.querySelectorAll('.quiz-option');
    const feedback = card.querySelector('.quiz-feedback');

    // Reset wrong options
    options.forEach(opt => {
        if (opt.getAttribute('data-correct') !== 'true') {
            opt.classList.remove('incorrect');
            opt.removeAttribute('aria-disabled');
        }
    });

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    focusFirstOpen(options);
}

function showNextQuestion(currentIndex) {
    const storyContent = document.getElementById('storyContent');
    const isSlideMode = storyContent && !storyContent.classList.contains('classic-scroll') && document.getElementById('storySlides');

    if (isSlideMode) {
        // In slide mode, just go to next slide
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }

        setTimeout(() => {
            nextSlide();
            // Check if we're now on results slide
            const currentSlideElement = document.querySelector('.story-slide[data-slide-index="' + currentSlide + '"]');
            if (currentSlideElement && currentSlideElement.querySelector('.quiz-results')) {
                createConfetti(currentSlideElement);
                playSound('success');
            }
        }, 1000);
    } else {
        // Classic scroll mode
        const quizCards = document.querySelectorAll('.final-quiz-section .quiz-card');
        const quizResults = document.getElementById('quizResults');
        const videoSection = document.getElementById('videoSection');
        const scoreDisplay = document.getElementById('scoreDisplay');

        if (currentIndex < quizCards.length - 1) {
            // Show next question
            quizCards[currentIndex + 1].classList.remove('hidden');
            quizCards[currentIndex + 1].scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        } else {
            // Show results
            if (quizResults) {
                quizResults.classList.remove('hidden');
                if (scoreDisplay) {
                    scoreDisplay.textContent = score;
                }

                // Create celebration effect
                createConfetti(quizResults);
                playSound('success');

                // Show video section after delay
                setTimeout(() => {
                    if (videoSection) {
                        videoSection.classList.remove('hidden');
                        videoSection.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
                    }
                }, 2000);
            }
        }
    }
}

// Mode Buttons (Read/Listen)
function initializeModeButtons() {
    const readMode = document.getElementById('readMode');
    const listenMode = document.getElementById('listenMode');

    if (readMode && listenMode) {
        readMode.addEventListener('click', function() {
            readMode.classList.add('active');
            listenMode.classList.remove('active');
        });

        listenMode.addEventListener('click', function() {
            listenMode.classList.add('active');
            readMode.classList.remove('active');
            // v2: Listen mode starts the narration (it used to alert "coming soon").
            if (window.AudioNarration && !window.AudioNarration.isPlaying) {
                window.AudioNarration.togglePlayPause();
            }
        });
    }
}

// Sound Effects
function initializeSoundEffects() {
    window.sounds = {
        correct: null,
        incorrect: null,
        success: null,
        pageFlip: null
    };
}

function playSound(soundName) {
    console.log('Playing sound:', soundName);

    if (soundName === 'correct') {
        document.body.style.animation = 'flashGreen 0.3s ease';
        setTimeout(() => document.body.style.animation = '', 300);
    }
}

// Confetti Effect
function createConfetti(container) {
    const colors = ['var(--ornament)', 'var(--ornament-light)', 'var(--action-bright)', 'var(--quran)', 'var(--reward-wash)'];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('span');
        confetti.className = 'confetti';
        confetti.style.cssText = [
            'position: absolute',
            'width: 10px',
            'height: 10px',
            'background: ' + colors[Math.floor(Math.random() * colors.length)],
            'border-radius: 50%',
            'pointer-events: none',
            'animation: confettiFall ' + (1 + Math.random()) + 's ease-out forwards',
            'left: ' + (Math.random() * 100) + '%',
            'top: 50%',
            'z-index: 1000'
        ].join(';');

        container.style.position = 'relative';
        container.style.overflow = 'visible';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Add styles for retry button and animations
// Retry button and the two one-shot effects. v2: palette tokens only, no hex
// in JS (frontend hard rule 1), and explicit transition properties.
const style = document.createElement('style');
style.textContent = [
    '@keyframes confettiFall {',
    '    0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }',
    '    100% { opacity: 0; transform: translateY(-100px) rotate(720deg) scale(0); }',
    '}',
    '@keyframes flashGreen {',
    '    0%, 100% { background-color: inherit; }',
    '    50% { background-color: var(--action-wash); }',
    '}',
    '.retry-btn {',
    '    background: var(--surface-1);',
    '    color: var(--text-1);',
    '    border: 1px solid var(--line);',
    '    min-height: 44px;',
    '    padding: 0 1.25rem;',
    '    border-radius: 999px;',
    '    font-weight: 700;',
    '    cursor: pointer;',
    '    margin-top: 0.8rem;',
    '    font-size: 1rem;',
    '    transition: var(--t-press);',
    '}',
    '.retry-btn:active { transform: scale(0.97); }',
    '.quiz-feedback.incorrect { color: #B42318; }',
    '.quiz-feedback.correct { color: var(--action); }'
].join('\n');
document.head.appendChild(style);

// v2: story scenes are no longer hidden until an IntersectionObserver fires.
// That hid the first slide (blank until scrolled into view, and blank in print
// and full-page captures). Slide mode shows one page at a time anyway.

// =====================================================
// SLIDE MODE: the app reader
// One page at a time, stacked in a grid cell and cross-faded. Hidden pages are
// inert. A polite live region says "Page n of N". Swipe, arrow keys and the
// arrow glyphs follow the reading direction, so in Arabic the book turns the
// other way. Chrome: a minimal top bar (close, title and page, Aa, read-aloud,
// settings), a floating transport (previous, play, next) and a settings sheet.
// =====================================================
let currentSlide = 0;
let totalSlides = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

var ICONS = 'vendor/icons/sprite.svg#i-';
function icon(name, extra) {
    return '<svg class="icon' + (extra ? ' ' + extra : '') + '" aria-hidden="true"><use href="' + ICONS + name + '"/></svg>';
}

function isRTL() {
    return document.documentElement.dir === 'rtl';
}

function readerLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

function digits(n) {
    return readerLang() === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
}

var READER_TEXT = {
    en: { close: 'Close story', page: 'Page {n} of {N}', prev: 'Previous page', next: 'Next page',
          size: 'Text size', sizes: ['small', 'medium', 'large'], sound: 'Read each page aloud',
          settings: 'Reading settings', sheetTitle: 'Reading settings', textSize: 'Text size',
          narration: 'Narration', display: 'Display', bedtime: 'Bedtime colours', bedtimeSub: 'A dim, warm page for a dark room',
          fullscreen: 'Full screen', fullscreenSub: 'Hide everything but the page', language: 'Language', done: 'Done',
          childName: "Child's name", childNameHint: 'Saved on this device only. It is never sent anywhere.',
          restart: 'Start over', restartSub: 'Go back to page 1 of this story' },
    ar: { close: 'إغلاق القصة', page: 'صفحة {n} من {N}', prev: 'الصفحة السابقة', next: 'الصفحة التالية',
          size: 'حجم الخط', sizes: ['صغير', 'متوسط', 'كبير'], sound: 'اقرأ كل صفحة بصوت عالٍ',
          settings: 'إعدادات القراءة', sheetTitle: 'إعدادات القراءة', textSize: 'حجم الخط',
          narration: 'السرد', display: 'العرض', bedtime: 'ألوان الليل', bedtimeSub: 'صفحة خافتة ودافئة لغرفة مظلمة',
          fullscreen: 'ملء الشاشة', fullscreenSub: 'إخفاء كل شيء ما عدا الصفحة', language: 'اللغة', done: 'تم',
          childName: 'اسم الطفل', childNameHint: 'يُحفظ على هذا الجهاز فقط، ولا يُرسل إلى أي مكان.',
          restart: 'من البداية', restartSub: 'العودة إلى الصفحة الأولى من القصة' }
};

function rt(key) {
    return READER_TEXT[readerLang()][key];
}

function storyId() {
    return (location.pathname.split('/').pop() || '').replace(/^story-/, '').replace(/\.html$/, '');
}

function saveStoryProgress() {
    try {
        var all = JSON.parse(localStorage.getItem('ik-story-progress') || '{}') || {};
        var prev = all[storyId()] || {};
        all[storyId()] = {
            slide: currentSlide,
            total: totalSlides,
            done: prev.done || currentSlide >= totalSlides - 1,
            t: Date.now()
        };
        localStorage.setItem('ik-story-progress', JSON.stringify(all));
    } catch (e) { /* private mode: the reader still works, it just forgets */ }
}

function initializeSlideMode() {
    const storyContent = document.getElementById('storyContent');
    if (!storyContent) return;

    // Skip slide mode if story uses classic scroll format
    if (storyContent.classList.contains('classic-scroll')) {
        return;
    }

    // Get all content elements including final quiz and video
    const storyScenes = storyContent.querySelectorAll('.story-scene, .mini-quiz, .lesson-box, .dua-box');
    const finalQuizSection = document.getElementById('finalQuiz');
    const videoSection = document.getElementById('videoSection');

    if (storyScenes.length === 0) return;

    const allSlideContent = Array.from(storyScenes);

    if (finalQuizSection) {
        const quizIntro = finalQuizSection.querySelector('.quiz-intro');
        const quizCards = finalQuizSection.querySelectorAll('.quiz-card');
        const quizResults = finalQuizSection.querySelector('.quiz-results');

        if (quizIntro) allSlideContent.push(quizIntro);
        quizCards.forEach(card => {
            card.classList.remove('hidden');
            allSlideContent.push(card);
        });
        if (quizResults) {
            quizResults.classList.remove('hidden');
            allSlideContent.push(quizResults);
        }
    }

    if (videoSection) {
        videoSection.classList.remove('hidden');
        allSlideContent.push(videoSection);
    }

    totalSlides = allSlideContent.length;

    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'story-slides-container';

    const slidesWrapper = document.createElement('div');
    slidesWrapper.className = 'story-slides';
    slidesWrapper.id = 'storySlides';

    // Move the real elements (not clones) so their listeners survive
    allSlideContent.forEach((content, index) => {
        const slide = document.createElement('section');
        slide.className = 'story-slide';
        slide.dataset.slideIndex = index;
        slide.setAttribute('aria-roledescription', 'page');
        slide.appendChild(content);
        slidesWrapper.appendChild(slide);
    });

    if (finalQuizSection) finalQuizSection.style.display = 'none';
    if (videoSection) videoSection.style.display = 'none';

    slidesContainer.appendChild(slidesWrapper);
    storyContent.insertBefore(slidesContainer, storyContent.firstChild);

    // Read the saved place before the chrome is built: building it relabels and
    // saves the current page, which would overwrite the place with page 1.
    var resumeAt = 0;
    try {
        var saved = (JSON.parse(localStorage.getItem('ik-story-progress') || '{}') || {})[storyId()];
        if (saved && !saved.done && saved.slide > 0 && saved.slide < totalSlides && !/[?&]resume=0/.test(location.search)) {
            resumeAt = saved.slide;
        }
    } catch (e) {}
    currentSlide = resumeAt;

    buildReaderChrome(slidesContainer);

    slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    slidesContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeyNavigation);
    document.addEventListener('languageChanged', relabelReader);

    // Re-initialize mini quizzes in slides
    const slideQuizzes = slidesWrapper.querySelectorAll('.mini-quiz');
    slideQuizzes.forEach(quiz => setupMiniQuiz(quiz));

    updateSlideView(true);   // silent: nothing is announced on load
}

function buildReaderChrome(slidesContainer) {
    document.body.classList.add('reader');

    // --- top bar ---
    const bar = document.createElement('div');
    bar.className = 'reader-bar';
    bar.id = 'readerBar';
    var title = document.querySelector('.story-title');
    bar.innerHTML =
        '<a class="icon-btn" id="readerClose" href="stories.html">' + icon('x') + '</a>' +
        '<div class="reader-bar__title"><span class="reader-bar__name" id="readerName"></span>' +
        '<span class="reader-count" aria-hidden="true"><span id="currentSlideNum">1</span></span></div>' +
        '<div class="reader-bar__actions" id="readerActions">' +
            '<button class="icon-btn reader-aa" id="readerTextSize" type="button"><span aria-hidden="true">Aa</span></button>' +
            '<button class="icon-btn" id="readerSound" type="button" aria-pressed="true">' + icon('volume-2', 'icon-on') + icon('volume-x', 'icon-off') + '</button>' +
            '<button class="icon-btn" id="readerSettings" type="button" aria-haspopup="dialog">' + icon('settings-2') + '</button>' +
        '</div>' +
        '<div class="reader-progress" aria-hidden="true"><span id="readerProgressFill"></span></div>';
    document.body.insertBefore(bar, document.body.firstChild);

    // One toolbar: the stars counter and the effects-sound toggle (Adam,
    // Ibrahim) join the bar instead of floating over the page.
    var actions = bar.querySelector('#readerActions');
    var stars = document.getElementById('starsCounter');
    if (stars) actions.insertBefore(stars, actions.firstChild);
    var fx = document.getElementById('soundToggle');
    if (fx) {
        fx.classList.add('icon-btn');
        fx.setAttribute('type', 'button');
        actions.insertBefore(fx, document.getElementById('readerSound'));
    }

    // --- live region: "Page n of N" ---
    const live = document.createElement('div');
    live.id = 'readerLive';
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    slidesContainer.after(live);

    // --- floating transport: previous / play / next ---
    const transport = document.createElement('div');
    transport.className = 'reader-transport';
    transport.id = 'readerTransport';
    transport.innerHTML =
        '<button class="icon-btn transport-btn" id="prevSlide" type="button">' + icon('chevron-left', 'flip-rtl') + '</button>' +
        '<div class="transport-play" id="transportPlay"></div>' +
        '<button class="icon-btn transport-btn" id="nextSlide" type="button">' + icon('chevron-right', 'flip-rtl') + '</button>';
    // Old id kept so anything that looks for the slide navigation still finds it
    transport.setAttribute('data-role', 'slide-navigation');
    document.body.appendChild(transport);

    document.getElementById('prevSlide').addEventListener('click', prevSlide);
    document.getElementById('nextSlide').addEventListener('click', nextSlide);

    // --- settings sheet ---
    const sheet = document.createElement('dialog');
    sheet.className = 'sheet';
    sheet.id = 'readerSheet';
    sheet.setAttribute('aria-labelledby', 'readerSheetTitle');
    sheet.innerHTML =
        '<div class="sheet__grabber" aria-hidden="true"></div>' +
        '<div class="sheet__head"><h2 id="readerSheetTitle"></h2>' +
        '<button class="btn btn--secondary" id="readerSheetDone" type="button"></button></div>' +
        '<div class="sheet-group"><span class="sheet-label" id="lblTextSize"></span>' +
            '<div class="segmented" role="group" aria-labelledby="lblTextSize" id="sizeSeg">' +
            '<button type="button" data-size="s"></button><button type="button" data-size="m"></button><button type="button" data-size="l"></button></div></div>' +
        '<div class="sheet-group"><span class="sheet-label" id="lblLanguage"></span>' +
            '<div class="segmented" role="group" aria-labelledby="lblLanguage" id="langSeg">' +
            '<button type="button" data-lang="en" lang="en">English</button><button type="button" data-lang="ar" lang="ar">العربية</button></div></div>' +
        '<div class="sheet-group"><label class="sheet-label" for="readerChildName" id="lblChildName"></label>' +
            '<input class="text-field" id="readerChildName" type="text" maxlength="20" autocomplete="off" spellcheck="false">' +
            '<p class="field-hint" id="lblChildNameHint"></p></div>' +
        '<div class="sheet-group" id="narrSettings"><span class="sheet-label" id="lblNarration"></span></div>' +
        '<div class="sheet-group"><span class="sheet-label" id="lblDisplay"></span>' +
            '<button class="setting-row" type="button" role="switch" id="bedtimeSwitch" aria-checked="false"><span><span id="lblBedtime"></span><small id="lblBedtimeSub"></small></span><span class="switch" aria-hidden="true"></span></button>' +
            '<button class="setting-row" type="button" id="restartRow"><span><span id="lblRestart"></span><small id="lblRestartSub"></small></span>' + icon('repeat') + '</button>' +
            '<button class="setting-row" type="button" id="fullscreenRow"><span><span id="lblFullscreen"></span><small id="lblFullscreenSub"></small></span>' + icon('maximize-2') + '</button>' +
        '</div>';
    document.body.appendChild(sheet);

    document.getElementById('readerSettings').addEventListener('click', openReaderSheet);
    document.getElementById('readerSheetDone').addEventListener('click', function () { sheet.close(); });
    sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });  // tap the backdrop

    // text size: Aa cycles, the sheet sets directly
    applyTextSize(localStorageGet('ik-text-size') || 'm');
    document.getElementById('readerTextSize').addEventListener('click', function () {
        var order = ['s', 'm', 'l'];
        var cur = document.documentElement.getAttribute('data-text-size') || 'm';
        applyTextSize(order[(order.indexOf(cur) + 1) % order.length]);
    });
    sheet.querySelectorAll('#sizeSeg button').forEach(function (b) {
        b.addEventListener('click', function () { applyTextSize(b.getAttribute('data-size')); });
    });

    // language
    sheet.querySelectorAll('#langSeg button').forEach(function (b) {
        b.addEventListener('click', function () {
            if (window.bilingual && window.bilingual.current() !== b.getAttribute('data-lang')) window.bilingual.toggle();
        });
    });

    // read-aloud toggle in the bar mirrors the narration autoplay setting
    document.getElementById('readerSound').addEventListener('click', function () {
        if (window.AudioNarration && window.AudioNarration.toggleAutoPlay) window.AudioNarration.toggleAutoPlay();
    });

    // bedtime (bedtime.js owns the state; this switch mirrors it)
    var bed = document.getElementById('bedtimeSwitch');
    bed.addEventListener('click', function () {
        var b = document.querySelector('.bedtime-btn');
        if (b) b.click();
        syncBedtimeSwitch();
    });

    // Start over: back to page 1 (the saved place is reset with it)
    document.getElementById('restartRow').addEventListener('click', function () {
        sheet.close();
        try {
            var all = JSON.parse(localStorage.getItem('ik-story-progress') || '{}') || {};
            delete all[storyId()];
            localStorage.setItem('ik-story-progress', JSON.stringify(all));
        } catch (e) {}
        goToSlide(0);
    });

    // The child's name: this device only (islamicKidsName), never a default
    var nameInput = document.getElementById('readerChildName');
    var saveName = function () {
        var v = nameInput.value.trim().slice(0, 20);
        try {
            if (v) localStorage.setItem('islamicKidsName', v);
            else localStorage.removeItem('islamicKidsName');
        } catch (e) {}
        childName = v;
        if (v) personalizeStory();
    };
    nameInput.addEventListener('change', saveName);
    sheet.addEventListener('close', saveName);

    document.getElementById('fullscreenRow').addEventListener('click', function () {
        sheet.close();
        toggleFullscreen();
    });

    relabelReader();
}

function localStorageGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
}

function applyTextSize(size) {
    document.documentElement.setAttribute('data-text-size', size);
    try { localStorage.setItem('ik-text-size', size); } catch (e) {}
    document.querySelectorAll('#sizeSeg button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-size') === size));
    });
    var aa = document.getElementById('readerTextSize');
    if (aa) {
        var i = ['s', 'm', 'l'].indexOf(size);
        aa.setAttribute('aria-label', rt('size') + ': ' + rt('sizes')[i]);
    }
}

function syncBedtimeSwitch() {
    var on = document.documentElement.getAttribute('data-theme') === 'bedtime';
    var bed = document.getElementById('bedtimeSwitch');
    if (bed) bed.setAttribute('aria-checked', String(on));
}

function openReaderSheet() {
    var sheet = document.getElementById('readerSheet');
    if (!sheet) return;
    syncBedtimeSwitch();
    var nameInput = document.getElementById('readerChildName');
    if (nameInput) nameInput.value = localStorageGet('islamicKidsName') || '';
    if (typeof sheet.showModal === 'function') sheet.showModal();
    else sheet.setAttribute('open', '');
}

function relabelReader() {
    var set = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    var lab = function (id, text) { var el = document.getElementById(id); if (el) el.setAttribute('aria-label', text); };
    var title = document.querySelector('.story-title');
    set('readerName', title ? title.textContent.trim() : '');
    lab('readerClose', rt('close'));
    lab('prevSlide', rt('prev'));
    lab('nextSlide', rt('next'));
    lab('readerSound', rt('sound'));
    lab('readerSettings', rt('settings'));
    set('readerSheetTitle', rt('sheetTitle'));
    set('readerSheetDone', rt('done'));
    set('lblTextSize', rt('textSize'));
    set('lblLanguage', rt('language'));
    set('lblNarration', rt('narration'));
    set('lblDisplay', rt('display'));
    set('lblBedtime', rt('bedtime'));
    set('lblBedtimeSub', rt('bedtimeSub'));
    set('lblFullscreen', rt('fullscreen'));
    set('lblChildName', rt('childName'));
    set('lblChildNameHint', rt('childNameHint'));
    set('lblRestart', rt('restart'));
    set('lblRestartSub', rt('restartSub'));
    set('lblFullscreenSub', rt('fullscreenSub'));
    var sizes = rt('sizes');
    document.querySelectorAll('#sizeSeg button').forEach(function (b, i) {
        b.textContent = sizes[i];
        b.style.fontSize = ['0.9rem', '1.05rem', '1.2rem'][i];
    });
    document.querySelectorAll('#langSeg button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === readerLang()));
    });
    applyTextSize(document.documentElement.getAttribute('data-text-size') || 'm');
    if (totalSlides) updateSlideView(true);
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    var dir = index > currentSlide ? 'forward' : 'back';
    currentSlide = index;
    updateSlideView(false, dir);
    playSound('pageFlip');

    // Bring the top of the page back into view on a long page; never move focus.
    var bar = document.getElementById('readerBar');
    var stage = document.querySelector('.story-slides-container');
    if (stage && bar) {
        var top = stage.getBoundingClientRect().top - bar.offsetHeight - 8;
        if (top < 0) {
            var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollBy({ top: top, behavior: reduced ? 'auto' : 'smooth' });
        }
    }

    // Dispatch slide changed event for audio narration
    document.dispatchEvent(new CustomEvent('slideChanged', {
        detail: { slideIndex: index }
    }));
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function updateSlideView(silent, dir) {
    const slidesWrapper = document.getElementById('storySlides');
    if (!slidesWrapper) return;

    const slides = slidesWrapper.querySelectorAll('.story-slide');
    slides.forEach(function (slide, index) {
        var on = index === currentSlide;
        slide.classList.toggle('active', on);
        slide.classList.remove('enter-forward', 'enter-back');
        if (on && dir) {
            void slide.offsetWidth;   // restart the one-shot entrance
            slide.classList.add(dir === 'forward' ? 'enter-forward' : 'enter-back');
        }
        if (on) {
            slide.removeAttribute('inert');
            slide.removeAttribute('aria-hidden');
        } else {
            slide.setAttribute('inert', '');
            slide.setAttribute('aria-hidden', 'true');
        }
    });

    var pageText = rt('page').replace('{n}', digits(currentSlide + 1)).replace('{N}', digits(totalSlides));
    const counter = document.getElementById('currentSlideNum');
    if (counter) counter.textContent = pageText;

    var active = slides[currentSlide];
    if (active) active.setAttribute('aria-label', pageText);

    const live = document.getElementById('readerLive');
    if (live && !silent) {
        var heading = active && active.querySelector('h2, h3');
        live.textContent = pageText + (heading ? ': ' + heading.textContent.trim() : '');
    }

    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    // aria-disabled, not disabled: on the last page the focused Next must keep
    // focus (a disabled button drops it to <body>). nextSlide/prevSlide guard the ends.
    if (prevBtn) prevBtn.setAttribute('aria-disabled', String(currentSlide === 0));
    if (nextBtn) nextBtn.setAttribute('aria-disabled', String(currentSlide === totalSlides - 1));

    // The "previous / next story" links and the closing moral belong to the
    // end of the book, not under every page.
    document.body.classList.toggle('reader-at-end', currentSlide === totalSlides - 1);

    var percent = ((currentSlide + 1) / totalSlides) * 100;
    var fill = document.getElementById('readerProgressFill');
    if (fill) fill.style.width = percent + '%';
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = percent + '%';

    saveStoryProgress();
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    // a mostly vertical drag is a scroll, not a page turn
    if (Math.abs(diff) < swipeThreshold || Math.abs(diff) < Math.abs(touchStartY - touchEndY)) return;
    // finger moves toward the start edge = forward. LTR: right-to-left; RTL: left-to-right.
    var forward = isRTL() ? diff < 0 : diff > 0;
    if (forward) nextSlide(); else prevSlide();
}

function handleKeyNavigation(e) {
    if (!document.getElementById('storySlides')) return;
    // never steal keys from a text field, a select, an open sheet or a modifier chord
    var el = e.target;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    var sheet = document.getElementById('readerSheet');
    if (sheet && sheet.open) return;

    var fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight';
    var back = isRTL() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { e.preventDefault(); nextSlide(); }
    else if (e.key === back) { e.preventDefault(); prevSlide(); }
}
// =====================================================
// FULLSCREEN MODE
// =====================================================

let isFullscreen = false;
let controlsFadeTimeout = null;

function initializeFullscreenMode() {
    const storyContainer = document.querySelector('.story-container');
    if (!storyContainer) return;

    // Listen for ESC key and browser fullscreen changes either way
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // In the reader, "Full screen" lives in the settings sheet: no floating button.
    if (document.body.classList.contains('reader')) return;

    // Create fullscreen toggle button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-toggle';
    fullscreenBtn.id = 'fullscreenToggle';
    fullscreenBtn.textContent = '⛶';
    fullscreenBtn.title = t('fullscreenToggle', 'Toggle Fullscreen');
    // icon-only control: a title is a tooltip, not an accessible name
    fullscreenBtn.setAttribute('aria-label', t('fullscreenToggle', 'Toggle Fullscreen'));
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.body.appendChild(fullscreenBtn);

    // Listen for ESC key to exit fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isFullscreen) {
            exitFullscreen();
        }
    });


}

function toggleFullscreen() {
    if (isFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function enterFullscreen() {
    const storyContainer = document.querySelector('.story-container');
    const fullscreenBtn = document.getElementById('fullscreenToggle');

    if (!storyContainer) return;

    isFullscreen = true;

    // Add fullscreen classes
    storyContainer.classList.add('fullscreen-active');
    document.body.classList.add('fullscreen-mode');

    // Update button icon
    if (fullscreenBtn) {
        fullscreenBtn.textContent = '⛶';
        fullscreenBtn.style.display = 'none';
    }

    // Create fullscreen controls
    createFullscreenControls();

    // Try to enter browser fullscreen
    // In the reader the bar and transport live outside the container, so the
    // whole document goes full screen.
    var target = document.body.classList.contains('reader') ? document.documentElement : storyContainer;
    try {
        if (target.requestFullscreen) {
            target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen();
        }
    } catch (e) {
        console.log('Browser fullscreen not available, using CSS fullscreen');
    }

    // Start control fade timer
    startControlsFadeTimer();

    console.log('🖥️ Entered fullscreen mode');
}

function exitFullscreen() {
    const storyContainer = document.querySelector('.story-container');
    const fullscreenBtn = document.getElementById('fullscreenToggle');
    const controls = document.getElementById('fullscreenControls');

    isFullscreen = false;

    // Remove fullscreen classes
    if (storyContainer) {
        storyContainer.classList.remove('fullscreen-active');
    }
    document.body.classList.remove('fullscreen-mode');

    // Update button
    if (fullscreenBtn) {
        fullscreenBtn.textContent = '⛶';
        fullscreenBtn.style.display = 'flex';
    }

    // Remove fullscreen controls
    if (controls) {
        controls.remove();
    }

    // Exit browser fullscreen
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } catch (e) {
        // Already not in fullscreen
    }

    // Clear fade timer
    if (controlsFadeTimeout) {
        clearTimeout(controlsFadeTimeout);
    }

    console.log('🖥️ Exited fullscreen mode');
}

function createFullscreenControls() {
    // Remove existing controls
    const existing = document.getElementById('fullscreenControls');
    if (existing) existing.remove();

    const controls = document.createElement('div');
    controls.className = 'fullscreen-controls';
    controls.id = 'fullscreenControls';

    const exitBtn = document.createElement('button');
    exitBtn.className = 'fullscreen-exit-btn';
    exitBtn.textContent = t('exitFullscreen', '✕ Exit Fullscreen');
    exitBtn.addEventListener('click', exitFullscreen);

    controls.appendChild(exitBtn);
    document.body.appendChild(controls);

    // Add mouse move listener to show controls
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove() {
    const controls = document.getElementById('fullscreenControls');
    if (controls && isFullscreen) {
        controls.classList.remove('faded');
        startControlsFadeTimer();
    }
}

function startControlsFadeTimer() {
    if (controlsFadeTimeout) {
        clearTimeout(controlsFadeTimeout);
    }

    controlsFadeTimeout = setTimeout(function() {
        const controls = document.getElementById('fullscreenControls');
        if (controls && isFullscreen) {
            controls.classList.add('faded');
        }
    }, 3000);
}

function handleFullscreenChange() {
    // If browser exits fullscreen (e.g., ESC key), sync our state
    if (!document.fullscreenElement && !document.webkitFullscreenElement && isFullscreen) {
        exitFullscreen();
    }
}

// =====================================================
// ANIMATED BACKGROUNDS
// =====================================================

// =====================================================
// ANIMATED BACKGROUNDS
// v2: the reader has no ambient loops (motion policy, UI/DESIGN.md section 6).
// The decorative stars and clouds are only added to a classic-scroll story,
// are hidden from screen readers, and play once.
// =====================================================

function initializeBackgroundAnimations() {
    const storyContainer = document.querySelector('.story-container.interactive-story');
    if (!storyContainer || document.body.classList.contains('reader')) return;

    const bgAnimations = document.createElement('div');
    bgAnimations.className = 'story-bg-animations';
    bgAnimations.setAttribute('aria-hidden', 'true');

    const starEmojis = ['⭐', '✨', '🌟', '💫', '⭐'];
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'bg-star';
        star.textContent = starEmojis[i];
        bgAnimations.appendChild(star);
    }
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('span');
        cloud.className = 'bg-cloud';
        cloud.textContent = '☁️';
        bgAnimations.appendChild(cloud);
    }
    storyContainer.insertBefore(bgAnimations, storyContainer.firstChild);
}




// Exposed so audio-narration.js can turn the page when a slide's narration
// finishes - the auto-advance mode for children who cannot read yet.
window.StorySlides = {
    next: function () { nextSlide(); },
    isLast: function () { return currentSlide >= totalSlides - 1; },
    current: function () { return currentSlide; }
};
