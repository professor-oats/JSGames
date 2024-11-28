const canvas =document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.position.x, this.position.y, 50, this.height)
  }

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    }
    else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position:{
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const enemy = new Sprite({
  position:{
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  }
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
  }
}
let lastKey

function animate() {
  // Loop over itself to continue to request animation frames
  window.requestAnimationFrame(animate);
  // Fill background black
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  // Default player velocity here
  player.velocity.x = 0

  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -1
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 1
  }
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -10
      break;
  }
  console.log(event.key);
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
  }
  console.log(event.key);
});