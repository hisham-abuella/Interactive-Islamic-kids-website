// Surah Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
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

            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                card.classList.add('answered-correct');
                this.classList.add('correct');
                feedback.textContent = '🎉 MashaAllah! Correct!';
                feedback.className = 'quiz-feedback correct';
                score++;
                createConfetti(card);

                // Disable all options
                options.forEach(opt => opt.disabled = true);

                // Move to next question after delay
                setTimeout(() => {
                    showNextQuestion(index, totalCards);
                }, 1500);
            } else {
                this.classList.add('incorrect');
                showRetryFeedback(feedback, card);

                // Disable only this wrong option
                this.disabled = true;
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
    message.textContent = '💪 Not quite! Try again! ';
    feedback.appendChild(message);

    // Create line break
    feedback.appendChild(document.createElement('br'));

    // Create retry button
    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = '🔄 Try Again';
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
            opt.disabled = false;
        }
    });

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
}

function showNextQuestion(currentIndex, totalCards) {
    const quizCards = document.querySelectorAll('.quiz-section .quiz-card');
    const quizResults = document.getElementById('quizResults');
    const scoreDisplay = document.getElementById('scoreDisplay');

    if (currentIndex < quizCards.length - 1) {
        // Show next question
        quizCards[currentIndex + 1].classList.remove('hidden');
        quizCards[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            quizResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Cards are visible by default. We only hide them to animate them in, and only
    // when we can be sure something will bring them back: IntersectionObserver is
    // supported and the reader has not asked for reduced motion. Otherwise the page
    // stays fully readable - which is what happens when it is printed, when JS is
    // off, or on a browser without the observer.
    const canAnimate = 'IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAnimate) return;

    document.querySelectorAll('.verse-card, .fact-card, .tip-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

console.log('📖 Surah Al-Fatiha page loaded!');
