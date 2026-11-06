// Surah Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // quiz feedback is announced politely when it changes (v2, a11y)
    document.querySelectorAll('.quiz-feedback').forEach(el => el.setAttribute('role', 'status'));
    initializeQuiz();
    initializeAnimations();
    initStagePicker();
});

// --- Training wheels -------------------------------------------------
// Read shows everything, Practice drops the transliteration, Recite leaves
// only the Arabic with the meaning one tap away. Remembered per surah, so a
// child who has moved on does not land back on Read every night.
function initStagePicker() {
    var section = document.querySelector('.verses-section');
    var picker = document.querySelector('.stage-picker');
    if (!section || !picker) return;

    var key = 'ik-stage-' + (location.pathname.split('/').pop() || 'surah');

    // A reveal button per verse, for Recite stage
    document.querySelectorAll('.verse-card .verse-content').forEach(function (content) {
        if (content.querySelector('.verse-reveal')) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'verse-reveal';
        btn.textContent = 'Show meaning';
        btn.setAttribute('data-ar', 'أظهر المعنى');
        btn.addEventListener('click', function () {
            content.closest('.verse-card').classList.add('revealed');
        });
        content.appendChild(btn);
    });

    function apply(stage) {
        section.setAttribute('data-stage', stage);
        picker.querySelectorAll('.stage-btn').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.getAttribute('data-stage') === stage));
        });
        document.querySelectorAll('.verse-card').forEach(function (c) {
            c.classList.remove('revealed');
        });
        try { localStorage.setItem(key, stage); } catch (e) {}
    }

    picker.querySelectorAll('.stage-btn').forEach(function (b) {
        b.addEventListener('click', function () {
            apply(b.getAttribute('data-stage'));
        });
    });

    var saved = 'read';
    try { saved = localStorage.getItem(key) || 'read'; } catch (e) {}
    apply(saved);
}

// Quiz functionality
let score = 0;

function initializeQuiz() {
    const quizCards = document.querySelectorAll('.quiz-section .quiz-card');

    quizCards.forEach((card, index) => {
        setupQuizCard(card, index, quizCards.length);
    });
}

function setupQuizCard(card, index, totalCards) {
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
                this.classList.add('correct');
                feedback.textContent = isArabic() ? 'ما شاء الله! إجابة صحيحة!' : 'MashaAllah! Correct!';
                feedback.className = 'quiz-feedback correct';
                score++;
                createConfetti(card);

                // Disable all options
                options.forEach(opt => opt.setAttribute('aria-disabled', 'true'));   // aria-disabled keeps focus on the button (v2)

                // Move to next question after delay
                setTimeout(() => {
                    showNextQuestion(index, totalCards);
                }, 1500);
            } else {
                this.classList.add('incorrect');
                showRetryFeedback(feedback, card);

                // Disable only this wrong option
                this.setAttribute('aria-disabled', 'true');
            }
        });
    });
}

function showRetryFeedback(feedback, card) {
    // Clear existing content
    feedback.textContent = '';
    feedback.className = 'quiz-feedback incorrect';

    // Create message
    const message = document.createElement('span');
    message.textContent = isArabic() ? 'ليس تماماً! حاول مرة أخرى! ' : 'Not quite! Try again! ';
    feedback.appendChild(message);

    // Create line break
    feedback.appendChild(document.createElement('br'));

    // Create retry button
    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.type = 'button';
    retryBtn.textContent = isArabic() ? 'حاول مرة أخرى' : 'Try again';
    retryBtn.addEventListener('click', function() {
        resetQuizCard(card);
    });
    feedback.appendChild(retryBtn);
}

function resetQuizCard(card) {
    const options = card.querySelectorAll('.quiz-option');
    const feedback = card.querySelector('.quiz-feedback');

    // Reset wrong options
    options.forEach(opt => {
        if (opt.getAttribute('data-correct') !== 'true') {
            opt.classList.remove('incorrect');
            opt.removeAttribute('aria-disabled');
        }
    });

    // Clear feedback, and keep focus on an answer (the retry button is gone)
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    const open = Array.prototype.find.call(options, o => o.getAttribute('aria-disabled') !== 'true');
    if (open) open.focus();
}

function isArabic() {
    return document.documentElement.lang === 'ar';
}

function showNextQuestion(currentIndex, totalCards) {
    const quizCards = document.querySelectorAll('.quiz-section .quiz-card');
    const quizResults = document.getElementById('quizResults');
    const scoreDisplay = document.getElementById('scoreDisplay');

    if (currentIndex < quizCards.length - 1) {
        // Show next question
        quizCards[currentIndex + 1].classList.remove('hidden');
        smoothScrollTo(quizCards[currentIndex + 1]);
    } else {
        // Show results
        if (quizResults) {
            quizResults.classList.remove('hidden');
            if (scoreDisplay) {
                // The Arabic copy uses Arabic-Indic numerals, so a Western digit
                // here reads as "أجبت 3 من ٤". Match the surrounding text.
                scoreDisplay.textContent = document.documentElement.lang === 'ar'
                    ? String(score).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
                    : score;
            }
            createConfetti(quizResults);
            smoothScrollTo(quizResults);
        }
    }
}

// Confetti Effect
function createConfetti(container) {
    const colors = ['#10b981', '#f59e0b', '#14b8a6', '#fde68a', '#a78bfa', '#818cf8'];
    const confettiCount = 25;

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

// Add styles
const style = document.createElement('style');
style.textContent = [
    '@keyframes confettiFall {',
    '    0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }',
    '    100% { opacity: 0; transform: translateY(-100px) rotate(720deg) scale(0); }',
    '}',
    '.retry-btn {',
    '    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);',
    '    color: white;',
    '    border: none;',
    '    padding: 0.6rem 1.5rem;',
    '    border-radius: 20px;',
    '    font-weight: 600;',
    '    cursor: pointer;',
    '    margin-top: 0.8rem;',
    '    font-size: 1rem;',
    '    transition: all 0.3s ease;',
    '}',
    '.retry-btn:hover {',
    '    transform: scale(1.05);',
    '    box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);',
    '}',
    '.quiz-feedback.incorrect { color: #dc2626; }',
    '.quiz-feedback.correct { color: #059669; }'
].join('\n');
document.head.appendChild(style);

// Scroll reveal (v2, the js-reveal gate). Cards are visible by default; they are
// only hidden once this script has marked <html> with .js-reveal AND can bring
// them back (IntersectionObserver, no reduced-motion request). A timer and a
// beforeprint handler reveal everything regardless, so a full-page capture, a
// printout or a stalled observer never shows blank cards. Classes, not inline
// styles, so the narration highlight can always override.
function initializeAnimations() {
    const canAnimate = 'IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAnimate) return;

    const cards = document.querySelectorAll('.verse-card, .fact-card, .tip-card');
    const revealAll = () => cards.forEach(c => c.classList.add('visible'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });

    document.documentElement.classList.add('js-reveal');
    cards.forEach(card => { card.classList.add('reveal'); observer.observe(card); });
    window.addEventListener('beforeprint', revealAll);
    setTimeout(revealAll, 2500);
}

function smoothScrollTo(el) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
}

