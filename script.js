function app() {
    return {
        step: 'onboarding',
        currentIndex: 0,
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        letters: {},
        noteText: '',
        theme: 'Coral',
        themes: [
            { name: 'Coral', color: '#f39375' },
            { name: 'Golden', color: '#fac875' },
            { name: 'Spring', color: '#e2f693' },
            { name: 'Sky', color: '#6cb6df' }
        ],
        showAlphabetGallery: false,
        isDownloading: false,
        canvas: null,
        ctx: null,
        fCanvas: null,

        init() {
            const saved = localStorage.getItem('script-o-matic-letters');
            if (saved) {
                this.letters = JSON.parse(saved);
                this.step = 'workshop';
            }

            this.$nextTick(() => {
                this.setupCanvas();
            });

            this.$watch('step', (val) => {
                if (val === 'onboarding') this.$nextTick(() => this.setupCanvas());
                if (val === 'workshop') {
                    this.$nextTick(() => {
                        if (this.$refs.editor) this.$refs.editor.focus();
                    });
                }
            });
        },

        setupCanvas() {
            const canvasEl = document.getElementById('onboardingCanvas');
            if (!canvasEl) return;

            if (this.fCanvas) {
                this.fCanvas.dispose();
            }

            const rect = canvasEl.parentElement.getBoundingClientRect();
            const size = Math.min(rect.width, 300);

            this.fCanvas = new fabric.Canvas('onboardingCanvas', {
                isDrawingMode: true,
                width: size,
                height: size,
                backgroundColor: '#F9FAFB'
            });

            this.fCanvas.freeDrawingBrush = new fabric.PencilBrush(this.fCanvas);
            this.fCanvas.freeDrawingBrush.width = 38;
            this.fCanvas.freeDrawingBrush.color = '#111';
            this.fCanvas.freeDrawingBrush.strokeLineCap = 'round';
            this.fCanvas.freeDrawingBrush.strokeLineJoin = 'round';

            this.fCanvas.calcOffset();
        },

        selectLetter(index) {
            this.currentIndex = index;
            this.clearCanvas();
        },

        saveCurrent() {
            const hasObjects = this.fCanvas && this.fCanvas.getObjects().length > 0;
            if (!hasObjects) return;

            const char = this.alphabet[this.currentIndex];
            const oldBg = this.fCanvas.backgroundColor;
            this.fCanvas.backgroundColor = 'transparent';
            this.fCanvas.renderAll();

            const dataUrl = this.fCanvas.toDataURL({
                format: 'png',
                multiplier: 1
            });

            this.fCanvas.backgroundColor = oldBg;
            this.fCanvas.renderAll();

            this.letters[char] = dataUrl;
            localStorage.setItem('script-o-matic-letters', JSON.stringify(this.letters));
        },

        saveAndNext() {
            this.saveCurrent();
            if (this.currentIndex < 25) {
                this.currentIndex++;
                this.clearCanvas();
            } else {
                localStorage.setItem('script-o-matic-letters', JSON.stringify(this.letters));
                this.step = 'workshop';
            }
        },

        prevLetter() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.clearCanvas();
            }
        },

        clearCanvas() {
            if (this.fCanvas) {
                this.fCanvas.clear();
                this.fCanvas.backgroundColor = '#f3f4f6';
                this.fCanvas.renderAll();
            }
        },

        resetOnboarding() {
            if (confirm('Are you sure you want to re-draw your alphabet?')) {
                localStorage.removeItem('script-o-matic-letters');
                this.letters = {};
                this.currentIndex = 0;
                this.step = 'onboarding';
                this.noteText = '';
            }
        },

        get renderedChars() {
            return this.noteText.split('');
        },

        async downloadImage() {
            if (typeof html2canvas === 'undefined') {
                alert('Download library (html2canvas) is not loaded. Please check your internet connection and refresh.');
                return;
            }

            const area = document.getElementById('captureArea');
            if (!area || this.isDownloading) return;

            this.isDownloading = true;

            // 1. Prepare for capture: normalize styles
            const originalStyle = area.getAttribute('style');

            try {
                const activeTheme = this.themes.find(t => t.name === this.theme) || this.themes[0];

                // Temporarily bypass shadows and transitions for html2canvas stability
                area.style.boxShadow = 'none';
                area.style.transition = 'none';
                area.style.transform = 'none';

                // 2. Small delay to ensure styles are applied
                await new Promise(r => setTimeout(r, 200));

                // 3. Capture using html2canvas
                const canvas = await html2canvas(area, {
                    backgroundColor: activeTheme.color,
                    scale: 2, // High DPI
                    useCORS: true,
                    logging: false,
                    allowTaint: true
                });

                // 4. Trigger download
                const link = document.createElement('a');
                link.download = `script-o-matic-note-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (err) {
                console.error('HTML2CANVAS DOWNLOAD ERROR:', err);
                alert(`Download failed. This is often due to browser memory limits or CORS issues with custom letter images. Try taking a screenshot as a fallback.`);
            } finally {
                // 5. Restore original state
                if (originalStyle) area.setAttribute('style', originalStyle);
                else area.removeAttribute('style');

                this.isDownloading = false;
            }
        }
    }
}
