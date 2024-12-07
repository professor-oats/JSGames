class Sprite {
  constructor({ position, imageSrc, scale = 1, offset = {x: 0, y:0}, framesMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 5, }) {
    // We will use the imageSrc to render a sprite for the frames
    this.position = position;
    this.width = 50;  // address these?
    this.height = 150; // ??
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
                sprites,
                attackBox = {offset: {}, width: undefined, height: undefined},
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
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.sprites = sprites

    // loop for checking over the different animation states
    // decided in sprites as Idle, Run, etc.
    for (const sprite in this.sprites) {
      // sprite here will be the object key
      // and we will push in .image attribute and declare a source for it
      // this ensures that we will render the correct image depending on what sprite
      // we have active
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  // Method responsible for what updates to do on animation frame
  update() {
    this.draw();
    this.animateFrames();

    // attackboxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw attackbox
    //ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // This condition checks for how long the fighters will fall >= value
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    }
    else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite('attack1')
    this.isAttacking = true;
  }

  takeHit() {
    this.switchSprite('takeHit')
    this.health -= 20;
  }

  switchSprite(sprite) {
    // override all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }

    // override when fighter gets hit
    if (this.image === this.sprites.takeHit.image &&
        this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    // switch between the available sprites here
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;  // ensures that we start at render frame
          // 0 when switching to next sprite
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}