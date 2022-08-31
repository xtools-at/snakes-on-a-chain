// forked from https://github.com/lucasrmagalhaes/snake-js (MIT)
/* eslint-disable prefer-template, consistent-return, prefer-arrow-callback */
/* eslint-disable func-names, no-multiple-empty-lines */


/** get input params */

const settings = window && window.inputParams ? window.inputParams : {
  foodColor: 'red',
  backgroundColor: 'black',
  snakeColor: 'green',
}
settings.speed = settings.speed != null ? 100 - settings.speed : 100


/** setup */

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const fields = 16
const space = 30
const directions = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down',
}
let box
let boxSize
let game
let firstGame = true
let gameOver = false
let direction = directions.RIGHT
let swipeInitialX
let swipeInitialY
let highScore = 0
let newHighScore = false
let snake = []
const food = {
  x: -1,
  y: -1,
}


/** canvas draw methods */

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
  context.font = '12px PressStart2P'
  context.fillStyle = settings.foodColor
  context.fillText('Click anywhere to start', space, space + 10)
  drawSnake()
}

function drawGame() {
  drawBackground()
  drawSnake()
  drawFood()
}


/** game helpers */

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

function initSnake() {
  snake = [{
    x: (fields / 4) * box,
    y: (fields / 2) * box,
  }]
}

function isSnakeOffScreen() {
  return (snake[0].x > (fields - 1) * box
    || snake[0].x < 0
    || snake[0].y > (fields - 1) * box
    || snake[0].y < 0)
}

function checkGameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      clearInterval(game)
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

  if (direction === directions.RIGHT) snakeX += box
  else if (direction === directions.LEFT) snakeX -= box
  else if (direction === directions.UP) snakeY -= box
  else if (direction === directions.DOWN) snakeY += box

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


/** main game methods */

function setupCanvas(e) {
  // set boundaries for game (16x16)
  box = canvas.width / fields
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
    drawGame()
  }
}

function loopGame() {
  if (checkGameOver()) return

  if (isSnakeOffScreen()) {
    if (direction === directions.RIGHT) snake[0].x = 0
    else if (direction === directions.LEFT) snake[0].x = fields * box
    else if (direction === directions.UP) snake[0].y = fields * box
    else if (direction === directions.DOWN) snake[0].y = 0
  }

  drawGame()
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
    setupCanvas()
    direction = directions.RIGHT
    startGame(settings.speed)
  }
}

function changeDirection(newDir) {
  if (!newDir) return
  if ((newDir === directions.RIGHT && direction !== directions.LEFT)
    || (newDir === directions.LEFT && direction !== directions.RIGHT)
    || (newDir === directions.UP && direction !== directions.DOWN)
    || (newDir === directions.DOWN && direction !== directions.UP)) {
    direction = newDir

    if (!gameOver) {
      loopGame()
    }
  }
}


/** input handlers */

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
      changeDirection(directions.LEFT)
    } else {
      changeDirection(directions.RIGHT)
    }
  } else if (diffY > 0) {
    changeDirection(directions.UP)
  } else {
    changeDirection(directions.DOWN)
  }

  swipeInitialX = null
  swipeInitialY = null
}

function moveKeyboard(e) {
  e.preventDefault()
  if (isSnakeOffScreen()) return
  if ([37, 65].indexOf(e.keyCode) > -1) changeDirection(directions.LEFT)
  else if ([38, 87].indexOf(e.keyCode) > -1) changeDirection(directions.UP)
  else if ([39, 68].indexOf(e.keyCode) > -1) changeDirection(directions.RIGHT)
  else if ([40, 83].indexOf(e.keyCode) > -1) changeDirection(directions.DOWN)
  else if (gameOver && [27, 32, 13, 8].indexOf(e.keyCode) > -1) {
    // restart game with keyboard (esc, space, enter, backspace)
    initGame()
  }
}


/** event listeners */
canvas.addEventListener('click', initGame)
document.addEventListener('keydown', moveKeyboard)
document.addEventListener('touchstart', startTouch)
document.addEventListener('touchmove', moveTouch)
window.addEventListener('resize', setupCanvas)


/** control flow */

// game startup
initSnake()
setupCanvas()

// static image generation mode: start game and make snake longer
if (window.location.search.indexOf('imageMode') > -1) {
  initGame()
  for (let i = 0; i < 5; i++) {
    snake.push({
      x: snake[i].x - 1,
      y: snake[i].y - 1,
    })
  }
}
