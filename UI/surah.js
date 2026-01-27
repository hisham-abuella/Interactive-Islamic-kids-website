// Surah Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    initializeAnimations();
});

// Quiz functionality
let currentQuestion = 0;
let score = 0;
const totalQuestions = 4;

function initializeQuiz() {
    const quizCards = document.querySelectorAll('.quiz-card');

    quizCards.forEach((card, index) => {
        const options = card.querySelectorAll('.quiz-option');
        const feedback = card.querySelector('.quiz-feedback');

        options.forEach(option => {
            option.addEventListener('click', function() {
                // Prevent multiple answers
                if (card.classList.contains('answered')) return;
                card.classList.add('answered');

                const isCorrect = this.getAttribute('data-correct') === 'true';

                // Disable all options
                options.forEach(opt => opt.disabled = true);

                if (isCorrect) {
                    this.classList.add('correct');
                    feedback.textContent = '🎉 MashaAllah! Correct!';
                    feedback.style.color = '#10b981';
                    score++;
                    createConfetti(card);
                } else {
                    this.classList.add('incorrect');
                    feedback.textContent = '💪 Not quite, keep learning!';
                    feedback.style.color = '#ef4444';

                    // Show correct answer
                    options.forEach(opt => {
                        if (opt.getAttribute('data-correct') === 'true') {
                            setTimeout(() => opt.classList.add('correct'), 500);
                        }
                    });
                }

                // Move to next question after delay
                setTimeout(() => {
                    showNextQuestion(index);
                }, 1500);
            });
        });
    });
}

function showNextQuestion(currentIndex) {
    const quizCards = document.querySelectorAll('.quiz-card');
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
                scoreDisplay.textContent = score;
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
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            animation: confettiFall ${1 + Math.random()}s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: 50%;
            z-index: 1000;
        `;

        container.style.position = 'relative';
        container.style.overflow = 'visible';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) rotate(720deg) scale(0);
        }
    }
`;
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

    // Observe verse cards
    document.querySelectorAll('.verse-card, .fact-card, .tip-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

console.log('📖 Surah Al-Fatiha page loaded!');
