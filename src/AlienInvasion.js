class AlienInvasion extends Phaser.Scene {
  constructor() {
    super({ key: "AlienInvasion" });
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
    this.difficulty = data.difficulty || "challenger";

    // Adjust spawn rates and thresholds based on difficulty
    switch (this.difficulty) {
      case "Beginner":
        this.alienSpawnRate = 2000;
        this.obstacleSpeed = 100;
        this.asteroidSpawnScoreThreshold = 100; // Easier threshold for asteroids
        this.bombSpawnScoreThreshold = 200; // Easier threshold for bombs
        break;
      case "challenger":
        this.alienSpawnRate = 1500;
        this.obstacleSpeed = 150;
        this.asteroidSpawnScoreThreshold = 200;
        this.bombSpawnScoreThreshold = 350;
        break;
      case "expert":
        this.alienSpawnRate = 1000;
        this.obstacleSpeed = 200;
        this.asteroidSpawnScoreThreshold = 300;
        this.bombSpawnScoreThreshold = 450;
        break;
      default:
        this.alienSpawnRate = 1500;
        this.obstacleSpeed = 150;
        this.asteroidSpawnScoreThreshold = 200;
        this.bombSpawnScoreThreshold = 350;
    }
  }

  
    preload() {
        this.load.audio("backgroundMusic", "assets/backgroundmusic.m4a"); // Load background music
    
    this.load.image("sky", "assets/bg.png");
    this.load.image("spaceship", "assets/1.png");
    this.load.image("alien", "assets/alien.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("bullet", "assets/PlayProjectile.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("powerup-life", "assets/heart.png");
    this.load.image("powerup-shield", "assets/shield.png");
    this.load.image("powerup-score", "assets/score_multiplier.png");
    this.load.audio("shoot", "assets/shoot.mp3");
    this.load.audio("explosion", "assets/explosion.mp3");
    this.load.audio("powerup", "assets/powerup.mp3");
    this.load.image("powerup-spread", "assets/spread.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("powerup-clone", "assets/1.png");
  }

  
    create() {
        this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 }); // Add background music
        this.backgroundMusic.play(); // Play background music
    
    this.add.image(400, 300, "sky");

    // Reset game state
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.allowAlienSpawns = true;
    this.spreadPowerActive = false;

    this.player = this.physics.add.sprite(400, 550, "spaceship");
    this.player.setDisplaySize(64, 64);
    this.player.setCollideWorldBounds(true);

    this.bullets = this.physics.add.group();
    this.aliens = this.physics.add.group();
    this.asteroids = this.physics.add.group();
    this.bombs = this.physics.add.group();
    this.powerUps = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.hearts = [];
    for (let i = 0; i < this.maxHealth; i++) {
      const heart = this.add
        .image(760 - i * 30, 30, "heart")
        .setScale(0.3)
        .setVisible(i < this.health);
      this.hearts.push(heart);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
   
    this.checkWinCondition = () => {
      if (this.score >= 2000 && !this.gameOver) {
        this.gameOver = true; // Prevent further updates
        this.cleanup(); // Stop all timers and clear objects
        this.scene.start("WinScreen", { score: this.score }); // Transition to WinScreen
      }
    };
    
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

    // Colliders and overlap handlers
    this.physics.add.collider(
      this.bullets,
      this.aliens,
      this.hitAlien,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.asteroids,
      this.hitAsteroid,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.collectPowerUp,
      null,
      this
    );
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
      if (this.spreadPowerActive) {
        this.shootSpread();
      }
      this.shootBullet();
    }
  
    this.aliens.children.iterate((alien) => {
      if (alien && alien.y > 600) {
        this.loseHealth();
        alien.destroy();
      }
    });
  
    this.scoreText.setText("Score: " + this.score);
  
    // Add the win condition check here
    this.checkWinCondition();
  }
  
  shootSpread() {
    const offsets = [-15, 0, 15]; // Three directions: slight left, center, slight right

    offsets.forEach((offset) => {
      const bullet = this.bullets.create(
        this.player.x,
        this.player.y - 20,
        "bullet"
      );

      // Calculate the velocity offset for vertical scrolling
      bullet.body.velocity.x = offset * 15; // Adjust sideways offset
      bullet.body.velocity.y = -900; // Upward shooting velocity
      bullet.setDisplaySize(20, 40);
    });

    this.sound.play("shoot");
  }

  shootBullet() {
    const bullet = this.bullets.create(
      this.player.x,
      this.player.y - 20,
      "bullet"
    );
    bullet.body.velocity.y = -900;
    bullet.setDisplaySize(20, 40);
    this.sound.play("shoot");
  }

  spawnAliens() {
    if (this.gameOver || !this.allowAlienSpawns) return;

    const speed = Phaser.Math.Between(50, 100);
    const alienCount = Phaser.Math.Between(1, 3);

    for (let i = 0; i < alienCount; i++) {
      const alienX = Phaser.Math.Between(50, 750);
      const alien = this.aliens.create(alienX, 0, "alien");
      alien.setVelocityY(speed);
      alien.setDisplaySize(48, 48);
    }
  }

  spawnAsteroids() {
    if (this.gameOver || this.score < this.asteroidSpawnScoreThreshold) return;

    const speed = this.obstacleSpeed + Phaser.Math.Between(-50, 50);
    const asteroidX = Phaser.Math.Between(50, 750);
    const asteroidY = -50; // Start from above the screen

    const asteroid = this.asteroids.create(asteroidX, asteroidY, "asteroid");
    asteroid.setVelocityY(speed);
    asteroid.setDisplaySize(48, 48);
  }

  spawnBombs() {
    if (this.gameOver || this.score < this.bombSpawnScoreThreshold) return;

    const speed = this.obstacleSpeed + Phaser.Math.Between(-50, 50);
    const bombX = Phaser.Math.Between(50, 750);
    const bombY = -50; // Start from above the screen

    const bomb = this.bombs.create(bombX, bombY, "bomb");
    bomb.setVelocityY(speed);
    bomb.setDisplaySize(32, 32);
  }

  spawnPowerUp() {
    const powerUpTypes = [
      { texture: "powerup-life", type: "health", weight: 30 }, // 30% chance
      { texture: "powerup-shield", type: "shield", weight: 30 }, // 30% chance
      { texture: "powerup-score", type: "score", weight: 40 }, // 40% chance
      { texture: "powerup-spread", type: "spread", weight: 20 },
      { texture: "powerup-clone", type: "clone", weight: 20 },
    ];

    // Check if an offensive power-up is already present
    const offensivePowerUpExists = this.powerUps.children.entries.some(
      (powerUp) => powerUp.type === "spread"
    );
    if (offensivePowerUpExists) return; // Skip spawning if offensive power-up exists

    // Determine which power-up to spawn
    const totalWeight = powerUpTypes.reduce((sum, p) => sum + p.weight, 0);
    const random = Phaser.Math.Between(0, totalWeight - 1);

    let cumulativeWeight = 0;
    const selectedPowerUp = powerUpTypes.find((p) => {
      cumulativeWeight += p.weight;
      return random < cumulativeWeight;
    });

    // Spawn the selected power-up
    const powerUpX = Phaser.Math.Between(50, 750);
    const powerUp = this.powerUps.create(powerUpX, 0, selectedPowerUp.texture);
    powerUp.type = selectedPowerUp.type;
    powerUp.setVelocityY(100);
    powerUp.setDisplaySize(45, 45);
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

      case "spread":
        this.activateSpreadPowerUp(); // New Spread Power-Up Activation
        break;
      case "clone":
        this.activateClonePowerUp(); // Activate clone power-up
        break;

      default:
        break;
    }
  }

  activateClonePowerUp() {
    // If clone is already active, destroy the old clone and create a new one
    if (this.cloneActive) {
      this.destroyClone(this.clone);
    }

    this.cloneActive = true;
    // Set initial position of the clone a bit off from the player but within screen bounds
    let offsetX = 50; // X offset
    let offsetY = 50; // Y offset

    // Ensuring the clone spawns inside the screen bounds
    const spawnX = Phaser.Math.Clamp(
      this.player.x + offsetX,
      0,
      this.game.config.width
    );
    const spawnY = Phaser.Math.Clamp(
      this.player.y + offsetY,
      0,
      this.game.config.height
    );
    this.clone = this.physics.add.sprite(spawnX, spawnY, "spaceship");
    this.clone.setDisplaySize(64, 64);
    this.clone.setCollideWorldBounds(true);

    // Set clone's initial velocity to be the inverse of the player's velocity
    this.clone.setVelocity(
      -this.player.body.velocity.x,
      -this.player.body.velocity.y
    );

    // Clone mimics player’s movement
    this.physics.world.on("worldstep", () => {
      if (this.cloneActive) {
        // Update clone's velocity to invert the player's movement
        this.clone.setVelocity(
          -this.player.body.velocity.x,
          -this.player.body.velocity.y
        );

        // Ensure clone stays inside the screen bounds
        this.clone.x = Phaser.Math.Clamp(
          this.clone.x,
          0,
          this.game.config.width
        );
        this.clone.y = Phaser.Math.Clamp(
          this.clone.y,
          0,
          this.game.config.height
        );
      }
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.cloneActive) {
        this.fireProjectileFromClone();
      }
    });

    // Clone will die if it collides with bomb or asteroid
    this.physics.add.collider(this.clone, this.bombs, () =>
      this.destroyClone(this.clone)
    );
    this.physics.add.collider(this.clone, this.asteroids, () =>
      this.destroyClone(this.clone)
    );

    // After a set time, the clone disappears
    this.time.delayedCall(10000, () => {
      if (this.clone) this.destroyClone(this.clone);
    });
  }
  fireProjectileFromClone() {
    // Create a projectile from the clone's current position and set its velocity in the same direction as the clone's movement
    let projectile = this.physics.add.sprite(
      this.clone.x,
      this.clone.y,
      "bullet"
    );
    projectile.setDisplaySize(20, 40);
    projectile.setVelocity(0,-900);

    // Add collision with aliens for clone's projectile
    this.physics.add.collider(
      projectile,
      this.aliens,
      (projectile, alien) => {
        projectile.destroy();
        alien.destroy();
        this.sound.play("explosion");

        // Update score when an alien is destroyed by the clone's projectile
        const points = 10 * this.scoreMultiplier;
        this.score += points;
      }
    );

    // Optional: Add a collision with enemies or asteroids
    this.physics.add.collider(
      projectile,
      this.asteroids,
      (projectile, asteroid) => {
        projectile.destroy();
        asteroid.destroy();
      }
    );

    this.physics.add.collider(projectile, this.bombs, (projectile, bomb) => {
      projectile.destroy();
      bomb.destroy();
    });

    // Destroy the projectile after a certain time
    this.time.delayedCall(5000, () => {
      if (projectile) projectile.destroy();
    });
  }

  destroyClone(clone) {
    clone.destroy();
    this.cloneActive = false; // Deactivate the clone power-up after it dies
  }

  activateSpreadPowerUp() {
    if (this.spreadPowerActive) return; // If already active, do nothing
    this.spreadPowerActive = true;
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
    this.sound.play("explosion");

    const points = 10 * this.scoreMultiplier;
    this.score += points;
    this.checkWinCondition();

  }

  hitAsteroid(player, asteroid) {
    console.log("Asteroid hit detected!");
    asteroid.destroy();
    this.loseHealth();
  }

  hitBomb(player, bomb) {
    console.log("Bomb hit detected!");
    bomb.destroy();
    this.loseHealth();
  }

  loseHealth() {
    this.health -= 1;

    if (this.health >= 0) {
      this.hearts[this.health].setVisible(false);
    }

    if (this.health === 0) {
      // Trigger game over when health reaches 0
      this.cleanup();
      this.scene.start("GameOver", { score: this.score });
    }
  }

  
    cleanup() {
        if (this.backgroundMusic) this.backgroundMusic.stop(); // Stop background music on cleanup
    
    if (this.alienTimer) this.alienTimer.remove();
    if (this.asteroidTimer) this.asteroidTimer.remove();
    if (this.bombTimer) this.bombTimer.remove();
    if (this.powerUpTimer) this.powerUpTimer.remove();

    this.aliens.clear(true, true);
    this.asteroids.clear(true, true);
    this.bombs.clear(true, true);
    this.bullets.clear(true, true);
    this.powerUps.clear(true, true);
  }
}

export default AlienInvasion;