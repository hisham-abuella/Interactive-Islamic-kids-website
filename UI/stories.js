// Stories Interactive JavaScript

var childName = '';

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a saved name
    childName = localStorage.getItem('islamicKidsName') || '';

    if (!childName && document.querySelector('.story-container')) {
        showNameModal();
    } else if (childName) {
        personalizeStory();
    }

    initializeProgress();
    initializeMiniQuizzes();
    initializeFinalQuiz();
    initializeModeButtons();
    initializeSoundEffects();
    initializeSlideMode();
});

// Name Input Modal
function showNameModal() {
    const modal = document.createElement('div');
    modal.className = 'name-modal';
    modal.id = 'nameModal';

    const modalContent = document.createElement('div');
    modalContent.className = 'name-modal-content';

    const icon = document.createElement('div');
    icon.className = 'modal-icon';
    icon.textContent = '🌟';

    const title = document.createElement('h2');
    title.textContent = 'Assalamu Alaikum!';

    const subtitle = document.createElement('p');
    subtitle.textContent = "What's your name, little one?";

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'name-input';
    input.placeholder = 'Enter your name...';
    input.maxLength = 20;

    const button = document.createElement('button');
    button.className = 'name-submit-btn';
    button.textContent = "Let's Begin! ✨";
    button.addEventListener('click', function() {
        submitName(input.value);
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitName(input.value);
        }
    });

    modalContent.appendChild(icon);
    modalContent.appendChild(title);
    modalContent.appendChild(subtitle);
    modalContent.appendChild(input);
    modalContent.appendChild(button);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Focus on input
    setTimeout(() => input.focus(), 100);
}

function submitName(name) {
    name = name.trim();
    if (name.length > 0) {
        childName = name;
        localStorage.setItem('islamicKidsName', name);

        const modal = document.getElementById('nameModal');
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => modal.remove(), 300);
        }

        personalizeStory();
    }
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
        greeting.textContent = '👋 Welcome, ' + childName + '! Enjoy this story!';
        storyHeader.insertBefore(greeting, storyHeader.firstChild);
    }

    // Update quiz results with name
    const quizResults = document.getElementById('quizResults');
    if (quizResults) {
        const resultsContent = quizResults.querySelector('.results-content h2');
        if (resultsContent && !resultsContent.dataset.personalized) {
            resultsContent.textContent = 'Congratulations, ' + childName + '!';
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
            progressText.textContent = Math.round(scrollPercent) + '% Complete';
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

            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                // Mark as correctly answered
                quiz.classList.add('answered-correct');
                this.classList.add('correct');
                feedback.textContent = '🎉 Correct! Great job!';
                feedback.className = 'quiz-feedback correct';
                playSound('correct');
                createConfetti(quiz);

                // Disable all options
                options.forEach(opt => opt.disabled = true);
            } else {
                this.classList.add('incorrect');
                showRetryFeedback(feedback, 'mini', quiz);
                playSound('incorrect');

                // Disable only this wrong option
                this.disabled = true;
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
    message.textContent = '💪 Not quite! Try again! ';
    feedback.appendChild(message);

    // Create line break
    feedback.appendChild(document.createElement('br'));

    // Create retry button
    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = '🔄 Try Again';
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
            opt.disabled = false;
        }
    });

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
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

            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                card.classList.add('answered-correct');
                card.dataset.cardIndex = index;
                this.classList.add('correct');
                feedback.textContent = '🎉 Correct! Well done!';
                feedback.className = 'quiz-feedback correct';
                score++;
                playSound('correct');
                createConfetti(card);

                // Disable all options
                options.forEach(opt => opt.disabled = true);

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
                this.disabled = true;
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
            opt.disabled = false;
        }
    });

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
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
            alert('🎧 Audio narration coming soon! For now, enjoy reading the story.');
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
    const colors = ['#10b981', '#f59e0b', '#14b8a6', '#fde68a', '#a78bfa'];
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
const style = document.createElement('style');
style.textContent = [
    '@keyframes confettiFall {',
    '    0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }',
    '    100% { opacity: 0; transform: translateY(-100px) rotate(720deg) scale(0); }',
    '}',
    '@keyframes flashGreen {',
    '    0%, 100% { background-color: inherit; }',
    '    50% { background-color: rgba(16, 185, 129, 0.1); }',
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

// Slide Mode for Stories
let currentSlide = 0;
let totalSlides = 0;
let touchStartX = 0;
let touchEndX = 0;

function initializeSlideMode() {
    const storyContent = document.getElementById('storyContent');
    if (!storyContent) return;

    // Skip slide mode if story uses classic scroll format
    if (storyContent.classList.contains('classic-scroll')) {
        console.log('📜 Using classic scroll mode for this story');
        return;
    }

    // Get all content elements including final quiz and video
    const storyScenes = storyContent.querySelectorAll('.story-scene, .mini-quiz, .lesson-box, .dua-box');
    const finalQuizSection = document.getElementById('finalQuiz');
    const videoSection = document.getElementById('videoSection');

    if (storyScenes.length === 0) return;

    // Collect all slide content
    const allSlideContent = Array.from(storyScenes);

    // Add final quiz intro and cards as slides
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

    // Add video section as final slide
    if (videoSection) {
        videoSection.classList.remove('hidden');
        allSlideContent.push(videoSection);
    }

    totalSlides = allSlideContent.length;
    console.log('📖 Initializing slide mode with ' + totalSlides + ' slides');

    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'story-slides-container';

    const slidesWrapper = document.createElement('div');
    slidesWrapper.className = 'story-slides';
    slidesWrapper.id = 'storySlides';

    // Move all content into slides (not clone, to preserve event listeners)
    allSlideContent.forEach((content, index) => {
        const slide = document.createElement('div');
        slide.className = 'story-slide';
        slide.dataset.slideIndex = index;
        // Move the actual element, not a clone
        slide.appendChild(content);
        slidesWrapper.appendChild(slide);
    });

    // Hide original quiz and video sections since content moved to slides
    if (finalQuizSection) finalQuizSection.style.display = 'none';
    if (videoSection) videoSection.style.display = 'none';

    slidesContainer.appendChild(slidesWrapper);

    // Insert at the beginning of story content
    storyContent.insertBefore(slidesContainer, storyContent.firstChild);

    // Add progress dots
    const progressDots = document.createElement('div');
    progressDots.className = 'slide-progress';
    progressDots.id = 'slideProgress';

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.dataset.slideIndex = i;
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.slideIndex));
        });
        progressDots.appendChild(dot);
    }

    slidesContainer.after(progressDots);

    // Add navigation arrows
    const slideNav = document.createElement('div');
    slideNav.className = 'slide-navigation';
    slideNav.id = 'slideNavigation';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-nav-btn prev-btn';
    prevBtn.id = 'prevSlide';
    prevBtn.disabled = true;
    prevBtn.textContent = '◀';

    const counter = document.createElement('span');
    counter.className = 'slide-counter';
    counter.innerHTML = '<span id="currentSlideNum">1</span> / ' + totalSlides;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-nav-btn next-btn';
    nextBtn.id = 'nextSlide';
    nextBtn.textContent = '▶';

    slideNav.appendChild(prevBtn);
    slideNav.appendChild(counter);
    slideNav.appendChild(nextBtn);

    progressDots.after(slideNav);

    // Add swipe hint for mobile
    if ('ontouchstart' in window) {
        const swipeHint = document.createElement('div');
        swipeHint.className = 'swipe-hint';
        swipeHint.innerHTML = '<span class="swipe-hint-icon">👆</span>Swipe left or right to navigate';
        slideNav.after(swipeHint);

        // Remove hint after 5 seconds
        setTimeout(() => swipeHint.remove(), 5000);
    }

    // Event listeners for navigation
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch/swipe support
    slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    slidesContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Re-initialize mini quizzes in slides
    const slideQuizzes = slidesWrapper.querySelectorAll('.mini-quiz');
    slideQuizzes.forEach(quiz => setupMiniQuiz(quiz));

    // Set initial progress
    updateSlideView();
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    currentSlide = index;
    updateSlideView();
    playSound('pageFlip');
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

function updateSlideView() {
    const slidesWrapper = document.getElementById('storySlides');
    if (!slidesWrapper) return;

    // Move slides
    slidesWrapper.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    // Update progress dots
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
        if (index < currentSlide) {
            dot.classList.add('completed');
        }
    });

    // Update counter
    const counter = document.getElementById('currentSlideNum');
    if (counter) {
        counter.textContent = currentSlide + 1;
    }

    // Update nav buttons
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    if (progressBar) {
        const percent = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = percent + '%';
        if (progressText) {
            progressText.textContent = Math.round(percent) + '% Complete';
        }
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - prev slide
            prevSlide();
        }
    }
}

function handleKeyNavigation(e) {
    // Only handle if we're on a story page
    if (!document.getElementById('storySlides')) return;

    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            prevSlide();
            break;
    }
}

console.log('📚 Islamic Kids Stories - Interactive features loaded!');
