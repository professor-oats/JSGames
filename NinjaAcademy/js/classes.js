class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    // We will use the imageSrc to render a sprite for the frames
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image()
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;  // how many frames have elapsed over the run
    this.framesHold = 5;  // how many frames to go through before update of animation
  };

  draw() {
    // using position.x and position.y is possible since we pass
    // position as an object with assign values for these
    // the drawImage function first takes 4 parameters for cropping
    // later takes the 4 parameters for position and dimensions
    // The superfirst parameter is the image itself to draw
    ctx.drawImage(
      this.image,
       // crop location, crop width, crop height
      // the position for crop will vary with the frames
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,  // divide by 6 since 6 frames in the image
      this.image.height,

      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale,
    );
  }

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw()
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Fighter {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey = null;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    // attackbox
    if (this.isAttacking) {
      ctx.fillStyle = 'green'
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      )
    }
  }

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // This condition checks for how long the fighters will fall >= value
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
    }
    else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100)
  }
}