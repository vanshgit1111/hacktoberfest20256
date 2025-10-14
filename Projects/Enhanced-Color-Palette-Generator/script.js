class ColorPaletteGenerator {
    constructor() {
        this.currentPalette = [];
        this.lockedColors = [];
        this.savedPalettes = [];
        this.paletteSize = 5;
        
        this.initializeElements();
        this.loadSavedPalettes();
        this.generatePalette();
        this.bindEvents();
    }

    initializeElements() {
        this.generateBtn = document.getElementById('generateBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.paletteContainer = document.getElementById('paletteContainer');
        this.savedPalettesList = document.getElementById('savedPalettesList');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.saveBtn.addEventListener('click', () => this.savePalette());
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.clearBtn.addEventListener('click', () => this.clearSavedPalettes());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'g' || e.key === 'G') {
                this.generatePalette();
            } else if (e.key === 's' || e.key === 'S') {
                this.savePalette();
            } else if (e.key === 'e' || e.key === 'E') {
                this.showExportModal();
            }
        });
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
        const lightness = Math.floor(Math.random() * 30) + 40;  // 40-70%
        
        return this.hslToHex(hue, saturation, lightness);
    }

    generateHarmoniousColor(baseHue, type) {
        let newHue;
        const saturation = Math.floor(Math.random() * 20) + 70; // 70-90%
        const lightness = Math.floor(Math.random() * 30) + 40;  // 40-70%

        switch (type) {
            case 'analogous':
                newHue = (baseHue + Math.floor(Math.random() * 60) - 30) % 360;
                break;
            case 'complementary':
                newHue = (baseHue + 180) % 360;
                break;
            case 'triadic':
                newHue = (baseHue + 120) % 360;
                break;
            case 'splitComplementary':
                const offset = Math.random() > 0.5 ? 150 : 210;
                newHue = (baseHue + offset) % 360;
                break;
            default:
                newHue = Math.floor(Math.random() * 360);
        }

        if (newHue < 0) newHue += 360;
        return this.hslToHex(newHue, saturation, lightness);
    }

    generatePalette() {
        const newPalette = [];
        const baseHue = Math.floor(Math.random() * 360);
        const harmonyTypes = ['analogous', 'complementary', 'triadic', 'splitComplementary', 'random'];

        for (let i = 0; i < this.paletteSize; i++) {
            if (this.lockedColors[i]) {
                newPalette.push(this.currentPalette[i]);
            } else {
                if (i === 0) {
                    newPalette.push(this.generateRandomColor());
                } else {
                    const harmonyType = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];
                    if (harmonyType === 'random') {
                        newPalette.push(this.generateRandomColor());
                    } else {
                        newPalette.push(this.generateHarmoniousColor(baseHue, harmonyType));
                    }
                }
            }
        }

        this.currentPalette = newPalette;
        this.renderPalette();
    }

    renderPalette() {
        this.paletteContainer.innerHTML = '';

        this.currentPalette.forEach((color, index) => {
            const colorCard = this.createColorCard(color, index);
            this.paletteContainer.appendChild(colorCard);
        });
    }

    createColorCard(color, index) {
        const card = document.createElement('div');
        card.className = 'color-card generating';
        
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.backgroundColor = color;
        
        const lockBtn = document.createElement('button');
        lockBtn.className = `lock-btn ${this.lockedColors[index] ? 'locked' : ''}`;
        lockBtn.innerHTML = this.lockedColors[index] ? 
            '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
        lockBtn.setAttribute('aria-label', this.lockedColors[index] ? 'Unlock color' : 'Lock color');
        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLock(index);
        });
        
        colorDisplay.appendChild(lockBtn);
        
        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        
        // Create format toggle buttons
        const formatButtons = document.createElement('div');
        formatButtons.className = 'format-buttons';
        
        const hexBtn = document.createElement('button');
        hexBtn.textContent = 'HEX';
        hexBtn.className = 'format-btn active';
        hexBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setColorFormat(card, color, 'hex');
        });
        
        const rgbBtn = document.createElement('button');
        rgbBtn.textContent = 'RGB';
        rgbBtn.className = 'format-btn';
        rgbBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setColorFormat(card, color, 'rgb');
        });
        
        const hslBtn = document.createElement('button');
        hslBtn.textContent = 'HSL';
        hslBtn.className = 'format-btn';
        hslBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setColorFormat(card, color, 'hsl');
        });
        
        formatButtons.appendChild(hexBtn);
        formatButtons.appendChild(rgbBtn);
        formatButtons.appendChild(hslBtn);
        
        const colorCode = document.createElement('div');
        colorCode.className = 'color-code';
        colorCode.textContent = color.toUpperCase();
        colorCode.setAttribute('data-format', 'hex');
        colorCode.setAttribute('data-color', color);
        
        const copyHint = document.createElement('div');
        copyHint.className = 'copy-hint';
        copyHint.textContent = 'Click to copy';
        
        // Add accessibility contrast information
        const contrastInfo = document.createElement('div');
        contrastInfo.className = 'contrast-info';
        const contrastRatio = this.getContrastRatio(color, '#ffffff');
        contrastInfo.textContent = `Contrast: ${contrastRatio.toFixed(1)}:1`;
        contrastInfo.className += contrastRatio >= 4.5 ? ' good-contrast' : ' poor-contrast';
        
        colorInfo.appendChild(formatButtons);
        colorInfo.appendChild(colorCode);
        colorInfo.appendChild(contrastInfo);
        colorInfo.appendChild(copyHint);
        
        card.appendChild(colorDisplay);
        card.appendChild(colorInfo);
        
        card.addEventListener('click', () => this.copyCurrentFormat(card));
        
        return card;
    }

    toggleLock(index) {
        this.lockedColors[index] = !this.lockedColors[index];
        this.renderPalette();
        
        const action = this.lockedColors[index] ? 'locked' : 'unlocked';
        this.showNotification(`Color ${action}!`);
    }

    copyToClipboard(color) {
        navigator.clipboard.writeText(color).then(() => {
            this.showNotification(`Copied ${color} to clipboard!`);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = color;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification(`Copied ${color} to clipboard!`);
        });
    }

    copyCurrentFormat(card) {
        const colorCode = card.querySelector('.color-code');
        const currentValue = colorCode.textContent;
        this.copyToClipboard(currentValue);
    }

    setColorFormat(card, hexColor, format) {
        const colorCode = card.querySelector('.color-code');
        const formatButtons = card.querySelectorAll('.format-btn');
        
        // Update active button
        formatButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(formatButtons).find(btn => btn.textContent.toLowerCase() === format);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Convert and display color in requested format
        let displayValue;
        switch (format) {
            case 'hex':
                displayValue = hexColor.toUpperCase();
                break;
            case 'rgb':
                displayValue = this.hexToRgb(hexColor);
                break;
            case 'hsl':
                displayValue = this.hexToHsl(hexColor);
                break;
            default:
                displayValue = hexColor.toUpperCase();
        }
        
        colorCode.textContent = displayValue;
        colorCode.setAttribute('data-format', format);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return hex;
    }

    hexToHsl(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            let r = parseInt(result[1], 16) / 255;
            let g = parseInt(result[2], 16) / 255;
            let b = parseInt(result[3], 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            h = Math.round(h * 360);
            s = Math.round(s * 100);
            l = Math.round(l * 100);

            return `hsl(${h}, ${s}%, ${l}%)`;
        }
        return hex;
    }

    getContrastRatio(color1, color2) {
        const getLuminance = (hex) => {
            const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (rgb) {
                const r = parseInt(rgb[1], 16) / 255;
                const g = parseInt(rgb[2], 16) / 255;
                const b = parseInt(rgb[3], 16) / 255;
                
                const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                
                const rLinear = toLinear(r);
                const gLinear = toLinear(g);
                const bLinear = toLinear(b);
                
                return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
            }
            return 0;
        };
        
        const l1 = getLuminance(color1);
        const l2 = getLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    showExportModal() {
        if (this.currentPalette.length === 0) {
            this.showNotification('Generate a palette first!', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-content">
                <h3>Export Palette</h3>
                <div class="export-options">
                    <button class="export-option" data-format="css">CSS Variables</button>
                    <button class="export-option" data-format="scss">SCSS Variables</button>
                    <button class="export-option" data-format="json">JSON</button>
                    <button class="export-option" data-format="txt">Text List</button>
                    <button class="export-option" data-format="svg">SVG Palette</button>
                </div>
                <button class="close-modal">&times;</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        modal.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.getAttribute('data-format');
                this.exportPalette(format);
                document.body.removeChild(modal);
            });
        });
    }

    exportPalette(format) {
        let content, filename, mimeType;

        switch (format) {
            case 'css':
                content = this.generateCSSExport();
                filename = 'color-palette.css';
                mimeType = 'text/css';
                break;
            case 'scss':
                content = this.generateSCSSExport();
                filename = 'color-palette.scss';
                mimeType = 'text/scss';
                break;
            case 'json':
                content = this.generateJSONExport();
                filename = 'color-palette.json';
                mimeType = 'application/json';
                break;
            case 'txt':
                content = this.generateTextExport();
                filename = 'color-palette.txt';
                mimeType = 'text/plain';
                break;
            case 'svg':
                content = this.generateSVGExport();
                filename = 'color-palette.svg';
                mimeType = 'image/svg+xml';
                break;
            default:
                return;
        }

        this.downloadFile(content, filename, mimeType);
        this.showNotification(`Exported as ${format.toUpperCase()}!`);
    }

    generateCSSExport() {
        let css = ':root {\n';
        this.currentPalette.forEach((color, index) => {
            css += `  --color-${index + 1}: ${color};\n`;
        });
        css += '}';
        return css;
    }

    generateSCSSExport() {
        let scss = '// Color Palette Variables\n';
        this.currentPalette.forEach((color, index) => {
            scss += `$color-${index + 1}: ${color};\n`;
        });
        return scss;
    }

    generateJSONExport() {
        const paletteData = {
            palette: this.currentPalette,
            generated: new Date().toISOString(),
            formats: {
                hex: this.currentPalette,
                rgb: this.currentPalette.map(color => this.hexToRgb(color)),
                hsl: this.currentPalette.map(color => this.hexToHsl(color))
            }
        };
        return JSON.stringify(paletteData, null, 2);
    }

    generateTextExport() {
        let text = 'Color Palette\n' + '='.repeat(20) + '\n';
        this.currentPalette.forEach((color, index) => {
            text += `Color ${index + 1}: ${color}\n`;
        });
        return text;
    }

    generateSVGExport() {
        const width = 500;
        const height = 100;
        const colorWidth = width / this.currentPalette.length;
        
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
        
        this.currentPalette.forEach((color, index) => {
            const x = index * colorWidth;
            svg += `  <rect x="${x}" y="0" width="${colorWidth}" height="${height}" fill="${color}"/>\n`;
            svg += `  <text x="${x + colorWidth/2}" y="${height/2 + 5}" text-anchor="middle" fill="${this.getContrastRatio(color, '#000000') > 4.5 ? '#000000' : '#ffffff'}" font-family="Arial, sans-serif" font-size="12">${color}</text>\n`;
        });
        
        svg += '</svg>';
        return svg;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    savePalette() {
        if (this.currentPalette.length === 0) {
            this.showNotification('Generate a palette first!', 'error');
            return;
        }

        const paletteData = {
            id: Date.now(),
            colors: [...this.currentPalette],
            timestamp: new Date().toLocaleDateString()
        };

        this.savedPalettes.unshift(paletteData);
        this.saveToLocalStorage();
        this.renderSavedPalettes();
        this.showNotification('Palette saved successfully!');
    }

    loadPalette(paletteData) {
        this.currentPalette = [...paletteData.colors];
        this.lockedColors = new Array(this.paletteSize).fill(false);
        this.renderPalette();
        this.showNotification('Palette loaded!');
    }

    deleteSavedPalette(id) {
        this.savedPalettes = this.savedPalettes.filter(palette => palette.id !== id);
        this.saveToLocalStorage();
        this.renderSavedPalettes();
        this.showNotification('Palette deleted!');
    }

    clearSavedPalettes() {
        if (this.savedPalettes.length === 0) {
            this.showNotification('No saved palettes to clear!', 'error');
            return;
        }

        if (confirm('Are you sure you want to clear all saved palettes?')) {
            this.savedPalettes = [];
            this.saveToLocalStorage();
            this.renderSavedPalettes();
            this.showNotification('All saved palettes cleared!');
        }
    }

    renderSavedPalettes() {
        this.savedPalettesList.innerHTML = '';

        if (this.savedPalettes.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No saved palettes yet. Create and save some beautiful color combinations!';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#666';
            emptyMessage.style.fontStyle = 'italic';
            this.savedPalettesList.appendChild(emptyMessage);
            return;
        }

        this.savedPalettes.forEach(palette => {
            const paletteDiv = document.createElement('div');
            paletteDiv.className = 'saved-palette';

            const colorsDiv = document.createElement('div');
            colorsDiv.className = 'saved-colors';

            palette.colors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'saved-color';
                colorDiv.style.backgroundColor = color;
                colorDiv.title = color;
                colorDiv.addEventListener('click', () => this.copyToClipboard(color));
                colorsDiv.appendChild(colorDiv);
            });

            const loadBtn = document.createElement('button');
            loadBtn.className = 'load-palette';
            loadBtn.innerHTML = '<i class="fas fa-download"></i> Load';
            loadBtn.addEventListener('click', () => this.loadPalette(palette));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-palette';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteSavedPalette(palette.id));

            const dateSpan = document.createElement('span');
            dateSpan.textContent = palette.timestamp;
            dateSpan.style.fontSize = '0.8rem';
            dateSpan.style.color = '#666';

            paletteDiv.appendChild(colorsDiv);
            paletteDiv.appendChild(dateSpan);
            paletteDiv.appendChild(loadBtn);
            paletteDiv.appendChild(deleteBtn);

            this.savedPalettesList.appendChild(paletteDiv);
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('colorPalettes', JSON.stringify(this.savedPalettes));
    }

    loadSavedPalettes() {
        const saved = localStorage.getItem('colorPalettes');
        if (saved) {
            this.savedPalettes = JSON.parse(saved);
            this.renderSavedPalettes();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});

// Add some fun easter eggs
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        // Easter egg: Rainbow palette
        const rainbowColors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff'];
        const generator = window.colorGenerator;
        if (generator) {
            generator.currentPalette = rainbowColors;
            generator.renderPalette();
            generator.showNotification('🌈 Rainbow mode activated! 🌈');
        }
        konamiSequence = [];
    }
});

// Make the generator globally accessible for easter eggs
let colorGenerator;
document.addEventListener('DOMContentLoaded', () => {
    colorGenerator = new ColorPaletteGenerator();
    window.colorGenerator = colorGenerator;
});