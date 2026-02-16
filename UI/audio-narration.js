// Audio Narration System for Islamic Kids Stories
// Supports Google Cloud TTS (pre-generated files) and Web Speech API fallback

const AudioNarration = {
    // Current state
    isPlaying: false,
    isPaused: false,
    currentAudio: null,
    currentSlide: -1,
    storyId: null,
    autoPlayEnabled: true,
    usePreGeneratedAudio: true, // Set to true when audio files are available

    // Audio directory path
    audioBasePath: 'audio/',

    // Initialize the narration system
    init: function(storyId) {
        this.storyId = storyId;
        this.createNarrationUI();
        this.bindEvents();
        this.checkAudioAvailability();
        console.log('🎙️ Audio narration initialized for:', storyId);
    },

    // Create the narration UI controls
    createNarrationUI: function() {
        // Create narration control bar
        const controlBar = document.createElement('div');
        controlBar.className = 'narration-control-bar';
        controlBar.id = 'narrationControlBar';

        // Play/Pause button
        const playBtn = document.createElement('button');
        playBtn.className = 'narration-btn play-btn';
        playBtn.id = 'narrationPlayBtn';
        playBtn.textContent = '▶️';
        playBtn.title = 'Play/Pause Narration';

        // Progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'narration-progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'narration-progress-bar';
        progressBar.id = 'narrationProgressBar';

        progressContainer.appendChild(progressBar);

        // Time display
        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'narration-time';
        timeDisplay.id = 'narrationTime';
        timeDisplay.textContent = '0:00';

        // Auto-play toggle
        const autoPlayToggle = document.createElement('button');
        autoPlayToggle.className = 'narration-btn auto-play-btn active';
        autoPlayToggle.id = 'autoPlayToggle';
        autoPlayToggle.textContent = '🔄';
        autoPlayToggle.title = 'Auto-play: ON';

        // Speed control
        const speedBtn = document.createElement('button');
        speedBtn.className = 'narration-btn speed-btn';
        speedBtn.id = 'narrationSpeedBtn';
        speedBtn.textContent = '1x';
        speedBtn.title = 'Playback Speed';

        // Assemble control bar
        controlBar.appendChild(playBtn);
        controlBar.appendChild(progressContainer);
        controlBar.appendChild(timeDisplay);
        controlBar.appendChild(autoPlayToggle);
        controlBar.appendChild(speedBtn);

        // Insert after slide navigation
        const slideNav = document.getElementById('slideNavigation');
        if (slideNav) {
            slideNav.parentNode.insertBefore(controlBar, slideNav.nextSibling);
        } else {
            // Fallback: add to story container
            const storyContainer = document.querySelector('.story-container');
            if (storyContainer) {
                storyContainer.appendChild(controlBar);
            }
        }

        // Add styles
        this.addStyles();
    },

    // Add CSS styles for narration UI
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .narration-control-bar {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px 20px;
                background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
                border-radius: 30px;
                margin: 15px auto;
                max-width: 500px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            .narration-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 45px;
                height: 45px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .narration-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .narration-btn.play-btn {
                background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
                width: 55px;
                height: 55px;
                font-size: 1.4rem;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }

            .narration-btn.play-btn.playing {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
            }

            .narration-progress-container {
                flex: 1;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
            }

            .narration-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #10b981 0%, #f59e0b 100%);
                border-radius: 4px;
                transition: width 0.1s linear;
            }

            .narration-time {
                color: white;
                font-size: 0.85rem;
                font-weight: 600;
                min-width: 45px;
                text-align: center;
            }

            .narration-btn.auto-play-btn {
                font-size: 1rem;
                width: 40px;
                height: 40px;
            }

            .narration-btn.auto-play-btn.active {
                background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
            }

            .narration-btn.speed-btn {
                font-size: 0.8rem;
                font-weight: bold;
                color: white;
                width: 40px;
                height: 40px;
            }

            /* Loading indicator */
            .narration-btn.play-btn.loading {
                animation: pulse 1s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* RTL Support */
            html[lang="ar"] .narration-control-bar {
                flex-direction: row-reverse;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .narration-control-bar {
                    padding: 10px 15px;
                    gap: 8px;
                    max-width: 100%;
                    margin: 10px;
                    border-radius: 20px;
                }

                .narration-btn {
                    width: 38px;
                    height: 38px;
                    font-size: 1rem;
                }

                .narration-btn.play-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 1.2rem;
                }

                .narration-time {
                    font-size: 0.75rem;
                    min-width: 35px;
                }
            }

            /* Speaking indicator animation */
            .speaking-indicator {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(16, 185, 129, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                animation: fadeInUp 0.3s ease;
            }

            .speaking-indicator .wave {
                display: flex;
                gap: 3px;
            }

            .speaking-indicator .wave span {
                width: 4px;
                height: 15px;
                background: white;
                border-radius: 2px;
                animation: wave 0.5s ease-in-out infinite;
            }

            .speaking-indicator .wave span:nth-child(2) { animation-delay: 0.1s; }
            .speaking-indicator .wave span:nth-child(3) { animation-delay: 0.2s; }
            .speaking-indicator .wave span:nth-child(4) { animation-delay: 0.3s; }

            @keyframes wave {
                0%, 100% { height: 5px; }
                50% { height: 15px; }
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        `;
        document.head.appendChild(style);
    },

    // Bind event listeners
    bindEvents: function() {
        const self = this;

        // Play/Pause button
        const playBtn = document.getElementById('narrationPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                self.togglePlayPause();
            });
        }

        // Auto-play toggle
        const autoPlayBtn = document.getElementById('autoPlayToggle');
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', function() {
                self.toggleAutoPlay();
            });
        }

        // Speed button
        const speedBtn = document.getElementById('narrationSpeedBtn');
        if (speedBtn) {
            speedBtn.addEventListener('click', function() {
                self.cycleSpeed();
            });
        }

        // Progress bar click
        const progressContainer = document.querySelector('.narration-progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                self.seekTo(e);
            });
        }

        // Listen for slide changes
        document.addEventListener('slideChanged', function(e) {
            if (self.autoPlayEnabled) {
                self.playSlideNarration(e.detail.slideIndex);
            }
        });
    },

    // Check if pre-generated audio files are available
    checkAudioAvailability: function() {
        // Use pre-generated ElevenLabs audio files
        this.usePreGeneratedAudio = true;
    },

    // Get current language
    getCurrentLanguage: function() {
        if (window.i18n && window.i18n.getCurrentLanguage) {
            return window.i18n.getCurrentLanguage();
        }
        return localStorage.getItem('islamicKidsLang') || 'en';
    },

    // Play narration for a specific slide
    playSlideNarration: function(slideIndex) {
        const lang = this.getCurrentLanguage();
        const script = window.getVoiceScript ? window.getVoiceScript(this.storyId, lang, slideIndex) : null;

        if (!script) {
            console.log('No script found for slide:', slideIndex);
            return;
        }

        this.currentSlide = slideIndex;

        // Stop any current playback
        this.stop();

        if (this.usePreGeneratedAudio) {
            this.playAudioFile(slideIndex, lang);
        } else {
            this.playWithWebSpeech(script.script, lang);
        }
    },

    // Play pre-generated audio file
    playAudioFile: function(slideIndex, lang) {
        const audioPath = `${this.audioBasePath}${this.storyId}/${lang}/slide-${slideIndex}.mp3`;

        this.currentAudio = new Audio(audioPath);
        this.currentAudio.playbackRate = this.getPlaybackRate();

        const self = this;

        this.currentAudio.addEventListener('loadedmetadata', function() {
            self.updateTimeDisplay(0, self.currentAudio.duration);
        });

        this.currentAudio.addEventListener('timeupdate', function() {
            self.updateProgress();
        });

        this.currentAudio.addEventListener('ended', function() {
            self.onNarrationEnded();
        });

        this.currentAudio.addEventListener('error', function() {
            console.log('Audio file not found, falling back to Web Speech');
            const script = window.getVoiceScript(self.storyId, lang, slideIndex);
            if (script) {
                self.playWithWebSpeech(script.script, lang);
            }
        });

        this.currentAudio.play();
        this.isPlaying = true;
        this.updatePlayButton();
        this.showSpeakingIndicator();
    },

    // Play with Web Speech API (fallback)
    playWithWebSpeech: function(text, lang) {
        if (!('speechSynthesis' in window)) {
            console.log('Web Speech API not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

        // Set voice settings
        utterance.rate = this.getPlaybackRate() * 0.9; // Web Speech is faster
        utterance.pitch = 1.0;

        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.lang.startsWith(lang === 'ar' ? 'ar' : 'en') &&
            (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        const self = this;

        utterance.onstart = function() {
            self.isPlaying = true;
            self.updatePlayButton();
            self.showSpeakingIndicator();
        };

        utterance.onend = function() {
            self.onNarrationEnded();
        };

        utterance.onerror = function(e) {
            console.log('Speech synthesis error:', e);
            self.onNarrationEnded();
        };

        // Estimate duration for progress (rough estimate: 150 words per minute)
        const wordCount = text.split(/\s+/).length;
        const estimatedDuration = (wordCount / 150) * 60;
        this.estimatedDuration = estimatedDuration;
        this.speechStartTime = Date.now();

        // Update progress periodically
        this.progressInterval = setInterval(function() {
            if (self.isPlaying) {
                const elapsed = (Date.now() - self.speechStartTime) / 1000;
                const progress = Math.min((elapsed / self.estimatedDuration) * 100, 100);
                document.getElementById('narrationProgressBar').style.width = progress + '%';
                self.updateTimeDisplay(elapsed, self.estimatedDuration);
            }
        }, 100);

        window.speechSynthesis.speak(utterance);
        this.currentUtterance = utterance;
    },

    // Toggle play/pause
    togglePlayPause: function() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (this.isPaused) {
                this.resume();
            } else {
                // Start playing current slide
                const currentSlideIndex = typeof currentSlide !== 'undefined' ? currentSlide : 0;
                this.playSlideNarration(currentSlideIndex);
            }
        }
    },

    // Pause playback
    pause: function() {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.pause();
        }
        this.isPlaying = false;
        this.isPaused = true;
        this.updatePlayButton();
        this.hideSpeakingIndicator();
    },

    // Resume playback
    resume: function() {
        if (this.currentAudio) {
            this.currentAudio.play();
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.resume();
        }
        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayButton();
        this.showSpeakingIndicator();
    },

    // Stop playback
    stop: function() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        this.isPlaying = false;
        this.isPaused = false;
        this.updatePlayButton();
        this.hideSpeakingIndicator();
    },

    // Handle narration ended
    onNarrationEnded: function() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        this.updatePlayButton();
        this.hideSpeakingIndicator();

        // Reset progress bar
        const progressBar = document.getElementById('narrationProgressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    },

    // Toggle auto-play
    toggleAutoPlay: function() {
        this.autoPlayEnabled = !this.autoPlayEnabled;
        const btn = document.getElementById('autoPlayToggle');
        if (btn) {
            btn.classList.toggle('active', this.autoPlayEnabled);
            btn.title = 'Auto-play: ' + (this.autoPlayEnabled ? 'ON' : 'OFF');
        }
    },

    // Cycle playback speed
    cycleSpeed: function() {
        const speeds = [0.75, 1, 1.25, 1.5];
        const currentRate = this.getPlaybackRate();
        const currentIndex = speeds.indexOf(currentRate);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newRate = speeds[nextIndex];

        localStorage.setItem('narrationSpeed', newRate);

        const btn = document.getElementById('narrationSpeedBtn');
        if (btn) {
            btn.textContent = newRate + 'x';
        }

        // Apply to current audio
        if (this.currentAudio) {
            this.currentAudio.playbackRate = newRate;
        }
    },

    // Get current playback rate
    getPlaybackRate: function() {
        return parseFloat(localStorage.getItem('narrationSpeed')) || 1;
    },

    // Update play button state
    updatePlayButton: function() {
        const btn = document.getElementById('narrationPlayBtn');
        if (btn) {
            btn.textContent = this.isPlaying ? '⏸️' : '▶️';
            btn.classList.toggle('playing', this.isPlaying);
        }
    },

    // Update progress display
    updateProgress: function() {
        if (!this.currentAudio) return;

        const progressBar = document.getElementById('narrationProgressBar');
        const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        this.updateTimeDisplay(this.currentAudio.currentTime, this.currentAudio.duration);
    },

    // Update time display
    updateTimeDisplay: function(current, total) {
        const timeDisplay = document.getElementById('narrationTime');
        if (timeDisplay) {
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
            timeDisplay.textContent = formatTime(current);
        }
    },

    // Seek to position
    seekTo: function(e) {
        if (!this.currentAudio) return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;

        this.currentAudio.currentTime = percentage * this.currentAudio.duration;
    },

    // Show speaking indicator
    showSpeakingIndicator: function() {
        let indicator = document.getElementById('speakingIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'speaking-indicator';
            indicator.id = 'speakingIndicator';

            const lang = this.getCurrentLanguage();
            const label = document.createElement('span');
            label.textContent = lang === 'ar' ? 'جاري القراءة...' : 'Reading...';

            const wave = document.createElement('div');
            wave.className = 'wave';
            for (let i = 0; i < 4; i++) {
                wave.appendChild(document.createElement('span'));
            }

            indicator.appendChild(label);
            indicator.appendChild(wave);
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    },

    // Hide speaking indicator
    hideSpeakingIndicator: function() {
        const indicator = document.getElementById('speakingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
};

// Export
window.AudioNarration = AudioNarration;
