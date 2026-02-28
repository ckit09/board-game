class CottonPicker {
    constructor() {
        this.score = 0;
        this.misses = 0;
        this.timeLeft = 0;
        this.gameActive = false;
        this.targetButton = null;
        this.difficulty = 'normal';
        this.timerInterval = null;
        this.buttonCount = 12;

        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.difficultySelect = document.getElementById('difficultyLevel');
        this.startBtn = document.getElementById('startGameBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.scoreDisplay = document.getElementById('score');
        this.missesDisplay = document.getElementById('misses');
        this.timerDisplay = document.getElementById('timer');
        this.gameStatus = document.getElementById('gameStatus');
        this.gameArea = document.getElementById('gameArea');
        this.gameResult = document.getElementById('gameResult');
        this.finalScore = document.getElementById('finalScore');
        this.finalMisses = document.getElementById('finalMisses');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.startGame());
    }

    getDifficultySettings() {
        const settings = {
            easy: { timeLimit: 8, buttonCount: 12 },
            normal: { timeLimit: 5, buttonCount: 16 },
            hard: { timeLimit: 3, buttonCount: 20 }
        };
        return settings[this.difficulty];
    }

    startGame() {
        this.difficulty = this.difficultySelect.value;
        const settings = this.getDifficultySettings();

        this.score = 0;
        this.misses = 0;
        this.timeLeft = settings.timeLimit;
        this.buttonCount = settings.buttonCount;
        this.gameActive = true;

        this.startBtn.style.display = 'none';
        this.resetBtn.style.display = 'block';
        this.gameResult.style.display = 'none';
        this.difficultySelect.disabled = true;

        this.updateDisplay();
        this.createButtons();
        this.selectRandomTarget();
        this.startTimer();
    }

    createButtons() {
        this.gameArea.innerHTML = '';
        for (let i = 0; i < this.buttonCount; i++) {
            const button = document.createElement('button');
            button.className = 'cotton-button';
            button.textContent = '🌾';
            button.addEventListener('click', (e) => this.handleButtonClick(e, button));
            this.gameArea.appendChild(button);
        }
    }

    selectRandomTarget() {
        if (!this.gameActive) return;

        const buttons = document.querySelectorAll('.cotton-button');
        buttons.forEach(btn => btn.classList.remove('target'));

        const randomIndex = Math.floor(Math.random() * buttons.length);
        this.targetButton = buttons[randomIndex];
        this.targetButton.classList.add('target');
        this.gameStatus.textContent = 'Click the green cotton!';
    }

    handleButtonClick(e, button) {
        if (!this.gameActive) return;

        e.preventDefault();

        if (button === this.targetButton) {
            this.score++;
            button.classList.add('target');
            setTimeout(() => {
                this.selectRandomTarget();
            }, 100);
        } else {
            this.misses++;
            button.classList.add('wrong');
            setTimeout(() => {
                button.classList.remove('wrong');
            }, 300);
        }

        this.updateDisplay();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft + 's';

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.missesDisplay.textContent = this.misses;
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        this.startBtn.style.display = 'block';
        this.resetBtn.style.display = 'none';
        this.difficultySelect.disabled = false;

        this.finalScore.textContent = this.score;
        this.finalMisses.textContent = this.misses;
        this.gameResult.style.display = 'block';
        this.gameStatus.textContent = 'Game Over!';
    }

    resetGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        this.score = 0;
        this.misses = 0;
        this.timeLeft = 0;
        this.targetButton = null;

        this.gameArea.innerHTML = '';
        this.gameStatus.textContent = 'Click "Start Game" to begin';
        this.gameResult.style.display = 'none';
        this.startBtn.style.display = 'block';
        this.resetBtn.style.display = 'none';
        this.difficultySelect.disabled = false;

        this.updateDisplay();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new CottonPicker();
});
