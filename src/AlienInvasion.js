// class AlienInvasion extends Phaser.Scene {
//   constructor() {
//     super({ key: 'AlienInvasion' });
//     this.score = 0;
//     this.health = 3;
//     this.gameOver = false;
//     this.achievements = { 100: false, 500: false, 1000: false };
//     this.difficulty = 'easy';  // Default difficulty
//     this.difficultyLevel = 1;  // Keep track of the difficulty level
//   }

//   preload() {
//     // Load assets as before...
//     this.load.image("sky", 'assets/bg.png');
//     this.load.image('spaceship', 'assets/1.png');
//     this.load.image('alien', 'assets/alien.png');
//     this.load.image('bullet', 'assets/PlayProjectile.png');
//     this.load.image('heart', 'assets/heart.png');
//     this.load.image('skull', 'assets/skull.png');
//     this.load.image('exterminator', 'assets/exterminator.png');
//     this.load.image('star', 'assets/star.png');
//     this.load.audio('shoot', 'assets/shoot.mp3');
//     this.load.audio('explosion', 'assets/explosion.mp3');
//   }

//   create() {
//     this.add.image(400, 300, "sky");

//     // Reset game state
//     this.score = 0;
//     this.health = 3;
//     this.gameOver = false;
//     this.achievements = { 100: false, 500: false, 1000: false };
//     this.difficulty = 'easy';  // Start with easy difficulty
//     this.difficultyLevel = 1;

//     // Spaceship
//     this.player = this.physics.add.sprite(400, 550, 'spaceship');
//     this.player.setDisplaySize(64, 64);
//     this.player.setCollideWorldBounds(true);

//     // Bullets
//     this.bullets = this.physics.add.group({
//       classType: Phaser.Physics.Arcade.Image,
//       defaultKey: 'bullet',
//       runChildUpdate: true
//     });

//     // Aliens
//     this.aliens = this.physics.add.group();

//     // Score display
//     this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

//     // Health (hearts)
//     this.hearts = [];
//     for (let i = 0; i < 3; i++) {
//       this.hearts.push(this.add.image(760 - i * 30, 30, 'heart').setScale(0.01));
//     }

//     // Achievement icons
//     this.achievementIcons = {
//       100: this.add.image(300, 30, 'skull').setScale(0.1).setVisible(false),
//       500: this.add.image(350, 30, 'exterminator').setScale(0.1).setVisible(false),
//       1000: this.add.image(400, 30, 'star').setScale(0.1).setVisible(false)
//     };

//     // Difficulty display
//     this.difficultyText = this.add.text(16, 60, `Difficulty: ${this.difficulty}`, { fontSize: '32px', fill: '#fff' });

//     // Input controls
//     this.cursors = this.input.keyboard.createCursorKeys();
//     this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//     // Alien spawn timer
//     this.alienTimer = this.time.addEvent({
//       delay: 1500,
//       callback: this.spawnAliens,
//       callbackScope: this,
//       loop: true
//     });

//     // Bullet-alien collision
//     this.physics.add.collider(this.bullets, this.aliens, this.hitAlien, null, this);
//   }

//   update() {
//     // Move the spaceship
//     if (this.cursors.left.isDown) {
//       this.player.setVelocityX(-200);
//     } else if (this.cursors.right.isDown) {
//       this.player.setVelocityX(200);
//     } else {
//       this.player.setVelocityX(0);
//     }

//     // Shoot bullets
//     if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
//       this.shootBullet();
//     }

//     // Check if any alien has reached the bottom
//     this.aliens.children.iterate((alien) => {
//       if (alien && alien.y > 600) {
//         this.loseHealth();
//         alien.destroy();
//       }
//     });

//     // Check for achievements
//     this.checkAchievements();

//     // Check and update difficulty based on score
//     this.updateDifficulty();
//   }

//   shootBullet() {
//     const bullet = this.bullets.get(this.player.x, this.player.y - 20);
//     if (bullet) {
//       bullet.setActive(true);
//       bullet.setVisible(true);
//       bullet.body.velocity.y = -900;
//       bullet.setDisplaySize(20, 40);
//       this.sound.play('shoot');
//     }
//   }

//   spawnAliens() {
//     if (this.gameOver) return;

//     // Define alien speed based on difficulty level
//     let speed;
//     if (this.difficulty === 'easy') {
//       speed = Phaser.Math.Between(50, 100);  // Easy level alien speed
//     } else if (this.difficulty === 'medium') {
//       speed = Phaser.Math.Between(100, 150);  // Medium level alien speed
//     } else if (this.difficulty === 'hard') {
//       speed = Phaser.Math.Between(150, 200);  // Hard level alien speed
//     }

//     // Determine the number of aliens based on the difficulty
//     const alienCount = Phaser.Math.Between(1, this.difficultyLevel + 2);

//     for (let i = 0; i < alienCount; i++) {
//       const alienX = Phaser.Math.Between(50, 750);
//       const alien = this.aliens.create(alienX, 50, 'alien');
//       alien.setVelocityY(speed);  // Use the calculated speed
//       alien.setDisplaySize(48, 48);
//     }
//   }

//   hitAlien(bullet, alien) {
//     bullet.destroy();
//     alien.destroy();
//     this.sound.play('explosion');

//     // Increase score
//     this.score += 10;
//     this.scoreText.setText('Score: ' + this.score);
//   }

//   checkAchievements() {
//     if (this.score >= 100 && !this.achievements[100]) {
//       this.achievements[100] = true;
//       this.achievementIcons[100].setVisible(true);
//       this.showAchievementText('Best Alien Destroyer');
//     }

//     if (this.score >= 500 && !this.achievements[500]) {
//       this.achievements[500] = true;
//       this.achievementIcons[500].setVisible(true);
//       this.showAchievementText('Indestructible');
//     }

//     if (this.score >= 1000 && !this.achievements[1000]) {
//       this.achievements[1000] = true;
//       this.achievementIcons[1000].setVisible(true);
//       this.showAchievementText("I'm Too Lazy to Give Up");
//     }
//   }

//   showAchievementText(text) {
//     const achievementText = this.add.text(400, 300, text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
//     this.time.delayedCall(2000, () => {
//       achievementText.destroy();
//     });
//   }

//   loseHealth() {
//     this.health -= 1;
//     if (this.health >= 0) {
//       this.hearts[this.health].setVisible(false);
//     }

//     if (this.health === 0) {
//       this.gameOver = true;
//       this.scene.start('GameOver', { score: this.score });
//     }
//   }

//   updateDifficulty() {
//     // Increase difficulty as the score increases
//     if (this.score >= 1000 && this.difficultyLevel < 3) {
//       this.difficultyLevel = 3;
//       this.difficulty = 'hard';
//       this.difficultyText.setText(`Difficulty: ${this.difficulty}`);
//       this.alienTimer.delay = 1000;  // Faster spawn rate
//     } else if (this.score >= 500 && this.difficultyLevel < 2) {
//       this.difficultyLevel = 2;
//       this.difficulty = 'medium';
//       this.difficultyText.setText(`Difficulty: ${this.difficulty}`);
//       this.alienTimer.delay = 1200;  // Medium spawn rate
//     } else if (this.score >= 100 && this.difficultyLevel < 1) {
//       this.difficultyLevel = 1;
//       this.difficulty = 'easy';
//       this.difficultyText.setText(`Difficulty: ${this.difficulty}`);
//       this.alienTimer.delay = 1500;  // Easy spawn rate
//     }
//   }
// }

// export default AlienInvasion;
class AlienInvasion extends Phaser.Scene {
  constructor() {
    super({ key: 'AlienInvasion' });
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.achievements = { 100: false, 500: false, 1000: false };
    this.difficulty = 'easy';  // Default difficulty
    this.difficultyLevel = 1;  // Difficulty level (easy = 1, medium = 2, hard = 3)
  }

  init(data) {
    if (data.difficulty) {
      this.difficulty = data.difficulty;  // Set the difficulty passed from the menu
    }

    // Update difficulty level based on selected difficulty
    if (this.difficulty === 'medium') {
      this.difficultyLevel = 2;
    } else if (this.difficulty === 'hard') {
      this.difficultyLevel = 3;
    }
  }

  preload() {
    // Load assets for the game
    this.load.image("sky", 'assets/bg.png');
    this.load.image('spaceship', 'assets/1.png');
    this.load.image('alien', 'assets/alien.png');
    this.load.image('bullet', 'assets/PlayProjectile.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('skull', 'assets/skull.png');
    this.load.image('exterminator', 'assets/exterminator.png');
    this.load.image('star', 'assets/star.png');
    this.load.audio('shoot', 'assets/shoot.mp3');
    this.load.audio('explosion', 'assets/explosion.mp3');
  }

  create() {
    this.add.image(400, 300, "sky");

    // Reset game state
    this.score = 0;
    this.health = 3;
    this.gameOver = false;
    this.achievements = { 100: false, 500: false, 1000: false };

    // Spaceship
    this.player = this.physics.add.sprite(400, 550, 'spaceship');
    this.player.setDisplaySize(64, 64);
    this.player.setCollideWorldBounds(true);

    // Bullets
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: 'bullet',
      runChildUpdate: true
    });

    // Aliens
    this.aliens = this.physics.add.group();

    // Score display
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Health (hearts)
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      this.hearts.push(this.add.image(760 - i * 30, 30, 'heart').setScale(0.01));
    }

    // Achievement icons
    this.achievementIcons = {
      100: this.add.image(300, 30, 'skull').setScale(0.1).setVisible(false),
      500: this.add.image(350, 30, 'exterminator').setScale(0.1).setVisible(false),
      1000: this.add.image(400, 30, 'star').setScale(0.1).setVisible(false)
    };

    // Difficulty display
    this.difficultyText = this.add.text(16, 60, `Difficulty: ${this.difficulty}`, { fontSize: '32px', fill: '#fff' });

    // Input controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Alien spawn timer
    this.alienTimer = this.time.addEvent({
      delay: 1500,  // Spawn aliens every 1.5 seconds
      callback: this.spawnAliens,
      callbackScope: this,
      loop: true
    });

    // Bullet-alien collision
    this.physics.add.collider(this.bullets, this.aliens, this.hitAlien, null, this);
  }

  update() {
    // Move the spaceship
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    // Shoot bullets
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shootBullet();
    }

    // Check if any alien has reached the bottom
    this.aliens.children.iterate((alien) => {
      if (alien && alien.y > 600) {
        this.loseHealth();
        alien.destroy();
      }
    });

    // Check for achievements
    this.checkAchievements();

    // Check and update difficulty based on score
    this.updateDifficulty();
  }

  shootBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 20);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.velocity.y = -900;
      bullet.setDisplaySize(20, 40);
      this.sound.play('shoot');
    }
  }

  spawnAliens() {
    if (this.gameOver) return;

    // Define alien speed based on difficulty level
    let speed;
    if (this.difficulty === 'easy') {
      speed = Phaser.Math.Between(50, 100);  // Easy level alien speed
    } else if (this.difficulty === 'medium') {
      speed = Phaser.Math.Between(100, 150);  // Medium level alien speed
    } else if (this.difficulty === 'hard') {
      speed = Phaser.Math.Between(150, 200);  // Hard level alien speed
    }

    // Determine the number of aliens based on the difficulty
    const alienCount = Phaser.Math.Between(1, this.difficultyLevel + 2);

    for (let i = 0; i < alienCount; i++) {
      const alienX = Phaser.Math.Between(50, 750);
      const alien = this.aliens.create(alienX, 50, 'alien');
      alien.setVelocityY(speed);  // Use the calculated speed
      alien.setDisplaySize(48, 48);
    }
  }

  hitAlien(bullet, alien) {
    bullet.destroy();
    alien.destroy();
    this.sound.play('explosion');

    // Increase score
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // Show a pop-up effect when an alien is destroyed
    this.showPopUpEffect(alien.x, alien.y);
  }

  showPopUpEffect(x, y) {
    const popUp = this.add.text(x, y, '+10', { fontSize: '32px', fill: '#ff0' });
    popUp.setOrigin(0.5);
    this.tweens.add({
      targets: popUp,
      y: y - 50,
      alpha: 0,
      duration: 500,
      onComplete: () => popUp.destroy()
    });
  }

  checkAchievements() {
    if (this.score >= 100 && !this.achievements[100]) {
      this.achievements[100] = true;
      this.achievementIcons[100].setVisible(true);
      this.showAchievementText('Best Alien Destroyer');
    }

    if (this.score >= 500 && !this.achievements[500]) {
      this.achievements[500] = true;
      this.achievementIcons[500].setVisible(true);
      this.showAchievementText('Indestructible');
    }

    if (this.score >= 1000 && !this.achievements[1000]) {
      this.achievements[1000] = true;
      this.achievementIcons[1000].setVisible(true);
      this.showAchievementText("I'm Too Lazy to Give Up");
    }
  }

  showAchievementText(text) {
    const achievementText = this.add.text(400, 300, text, { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.time.delayedCall(2000, () => {
      achievementText.destroy();
    });
  }

  loseHealth() {
    this.health -= 1;
    if (this.health >= 0) {
      this.hearts[this.health].setVisible(false);
    }

    if (this.health === 0) {
      this.gameOver = true;
      this.scene.start('GameOver', { score: this.score });
    }
  }

  updateDifficulty() {
    // Change difficulty when certain scores are reached
    if (this.score >= 100 && this.difficulty === 'easy') {
      this.difficulty = 'medium';
      this.difficultyText.setText('Difficulty: Medium');
      this.difficultyLevel = 2;
    } else if (this.score >= 500 && this.difficulty === 'medium') {
      this.difficulty = 'hard';
      this.difficultyText.setText('Difficulty: Hard');
      this.difficultyLevel = 3;
    }
  }
}

export default AlienInvasion;


