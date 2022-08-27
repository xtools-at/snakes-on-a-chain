// forked from https://github.com/lucasrmagalhaes/snake-js

/** setup */
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const sizes = [256, 384, 496, 512, 640, 768]
const fields = 16
let canvasSize
let box
let boxSize
let game
let firstGame = true
let gameOver = false
let direction = 'right'
let swipeInitialX
let swipeInitialY
let snake = []
const food = {
  x: 1,
  y: 1,
}

// eslint-disable-next-line no-undef
const settings = typeof params !== 'undefined' && params ? params : {
  speed: 100,
  foodColor: 'red',
  backgroundColor: 'black',
  snakeColor: 'green',
}

function getCanvasSize() {
  const windowSize = Math.min(window.innerWidth, window.innerHeight)
  let size;

  for (let i = 0; i < sizes.length; i++) {
    if (windowSize >= sizes[i]) {
      size = sizes[i]
    } else {
      break
    }
  }

  return size || sizes[0];
}

// draw methods
function drawBackground() {
  context.fillStyle = settings.backgroundColor
  context.fillRect(0, 0, fields * box, fields * box)
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = settings.snakeColor
    context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize)
  }
}

function drawFood() {
  context.fillStyle = settings.foodColor
  context.fillRect(food.x, food.y, boxSize, boxSize)
}

function drawGameOver() {
  const space = 30

  context.font = '20px PressStart2P'
  context.fillStyle = 'black'
  context.fillText('GAME OVER', space, space + 16)

  context.font = '16px PressStart2P'
  context.fillStyle = 'black'
  // eslint-disable-next-line prefer-template
  context.fillText('Score: ' + snake.length, space, space + 16 + space / 2 + 12)

  context.font = '10px PressStart2P'
  context.fillStyle = 'black'
  context.fillText('Click anywhere to restart', space, space + 16 + space / 2 + 12 + space / 2 + 7)
}

function drawStartGame() {
  const space = 30
  context.font = '10px PressStart2P'
  context.fillStyle = 'black'
  context.fillText('Click anywhere to Start', space, space + 16 + space / 2 + 12 + space / 2 + 7)
}

function draw() {
  drawBackground()
  drawSnake()
  drawFood()
}

function placeFood() {
  food.x = Math.floor(Math.random() * (fields - 1) + 1) * box
  food.y = Math.floor(Math.random() * (fields - 1) + 1) * box
}

function isSnakeOffScreen() {
  return (snake[0].x > (fields - 1) * box
    || snake[0].x < 0
    || snake[0].y > (fields - 1) * box
    || snake[0].y < 0)
}

function setCanvasSize() {
  canvasSize = getCanvasSize(canvas)
  canvas.width = canvasSize
  canvas.height = canvasSize
  box = canvasSize / fields
  boxSize = box - fields / 8
  if (firstGame) {
    drawBackground()
    drawStartGame()
  } else {
    if (!gameOver) placeFood()
    draw()
    if (gameOver) drawGameOver()
  }
}

setCanvasSize()

snake.push({
  x: (fields / 2) * box,
  y: (fields / 2) * box,
})

if (window.location.search.indexOf('imageMode') > -1) {
  for (let i = 0; i < 5; i++) {
    snake.push({
      x: snake[i].x - 1,
      y: snake[i].y - 1,
    })
  }
}

// touch handlers
function startTouch(e) {
  swipeInitialX = e.touches[0].clientX
  swipeInitialY = e.touches[0].clientY
}

function moveTouch(e) {
  e.preventDefault()
  if (isSnakeOffScreen()) return
  if (swipeInitialX === null) return
  if (swipeInitialY === null) return

  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  const diffX = swipeInitialX - currentX;
  const diffY = swipeInitialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      direction = 'left'
    } else {
      direction = 'right'
    }
  } else if (diffY > 0) {
    direction = 'up'
  } else {
    direction = 'down'
  }

  swipeInitialX = null
  swipeInitialY = null
}

function moveKeyboard(event) {
  event.preventDefault();
  if (isSnakeOffScreen()) return;
  if ((event.keyCode === 37 || event.keyCode === 65) && direction !== 'right') direction = 'left'
  else if ((event.keyCode === 38 || event.keyCode === 87) && direction !== 'down') direction = 'up'
  else if ((event.keyCode === 39 || event.keyCode === 68) && direction !== 'left') direction = 'right'
  else if ((event.keyCode === 40 || event.keyCode === 83) && direction !== 'up') direction = 'down'
}

function checkGameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      clearInterval(game);
      gameOver = true

      drawGameOver();

      return true
    }
  }

  return false
}

function loopGame() {
  if (checkGameOver()) return

  if (isSnakeOffScreen()) {
    if (direction === 'right') snake[0].x = 0
    else if (direction === 'left') snake[0].x = fields * box
    else if (direction === 'down') snake[0].y = 0
    else if (direction === 'up') snake[0].y = fields * box
  }

  draw();

  let snakeX = snake[0].x
  let snakeY = snake[0].y

  if (direction === 'right') snakeX += box
  else if (direction === 'left') snakeX -= box
  else if (direction === 'up') snakeY -= box
  else if (direction === 'down') snakeY += box

  if (snakeX !== food.x || snakeY !== food.y) {
    snake.pop()
  } else {
    placeFood()
  }

  const newHead = {
    x: snakeX,
    y: snakeY,
  }
  snake.unshift(newHead)
}

function startGame(speed) {
  if (game) {
    clearInterval(game)
  } else {
    // preload font
    context.font = '1px PressStart2P'
    context.fillStyle = settings.backgroundColor
    context.fillText('.', 0, 0)
  }
  placeFood()
  game = setInterval(loopGame, speed)
}

function gameInit() {
  if (firstGame) {
    firstGame = false
    setCanvasSize()
    startGame(settings.speed)
  }
  if (gameOver) {
    gameOver = false
    snake = []
    snake.push({
      x: (fields / 2) * box,
      y: (fields / 2) * box,
    })
    setCanvasSize()
    startGame(settings.speed)
  }
}

// event listeners
document.addEventListener('keydown', moveKeyboard)
document.addEventListener('touchstart', startTouch)
document.addEventListener('touchmove', moveTouch)
document.addEventListener('click', gameInit)
window.addEventListener('resize', setCanvasSize)
