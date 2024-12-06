class Sprite {
  constructor({ position, imageSrc, scale = 1, offset = {x: 0, y:0}, framesMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 5, }) {
    // We will use the imageSrc to render a sprite for the frames
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image()
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = framesCurrent;
    this.framesElapsed = framesElapsed;  // how many frames have elapsed over the run
    this.framesHold = framesHold;  // how many frames to go through before update of animation
    this.offset = offset;
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

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale,
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw()
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
                position,
                velocity,
                color = 'red',
                offset,
                imageSrc,
                scale = 1,
                framesMax = 1,
                framesCurrent = 0,
                framesElapsed = 0,
                framesHold = 5,
  }) {
    super({
      position,
      imageSrc,
      scale,
      offset,
      framesMax,
      framesCurrent,
      framesElapsed,
      framesHold,
    })
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

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw();
    this.animateFrames();
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