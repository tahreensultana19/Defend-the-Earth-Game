class DefendEarth extends Phaser.Scene {
  constructor() {
    super({ key: 'DefendEarth' });
    this.score = 0;
    this.health = 3;
    this.maxHealth = 3; // Define maximum health
    this.gameOver = false;
    this.allowAlienSpawns = true;
    this.asteroids = null;
    this.bombs = null;
    this.scoreMultiplier = 1; // Default multiplier
    this.shieldActive = false;
  }

  init(data) {
    this.difficulty = data.difficulty || "medium";
    this.alienSpawnRate = this.difficulty === "easy" ? 2000 : this.difficulty === "medium" ? 1500 : 1000;
    this.obstacleSpeed = this.difficulty === "easy" ? 100 : this.difficulty === "medium" ? 150 : 200;
  }

  preload() {
    this.load.image("sky", "assets/bg.png");
    this.load.image("spaceship", "assets/1.png");
    this.load.image("alien", "assets/alien.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("bullet", "assets/PlayProjectile.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("powerup-life", "assets/life.png");
    this.load.image("powerup-shield", "assets/shield.png");
    this.load.image("powerup-score", "assets/score_multiplier.png");
    this.load.audio("shoot", "assets/shoot.mp3");
    this.load.audio("explosion", "assets/explosion.mp3");
    this.load.audio("powerup", "assets/powerup.mp3");
  }

  create() {
    this.add.image(400, 300, "sky");

    // Reset game state
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.allowAlienSpawns = true;

    this.player = this.physics.add.sprite(400, 550, 'spaceship');
    this.player.setDisplaySize(64, 64);
    this.player.setCollideWorldBounds(true);

    this.bullets = this.physics.add.group();
    this.aliens = this.physics.add.group();
    this.asteroids = this.physics.add.group();
    this.bombs = this.physics.add.group();
    this.powerUps = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.hearts = [];
    for (let i = 0; i < this.maxHealth; i++) {
      const heart = this.add.image(760 - i * 30, 30, 'heart').setScale(0.01).setVisible(i < this.health);
      this.hearts.push(heart);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Alien spawning timer
    this.alienTimer = this.time.addEvent({
      delay: this.alienSpawnRate,
      callback: this.spawnAliens,
      callbackScope: this,
      loop: true,
    });

    // Asteroid spawning timer
    this.asteroidTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnAsteroids,
      callbackScope: this,
      loop: true,
    });

    // Bomb spawning timer
    this.bombTimer = this.time.addEvent({
      delay: 5000,
      callback: this.spawnBombs,
      callbackScope: this,
      loop: true,
    });

    // Power-up spawning timer
    this.powerUpTimer = this.time.addEvent({
      delay: 8000, // Reduced delay for more frequent power-ups
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.bullets, this.aliens, this.hitAlien, null, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shootBullet();
    }

    this.aliens.children.iterate((alien) => {
      if (alien && alien.y > 600) {
        this.loseHealth();
        alien.destroy();
      }
    });

    this.scoreText.setText('Score: ' + this.score);
  }

  shootBullet() {
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
    bullet.body.velocity.y = -900;
    bullet.setDisplaySize(20, 40);
    this.sound.play('shoot');
  }

  spawnAliens() {
    if (this.gameOver || !this.allowAlienSpawns) return;

    const speed = Phaser.Math.Between(50, 100);
    const alienCount = Phaser.Math.Between(1, 3);

    for (let i = 0; i < alienCount; i++) {
      const alienX = Phaser.Math.Between(50, 750);
      const alien = this.aliens.create(alienX, 0, 'alien');
      alien.setVelocityY(speed);
      alien.setDisplaySize(48, 48);
    }
  }

  spawnAsteroids() {
    if (this.gameOver || this.score < 200) return;

    const speed = this.obstacleSpeed + Phaser.Math.Between(-50, 50);
    const asteroidX = Phaser.Math.Between(50, 750);
    const asteroid = this.asteroids.create(asteroidX, 0, 'asteroid');
    asteroid.setVelocityY(speed);
    asteroid.setDisplaySize(48, 48);
  }

  spawnBombs() {
    if (this.gameOver || this.score < 350) return;

    const speed = this.obstacleSpeed + Phaser.Math.Between(-50, 50);
    const bombX = Phaser.Math.Between(50, 750);
    const bomb = this.bombs.create(bombX, 0, 'bomb');
    bomb.setVelocityY(speed);
    bomb.setDisplaySize(32, 32);
  }

  spawnPowerUp() {
    const powerUpTypes = [
      { texture: "powerup-life", type: "health", weight: 30 }, // 30% chance
      { texture: "powerup-shield", type: "shield", weight: 30 }, // 30% chance
      { texture: "powerup-score", type: "score", weight: 40 }, // 40% chance
    ];

    const totalWeight = powerUpTypes.reduce((sum, p) => sum + p.weight, 0);
    const random = Phaser.Math.Between(0, totalWeight - 1);

    let cumulativeWeight = 0;
    const selectedPowerUp = powerUpTypes.find((p) => {
      cumulativeWeight += p.weight;
      return random < cumulativeWeight;
    });

    const powerUpX = Phaser.Math.Between(50, 750);
    const powerUp = this.powerUps.create(powerUpX, 0, selectedPowerUp.texture);
    powerUp.type = selectedPowerUp.type;
    powerUp.setVelocityY(100);
    powerUp.setDisplaySize(32, 32);
  }

  collectPowerUp(player, powerUp) {
    const type = powerUp.type;
    powerUp.destroy();
    this.sound.play("powerup");

    switch (type) {
      case "health":
        this.activateHealth();
        break;

      case "shield":
        this.activateShield();
        break;

      case "score":
        this.activateScoreMultiplier();
        break;

      default:
        break;
    }
  }

  activateHealth() {
    if (this.health < this.maxHealth) {
      this.health += 1;
      this.hearts[this.health - 1].setVisible(true);
    }
  }

  activateShield() {
    if (this.shieldActive) return;

    this.player.setTint(0x00ff00);
    this.shieldActive = true;
    this.time.delayedCall(5000, () => {
      this.player.clearTint();
      this.shieldActive = false;
    });
  }

  activateScoreMultiplier() {
    if (this.scoreMultiplier > 1) return;

    this.scoreMultiplier = 2;
    this.time.delayedCall(10000, () => {
      this.scoreMultiplier = 1;
    });
  }

  hitAlien(bullet, alien) {
    bullet.destroy();
    alien.destroy();
    this.sound.play('explosion');

    const points = 10 * this.scoreMultiplier;
    this.score += points;
  }

  loseHealth() {
    this.health -= 1;

    if (this.health >= 0) {
      this.hearts[this.health].setVisible(false);
    }

    if (this.health === 0) {
      this.cleanup();
      this.scene.start('GameOver', { score: this.score });
    }
}
}
