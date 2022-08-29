// forked from https://github.com/lucasrmagalhaes/snake-js
/* eslint-disable prefer-template, consistent-return, prefer-arrow-callback, func-names */

/** setup */
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const sizes = [256, 384, 496, 512, 640, 768]
const fields = 16
const space = 30
let canvasSize
let box
let boxSize
let game
let firstGame = true
let gameOver = false
let direction = 'right'
let swipeInitialX
let swipeInitialY
let highScore = 0
let newHighScore = false
let snake = []
const food = {
  x: -1,
  y: -1,
}

// eslint-disable-next-line no-undef
const settings = typeof params !== 'undefined' && params ? params : {
  foodColor: 'red',
  backgroundColor: 'black',
  snakeColor: 'green',
}
settings.speed = settings.speed != null ? 100 - settings.speed : 100

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

function initSnake() {
  snake = [{
    x: (fields / 4) * box,
    y: (fields / 2) * box,
  }]
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
  drawBackground()
  drawSnake()
  context.fillStyle = settings.foodColor

  context.font = '20px PressStart2P'
  context.fillText('GAME OVER', space, space + 16)

  context.font = '16px PressStart2P'
  let scoreSpace = space + 16 + space / 2 + 12 + space / 2 + 12
  if (newHighScore) {
    context.fillText('NEW HIGH SCORE: ' + snake.length, space, space + 16 + space / 2 + 12)
    newHighScore = false
  } else {
    scoreSpace += space / 2 + 12
    context.fillText('Score: ' + snake.length, space, space + 16 + space / 2 + 12)
    context.fillText('High Score: ' + highScore, space, space + 16 + space / 2 + 12 + space / 2 + 12)
  }

  context.font = '10px PressStart2P'
  context.fillText('Click anywhere to restart', space, scoreSpace)
}

function drawStartGame() {
  drawBackground()
  context.font = '16px PressStart2P'
  context.fillStyle = settings.foodColor
  context.fillText('Click anywhere to start', space, space + 12)
  drawSnake()
}

function draw() {
  drawBackground()
  drawSnake()
  drawFood()
}

function placeFood() {
  function getRandomCoords() {
    return Math.floor(Math.random() * (fields - 1) + 1) * box
  }
  food.x = getRandomCoords()
  food.y = getRandomCoords()

  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      return placeFood()
    }
  }
}

function isSnakeOffScreen() {
  return (snake[0].x > (fields - 1) * box
    || snake[0].x < 0
    || snake[0].y > (fields - 1) * box
    || snake[0].y < 0)
}

function setCanvasSize(e) {
  canvasSize = getCanvasSize(canvas)
  canvas.width = canvasSize
  canvas.height = canvasSize
  box = canvasSize / fields
  boxSize = box - fields / 8

  if (e && !gameOver) placeFood()

  if (firstGame) {
    drawBackground()
    // preload font
    context.font = '1px PressStart2P'
    context.fillStyle = settings.backgroundColor
    context.fillText('.', 0, 0)
    // wait for font to load
    setTimeout(function () {
      initSnake()
      drawStartGame()
    }, 500)
  } else if (gameOver) {
    drawGameOver()
  } else {
    draw()
  }
}

// game methods
function checkGameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      clearInterval(game);
      gameOver = true
      if (snake.length > highScore) {
        highScore = snake.length
        newHighScore = true
      }
      drawGameOver()

      return true
    }
  }

  return false
}

function moveSnake() {
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

  // add new head
  snake.unshift({
    x: snakeX,
    y: snakeY,
  })
}

function loopGame() {
  if (checkGameOver()) return

  if (isSnakeOffScreen()) {
    if (direction === 'right') snake[0].x = 0
    else if (direction === 'left') snake[0].x = fields * box
    else if (direction === 'down') snake[0].y = 0
    else if (direction === 'up') snake[0].y = fields * box
  }

  draw()
  moveSnake()
}

function startGame(speed) {
  if (game) {
    clearInterval(game)
    game = null
  }
  game = setInterval(loopGame, speed)
}

function initGame() {
  if (firstGame || gameOver) {
    if (firstGame) {
      firstGame = false
    } else if (gameOver) {
      gameOver = false
    }
    initSnake()
    placeFood()
    setCanvasSize()
    direction = 'right'
    startGame(settings.speed)
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
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY

  const diffX = swipeInitialX - currentX
  const diffY = swipeInitialY - currentY

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
  if (!gameOver) loopGame()
}

function moveKeyboard(e) {
  e.preventDefault()
  if (isSnakeOffScreen()) return
  if ((e.keyCode === 37 || e.keyCode === 65) && direction !== 'right') direction = 'left'
  else if ((e.keyCode === 38 || e.keyCode === 87) && direction !== 'down') direction = 'up'
  else if ((e.keyCode === 39 || e.keyCode === 68) && direction !== 'left') direction = 'right'
  else if ((e.keyCode === 40 || e.keyCode === 83) && direction !== 'up') direction = 'down'
  else if (gameOver && [27, 32, 13, 8].indexOf(e.keyCode) > -1) {
    // restart game with keyboard (esc, space, enter, backspace)
    initGame()
  }
  if (!gameOver) {
    loopGame()
  }
}

// Control flow
initSnake()
setCanvasSize()

// event listeners
document.addEventListener('keydown', moveKeyboard)
document.addEventListener('touchstart', startTouch)
document.addEventListener('touchmove', moveTouch)
canvas.addEventListener('click', initGame)
window.addEventListener('resize', setCanvasSize)

// start game and make snake longer from the beginning for static image generation
if (window.location.search.indexOf('imageMode') > -1) {
  initGame()
  for (let i = 0; i < 5; i++) {
    snake.push({
      x: snake[i].x - 1,
      y: snake[i].y - 1,
    })
  }
}
