import Boss from "./Boss.js";
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
    this.winScoreThreshold = 0; // Initialize with default value
    this.difficulty = ''; // Will store difficulty
    this.cloneActive = false; // Track if clone power-up is active
    this.spreadPowerActive = false; // Track spread power-up status
    this.level = 1; // Default level
    this.nextBossAt = 500;   // Score threshold for the next boss
    this.currentBoss = null;
  }

  init(data) {
    // Ensure that the data passed contains difficulty, level, and score
    this.difficulty = data.difficulty || 'Beginner'; // Default to 'Beginner' if not passed
    this.score = data.score || 0; // Default to 0 score if not passed
    this.level = data.level || 'beginner'; // Default to 'beginner' if not passed
    
    // Log the received data for debugging purposes
    console.log(`AlienInvasion scene started with difficulty: ${this.difficulty}, level: ${this.level}, score: ${this.score}`);
    
    // Adjust win score threshold based on the difficulty
    switch (this.difficulty) {
      case "Beginner":
        this.alienSpawnRate = 2000;
        this.obstacleSpeed = 100;
        this.asteroidSpawnScoreThreshold = 100; // Easier threshold for asteroids
        this.bombSpawnScoreThreshold = 200; // Easier threshold for bombs
        this.winScoreThreshold = 1000;
        this.nextBossAt = 500;
        break;
      case "challenger":
        this.alienSpawnRate = 1500;
        this.obstacleSpeed = 150;
        this.asteroidSpawnScoreThreshold = 200;
        this.bombSpawnScoreThreshold = 350;
        this.winScoreThreshold = 2000;
        this.nextBossAt = 400;
        break;
      case "expert":
        this.alienSpawnRate = 1000;
        this.obstacleSpeed = 200;
        this.asteroidSpawnScoreThreshold = 300;
        this.bombSpawnScoreThreshold = 450;
        this.winScoreThreshold = 2500;
        this.nextBossAt = 300;
        break;
      default:
        this.alienSpawnRate = 1500;
        this.obstacleSpeed = 150;
        this.asteroidSpawnScoreThreshold = 200;
        this.bombSpawnScoreThreshold = 350;
        this.winScoreThreshold = 1000;
        this.nextBossAt = 500;  
    }

    // Log the win score threshold for debugging purposes
    console.log(`Win score threshold set to: ${this.winScoreThreshold}`);
    
    // Check if the player's score is above the threshold for the current difficulty
    if (this.score >= this.winScoreThreshold) {
        console.log('Player has won!');
        // Optionally, display a congratulatory message or trigger an event
    } else {
        console.log('Player has not reached the required score to win');
    }
}


  preload() {
    this.load.audio("backgroundMusic", "assets/background1.mp3"); // Load background music

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
    this.load.image('bossProjectile1', 'assets/frames/charged1.png');
    this.load.image('bossProjectile2', 'assets/frames/charged2.png');
    this.load.image('bossProjectile3', 'assets/frames/charged3.png');
    this.load.image('bossProjectile4', 'assets/frames/charged4.png');
    this.load.image('bossProjectile5', 'assets/frames/charged5.png');
    this.load.image('bossProjectile6', 'assets/frames/charged6.png');
    this.load.spritesheet("explosion", "assets/explosion.png", { frameWidth: 64, frameHeight: 64 });
    this.load.image('blast1', 'assets/blast/blast1.png');
    this.load.image('blast2', 'assets/blast/blast2.png');
    this.load.image('blast3', 'assets/blast/blast3.png');
    this.load.image('blast4', 'assets/blast/blast4.png');
    this.load.image('blast5', 'assets/blast/blast5.png');
    this.load.image('blast6', 'assets/blast/blast6.png');
    this.load.image('blast7', 'assets/blast/blast7.png');
    this.load.image('blast8', 'assets/blast/blast8.png');
    this.load.image('blast9', 'assets/blast/blast9.png');
    this.load.image('blast10', 'assets/blast/blast10.png');
    this.load.image('blast11', 'assets/blast/blast11.png');
 
    // this.load.audio('explosionSound', 'assets/sounds/explosion.mp3');
  }
  
  create() {
    this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 1.0 }); // Add background music
    this.backgroundMusic.play(); // Play background music

    this.add.image(400, 300, "sky");

    // Reset game state
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.allowAlienSpawns = true;
    this.spreadPowerActive = false;
    this.nextBossAt = 500  // Reset the boss spawn threshold
    this.currentBoss = null;  // Ensure boss is null on restart

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

    // Create the explosion animation using the 5 blast images
    this.anims.create({
      key: 'explode',
      frames: [
          { key: 'blast1' },
          { key: 'blast2' },
          { key: 'blast3' },
          { key: 'blast4' },
          { key: 'blast5' },
          { key: 'blast6' },
          { key: 'blast7' },
          { key: 'blast8' },
          { key: 'blast9' },
          { key: 'blast10' },
          { key: 'blast11' }

      ],
      frameRate: 10,  // Adjust frame rate to control speed
      yoyo: false,    // Animation should not loop
      repeat: 0       // Play the animation once
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
      // Check if the score has reached the win threshold and if the game is not already over
      if (this.score >= this.winScoreThreshold && !this.gameOver) {
        this.gameOver = true; // Mark the game as over to prevent further checks

        // Perform any cleanup tasks (e.g., stop enemies, clear timers, etc.)
        this.cleanup();

        // Transition to the WinScreen with a delay
        this.time.delayedCall(500, () => {
          this.scene.start('WinScreen', {
            level: this.level,         // Pass the current level
            score: this.score,         // Pass the current score
            difficulty: this.difficulty // Pass the current difficulty level
          });
        }, [], this);
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

     // Check for boss spawn
     if (this.score >= this.nextBossAt && !this.currentBoss && !this.gameOver) {
      console.log("Spawning boss at score:", this.score); // Debug log
      this.spawnBoss();
  }
  
  if (this.currentBoss) {
      this.currentBoss.update();
  }

    // Add the win condition check here
    this.checkWinCondition();
  }
  spawnBoss() {
    // Check if a boss is already present or if the game is over
    if (this.currentBoss || this.gameOver) return;

    console.log("Boss spawn initiated");
    
    // Stop spawning aliens, asteroids, and bombs
    this.allowAlienSpawns = false; // Stop alien spawns
    if (this.asteroidTimer) this.asteroidTimer.paused = true; // Stop asteroid spawns
    if (this.bombTimer) this.bombTimer.paused = true; // Stop bomb spawns

    // Create a new boss instance
    this.currentBoss = new Boss(this, this.score);
    
    // Add bullet collision with the boss
    this.physics.add.collider(
        this.currentBoss,
        this.bullets,
        (boss, bullet) => {
            if (boss.phase === 'battle' && !boss.isInvulnerable) {
                boss.onHit(bullet);
            }
        },
        null,
        this
    );
    
    // Listen for the destroy event of the boss
    this.currentBoss.events.on('destroy', () => {
        console.log("Boss destroyed, resuming enemy spawns");
        
        // Resume spawning of aliens, asteroids, and bombs
        this.allowAlienSpawns = true; // Resume alien spawns
        if (this.asteroidTimer) this.asteroidTimer.paused = false; // Resume asteroid spawns
        if (this.bombTimer) this.bombTimer.paused = false; // Resume bomb spawns
        
        this.currentBoss = null; // Clear the current boss reference
        this.nextBossAt = this.score + 400; // Set the next boss spawn threshold based on current score
    });
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
     // Add debug logs
     console.log('Spawn check:', {
      allowSpawns: this.allowAlienSpawns,
      gameOver: this.gameOver,
      hasBoss: !!this.currentBoss
  });
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
    if (this.gameOver) return;

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
    bomb.setVelocityY(speed); // Bomb falls down with this speed
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
    // this.physics.add.collider(
    //   this.player,
    //   this.aliens,
    //   this.hitAlienWithPlayer,
    //   null,
    //   this
    // );

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
    projectile.setVelocity(0, -900);

    // Add collision with aliens for clone's projectile
    this.physics.add.collider(projectile, this.aliens, (projectile, alien) => {
      projectile.destroy();
      alien.destroy();
      this.sound.play("explosion");

      // Update score when an alien is destroyed by the clone's projectile
      const points = 10 * this.scoreMultiplier;
      this.score += points;
    });

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
    this.time.delayedCall(3000, () => {
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
  activateSpreadPowerUp() {
    if (this.spreadPowerActive) return; // If already active, do nothing
    this.spreadPowerActive = true;

    // Deactivate the spread power-up after 15 seconds
    this.time.delayedCall(15000, () => {
      this.spreadPowerActive = false;
    });
  }

  hitAlien(bullet, alien) {
    bullet.destroy();
    alien.destroy();
    this.sound.play("explosion");

    // Create explosion animation
    const explosion = this.physics.add.sprite(alien.x, alien.y, "explosion");
    explosion.play("explode"); // Play the explosion animation
    explosion.on("animationcomplete", () => {
        explosion.destroy(); // Destroy the explosion sprite after the animation is complete
    });

    const points = 10 * this.scoreMultiplier;
    this.score += points;
    this.checkWinCondition();
  }

  hitAsteroid(player, asteroid) {
    console.log("Asteroid hit detected!");
    asteroid.destroy();

    // Skip losing health if the shield is active
    if (this.shieldActive) {
      console.log("Shield protected the player from asteroid!");
      return;
    }

    this.loseHealth();
  }




  hitBomb(player, bomb) {
    console.log("Bomb hit detected!");
    bomb.destroy();

    


    // Skip losing health if the shield is active
    if (this.shieldActive) {
      console.log("Shield protected the player from bomb!");
      return;
    }

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
    if (this.currentBoss) {
      this.currentBoss.destroy(); // Ensure the boss is removed from the scene
      this.currentBoss = null;
    }
  }
}

export default AlienInvasion;