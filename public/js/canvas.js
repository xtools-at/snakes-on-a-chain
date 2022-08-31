// setup canvas
function getCanvasSize() {
  const sizes = [320, 336, 352, 368, 384, 400, 416, 432, 448, 464, 480, 496, 512, 640, 768]
  const windowSize = Math.min(window.innerWidth, window.innerHeight)
  let size

  for (let i = 0; i < sizes.length; i++) {
    if (windowSize >= sizes[i]) {
      size = sizes[i]
    } else {
      break
    }
  }

  return size || sizes[0]
}

function setCanvasSize() {
  const canvasEl = document.getElementById('canvas')
  if (canvasEl) {
    const size = getCanvasSize()

    canvasEl.width = size
    canvasEl.height = size
  }
}

window.addEventListener('resize', setCanvasSize)

setCanvasSize()
