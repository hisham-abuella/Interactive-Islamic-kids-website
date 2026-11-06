// Interactive Story JavaScript

var totalStars = 0;
var soundEnabled = true;
var lessonsChecked = 0;
var brickCount = 0;
// childName is declared in stories.js

document.addEventListener('DOMContentLoaded', function() {
    // v2: no name prompt (the name is an optional setting in the reader sheet)
    childName = localStorage.getItem('islamicKidsName') || '';
    if (childName) {
        personalizeStory();
    }

    initializeStarsCounter();
    initializeSoundToggle();
    initializeTapToReveal();
    initializeInteractiveChoices();
    initializeShakeElements();
    initializeDragAndDrop();
    initializeEmotionCheck();
    initializeCelebration();
    initializeBuildingGame();
    initializeInteractiveLessons();
    initializeMemorizeButton();
    initializeSceneRewards();
    initializeLanguageSupport();

    console.log('🎮 Interactive Story features loaded!');
});

// Language Support
function initializeLanguageSupport() {
    // Listen for language change events
    document.addEventListener('languageChanged', function(e) {
        updateDynamicText(e.detail.lang);
    });
}

// Update dynamic text when language changes
function updateDynamicText(lang) {
    // Update question number templates
    document.querySelectorAll('[data-i18n-template="questionOf"]').forEach(function(el) {
        var num = el.dataset.num;
        var total = el.dataset.total;
        el.textContent = window.i18n.getText('questionOf', { num: num, total: total });
    });

    // Update personalized greeting if exists
    var greeting = document.querySelector('.personal-greeting');
    if (greeting && childName) {
        greeting.textContent = '👋 ' + window.i18n.getText('welcomeMessage', { name: childName });
    }

    // Update results title if name exists
    var resultsH2 = document.querySelector('.results-content h2');
    if (resultsH2 && childName) {
        resultsH2.textContent = window.i18n.getText('resultsTitleWithName', { name: childName });
    }
}

// Helper to get translated text (with fallback)
function getTranslatedText(key, replacements) {
    if (window.i18n && window.i18n.getText) {
        return window.i18n.getText(key, replacements);
    }
    return key;
}

// Get personalized name for messages
function getName() {
    return childName ? childName : 'friend';
}

// Get personalized greeting
function getGreeting() {
    return childName ? (childName + ', ') : '';
}

function personalizeStory() {
    // Add greeting to story header
    var storyHeader = document.querySelector('.story-header');
    if (storyHeader && !document.querySelector('.personal-greeting') && childName) {
        var greeting = document.createElement('div');
        greeting.className = 'personal-greeting';
        greeting.textContent = '👋 ' + getTranslatedText('welcomeMessage', { name: childName });
        storyHeader.insertBefore(greeting, storyHeader.firstChild);
    }

    // Update quiz results
    var resultsH2 = document.querySelector('.results-content h2');
    if (resultsH2 && childName) {
        resultsH2.textContent = getTranslatedText('resultsTitleWithName', { name: childName });
    }
}

// Stars Counter
function initializeStarsCounter() {
    const savedStars = localStorage.getItem('ibrahimStoryStars');
    if (savedStars) {
        totalStars = parseInt(savedStars);
        updateStarsDisplay();
    }
}

function addStars(amount) {
    totalStars += amount;
    localStorage.setItem('ibrahimStoryStars', totalStars);
    updateStarsDisplay();
    playSound('star');
    showStarAnimation();
}

function updateStarsDisplay() {
    const starCount = document.getElementById('starCount');
    if (starCount) {
        starCount.textContent = totalStars;
    }

    const totalStarsDisplay = document.getElementById('totalStars');
    if (totalStarsDisplay) {
        totalStarsDisplay.textContent = totalStars;
    }
}

function showStarAnimation() {
    const counter = document.getElementById('starsCounter');
    if (counter) {
        counter.style.transform = 'scale(1.3)';
        setTimeout(function() {
            counter.style.transform = 'scale(1)';
        }, 300);
    }
}

// Sound Toggle
function initializeSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            // v2: the glyph stays (sparkles = sound effects); the state is aria-pressed
            this.setAttribute('aria-pressed', String(soundEnabled));
            this.classList.toggle('muted', !soundEnabled);
        });
    }
}

function playSound(type) {
    if (!soundEnabled) return;

    // Visual feedback since we don't have actual audio files
    switch(type) {
        case 'star':
            document.body.style.animation = 'flashGold 0.3s ease';
            break;
        case 'correct':
            document.body.style.animation = 'flashGreen 0.3s ease';
            break;
        case 'wrong':
            document.body.style.animation = 'flashRed 0.3s ease';
            break;
        case 'celebrate':
            createConfetti(document.body);
            break;
    }
    setTimeout(function() {
        document.body.style.animation = '';
    }, 300);
}

// Make a <div> control operable from the keyboard: focusable, a button to
// assistive tech, Enter and Space activate it (v2 a11y; the markup stays).
function makeKeyboardButton(el) {
    if (!el || el.tagName === 'BUTTON') return;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
}

// Tap to Reveal
function initializeTapToReveal() {
    const revealElements = document.querySelectorAll('.tap-to-reveal');

    revealElements.forEach(function(element) {
        const prompt = element.querySelector('.tap-prompt');
        const content = element.querySelector('.revealed-content');

        if (prompt && content) {
            makeKeyboardButton(prompt);
            prompt.setAttribute('aria-expanded', 'false');
            prompt.addEventListener('click', function() {
                content.classList.remove('hidden');
                prompt.style.display = 'none';
                prompt.setAttribute('aria-expanded', 'true');
                // the prompt disappears: give focus to what it revealed
                content.setAttribute('tabindex', '-1');
                content.focus();
                addStars(1);
            });
        }
    });
}

// Interactive Choices
function initializeInteractiveChoices() {
    const choiceContainers = document.querySelectorAll('.interactive-choice');

    choiceContainers.forEach(function(container) {
        const buttons = container.querySelectorAll('.choice-btn');
        const feedback = container.querySelector('.choice-feedback');

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (container.classList.contains('answered')) return;

                const isCorrect = this.dataset.correct === 'true';

                if (isCorrect) {
                    this.classList.add('selected-correct');
                    feedback.textContent = '🎉 ' + getGreeting() + getTranslatedText('feedbackCorrect');
                    feedback.style.color = 'var(--action-text)';
                    container.classList.add('answered');
                    addStars(2);
                    playSound('correct');
                } else {
                    this.classList.add('selected-wrong');
                    feedback.textContent = '🤔 ' + getGreeting() + getTranslatedText('feedbackTryAgain');
                    feedback.style.color = 'var(--wrong-text)';
                    playSound('wrong');

                    var wrongBtn = this;
                    setTimeout(function() {
                        wrongBtn.classList.remove('selected-wrong');
                        feedback.textContent = '';
                    }, 1500);
                }
            });
        });
    });
}

// Shake/Tap Elements
function initializeShakeElements() {
    const shakeables = document.querySelectorAll('.shakeable-element');

    shakeables.forEach(function(element) {
        element.addEventListener('click', function() {
            if (this.classList.contains('activated')) return;

            var el = this;
            this.classList.add('shaking');
            setTimeout(function() {
                el.classList.remove('shaking');
                el.classList.add('activated');

                // Show result
                var parent = el.closest('.shake-to-animate');
                var result = parent.querySelector('.shake-result');
                if (result) {
                    result.classList.remove('hidden');
                }

                // Change appearance
                el.textContent = '🌑';
                el.style.opacity = '0.5';

                addStars(1);
            }, 500);
        });
    });
}

// Drag and Drop
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    var draggedItem = null;
    var correctPlacements = 0;

    // Keyboard: pick an item (Enter/Space), then pick its box (Enter/Space)
    dragItems.forEach(function (item) { makeKeyboardButton(item); item.setAttribute('aria-pressed', 'false'); });
    dropZones.forEach(function (zone) { makeKeyboardButton(zone); });

    dragItems.forEach(function(item) {
        // Touch events for mobile
        item.addEventListener('touchstart', handleTouchStart, { passive: true });
        item.addEventListener('touchend', handleTouchEnd);

        // Mouse events for desktop
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
        });

        // Click as fallback
        item.addEventListener('click', function() {
            if (this.classList.contains('placed')) return;

            // Toggle selection
            dragItems.forEach(function(i) {
                i.classList.remove('selected');
                i.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('selected');
            this.setAttribute('aria-pressed', 'true');
            draggedItem = this;
        });
    });

    dropZones.forEach(function(zone) {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });

        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            handleDrop(this, draggedItem);
        });

        // Click to drop for mobile
        zone.addEventListener('click', function() {
            if (draggedItem && !draggedItem.classList.contains('placed')) {
                handleDrop(this, draggedItem);
            }
        });
    });

    function handleDrop(zone, item) {
        if (!item || item.classList.contains('placed')) return;

        var itemType = item.dataset.item;
        var accepts = zone.dataset.accepts.split(',');
        var isCorrect = accepts.includes(itemType);

        var feedback = document.getElementById('dragFeedback');

        if (isCorrect) {
            // Create dropped indicator
            var droppedElement = document.createElement('div');
            droppedElement.className = 'dropped-item';
            droppedElement.textContent = item.textContent;
            zone.appendChild(droppedElement);

            item.classList.add('placed');
            item.setAttribute('aria-disabled', 'true');
            item.setAttribute('aria-pressed', 'false');
            correctPlacements++;

            if (correctPlacements === 3) {
                feedback.textContent = '🎉 ' + getGreeting() + getTranslatedText('feedbackPerfect');
                feedback.style.color = 'var(--action-text)';
                addStars(3);
                playSound('correct');
            }
        } else {
            feedback.textContent = '🤔 ' + getGreeting() + getTranslatedText('feedbackTryElsewhere');
            feedback.style.color = 'var(--wrong-text)';
            playSound('wrong');

            setTimeout(function() {
                feedback.textContent = '';
            }, 2000);
        }

        draggedItem = null;
        item.classList.remove('selected');
        if (!item.classList.contains('placed')) item.setAttribute('aria-pressed', 'false');
    }

    // Touch handlers for mobile drag
    function handleTouchStart(e) {
        var touchedItem = e.target.closest('.drag-item');
        if (touchedItem) {
            touchedItem.classList.add('selected');
            draggedItem = touchedItem;
        }
    }

    function handleTouchEnd(e) {
        // Touch end handled by click on drop zones
    }
}

// Emotion Check
function initializeEmotionCheck() {
    const emotionBtns = document.querySelectorAll('.emotion-btn');
    const emotionFeedback = document.querySelector('.emotion-feedback');

    emotionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.parentElement.classList.contains('answered')) return;

            var isCorrect = this.classList.contains('correct');

            emotionBtns.forEach(function(b) {
                b.classList.remove('selected', 'wrong');
            });
            this.classList.add('selected');

            if (isCorrect) {
                emotionFeedback.textContent = '🎉 ' + getGreeting() + getTranslatedText('feedbackCorrect');
                emotionFeedback.style.color = 'var(--action-text)';
                this.parentElement.classList.add('answered');
                addStars(2);
                playSound('correct');
            } else {
                this.classList.add('wrong');
                emotionFeedback.textContent = '🤔 ' + getGreeting() + getTranslatedText('feedbackThinkAgain');
                emotionFeedback.style.color = 'var(--wrong-text)';
                playSound('wrong');
            }
        });
    });
}

// Celebration
function initializeCelebration() {
    const celebrateBtn = document.querySelector('.celebrate-btn');

    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', function() {
            if (this.classList.contains('celebrated')) return;

            this.classList.add('celebrated');
            this.textContent = '🎊 ' + getTranslatedText('feedbackSubhanAllah') + ' 🎊';

            playSound('celebrate');
            createMassiveConfetti();
            addStars(2);
        });
    }
}

function createMassiveConfetti() {
    var colors = ['var(--ornament)', 'var(--ornament-light)', 'var(--action-bright)', 'var(--quran)', 'var(--reward-wash)', 'var(--gold-pale)'];
    var container = document.body;

    for (var i = 0; i < 100; i++) {
        (function(index) {
            setTimeout(function() {
                var confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = (Math.random() * 10 + 5) + 'px';
                confetti.style.height = (Math.random() * 10 + 5) + 'px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '10000';
                confetti.style.left = (Math.random() * 100) + 'vw';
                confetti.style.top = '-20px';
                confetti.style.animation = 'confettiFall ' + (Math.random() * 2 + 2) + 's ease-out forwards';

                container.appendChild(confetti);
                setTimeout(function() {
                    confetti.remove();
                }, 4000);
            }, index * 30);
        })(i);
    }
}

// Building Game
function initializeBuildingGame() {
    const addBrickBtn = document.getElementById('addBrickBtn');
    const buildingStructure = document.getElementById('buildingStructure');
    const brickCountDisplay = document.getElementById('brickCount');

    if (!addBrickBtn || !buildingStructure) return;

    const rows = buildingStructure.querySelectorAll('.brick-row');

    addBrickBtn.addEventListener('click', function() {
        if (brickCount >= 9) return;

        // Find which row to add to
        var rowIndex = Math.floor(brickCount / 3);
        var row = rows[rowIndex];

        if (row) {
            var brick = document.createElement('div');
            brick.className = 'brick';
            row.appendChild(brick);

            brickCount++;
            brickCountDisplay.textContent = brickCount;

            if (brickCount >= 9) {
                // aria-disabled keeps focus on the button the child just pressed
                addBrickBtn.setAttribute('aria-disabled', 'true');
                addBrickBtn.textContent = document.documentElement.lang === 'ar' ? 'اكتملت!' : 'Complete!';

                // Add kaaba emoji on top
                var kaaba = document.createElement('div');
                kaaba.textContent = '🕋';
                kaaba.style.fontSize = '3rem';
                kaaba.style.marginTop = '1rem';
                kaaba.setAttribute('aria-hidden', 'true');
                kaaba.style.animation = 'kaabaGlow 2s ease-in-out 2';   // v2: no infinite loops
                buildingStructure.appendChild(kaaba);

                addStars(3);
                playSound('celebrate');
            }
        }
    });
}

// Interactive Lessons
function initializeInteractiveLessons() {
    const lessonItems = document.querySelectorAll('.lesson-item');

    lessonItems.forEach(function(item) {
        item.addEventListener('click', function() {
            if (this.classList.contains('checked')) return;

            this.classList.add('checked');
            var check = this.querySelector('.lesson-check');
            if (check) {
                check.textContent = '☑️';
            }

            lessonsChecked++;
            addStars(1);

            if (lessonsChecked === 4) {
                var instruction = document.querySelector('.lesson-instruction');
                if (instruction) {
                    instruction.textContent = '🎉 ' + getGreeting() + getTranslatedText('feedbackAllLessons');
                    instruction.style.color = 'var(--action-text)';
                }
            }
        });
    });
}

// Memorize Button
function initializeMemorizeButton() {
    const memorizeBtn = document.getElementById('memorizeBtn');

    if (memorizeBtn) {
        memorizeBtn.addEventListener('click', function() {
            if (this.classList.contains('saved')) return;

            this.classList.add('saved');

            // Clear and add new content safely
            this.textContent = '';
            var checkSpan = document.createElement('span');
            checkSpan.textContent = '✅ ' + getGreeting() + getTranslatedText('memorizeSaved');
            this.appendChild(checkSpan);

            // Save to localStorage
            var savedDuas = JSON.parse(localStorage.getItem('savedDuas') || '[]');
            savedDuas.push({
                arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
                translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
                source: 'Prophet Adam'
            });
            localStorage.setItem('savedDuas', JSON.stringify(savedDuas));

            addStars(2);
        });
    }
}

// Scene Rewards (auto-award when scene is viewed)
function initializeSceneRewards() {
    const scenes = document.querySelectorAll('.interactive-scene');
    var viewedScenes = JSON.parse(localStorage.getItem('viewedIbrahimScenes') || '[]');

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var scene = entry.target;
                var sceneId = scene.dataset.scene;

                if (viewedScenes.indexOf(sceneId) === -1) {
                    viewedScenes.push(sceneId);
                    localStorage.setItem('viewedIbrahimScenes', JSON.stringify(viewedScenes));

                    // Show reward animation
                    var reward = scene.querySelector('.scene-reward');
                    if (reward) {
                        reward.style.animation = 'rewardPop 0.5s ease';
                        setTimeout(function() {
                            reward.style.opacity = '0';
                        }, 2000);
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    scenes.forEach(function(scene) {
        observer.observe(scene);
    });
}

// Confetti helper
function createConfetti(container) {
    var colors = ['var(--ornament)', 'var(--ornament-light)', 'var(--action-bright)', 'var(--quran)', 'var(--reward-wash)'];

    for (var i = 0; i < 30; i++) {
        var confetti = document.createElement('span');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'confettiFall ' + (1 + Math.random()) + 's ease-out forwards';
        confetti.style.left = (Math.random() * 100) + '%';
        confetti.style.top = '50%';
        confetti.style.zIndex = '1000';

        container.style.position = 'relative';
        container.style.overflow = 'visible';
        container.appendChild(confetti);

        (function(el) {
            setTimeout(function() {
                el.remove();
            }, 2000);
        })(confetti);
    }
}

// Add CSS animations dynamically
var styleSheet = document.createElement('style');
styleSheet.textContent = [
    '@keyframes flashGold {',
    '    0%, 100% { background-color: inherit; }',
    '    50% { background-color: rgba(245, 158, 11, 0.2); }',
    '}',
    '@keyframes flashGreen {',
    '    0%, 100% { background-color: inherit; }',
    '    50% { background-color: rgba(16, 185, 129, 0.2); }',
    '}',
    '@keyframes flashRed {',
    '    0%, 100% { background-color: inherit; }',
    '    50% { background-color: rgba(239, 68, 68, 0.1); }',
    '}',
    '@keyframes confettiFall {',
    '    0% { opacity: 1; transform: translateY(0) rotate(0deg); }',
    '    100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }',
    '}',
    '@keyframes rewardPop {',
    '    0% { transform: scale(1); }',
    '    50% { transform: scale(1.5); }',
    '    100% { transform: scale(1); }',
    '}'
].join('\n');
document.head.appendChild(styleSheet);

console.log('🌟 Interactive features ready!');
