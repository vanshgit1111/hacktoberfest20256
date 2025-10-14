class PasswordSecurityHub {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentTab = 'analyzer';
        this.commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou'
        ];
    }

    initializeElements() {
        // Tab elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Analyzer elements
        this.passwordInput = document.getElementById('passwordInput');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.strengthProgress = document.getElementById('strengthProgress');
        this.strengthText = document.getElementById('strengthText');
        this.lengthValue = document.getElementById('lengthValue');
        this.lengthBar = document.getElementById('lengthBar');
        this.crackTime = document.getElementById('crackTime');
        this.crackBar = document.getElementById('crackBar');
        this.entropyValue = document.getElementById('entropyValue');
        this.entropyBar = document.getElementById('entropyBar');
        this.scoreValue = document.getElementById('scoreValue');
        this.scoreBar = document.getElementById('scoreBar');
        this.feedbackList = document.getElementById('feedbackList');

        // Generator elements
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthDisplay = document.getElementById('lengthDisplay');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        this.generatePasswordBtn = document.getElementById('generatePassword');
        this.generateMultipleBtn = document.getElementById('generateMultiple');
        this.generatedPassword = document.getElementById('generatedPassword');
        this.copyPasswordBtn = document.getElementById('copyPassword');
        this.multiplePasswords = document.getElementById('multiplePasswords');

        // Strength test elements
        this.passwordA = document.getElementById('passwordA');
        this.passwordB = document.getElementById('passwordB');
        this.strengthA = document.getElementById('strengthA');
        this.strengthB = document.getElementById('strengthB');
        this.scoreA = document.getElementById('scoreA');
        this.scoreB = document.getElementById('scoreB');
        this.comparisonResult = document.getElementById('comparisonResult');

        // Security check elements
        this.breachCheckInput = document.getElementById('breachCheckInput');
        this.checkBreachBtn = document.getElementById('checkBreachBtn');
        this.breachResult = document.getElementById('breachResult');
        this.tfaCheckboxes = document.querySelectorAll('.tfa-checkbox');
        this.tfaScore = document.getElementById('tfaScore');
        this.tfaMeter = document.getElementById('tfaMeter');
        this.tfaRecommendations = document.getElementById('tfaRecommendations');
        this.historyInput = document.getElementById('historyInput');
        this.addToHistoryBtn = document.getElementById('addToHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.passwordHistory = document.getElementById('passwordHistory');
        this.historyCount = document.getElementById('historyCount');
        this.averageStrength = document.getElementById('averageStrength');
        this.securityTrend = document.getElementById('securityTrend');
        this.patternInput = document.getElementById('patternInput');
        this.patternResults = document.getElementById('patternResults');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.themeToggle = document.getElementById('themeToggle');

        // Initialize password history from localStorage
        this.passwordHistoryData = JSON.parse(localStorage.getItem('passwordHistory')) || [];
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    bindEvents() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Analyzer events
        this.passwordInput.addEventListener('input', () => this.analyzePassword());
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());

        // Generator events
        this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        this.generatePasswordBtn.addEventListener('click', () => this.generateSinglePassword());
        this.generateMultipleBtn.addEventListener('click', () => this.generateMultiplePasswords());
        this.copyPasswordBtn.addEventListener('click', () => this.copyToClipboard(this.generatedPassword.value));

        // Strength test events
        this.passwordA.addEventListener('input', () => this.comparePasswords());
        this.passwordB.addEventListener('input', () => this.comparePasswords());

        // Security check events
        this.checkBreachBtn.addEventListener('click', () => this.checkBreachRisk());
        this.breachCheckInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkBreachRisk();
        });
        
        // 2FA events
        this.tfaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.calculate2FAStrength());
        });
        
        // Password history events
        this.addToHistoryBtn.addEventListener('click', () => this.addPasswordToHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearPasswordHistory());
        this.historyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPasswordToHistory();
        });
        
        // Pattern analysis events
        this.patternInput.addEventListener('input', () => this.analyzeAdvancedPatterns());
        
        // Theme toggle events
        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                this.generateSinglePassword();
            } else if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.addPasswordToHistory();
            } else if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.checkBreachRisk();
            }
        });
        
        // Initialize UI
        this.updatePasswordHistoryUI();
        this.calculate2FAStrength();
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab contents
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        // Focus relevant input
        if (tabName === 'analyzer') {
            setTimeout(() => this.passwordInput.focus(), 100);
        }
    }

    analyzePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.resetAnalysis();
            return;
        }

        const analysis = this.calculatePasswordStrength(password);
        this.updateAnalysisUI(analysis);
        this.provideFeedback(password, analysis);
    }

    calculatePasswordStrength(password) {
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password);
        const hasExtended = /[^\w\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password);

        // Character set size for entropy calculation
        let charsetSize = 0;
        if (hasLower) charsetSize += 26;
        if (hasUpper) charsetSize += 26;
        if (hasNumbers) charsetSize += 10;
        if (hasSpecial) charsetSize += 32;
        if (hasExtended) charsetSize += 50;

        // Calculate entropy
        const entropy = length * Math.log2(charsetSize || 1);

        // Check for common patterns
        const hasCommonPassword = this.commonPasswords.some(common => 
            password.toLowerCase().includes(common.toLowerCase())
        );
        const hasSequentialChars = this.hasSequentialCharacters(password);
        const hasRepeatingChars = this.hasRepeatingCharacters(password);
        const hasKeyboardPattern = this.hasKeyboardPattern(password);

        // Calculate base score
        let score = 0;
        score += Math.min(length * 4, 50); // Length score (max 50)
        score += hasLower ? 5 : 0;
        score += hasUpper ? 5 : 0;
        score += hasNumbers ? 5 : 0;
        score += hasSpecial ? 10 : 0;
        score += hasExtended ? 5 : 0;
        score += Math.min(entropy / 4, 20); // Entropy bonus (max 20)

        // Penalties
        if (hasCommonPassword) score -= 20;
        if (hasSequentialChars) score -= 10;
        if (hasRepeatingChars) score -= 5;
        if (hasKeyboardPattern) score -= 10;
        if (length < 8) score -= 20;

        score = Math.max(0, Math.min(100, score));

        // Calculate crack time
        const combinations = Math.pow(charsetSize, length);
        const crackTimeSeconds = combinations / (2 * 1e9); // Assuming 1 billion attempts per second
        
        return {
            score: Math.round(score),
            length,
            entropy: Math.round(entropy),
            crackTimeSeconds,
            hasLower,
            hasUpper,
            hasNumbers,
            hasSpecial,
            hasCommonPassword,
            hasSequentialChars,
            hasRepeatingChars,
            hasKeyboardPattern,
            strengthLevel: this.getStrengthLevel(score)
        };
    }

    getStrengthLevel(score) {
        if (score < 20) return { name: 'Very Weak', class: 'very-weak' };
        if (score < 40) return { name: 'Weak', class: 'weak' };
        if (score < 60) return { name: 'Fair', class: 'fair' };
        if (score < 80) return { name: 'Good', class: 'good' };
        return { name: 'Strong', class: 'strong' };
    }

    hasSequentialCharacters(password) {
        const sequences = ['abc', 'bcd', 'cde', 'def', '123', '234', '345', '456', '789'];
        return sequences.some(seq => password.toLowerCase().includes(seq));
    }

    hasRepeatingCharacters(password) {
        return /(.)\1{2,}/.test(password); // 3 or more same characters in a row
    }

    hasKeyboardPattern(password) {
        const patterns = ['qwe', 'asd', 'zxc', '123', 'qaz', 'wsx', 'edc'];
        return patterns.some(pattern => password.toLowerCase().includes(pattern));
    }

    formatCrackTime(seconds) {
        if (seconds < 1) return 'Instant';
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
        return 'Centuries';
    }

    updateAnalysisUI(analysis) {
        // Update strength meter
        const strengthPercent = analysis.score;
        this.strengthProgress.style.width = `${strengthPercent}%`;
        this.strengthProgress.className = `strength-progress strength-${analysis.strengthLevel.class}`;
        this.strengthText.textContent = `${analysis.strengthLevel.name} (${analysis.score}%)`;
        this.strengthText.className = `strength-text text-${analysis.strengthLevel.class}`;

        // Update metrics
        this.lengthValue.textContent = analysis.length;
        this.lengthBar.style.width = `${Math.min(analysis.length * 4, 100)}%`;
        this.lengthBar.className = `metric-progress strength-${analysis.strengthLevel.class}`;

        this.crackTime.textContent = this.formatCrackTime(analysis.crackTimeSeconds);
        const crackPercent = Math.min(Math.log10(analysis.crackTimeSeconds + 1) * 10, 100);
        this.crackBar.style.width = `${crackPercent}%`;
        this.crackBar.className = `metric-progress strength-${analysis.strengthLevel.class}`;

        this.entropyValue.textContent = `${analysis.entropy} bits`;
        this.entropyBar.style.width = `${Math.min(analysis.entropy * 2, 100)}%`;
        this.entropyBar.className = `metric-progress strength-${analysis.strengthLevel.class}`;

        this.scoreValue.textContent = `${analysis.score}/100`;
        this.scoreBar.style.width = `${analysis.score}%`;
        this.scoreBar.className = `metric-progress strength-${analysis.strengthLevel.class}`;
    }

    provideFeedback(password, analysis) {
        const feedback = [];

        // Positive feedback
        if (analysis.length >= 12) {
            feedback.push({ type: 'success', icon: 'fas fa-check', text: 'Great password length!' });
        }
        if (analysis.hasLower && analysis.hasUpper) {
            feedback.push({ type: 'success', icon: 'fas fa-check', text: 'Good mix of uppercase and lowercase' });
        }
        if (analysis.hasNumbers && analysis.hasSpecial) {
            feedback.push({ type: 'success', icon: 'fas fa-check', text: 'Includes numbers and special characters' });
        }

        // Warnings and suggestions
        if (analysis.length < 8) {
            feedback.push({ type: 'danger', icon: 'fas fa-exclamation-triangle', text: 'Password is too short - use at least 8 characters' });
        } else if (analysis.length < 12) {
            feedback.push({ type: 'warning', icon: 'fas fa-exclamation', text: 'Consider using 12+ characters for better security' });
        }

        if (!analysis.hasUpper) {
            feedback.push({ type: 'warning', icon: 'fas fa-arrow-up', text: 'Add uppercase letters (A-Z)' });
        }
        if (!analysis.hasLower) {
            feedback.push({ type: 'warning', icon: 'fas fa-arrow-down', text: 'Add lowercase letters (a-z)' });
        }
        if (!analysis.hasNumbers) {
            feedback.push({ type: 'warning', icon: 'fas fa-sort-numeric-up', text: 'Add numbers (0-9)' });
        }
        if (!analysis.hasSpecial) {
            feedback.push({ type: 'warning', icon: 'fas fa-at', text: 'Add special characters (!@#$%^&*)' });
        }

        if (analysis.hasCommonPassword) {
            feedback.push({ type: 'danger', icon: 'fas fa-ban', text: 'Avoid common passwords and dictionary words' });
        }
        if (analysis.hasSequentialChars) {
            feedback.push({ type: 'warning', icon: 'fas fa-list-ol', text: 'Avoid sequential characters (abc, 123)' });
        }
        if (analysis.hasRepeatingChars) {
            feedback.push({ type: 'warning', icon: 'fas fa-repeat', text: 'Avoid repeating characters (aaa, 111)' });
        }
        if (analysis.hasKeyboardPattern) {
            feedback.push({ type: 'warning', icon: 'fas fa-keyboard', text: 'Avoid keyboard patterns (qwe, asd)' });
        }

        this.updateFeedbackUI(feedback);
    }

    updateFeedbackUI(feedback) {
        if (feedback.length === 0) {
            this.feedbackList.innerHTML = '<p class="feedback-empty">Perfect! Your password looks secure.</p>';
            return;
        }

        this.feedbackList.innerHTML = feedback.map(item => 
            `<div class="feedback-item ${item.type}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </div>`
        ).join('');
    }

    resetAnalysis() {
        this.strengthProgress.style.width = '0%';
        this.strengthProgress.className = 'strength-progress';
        this.strengthText.textContent = 'Enter a password';
        this.strengthText.className = 'strength-text';

        [this.lengthBar, this.crackBar, this.entropyBar, this.scoreBar].forEach(bar => {
            bar.style.width = '0%';
            bar.className = 'metric-progress';
        });

        this.lengthValue.textContent = '0';
        this.crackTime.textContent = 'Instant';
        this.entropyValue.textContent = '0 bits';
        this.scoreValue.textContent = '0/100';

        this.feedbackList.innerHTML = '<p class="feedback-empty">Enter a password to get personalized security recommendations</p>';
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.togglePasswordBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    }

    updateLengthDisplay() {
        this.lengthDisplay.textContent = this.lengthSlider.value;
    }

    generateSinglePassword() {
        const options = this.getGeneratorOptions();
        const password = this.generatePassword(options);
        this.generatedPassword.value = password;
        this.multiplePasswords.innerHTML = '';
    }

    generateMultiplePasswords() {
        const options = this.getGeneratorOptions();
        const passwords = [];
        for (let i = 0; i < 5; i++) {
            passwords.push(this.generatePassword(options));
        }

        this.generatedPassword.value = passwords[0];
        this.multiplePasswords.innerHTML = passwords.map((password, index) => 
            `<div class="password-option" onclick="passwordHub.selectPassword('${password}')">
                <span class="password-text">${password}</span>
                <button class="copy-btn" onclick="passwordHub.copyToClipboard('${password}'); event.stopPropagation();">
                    <i class="fas fa-copy"></i>
                </button>
            </div>`
        ).join('');
    }

    selectPassword(password) {
        this.generatedPassword.value = password;
    }

    getGeneratorOptions() {
        return {
            length: parseInt(this.lengthSlider.value),
            includeUppercase: this.includeUppercase.checked,
            includeLowercase: this.includeLowercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            excludeSimilar: this.excludeSimilar.checked
        };
    }

    generatePassword(options) {
        let charset = '';
        
        if (options.includeLowercase) {
            charset += options.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        }
        if (options.includeUppercase) {
            charset += options.excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (options.includeNumbers) {
            charset += options.excludeSimilar ? '23456789' : '0123456789';
        }
        if (options.includeSymbols) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        if (!charset) {
            this.showNotification('Please select at least one character type', 'error');
            return '';
        }

        let password = '';
        const cryptoArray = new Uint32Array(options.length);
        window.crypto.getRandomValues(cryptoArray);

        for (let i = 0; i < options.length; i++) {
            password += charset[cryptoArray[i] % charset.length];
        }

        return password;
    }

    comparePasswords() {
        const passwordA = this.passwordA.value;
        const passwordB = this.passwordB.value;

        if (passwordA) {
            const analysisA = this.calculatePasswordStrength(passwordA);
            this.updateMiniStrength(this.strengthA, this.scoreA, analysisA);
        } else {
            this.resetMiniStrength(this.strengthA, this.scoreA);
        }

        if (passwordB) {
            const analysisB = this.calculatePasswordStrength(passwordB);
            this.updateMiniStrength(this.strengthB, this.scoreB, analysisB);
        } else {
            this.resetMiniStrength(this.strengthB, this.scoreB);
        }

        if (passwordA && passwordB) {
            this.showComparison(passwordA, passwordB);
        } else {
            this.comparisonResult.innerHTML = '';
        }
    }

    updateMiniStrength(barElement, scoreElement, analysis) {
        barElement.innerHTML = `<div style="width: ${analysis.score}%; background: linear-gradient(90deg, ${this.getStrengthColor(analysis.strengthLevel.class)})"></div>`;
        scoreElement.textContent = `${analysis.score}%`;
        scoreElement.className = `text-${analysis.strengthLevel.class}`;
    }

    resetMiniStrength(barElement, scoreElement) {
        barElement.innerHTML = '';
        scoreElement.textContent = '0%';
        scoreElement.className = '';
    }

    getStrengthColor(strengthClass) {
        const colors = {
            'very-weak': '#ef4444, #dc2626',
            'weak': '#f97316, #ea580c',
            'fair': '#eab308, #ca8a04',
            'good': '#22c55e, #16a34a',
            'strong': '#10b981, #059669'
        };
        return colors[strengthClass] || colors['very-weak'];
    }

    showComparison(passwordA, passwordB) {
        const analysisA = this.calculatePasswordStrength(passwordA);
        const analysisB = this.calculatePasswordStrength(passwordB);

        let winner, message;
        if (analysisA.score > analysisB.score) {
            winner = 'A';
            message = `Password A is stronger (${analysisA.score}% vs ${analysisB.score}%)`;
        } else if (analysisB.score > analysisA.score) {
            winner = 'B';
            message = `Password B is stronger (${analysisB.score}% vs ${analysisA.score}%)`;
        } else {
            winner = 'tie';
            message = `Both passwords have equal strength (${analysisA.score}%)`;
        }

        this.comparisonResult.innerHTML = `
            <h4><i class="fas fa-trophy"></i> Comparison Result</h4>
            <p>${message}</p>
            <div style="margin-top: 15px;">
                <strong>Password A:</strong> ${analysisA.strengthLevel.name} - ${this.formatCrackTime(analysisA.crackTimeSeconds)} to crack<br>
                <strong>Password B:</strong> ${analysisB.strengthLevel.name} - ${this.formatCrackTime(analysisB.crackTimeSeconds)} to crack
            </div>
        `;
    }

    copyToClipboard(text) {
        if (!text) {
            this.showNotification('No password to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Password copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Password copied to clipboard!');
        });
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

    // ===== NEW SECURITY FEATURES =====
    
    checkBreachRisk() {
        const password = this.breachCheckInput.value;
        if (!password) {
            this.showNotification('Please enter a password to check', 'error');
            return;
        }

        // Simulate breach check (in real implementation, this would use HaveIBeenPwned API or similar)
        const commonBreachedPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
            'princess', 'rockyou', '1234567', '12345678', '123123', 'daniel',
            'passw0rd', 'qwerty123', 'hello', 'charlie', 'aa123456'
        ];

        const isCommon = commonBreachedPasswords.includes(password.toLowerCase());
        const analysis = this.calculatePasswordStrength(password);
        
        // Calculate risk based on various factors
        let riskLevel = 'Low';
        let riskClass = 'low-risk';
        let riskScore = 0;
        
        if (isCommon) {
            riskLevel = 'Critical';
            riskClass = 'critical-risk';
            riskScore = 95;
        } else if (analysis.score < 40) {
            riskLevel = 'High';
            riskClass = 'high-risk';
            riskScore = 75;
        } else if (analysis.score < 70) {
            riskLevel = 'Medium';
            riskClass = 'medium-risk';
            riskScore = 45;
        } else {
            riskScore = Math.max(10, 100 - analysis.score);
        }

        this.breachResult.innerHTML = `
            <div class="risk-assessment ${riskClass}">
                <div class="risk-header">
                    <i class="fas fa-shield-alt"></i>
                    <h4>Breach Risk Assessment</h4>
                </div>
                <div class="risk-meter">
                    <div class="risk-bar">
                        <div class="risk-progress ${riskClass}" style="width: ${riskScore}%"></div>
                    </div>
                    <span class="risk-text">${riskLevel} Risk (${riskScore}%)</span>
                </div>
                <div class="risk-details">
                    ${isCommon ? 
                        '<p><i class="fas fa-exclamation-triangle"></i> <strong>Warning:</strong> This password appears in common breach databases!</p>' :
                        '<p><i class="fas fa-check-circle"></i> This password was not found in common breach databases.</p>'
                    }
                    <p><strong>Password Strength:</strong> ${analysis.strengthLevel.name} (${analysis.score}%)</p>
                    <p><strong>Estimated Crack Time:</strong> ${this.formatCrackTime(analysis.crackTimeSeconds)}</p>
                </div>
                <div class="risk-recommendations">
                    <h5>Security Recommendations:</h5>
                    <ul>
                        ${isCommon ? '<li>Change this password immediately - it\'s widely known</li>' : ''}
                        ${analysis.score < 70 ? '<li>Use a longer, more complex password</li>' : ''}
                        <li>Enable two-factor authentication</li>
                        <li>Use a unique password for each account</li>
                        <li>Consider using a password manager</li>
                    </ul>
                </div>
            </div>
        `;

        this.showNotification(`Breach risk analysis complete: ${riskLevel} risk`, riskLevel === 'Critical' ? 'error' : 'success');
    }

    calculate2FAStrength() {
        const tfaMethods = {
            'tfa-sms': { weight: 10, security: 'Low' },
            'tfa-email': { weight: 15, security: 'Low' },
            'tfa-app': { weight: 35, security: 'High' },
            'tfa-hardware': { weight: 50, security: 'Very High' },
            'tfa-biometric': { weight: 30, security: 'High' }
        };

        let totalScore = 0;
        let enabledMethods = [];
        
        this.tfaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const method = tfaMethods[checkbox.id];
                if (method) {
                    totalScore += method.weight;
                    enabledMethods.push({
                        id: checkbox.id,
                        name: checkbox.nextElementSibling.textContent,
                        security: method.security
                    });
                }
            }
        });

        // Cap at 100 and apply diminishing returns for multiple methods
        const finalScore = Math.min(100, totalScore * 0.9);
        
        this.tfaScore.textContent = Math.round(finalScore);
        this.tfaMeter.style.width = `${finalScore}%`;
        this.tfaMeter.className = `tfa-progress ${this.get2FAClass(finalScore)}`;

        let recommendations = [];
        if (finalScore < 30) {
            recommendations.push('Enable at least one 2FA method');
            recommendations.push('Consider using an authenticator app for better security');
        } else if (finalScore < 60) {
            recommendations.push('Add a hardware token for maximum security');
            recommendations.push('Avoid SMS-only 2FA if possible');
        } else {
            recommendations.push('Excellent 2FA setup!');
            recommendations.push('Consider backup authentication methods');
        }

        this.tfaRecommendations.innerHTML = `
            <h5>Enabled Methods:</h5>
            ${enabledMethods.length > 0 ? 
                enabledMethods.map(method => 
                    `<div class="enabled-method">
                        <i class="fas fa-check-circle"></i>
                        <span>${method.name}</span>
                        <span class="security-badge ${method.security.toLowerCase().replace(' ', '-')}">${method.security}</span>
                    </div>`
                ).join('') : 
                '<p class="no-methods">No 2FA methods enabled</p>'
            }
            <h5>Recommendations:</h5>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;
    }

    get2FAClass(score) {
        if (score < 30) return 'very-low';
        if (score < 50) return 'low';
        if (score < 70) return 'medium';
        if (score < 90) return 'high';
        return 'very-high';
    }

    addPasswordToHistory() {
        const password = this.historyInput.value;
        if (!password) {
            this.showNotification('Please enter a password to add to history', 'error');
            return;
        }

        const analysis = this.calculatePasswordStrength(password);
        const historyEntry = {
            id: Date.now(),
            password: password,
            score: analysis.score,
            strength: analysis.strengthLevel.name,
            timestamp: new Date().toLocaleDateString(),
            entropy: analysis.entropy,
            crackTime: this.formatCrackTime(analysis.crackTimeSeconds)
        };

        this.passwordHistoryData.unshift(historyEntry);
        if (this.passwordHistoryData.length > 50) {
            this.passwordHistoryData = this.passwordHistoryData.slice(0, 50);
        }

        this.savePasswordHistory();
        this.updatePasswordHistoryUI();
        this.historyInput.value = '';
        this.showNotification('Password added to history!');
    }

    clearPasswordHistory() {
        if (this.passwordHistoryData.length === 0) {
            this.showNotification('No password history to clear', 'error');
            return;
        }

        if (confirm('Are you sure you want to clear all password history?')) {
            this.passwordHistoryData = [];
            this.savePasswordHistory();
            this.updatePasswordHistoryUI();
            this.showNotification('Password history cleared!');
        }
    }

    updatePasswordHistoryUI() {
        const count = this.passwordHistoryData.length;
        this.historyCount.textContent = count;

        if (count === 0) {
            this.passwordHistory.innerHTML = '<p class="no-history">No password history yet. Add passwords to track your security progress!</p>';
            this.averageStrength.textContent = '0';
            this.securityTrend.textContent = '➡️';
            return;
        }

        // Calculate average strength
        const avgStrength = this.passwordHistoryData.reduce((sum, entry) => sum + entry.score, 0) / count;
        this.averageStrength.textContent = Math.round(avgStrength);

        // Calculate security trend
        if (count >= 3) {
            const recent = this.passwordHistoryData.slice(0, 3);
            const older = this.passwordHistoryData.slice(-3);
            const recentAvg = recent.reduce((sum, entry) => sum + entry.score, 0) / recent.length;
            const olderAvg = older.reduce((sum, entry) => sum + entry.score, 0) / older.length;
            
            if (recentAvg > olderAvg + 5) {
                this.securityTrend.textContent = '📈';
            } else if (recentAvg < olderAvg - 5) {
                this.securityTrend.textContent = '📉';
            } else {
                this.securityTrend.textContent = '➡️';
            }
        } else {
            this.securityTrend.textContent = '➡️';
        }

        // Display history
        this.passwordHistory.innerHTML = this.passwordHistoryData.map(entry => `
            <div class="history-entry">
                <div class="history-password">
                    <span class="password-display">${'*'.repeat(entry.password.length)}</span>
                    <button class="show-password" onclick="this.textContent = this.textContent === 'Show' ? 'Hide' : 'Show'; this.previousElementSibling.textContent = this.textContent === 'Hide' ? '${entry.password}' : '${'*'.repeat(entry.password.length)}'">Show</button>
                </div>
                <div class="history-stats">
                    <span class="strength-badge strength-${entry.strength.toLowerCase().replace(' ', '-')}">${entry.strength}</span>
                    <span class="score">${entry.score}%</span>
                    <span class="date">${entry.timestamp}</span>
                </div>
                <button class="remove-entry" onclick="passwordHub.removeHistoryEntry(${entry.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeHistoryEntry(id) {
        this.passwordHistoryData = this.passwordHistoryData.filter(entry => entry.id !== id);
        this.savePasswordHistory();
        this.updatePasswordHistoryUI();
        this.showNotification('Entry removed from history!');
    }

    savePasswordHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.passwordHistoryData));
    }

    analyzeAdvancedPatterns() {
        const password = this.patternInput.value;
        if (!password) {
            this.patternResults.innerHTML = '';
            return;
        }

        const patterns = this.detectAdvancedPatterns(password);
        const analysis = this.calculatePasswordStrength(password);

        this.patternResults.innerHTML = `
            <div class="pattern-analysis-results">
                <h5><i class="fas fa-brain"></i> Advanced Pattern Analysis</h5>
                <div class="pattern-grid">
                    ${patterns.map(pattern => `
                        <div class="pattern-item ${pattern.severity}">
                            <i class="${pattern.icon}"></i>
                            <div class="pattern-info">
                                <strong>${pattern.name}</strong>
                                <p>${pattern.description}</p>
                                ${pattern.found ? '<span class="found">Detected</span>' : '<span class="not-found">Not detected</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="pattern-summary">
                    <h6>Security Summary:</h6>
                    <p><strong>Overall Score:</strong> ${analysis.score}% (${analysis.strengthLevel.name})</p>
                    <p><strong>Entropy:</strong> ${analysis.entropy} bits</p>
                    <p><strong>Estimated Crack Time:</strong> ${this.formatCrackTime(analysis.crackTimeSeconds)}</p>
                </div>
            </div>
        `;
    }

    detectAdvancedPatterns(password) {
        return [
            {
                name: 'Dictionary Words',
                description: 'Contains common English words',
                icon: 'fas fa-book',
                severity: this.containsDictionaryWords(password) ? 'high' : 'safe',
                found: this.containsDictionaryWords(password)
            },
            {
                name: 'Personal Information',
                description: 'May contain dates, names, or personal data',
                icon: 'fas fa-user',
                severity: this.containsPersonalInfo(password) ? 'high' : 'safe',
                found: this.containsPersonalInfo(password)
            },
            {
                name: 'Keyboard Walks',
                description: 'Sequential keys on keyboard (qwerty, asdf)',
                icon: 'fas fa-keyboard',
                severity: this.hasKeyboardPattern(password) ? 'medium' : 'safe',
                found: this.hasKeyboardPattern(password)
            },
            {
                name: 'Number Patterns',
                description: 'Sequential or repeated numbers',
                icon: 'fas fa-sort-numeric-up',
                severity: this.hasNumberPattern(password) ? 'medium' : 'safe',
                found: this.hasNumberPattern(password)
            },
            {
                name: 'Repeated Characters',
                description: 'Same character repeated multiple times',
                icon: 'fas fa-repeat',
                severity: this.hasRepeatingCharacters(password) ? 'medium' : 'safe',
                found: this.hasRepeatingCharacters(password)
            },
            {
                name: 'L33t Speak',
                description: 'Simple character substitutions (a->@, e->3)',
                icon: 'fas fa-exchange-alt',
                severity: this.hasLeetSpeak(password) ? 'low' : 'safe',
                found: this.hasLeetSpeak(password)
            }
        ];
    }

    containsDictionaryWords(password) {
        const commonWords = [
            'password', 'admin', 'user', 'login', 'welcome', 'hello',
            'world', 'love', 'life', 'time', 'work', 'home', 'family'
        ];
        return commonWords.some(word => password.toLowerCase().includes(word));
    }

    containsPersonalInfo(password) {
        // Check for potential dates, common names, etc.
        const datePattern = /(19|20)\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/;
        const namePattern = /(john|jane|mike|mary|david|sarah|chris|lisa)/i;
        return datePattern.test(password) || namePattern.test(password);
    }

    hasNumberPattern(password) {
        const patterns = [
            /123/, /234/, /345/, /456/, /567/, /678/, /789/,
            /987/, /876/, /765/, /654/, /543/, /432/, /321/,
            /111/, /222/, /333/, /444/, /555/, /666/, /777/, /888/, /999/
        ];
        return patterns.some(pattern => pattern.test(password));
    }

    hasLeetSpeak(password) {
        const leetPatterns = [
            /@.*[a4]/, /3.*[e]/, /1.*[il]/, /0.*[o]/, /5.*[s]/, /7.*[t]/
        ];
        return leetPatterns.some(pattern => pattern.test(password.toLowerCase()));
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        localStorage.setItem('darkMode', this.isDarkMode.toString());
        
        const icon = this.isDarkMode ? 'fa-sun' : 'fa-moon';
        if (this.darkModeToggle) {
            this.darkModeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
        }
        if (this.themeToggle) {
            this.themeToggle.innerHTML = `<i class="fas ${icon}"></i> Toggle Theme`;
        }
        
        this.showNotification(`${this.isDarkMode ? 'Dark' : 'Light'} mode enabled!`);
    }
}

// Initialize the Password Security Hub
const passwordHub = new PasswordSecurityHub();

// Make it globally accessible for inline event handlers
window.passwordHub = passwordHub;

// Add some keyboard shortcuts help
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Password Security Hub Loaded');
    console.log('Keyboard Shortcuts:');
    console.log('  Ctrl+G: Generate new password');
    console.log('  Tab: Navigate between fields');
    console.log('  Privacy: All analysis happens locally - your passwords never leave this device!');
});