// Interactive Story JavaScript

var totalStars = 0;
var soundEnabled = true;
var lessonsChecked = 0;
var brickCount = 0;
// childName is declared in stories.js

document.addEventListener('DOMContentLoaded', function() {
    // Get saved name or show modal
    childName = localStorage.getItem('islamicKidsName') || '';

    if (!childName) {
        showNameModal();
    } else {
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

    console.log('🎮 Interactive Story features loaded!');
});

// Get personalized name for messages
function getName() {
    return childName ? childName : 'friend';
}

// Get personalized greeting
function getGreeting() {
    return childName ? (childName + ', ') : '';
}

// Name Modal
function showNameModal() {
    var modal = document.createElement('div');
    modal.className = 'name-modal';
    modal.id = 'nameModal';

    var modalContent = document.createElement('div');
    modalContent.className = 'name-modal-content';

    var icon = document.createElement('div');
    icon.className = 'modal-icon';
    icon.textContent = '🌟';

    var title = document.createElement('h2');
    title.textContent = 'Assalamu Alaikum!';

    var subtitle = document.createElement('p');
    subtitle.textContent = "What's your name, little one?";

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'name-input';
    input.placeholder = 'Enter your name...';
    input.maxLength = 20;

    var button = document.createElement('button');
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

    setTimeout(function() {
        input.focus();
    }, 100);
}

function submitName(name) {
    name = name.trim();
    if (name.length > 0) {
        childName = name;
        localStorage.setItem('islamicKidsName', name);
    }

    var modal = document.getElementById('nameModal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(function() {
            modal.remove();
        }, 300);
    }

    personalizeStory();
}

function personalizeStory() {
    // Add greeting to story header
    var storyHeader = document.querySelector('.story-header');
    if (storyHeader && !document.querySelector('.personal-greeting') && childName) {
        var greeting = document.createElement('div');
        greeting.className = 'personal-greeting';
        greeting.textContent = '👋 Welcome, ' + childName + '! Ready for an adventure?';
        storyHeader.insertBefore(greeting, storyHeader.firstChild);
    }

    // Update quiz results
    var resultsH2 = document.querySelector('.results-content h2');
    if (resultsH2 && childName) {
        resultsH2.textContent = 'Amazing Job, ' + childName + '!';
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
            this.textContent = soundEnabled ? '🔊' : '🔇';
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

// Tap to Reveal
function initializeTapToReveal() {
    const revealElements = document.querySelectorAll('.tap-to-reveal');

    revealElements.forEach(function(element) {
        const prompt = element.querySelector('.tap-prompt');
        const content = element.querySelector('.revealed-content');

        if (prompt && content) {
            prompt.addEventListener('click', function() {
                content.classList.remove('hidden');
                prompt.style.display = 'none';
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
                    feedback.textContent = '🎉 ' + getGreeting() + 'Correct! Great job!';
                    feedback.style.color = '#059669';
                    container.classList.add('answered');
                    addStars(2);
                    playSound('correct');
                } else {
                    this.classList.add('selected-wrong');
                    feedback.textContent = '🤔 ' + getGreeting() + 'Try again!';
                    feedback.style.color = '#dc2626';
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
            });
            this.classList.add('selected');
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
            correctPlacements++;

            if (correctPlacements === 3) {
                feedback.textContent = '🎉 ' + getGreeting() + 'Perfect! You got them all right!';
                feedback.style.color = '#059669';
                addStars(3);
                playSound('correct');
            }
        } else {
            feedback.textContent = '🤔 ' + getGreeting() + 'Hmm, try putting that somewhere else!';
            feedback.style.color = '#dc2626';
            playSound('wrong');

            setTimeout(function() {
                feedback.textContent = '';
            }, 2000);
        }

        draggedItem = null;
        item.classList.remove('selected');
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
                emotionFeedback.textContent = '🎉 ' + getGreeting() + 'Yes! Ibrahim felt peaceful because he trusted Allah completely!';
                emotionFeedback.style.color = '#059669';
                this.parentElement.classList.add('answered');
                addStars(2);
                playSound('correct');
            } else {
                this.classList.add('wrong');
                emotionFeedback.textContent = '🤔 ' + getGreeting() + 'Think about it... Ibrahim trusted Allah!';
                emotionFeedback.style.color = '#dc2626';
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
            this.textContent = '🎊 SubhanAllah! 🎊';

            playSound('celebrate');
            createMassiveConfetti();
            addStars(2);
        });
    }
}

function createMassiveConfetti() {
    var colors = ['#10b981', '#f59e0b', '#14b8a6', '#fde68a', '#a78bfa', '#ec4899'];
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
                addBrickBtn.disabled = true;
                addBrickBtn.textContent = '🕋 Complete!';

                // Add kaaba emoji on top
                var kaaba = document.createElement('div');
                kaaba.textContent = '🕋';
                kaaba.style.fontSize = '3rem';
                kaaba.style.marginTop = '1rem';
                kaaba.style.animation = 'kaabaGlow 2s ease-in-out infinite';
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
                    instruction.textContent = '🎉 ' + getGreeting() + 'Amazing! You learned all the lessons!';
                    instruction.style.color = '#059669';
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
            checkSpan.textContent = '✅ ' + getGreeting() + 'Added to your duas!';
            this.appendChild(checkSpan);

            // Save to localStorage
            var savedDuas = JSON.parse(localStorage.getItem('savedDuas') || '[]');
            savedDuas.push({
                arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
                translation: 'Our Lord, accept from us. Indeed You are the Hearing, the Knowing.',
                source: 'Prophet Ibrahim'
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
    var colors = ['#10b981', '#f59e0b', '#14b8a6', '#fde68a', '#a78bfa'];

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
