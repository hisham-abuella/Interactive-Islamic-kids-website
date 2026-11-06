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
    autoAdvanceEnabled: false,
    usePreGeneratedAudio: true, // Set to true when audio files are available

    // Audio directory path
    audioBasePath: 'audio/',

    // Initialize the narration system
    init: function(storyId) {
        this.storyId = storyId;
        this.createNarrationUI();
        this.bindEvents();
        this.checkAudioAvailability();
    },

    // Labels for the narration controls, in both languages
    labels: {
        en: { play: 'Listen to this page', pause: 'Pause', speed: 'Reading speed', autoplay: 'Read each page aloud',
              autoplaySub: 'Starts the narration when you turn the page', advance: 'Turn the page by itself',
              advanceSub: 'For children who cannot read yet', progress: 'Narration progress' },
        ar: { play: 'استمع إلى هذه الصفحة', pause: 'إيقاف مؤقت', speed: 'سرعة القراءة', autoplay: 'اقرأ كل صفحة بصوت عالٍ',
              autoplaySub: 'يبدأ السرد عند تقليب الصفحة', advance: 'تقليب الصفحة تلقائياً',
              advanceSub: 'للأطفال الذين لا يقرؤون بعد', progress: 'تقدّم السرد' }
    },

    label: function(key) {
        return this.labels[this.getCurrentLanguage() === 'ar' ? 'ar' : 'en'][key];
    },

    icon: function(name, extra) {
        return '<svg class="icon' + (extra ? ' ' + extra : '') + '" aria-hidden="true"><use href="vendor/icons/sprite.svg#i-' + name + '"/></svg>';
    },

    // Create the narration UI controls.
    // v2: no injected stylesheet. The controls are styled in stories.css on the
    // palette tokens (the old JS sheet carried off-palette hex and keyframe names
    // that overrode stories.css). In the reader the play button sits in the
    // floating transport and the settings go in the reading-settings sheet;
    // on a classic-scroll story (Yusuf) they form one labelled bar.
    createNarrationUI: function() {
        var self = this;
        try {
            var ap = localStorage.getItem('islamicKidsAutoPlay');
            if (ap === 'off') this.autoPlayEnabled = false;
        } catch (e) {}

        // Play / pause: a 56px round button with a text label for screen readers
        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'play-btn narration-btn';
        playBtn.id = 'narrationPlayBtn';
        playBtn.setAttribute('aria-pressed', 'false');
        playBtn.innerHTML = this.icon('play', 'icon-play') + this.icon('pause', 'icon-pause');

        // Progress: a thin seekable line
        const progressContainer = document.createElement('div');
        progressContainer.className = 'narration-progress-container';
        progressContainer.setAttribute('aria-hidden', 'true');
        const progressBar = document.createElement('div');
        progressBar.className = 'narration-progress-bar';
        progressBar.id = 'narrationProgressBar';
        progressContainer.appendChild(progressBar);

        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'narration-time';
        timeDisplay.id = 'narrationTime';
        timeDisplay.setAttribute('aria-hidden', 'true');
        timeDisplay.textContent = '0:00';

        // Speed: a segmented control
        const speedGroup = document.createElement('div');
        speedGroup.className = 'narration-speed';
        speedGroup.innerHTML = '<span class="sheet-label" id="lblSpeed"></span>' +
            '<div class="segmented" role="group" aria-labelledby="lblSpeed" id="narrationSpeedBtn">' +
            [0.75, 1, 1.25, 1.5].map(function (r) {
                return '<button type="button" dir="ltr" data-rate="' + r + '">' + r + '×</button>';
            }).join('') + '</div>';

        // Auto-play and auto-turn: switches
        const autoPlayToggle = document.createElement('button');
        autoPlayToggle.type = 'button';
        autoPlayToggle.className = 'setting-row narration-switch';
        autoPlayToggle.id = 'autoPlayToggle';
        autoPlayToggle.setAttribute('role', 'switch');
        autoPlayToggle.innerHTML = '<span><span class="sw-label"></span><small class="sw-sub"></small></span><span class="switch" aria-hidden="true"></span>';

        // A child too young to read should not have to tap to turn the page.
        const advanceBtn = document.createElement('button');
        advanceBtn.type = 'button';
        advanceBtn.className = 'setting-row narration-switch';
        advanceBtn.id = 'autoAdvanceBtn';
        advanceBtn.setAttribute('role', 'switch');
        advanceBtn.setAttribute('aria-checked', 'false');
        advanceBtn.innerHTML = '<span><span class="sw-label"></span><small class="sw-sub"></small></span><span class="switch" aria-hidden="true"></span>';

        const transportSlot = document.getElementById('transportPlay');
        const settingsSlot = document.getElementById('narrSettings');
        if (transportSlot && settingsSlot) {
            transportSlot.appendChild(progressContainer);
            transportSlot.appendChild(playBtn);
            transportSlot.appendChild(timeDisplay);
            settingsSlot.appendChild(speedGroup);
            settingsSlot.appendChild(autoPlayToggle);
            settingsSlot.appendChild(advanceBtn);
        } else {
            // Classic-scroll story: one labelled bar, sticky at the bottom of the screen
            const controlBar = document.createElement('div');
            controlBar.className = 'narration-control-bar';
            controlBar.id = 'narrationControlBar';
            // settings fold away behind one icon so the bar stays one row
            const settings = document.createElement('details');
            settings.className = 'narration-settings';
            const summary = document.createElement('summary');
            summary.className = 'icon-btn';
            summary.id = 'narrationMore';
            summary.innerHTML = this.icon('settings-2');
            settings.appendChild(summary);
            const panel = document.createElement('div');
            panel.className = 'narration-settings__panel';
            panel.appendChild(speedGroup);
            panel.appendChild(autoPlayToggle);
            panel.appendChild(advanceBtn);
            settings.appendChild(panel);
            controlBar.appendChild(playBtn);
            controlBar.appendChild(progressContainer);
            controlBar.appendChild(timeDisplay);
            controlBar.appendChild(settings);
            const storyContainer = document.querySelector('.story-container');
            const header = storyContainer && storyContainer.querySelector('.story-header');
            if (header) header.after(controlBar);
            else if (storyContainer) storyContainer.appendChild(controlBar);
        }

        this.relabel();
        this.updateSpeedControl();
        document.addEventListener('languageChanged', function () { self.relabel(); });
    },

    // Re-label every control for the current language and state
    relabel: function() {
        var set = function (el, sel, text) { var n = el && el.querySelector(sel); if (n) n.textContent = text; };
        var ap = document.getElementById('autoPlayToggle');
        if (ap) {
            set(ap, '.sw-label', this.label('autoplay'));
            set(ap, '.sw-sub', this.label('autoplaySub'));
            ap.setAttribute('aria-checked', String(this.autoPlayEnabled));
        }
        var adv = document.getElementById('autoAdvanceBtn');
        if (adv) {
            set(adv, '.sw-label', this.label('advance'));
            set(adv, '.sw-sub', this.label('advanceSub'));
        }
        var more = document.getElementById('narrationMore');
        if (more) more.setAttribute('aria-label', this.getCurrentLanguage() === 'ar' ? 'إعدادات السرد' : 'Narration settings');
                var lbl = document.getElementById('lblSpeed');
        if (lbl) lbl.textContent = this.label('speed');
        var sound = document.getElementById('readerSound');
        if (sound) sound.setAttribute('aria-pressed', String(this.autoPlayEnabled));
        this.updatePlayButton();
    },

    updateSpeedControl: function() {
        var rate = this.getPlaybackRate();
        var group = document.getElementById('narrationSpeedBtn');
        if (!group) return;
        Array.prototype.forEach.call(group.querySelectorAll('button'), function (b) {
            b.setAttribute('aria-pressed', String(parseFloat(b.getAttribute('data-rate')) === rate));
        });
    },

    setSpeed: function(rate) {
        try { localStorage.setItem('narrationSpeed', rate); } catch (e) {}
        if (this.currentAudio) this.currentAudio.playbackRate = rate;
        this.updateSpeedControl();
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

        // Speed: segmented control
        const speedGroup = document.getElementById('narrationSpeedBtn');
        if (speedGroup) {
            Array.prototype.forEach.call(speedGroup.querySelectorAll('button'), function (b) {
                b.addEventListener('click', function () { self.setSpeed(parseFloat(b.getAttribute('data-rate'))); });
            });
        }

        // Progress bar click
        const progressContainer = document.querySelector('.narration-progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                self.seekTo(e);
            });
        }

        // Auto-advance control
        var advBtn = document.getElementById('autoAdvanceBtn');
        if (advBtn) {
            advBtn.addEventListener('click', function () { self.toggleAutoAdvance(); });
        }
        try {
            self.autoAdvanceEnabled = localStorage.getItem('islamicKidsAutoAdvance') === 'on';
        } catch (e) {}
        self.updateAutoAdvanceButton();
        document.addEventListener('languageChanged', function () {
            self.updateAutoAdvanceButton();
        });

        // Listen for slide changes
        document.addEventListener('slideChanged', function(e) {
            if (self.autoPlayEnabled) {
                self.playSlideNarration(e.detail.slideIndex);
            }
        });

        // Follow a language switch. getCurrentLanguage() is read at play time, so
        // the next slide would have been correct anyway - but narration already
        // playing would have carried on in the old language until it finished.
        document.addEventListener('languageChanged', function() {
            if (self.isPlaying && self.currentSlide >= 0) {
                var slide = self.currentSlide;
                self.stop();
                self.playSlideNarration(slide);
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

        // A held slide (no-recitation rule: its wording awaits the scholar) is silent: no file,
        // and never speech synthesis. In listen mode the story still turns its own page.
        if (script.held) {
            const self = this;
            this.advanceTimer = setTimeout(function () { self.onNarrationEnded(); }, 3000);
            return;
        }

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

        this.currentAudio.play().catch(function () { /* interrupted by a page turn or pause: not an error */ });
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
            this.currentAudio.play().catch(function () { /* interrupted by a page turn or pause: not an error */ });
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
        if (this.advanceTimer) {
            clearTimeout(this.advanceTimer);
        }
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

        // Auto-advance: for a child too young to read, the story should turn
        // its own page when the narration for this one finishes. A short pause
        // first, so the last sentence is not clipped by the next one starting.
        if (this.autoAdvanceEnabled && window.StorySlides && !window.StorySlides.isLast()) {
            var self = this;
            this.advanceTimer = setTimeout(function () {
                if (self.autoAdvanceEnabled) {
                    window.StorySlides.next();
                }
            }, 1200);
        }
    },

    // Turn auto-advance on or off
    toggleAutoAdvance: function () {
        this.autoAdvanceEnabled = !this.autoAdvanceEnabled;
        if (!this.autoAdvanceEnabled && this.advanceTimer) {
            clearTimeout(this.advanceTimer);
        }
        try {
            localStorage.setItem('islamicKidsAutoAdvance', this.autoAdvanceEnabled ? 'on' : 'off');
        } catch (e) {}
        this.updateAutoAdvanceButton();
    },

    updateAutoAdvanceButton: function () {
        var btn = document.getElementById('autoAdvanceBtn');
        if (!btn) return;
        var on = this.autoAdvanceEnabled;
        btn.setAttribute('aria-checked', String(on));
        btn.classList.toggle('active', on);
    },

    // Toggle auto-play
    toggleAutoPlay: function() {
        this.autoPlayEnabled = !this.autoPlayEnabled;
        try { localStorage.setItem('islamicKidsAutoPlay', this.autoPlayEnabled ? 'on' : 'off'); } catch (e) {}
        this.relabel();
    },

    // Cycle playback speed (kept for callers; the UI uses setSpeed)
    cycleSpeed: function() {
        const speeds = [0.75, 1, 1.25, 1.5];
        const i = speeds.indexOf(this.getPlaybackRate());
        this.setSpeed(speeds[(i + 1) % speeds.length]);
    },

    // Get current playback rate
    getPlaybackRate: function() {
        return parseFloat(localStorage.getItem('narrationSpeed')) || 1;
    },

    // Update play button state
    updatePlayButton: function() {
        const btn = document.getElementById('narrationPlayBtn');
        if (btn) {
            btn.setAttribute('aria-pressed', String(this.isPlaying));
            btn.setAttribute('aria-label', this.label('play'));   // constant name; the state is aria-pressed
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

    // Speaking state. v2: no floating emerald toast; the play button shows the
    // state (aria-pressed, pause glyph) and the page gets .is-narrating.
    showSpeakingIndicator: function() {
        document.body.classList.add('is-narrating');
    },

    hideSpeakingIndicator: function() {
        document.body.classList.remove('is-narrating');
    }
};

// Export
window.AudioNarration = AudioNarration;
