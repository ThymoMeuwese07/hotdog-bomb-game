// sketch.js
let player;
let hotdog;
let bomb;
let score = 0;
let highscore = 0;
let caughtHotdogs = 0;
let hotdogSpeed = 2;
let bombSpeed = 2;
let backgroundImage;
let gameState = 'start'; // 'start', 'playing', 'end'

function preload() {
  backgroundImage = loadImage('achtergrond.jpg');
  hotdogImage = loadImage('hotdog.png');
  bombImage = loadImage('bomb.png');
  handImage = loadImage('hand.png');
}

function setup() {
  createCanvas(600, 600);
  player = new Player();
  hotdog = new Hotdog();
  bomb = new Bomb();
}

function draw() {
  image(backgroundImage, 0, 0, width, height);

  if (gameState === 'start') {
    startScreen();
  } else if (gameState === 'playing') {
    player.update();
    player.show();

    hotdog.update();
    hotdog.show();

    bomb.update();
    bomb.show();

    if (player.hits(hotdog)) {
      hotdog.reset();
      score++;
      caughtHotdogs++;

      if (score > highscore) {
        highscore = score;
      }

      if (caughtHotdogs === 10 || caughtHotdogs === 15 || (caughtHotdogs > 15 && (caughtHotdogs - 15) % 5 === 0)) {
        hotdogSpeed += 0.5;
        bombSpeed += 0.5;
      }
    }

    if (player.hits(bomb) || hotdog.y > height) {
      gameState = 'end';
    }

    textSize(16);
    fill(0);
    textAlign(LEFT, TOP);
    text('Score: ' + score, 10, 10);
    text('Highscore: ' + highscore, 10, 30);
    text('Caught Hotdogs: ' + caughtHotdogs, 10, 50);
  } else if (gameState === 'end') {
    endScreen();
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === 'start') {
      gameState = 'playing';
    } else if (gameState === 'end') {
      resetGame();
      gameState = 'start';
    }
  }
}

function startScreen() {
  background(200, 200, 0); // Gele achtergrondkleur
  textSize(32);
  fill(0);
  textAlign(CENTER, CENTER);
  text('Hotdog & Bomb Game', width / 2, height / 2 - 40);
  text('Press ENTER to start', width / 2, height / 2 + 40);
}

function endScreen() {
  background(255, 0, 0); // Rode achtergrondkleur
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2 - 40);
  text('Score: ' + score, width / 2, height / 2 + 40);
  text('Press ENTER to play again', width / 2, height / 2 + 80);
}

function resetGame() {
  score = 0;
  caughtHotdogs = 0;
  hotdogSpeed = 2;
  bombSpeed = 2;
  player = new Player();
  hotdog.reset();
  bomb.reset();
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
    this.size = 30;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;

    this.x = constrain(this.x, 0, width - this.size);
  }

  show() {
    let handSize = 80;
    image(handImage, this.x, this.y, handSize, handSize);
  }

  hits(target) {
    return (
      this.x < target.x + target.size &&
      this.x + this.size > target.x &&
      this.y < target.y + target.size &&
      this.y + this.size > target.y
    );
  }
}

class Hotdog {
  constructor() {
    this.reset();
  }

  update() {
    this.y += hotdogSpeed;

    if (this.y > height) {
      this.reset();
    }
  }

  show() {
    image(hotdogImage, this.x, this.y, this.size, this.size);
  }

  reset() {
    this.x = random(width - 20);
    this.y = 0;
    this.size = 30;
  }
}

class Bomb {
  constructor() {
    this.reset();
  }

  update() {
    this.y += bombSpeed;

    if (this.y > height) {
      this.reset();
    }
  }

  show() {
    image(bombImage, this.x, this.y, this.size, this.size);
  }

  reset() {
    this.x = random(width - 20);
    this.y = random(-height, -50);
    this.size = 30;
  }
}
