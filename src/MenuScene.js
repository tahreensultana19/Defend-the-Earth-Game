class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Preload background and assets
    this.load.image('spaceBg', 'assets/space_bg.jpg'); // Space-themed background
  }

  create() {
    // Add space background
    this.background = this.add.image(400, 300, 'spaceBg').setDisplaySize(800, 600);

    // Add title with glowing effect
    this.titleText = this.add.text(400, 100, 'Alien Invasion', {
      fontSize: '64px',
      fill: '#ffdd44',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 8,
      shadow: {
        offsetX: 5,
        offsetY: 5,
        color: '#333',
        blur: 20,
        stroke: true,
        fill: true,
      },
    }).setOrigin(0.5);

    // Add "Play" button
    this.playButtonBox = this.add.rectangle(400, 300, 200, 50, 0x4444ff).setInteractive();
    this.playButtonText = this.add.text(400, 300, 'Play', {
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    this.playButtonBox.on('pointerdown', () => {
      this.showDifficultySelection();
      this.playButtonBox.setVisible(false);
      this.playButtonText.setVisible(false);
    });

    // Add tips section
    const tips = [
      'Tip: Use arrow keys to move and spacebar to shoot.',
      'Tip: Collect power-ups to increase your firepower!',
      'Tip: Watch out for aliens dropping bombs!',
    ];
    const randomTip = tips[Phaser.Math.Between(0, tips.length - 1)];
    this.tipsText = this.add.text(400, 570, randomTip, {
      fontSize: '18px',
      fill: '#fff',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0.8);

    // Add hover effects for the "Play" button
    this.playButtonBox.on('pointerover', () => this.playButtonBox.setFillStyle(0x5555ff));
    this.playButtonBox.on('pointerout', () => this.playButtonBox.setFillStyle(0x4444ff));
  }

  showDifficultySelection() {
    // Hide Play screen elements
    this.playButtonBox.setVisible(false);
    this.playButtonText.setVisible(false);
    this.tipsText.setVisible(false);

    // Keep the title visible and glowing
    this.titleText.setText('Alien Invasion');
    this.titleText.setVisible(true);

    // Add title for difficulty selection
    const difficultyTitle = this.add.text(400, 180, 'Select Difficulty', {
      fontSize: '48px',
      fill: '#ffdd44',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Difficulty selection
    const difficulties = ['Easy', 'Medium', 'Hard'];
    this.selectedDifficulty = 'Medium'; // Default difficulty
    this.difficultyButtons = [];

    difficulties.forEach((difficulty, index) => {
      const yPosition = 250 + index * 50;

      const buttonBox = this.add.rectangle(400, yPosition, 200, 50, 0x8888ff).setInteractive();
      const buttonText = this.add.text(400, yPosition, difficulty, {
        fontSize: '24px',
        fill: '#fff',
      }).setOrigin(0.5);

      buttonBox.on('pointerdown', () => {
        this.selectedDifficulty = difficulty;
        this.startGame();
      });

      this.difficultyButtons.push({ box: buttonBox, text: buttonText });
    });

    // Add hover effects for difficulty buttons
    this.difficultyButtons.forEach((button) => {
      button.box.on('pointerover', () => button.box.setFillStyle(0xaaaaee));
      button.box.on('pointerout', () => button.box.setFillStyle(0x8888ff));
    });
  }

  startGame() {
    this.scene.start('AlienInvasion', { difficulty: this.selectedDifficulty.toLowerCase() });
  }
}

export default MenuScene;





