const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1500
canvas.height = 500

const pauseBtn = document.createElement('button')
pauseBtn.id = 'pauseBtn'
pauseBtn.className = 'game-btn'
pauseBtn.innerHTML = 'II'
pauseBtn.style.position = 'absolute'
pauseBtn.style.top = '20px'
pauseBtn.style.left = '50%'
pauseBtn.style.transform = 'translateX(-50%)'
pauseBtn.style.padding = '8px 16px'
pauseBtn.style.fontSize = '18px'
pauseBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
pauseBtn.style.color = '#333'
pauseBtn.style.border = '2px solid rgba(0, 0, 0, 0.1)'
pauseBtn.style.borderRadius = '12px'
pauseBtn.style.cursor = 'pointer'
pauseBtn.style.zIndex = '1000'
pauseBtn.style.fontWeight = '600'
pauseBtn.style.transition = 'all 0.3s ease'
pauseBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
pauseBtn.style.backdropFilter = 'blur(5px)'
pauseBtn.style.textShadow = 'none'
pauseBtn.style.minWidth = '50px'
pauseBtn.style.display = 'flex'
pauseBtn.style.alignItems = 'center'
pauseBtn.style.justifyContent = 'center'
document.body.appendChild(pauseBtn)

pauseBtn.addEventListener('mouseover', () => {
  pauseBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)'
  pauseBtn.style.transform = 'translateX(-50%) scale(1.05)'
  pauseBtn.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)'
})

pauseBtn.addEventListener('mouseout', () => {
  pauseBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
  pauseBtn.style.transform = 'translateX(-50%) scale(1)'
  pauseBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
})

pauseBtn.addEventListener('mousedown', () => {
  pauseBtn.style.transform = 'translateX(-50%) scale(0.95)'
})

pauseBtn.addEventListener('mouseup', () => {
  pauseBtn.style.transform = 'translateX(-50%) scale(1.05)'
})

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = 0.1

const player = new Player({
  position: {
    x: 100,
    y: 350,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: './img/warrior/Idle.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: './img/warrior/Run.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: './img/warrior/Jump.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: './img/warrior/Fall.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: './img/warrior/FallLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: './img/warrior/RunLeft.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: './img/warrior/IdleLeft.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: './img/warrior/JumpLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
  },
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const backgroundImageHeight = 432

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

window.addEventListener('resize', function () {
  if (document.fullscreenElement) {
    const aspectRatio = 1500 / 500
    if (window.innerWidth / window.innerHeight > aspectRatio) {
      canvas.style.width = window.innerHeight * aspectRatio + 'px'
      canvas.style.height = '100%'
    } else {
      canvas.style.width = '100%'
      canvas.style.height = window.innerWidth / aspectRatio + 'px'
    }
  } else {
    canvas.style.width = ''
    canvas.style.height = ''
  }
})

let score = 0
const savedScore = localStorage.getItem('scorGinu')
if (savedScore !== null) {
  score = parseInt(savedScore, 10)
}

const scoreElement = document.getElementById('score')

let isPaused = false

let gameStartTime = Date.now()
let gameTime = 0
const gameTimeElement = document.getElementById('gameTime')

function updateGameTime() {
  gameTime = Math.floor((Date.now() - gameStartTime) / 1000)
  const minutes = Math.floor(gameTime / 60)
  const seconds = gameTime % 60
  gameTimeElement.textContent = `Timp: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const coinPositions = [
  { x: 100, y: 325 },
  { x: 130, y: 325 },
  { x: 160, y: 325 },
  { x: 250, y: 200 },
  { x: 280, y: 200 },
  { x: 400, y: 250 },
  { x: 430, y: 250 },
  { x: 460, y: 250 },
  { x: 500, y: 150 },
  { x: 530, y: 150 },
]

let coins = []
function spawnCoins() {
  coins = []
  coinPositions.forEach((position) => {
    coins.push(new Coin({ position: { x: position.x, y: position.y } }))
  })
  console.log('Monedele au fost respawnate!', coins.length)
}

spawnCoins()

function updateScore() {
  scoreElement.textContent = `Scor: ${score}`
  localStorage.setItem('scorGinu', score)

  const scorGinuElem = document.getElementById('scorGinu')
  if (scorGinuElem) {
    scorGinuElem.textContent = `Scorul tău: ${score}`
  }
}

function checkCoinCollections() {
  coins.forEach((coin) => {
    if (!coin.collected && coin.checkCollision(player)) {
      score += 10
      updateScore()
      console.log('Scor actualizat la:', score)
    }
  })

  const allCollected = coins.every((coin) => coin.collected)
  if (allCollected && coins.length > 0) {
    console.log('Toate monedele au fost colectate! Respawn...')
    setTimeout(() => {
      spawnCoins()
    }, 1000)
  }
}

function animate() {
  if (!isPaused) {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    updateGameTime()

    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)

    if (background.image && background.image.complete) {
      background.update()
    }

    if (window.debugMode) {
      collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.draw()
      })
      platformCollisionBlocks.forEach((block) => {
        block.draw()
      })
    }

    coins.forEach((coin) => {
      coin.update()
    })

    player.checkForHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
      player.switchSprite('Run')
      player.velocity.x = 2
      player.lastDirection = 'right'
      player.shouldPanCameraToTheLeft({ canvas, camera })
    } else if (keys.a.pressed) {
      player.switchSprite('RunLeft')
      player.velocity.x = -2
      player.lastDirection = 'left'
      player.shouldPanCameraToTheRight({ canvas, camera })
    } else if (player.velocity.y === 0) {
      if (player.lastDirection === 'right') player.switchSprite('Idle')
      else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
      player.shouldPanCameraDown({ camera, canvas })
      if (player.lastDirection === 'right') player.switchSprite('Jump')
      else player.switchSprite('JumpLeft')
    } else if (player.velocity.y > 0) {
      player.shouldPanCameraUp({ camera, canvas })
      if (player.lastDirection === 'right') player.switchSprite('Fall')
      else player.switchSprite('FallLeft')
    }

    if (player.position.y > 400) {
      console.log('Player fell off the map')
      player.position.x = 100
      player.position.y = 300
      player.velocity.y = 0
    }

    checkCoinCollections()

    c.restore()
  }
}

window.debugMode = true

const keyState = {}

window.addEventListener('keydown', (event) => {
  keyState[event.key] = true

  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      if (player.velocity.y === 0) {
        player.velocity.y = -4
      }
      break
  }

  if (event.key.toLowerCase() === 'p') {
    pauseBtn.click()
  }
})

window.addEventListener('keyup', (event) => {
  keyState[event.key] = false

  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused
  if (!isPaused) {
    animate()
  }
  pauseBtn.innerHTML = isPaused ? '▶' : 'II'
})

updateScore()


animate()
