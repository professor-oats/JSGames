const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
})

const player = new Fighter({
  position:{
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position:{
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: './img/kenji/Idle.png',
  scale: 2.5,
  offset: {
    x: 215,
    y: 170
  },
  framesMax: 4,
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50,
  },
});

const keys= {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

decreaseTimer();

function animate() {
  // Loop over itself to continue to request animation frames
  window.requestAnimationFrame(animate);
  // Fill background black
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // important to render background before player and enemy to have
  // it in the back - Render order in general
  background.update();
  shop.update();
  player.update();
  enemy.update();

  // Default player and enemy velocity here
  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run');
  }
  else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run');
  }
  else {  // setting idle when not running
    player.switchSprite('idle');
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  }
  else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run');
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run');
  }
  else {
    enemy.switchSprite('idle');
  }

  if (player.velocity.y < 0) {
    enemy.switchSprite('jump');
  }
  else if (player.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }
    )
    && player.isAttacking
    && player.framesCurrent === 4  // collision condition for frame 4 when sword is fully drawn
  ) {
    enemy.takeHit()
    player.isAttacking = false;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    // setting to false again to ensure it doesn't stay true
    player.isAttacking = false;
  }

  // this is where our player gets hit

  if (
    rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }
    )
    && enemy.isAttacking
    && enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    // setting to false again to ensure it doesn't stay true
    enemy.isAttacking = false;
  }

  // End the game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerID})
  }

}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -20;
      break;
    case ' ':
      player.attack();
      break;


    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -20
      break;
    case 'ArrowDown':
      enemy.attack()
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {

    // Player movement
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;

    // Enemy movement
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
  }
});