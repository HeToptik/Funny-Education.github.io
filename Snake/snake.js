const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

const CELL_SIZE = 35; //длина стороны клетки
const GRID_WIDTH = canvas.width / CELL_SIZE; //клеток в высоту
const GRID_HEIGHT = canvas.height / CELL_SIZE; //клеток в ширину

let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let gameInterval = null;
let isGameRunning = false;

function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreEl.textContent = score;
    spawnFood();
}

function spawnFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * GRID_WIDTH);
        food.y = Math.floor(Math.random() * GRID_HEIGHT);
        
        validPosition = !snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );
    }
}

function draw() {
    // Очистка canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка сетки
    ctx.strokeStyle = '#2d2d44';
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // Отрисовка еды
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Отрисовка змейки
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#9f95ff' : '#6b5bf7';
        ctx.fillRect(
            segment.x * CELL_SIZE + 1,
            segment.y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        );
        
        // Глаза змейки
        if (index === 0) {
            ctx.fillStyle = '#fff';
            const eyeSize = 4;
            const eyeOffset = 4;
            
            if (direction.x === 1) {
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction.x === -1) {
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction.y === -1) {
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
            } else {
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
            }
        }
    });
}

function update() {
    direction = nextDirection;
    
    const head = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };
    
    // Проверка на столкновение со стенами
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver();
        return;
    }
    
    // Проверка на столкновение с собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Проверка на поедание еды
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreEl.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
    
    draw();
}

function gameOver() {
    GameEnded = true;
    isGameRunning = false;
    clearInterval(gameInterval);
    startBtn.textContent = 'Игра окончена';
    startBtn.disabled = true;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '20px Poppins, sans-serif';
    ctx.fillText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

function startGame() {
    GameEnded = false
    if (isGameRunning) return;
    isGameRunning = true;
    startBtn.textContent = 'Пауза';
    startBtn.disabled = false;
    
    gameInterval = setInterval(update, 100);
}

function pauseGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    startBtn.textContent = 'Продолжить';
}

function resetGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startBtn.textContent = 'Старт';
    startBtn.disabled = false;
    initGame();
    draw();
}

// Управление
document.addEventListener('keydown', (e) => {
    // Пауза по пробелу
    if (e.code === 'Space') {
        e.preventDefault();
        if (isGameRunning) {
            pauseGame();
        } else if (!startBtn.disabled) {
            startGame();
        }
        if (GameEnded) {
            resetGame();}
        return;
    }
    
    if (!isGameRunning) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
});

startBtn.addEventListener('click', () => {
    if (isGameRunning) {
        pauseGame();
    } else {
        startGame();
    }
});

resetBtn.addEventListener('click', resetGame);

// Инициализация
initGame();
draw();
