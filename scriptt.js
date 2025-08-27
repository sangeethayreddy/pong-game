const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 4;
  for (let i = 20; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i);
    ctx.lineTo(canvas.width / 2, i + 20);
    ctx.stroke();
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, '#111');

  // Net
  drawNet();

  // Paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');

  // Ball
  drawCircle(ballX, ballY, BALL_RADIUS, '#fff');
}

function update() {
  // Ball movement
  ballX += ballVX;
  ballY += ballVY;

  // Top and bottom collision
  if (ballY - BALL_RADIUS < 0) {
    ballY = BALL_RADIUS;
    ballVY *= -1;
  }
  if (ballY + BALL_RADIUS > canvas.height) {
    ballY = canvas.height - BALL_RADIUS;
    ballVY *= -1;
  }

  // Left paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ballVX *= -1.05;
    // Add some spin based on where ball hits paddle
    let hitPoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballVY = BALL_SPEED * hitPoint;
  }

  // Right paddle collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_RADIUS;
    ballVX *= -1.05;
    let hitPoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballVY = BALL_SPEED * hitPoint;
  }

  // Score/reset if the ball passes the paddles
  if (ballX - BALL_RADIUS < 0 || ballX + BALL_RADIUS > canvas.width) {
    resetBall();
  }

  // AI paddle movement
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 20) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + 20) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp player paddle
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

resetBall();
gameLoop();