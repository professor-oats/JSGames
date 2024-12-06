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

const player = new Fighter({
  position:{
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
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
  offset: {
    x: -50,
    y: 0
  },
  color: 'blue'
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

function rectangularCollision({
  rectangle1,
  rectangle2
  }
) {
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.isAttacking
  )
}

function determineWinner({player, enemy, timerID}) {
  clearTimeout(timerID);
  document.querySelector('#displayResult').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayResult').innerHTML = 'Tie';
  }
  else if (player.health > enemy.health) {
    document.querySelector('#displayResult').innerHTML = 'Player 1 Wins';
  }
  else if (player.health < enemy.health) {
    document.querySelector('#displayResult').innerHTML = 'Player 2 Wins';
  }
}

let timer = 60;
let timerID

function decreaseTimer() {

  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  // Who won the game?
  if (timer === 0) {
    determineWinner({player, enemy, timerID});
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
  // it in the back
  background.update();
  player.update();
  enemy.update();

  // Default player and enemy velocity here
  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
  }
  else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
  }

  // detect for collision
  if (
    rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }
    )
    && player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  if (
    rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }
    )
    && enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
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
  console.log(event.key);
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
  console.log(event.key);
});