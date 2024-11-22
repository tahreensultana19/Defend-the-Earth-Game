class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.win = data.win || false; // Default to false if not provided
    this.finalScore = data.score || 0; // Display final score
  }

  preload() {
    // Load background image
    this.load.image('gameOverBg', 'assets/GameOver.jpg');
  }

  create() {
    // Add background image
    this.add.image(400, 300, 'gameOverBg').setDisplaySize(800, 600);

    // Display Game Over or You Win text
    const titleText = this.add.text(400, 150, this.win ? 'You Win!' : 'Game Over', {
      fontSize: '64px',
      fill: '#ff4444',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Display final score
    const scoreText = this.add.text(400, 250, `Final Score: ${this.finalScore}`, {
      fontSize: '32px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Add "Restart Game" button
    const restartButtonBox = this.add.rectangle(400, 350, 200, 50, 0xff4444).setInteractive();
    const restartButtonText = this.add.text(400, 350, 'Restart', {
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    restartButtonBox.on('pointerdown', () => {
      this.scene.stop(); // Stop the current scene before starting a new one
      this.scene.start('AlienInvasion', { difficulty: 'medium' }); // Pass any data if necessary
    });

    // Add "Main Menu" button
    const menuButtonBox = this.add.rectangle(400, 450, 200, 50, 0x4444ff).setInteractive();
    const menuButtonText = this.add.text(400, 450, 'Main Menu', {
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    menuButtonBox.on('pointerdown', () => {
      this.scene.stop(); // Stop the current scene
      this.scene.start('MenuScene'); // Start the main menu scene
    });

    // Add hover effect for buttons
    [restartButtonBox, menuButtonBox].forEach((button) => {
      button.on('pointerover', () => {
        button.setFillStyle(0xffffff); // Highlight when hovered
      });
      button.on('pointerout', () => {
        // Revert to original color when not hovered
        button.setFillStyle(button === restartButtonBox ? 0xff4444 : 0x4444ff);
      });
    });
  }

  // Cleanup listeners when leaving the scene
  shutdown() {
    this.input.keyboard.removeAllListeners();
  }
}

export default GameOver;
