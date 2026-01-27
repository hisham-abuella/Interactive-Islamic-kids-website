// Stories Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    initializeMiniQuizzes();
    initializeFinalQuiz();
    initializeModeButtons();
    initializeSoundEffects();
});

// Progress Bar
function initializeProgress() {
    const storyContent = document.getElementById('storyContent');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');

    if (!storyContent || !progressBar) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = storyContent.offsetHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

        progressBar.style.width = scrollPercent + '%';
        if (progressText) {
            progressText.textContent = Math.round(scrollPercent) + '% Complete';
        }
    });
}

// Mini Quizzes (during story)
function initializeMiniQuizzes() {
    const miniQuizzes = document.querySelectorAll('.mini-quiz');

    miniQuizzes.forEach(quiz => {
        const options = quiz.querySelectorAll('.quiz-option');
        const feedback = quiz.querySelector('.quiz-feedback');

        options.forEach(option => {
            option.addEventListener('click', function() {
                // Prevent multiple answers
                if (quiz.classList.contains('answered')) return;
                quiz.classList.add('answered');

                const isCorrect = this.getAttribute('data-correct') === 'true';

                // Disable all options
                options.forEach(opt => opt.disabled = true);

                if (isCorrect) {
                    this.classList.add('correct');
                    feedback.textContent = '🎉 Correct! Great job!';
                    feedback.className = 'quiz-feedback correct';
                    playSound('correct');
                    createConfetti(quiz);
                } else {
                    this.classList.add('incorrect');
                    feedback.textContent = '💪 Not quite! Keep learning!';
                    feedback.className = 'quiz-feedback incorrect';
                    playSound('incorrect');

                    // Show correct answer
                    options.forEach(opt => {
                        if (opt.getAttribute('data-correct') === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                }
            });
        });
    });
}

// Final Quiz
let currentQuestion = 1;
let score = 0;
const totalQuestions = 3;

function initializeFinalQuiz() {
    const quizCards = document.querySelectorAll('.final-quiz-section .quiz-card');

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
                    feedback.textContent = '🎉 Correct!';
                    feedback.className = 'quiz-feedback correct';
                    score++;
                    playSound('correct');
                } else {
                    this.classList.add('incorrect');
                    feedback.textContent = '❌ Not quite!';
                    feedback.className = 'quiz-feedback incorrect';
                    playSound('incorrect');

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
    const quizCards = document.querySelectorAll('.final-quiz-section .quiz-card');
    const quizResults = document.getElementById('quizResults');
    const videoSection = document.getElementById('videoSection');
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

            // Create celebration effect
            createConfetti(quizResults);
            playSound('success');

            // Show video section after delay
            setTimeout(() => {
                if (videoSection) {
                    videoSection.classList.remove('hidden');
                    videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 2000);
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
            // Stop any audio if playing
        });

        listenMode.addEventListener('click', function() {
            listenMode.classList.add('active');
            readMode.classList.remove('active');
            alert('🎧 Audio narration coming soon! For now, enjoy reading the story.');
        });
    }
}

// Sound Effects
function initializeSoundEffects() {
    // Preload sounds (placeholders - would need actual audio files)
    window.sounds = {
        correct: null,
        incorrect: null,
        success: null,
        pageFlip: null
    };
}

function playSound(soundName) {
    // Placeholder for sound effects
    // In production, you would play actual audio files
    console.log('Playing sound:', soundName);

    // Visual feedback instead of sound
    if (soundName === 'correct') {
        document.body.style.animation = 'flashGreen 0.3s ease';
        setTimeout(() => document.body.style.animation = '', 300);
    }
}

// Confetti Effect
function createConfetti(container) {
    const colors = ['#10b981', '#f59e0b', '#14b8a6', '#fde68a', '#a78bfa'];
    const confettiCount = 30;

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

// Add confetti animation to stylesheet
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

    @keyframes flashGreen {
        0%, 100% { background-color: inherit; }
        50% { background-color: rgba(16, 185, 129, 0.1); }
    }
`;
document.head.appendChild(style);

// Scroll animations for story scenes
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

// Observe all story scenes
document.querySelectorAll('.story-scene').forEach(scene => {
    scene.style.opacity = '0';
    scene.style.transform = 'translateY(30px)';
    scene.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(scene);
});

console.log('📚 Islamic Kids Stories - Interactive features loaded!');
