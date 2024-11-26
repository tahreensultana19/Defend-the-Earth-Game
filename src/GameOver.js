class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.win = data.win || false; // Default to false if not provided
    this.finalScore = data.score || 0; // Display final score
  }

  preload() {
    // Load background image and music
    this.load.image('gameOverBg', 'assets/GameOver1.jpg');
    this.load.audio('gameOverMusic', 'assets/game_over_music.mp3'); // Replace with your music file
  }

  create() {
    // Add background image
    this.add.image(400, 300, 'gameOverBg').setDisplaySize(800, 600);

    // Play background music
    this.gameOverMusic = this.sound.add('gameOverMusic', { loop: true, volume: 0.5 });
    this.gameOverMusic.play();

    // Add enhanced title
    const titleText = this.add.text(400, 150, this.win ? 'You Win!' : 'Game Over', {
      fontSize: '72px',
      fontFamily: 'Georgia',
      fontStyle: 'bold',
      fill: this.win ? '#32cd32' : '#ff4500', // Green for win, red for game over
      stroke: '#000000', // Black stroke
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .setShadow(5, 5, '#000000', 10, false, true) // Outer shadow
      .setShadow(0, 0, '#ff6347', 15, true, false); // Glowing effect

    // Add description text
    const descriptionText = this.add.text(400, 210, 'Mission Failed: Aliens have taken over Earth.', {
      fontSize: '28px',
      fontFamily: 'Verdana',
      fill: '#ffffff', // White text
      stroke: '#000000', // Black stroke
      strokeThickness: 5,
      align: 'center',
    }).setOrigin(0.5);

    // Display final score
    const scoreText = this.add.text(400, 270, `Final Score: ${this.finalScore}`, {
      fontSize: '32px',
      fontFamily: 'Courier New',
      fill: '#FFD700', // Gold text
      stroke: '#000000', // Black stroke
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Add buttons with themed design
    this.createButton(400, 350, 'Restart', 0xff4500, () => {
      this.stopMusic();
      this.scene.start('AlienInvasion', { difficulty: 'challenger' }); // Restart the game
    });

    this.createButton(400, 450, 'Main Menu', 0x4169e1, () => {
      this.stopMusic();
      this.scene.start('MenuScene'); // Return to the menu
    });
  }

  // Helper method to create buttons
  createButton(x, y, text, color, onClick) {
    const buttonBox = this.add.rectangle(x, y, 220, 60, color, 0.8).setInteractive();
    buttonBox.setStrokeStyle(3, 0x000000); // Black outline

    const buttonText = this.add.text(x, y, text, {
      fontSize: '28px',
      fontFamily: 'Verdana',
      fill: '#ffffff', // White text
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Add hover effects
    buttonBox.on('pointerover', () => {
      buttonBox.setFillStyle(0x32cd32); // Highlight with lime green
      buttonText.setStyle({ fill: '#000000' }); // Black text on hover
    });

    buttonBox.on('pointerout', () => {
      buttonBox.setFillStyle(color); // Revert to original color
      buttonText.setStyle({ fill: '#ffffff' }); // White text
    });

    buttonBox.on('pointerdown', () => {
      onClick();
    });
  }

  // Stop the background music
  stopMusic() {
    if (this.gameOverMusic) {
      this.gameOverMusic.stop();
    }
  }

  shutdown() {
    this.input.keyboard.removeAllListeners(); // Cleanup keyboard listeners
    this.stopMusic(); // Stop music when leaving the scene
  }
}

export default GameOver;
