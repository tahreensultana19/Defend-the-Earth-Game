class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Preload background and assets
    this.load.image('spaceBg', 'assets/space_bg.jpg'); // Space-themed background
    this.load.audio('menuMusic', 'assets/menu_musicnew.mp3'); // Add your music file
  }

  create() {
    // Add sky background
    this.background = this.add.image(400, 300, 'spaceBg').setDisplaySize(800, 600);

    // Play menu music
    this.menuMusic = this.sound.add('menuMusic', { loop: true,});
    this.menuMusic.setVolume(0.1);
    this.menuMusic.play();
    this.menuMusic.setRate(2.0)

    // Add title with floating effect and shadows
    this.titleText = this.add.text(400, 100, 'DEFENDER OF EARTH', {
      fontSize: '60px',
      fontFamily: 'Georgia',
      fontStyle: 'italic bold',
      fill: '#ff8800', // Bright orange text
      stroke: '#000000', // Black stroke
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .setShadow(5, 5, '#000000', 10, false, true)
      .setShadow(0, 0, '#ff4500', 15, true, false); 

    // Add floating effect to title
    this.tweens.add({
      targets: this.titleText,
      y: { from: 100, to: 120 }, 
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Add description text
    this.descriptionText = this.add.text(400, 180, 'Aliens are attacking! You are the only hope.', {
      fontSize: '28px',
      fontFamily: 'Verdana',
      fontStyle: 'bold',
      fill: '#ffffff', // White text
      stroke: '#000000', // Black stroke
      strokeThickness: 5,
    })
      .setOrigin(0.5);

    // Add animated "Play" button with glassmorphism effect
    this.playButtonBox = this.add.rectangle(400, 300, 220, 60, 0xffffff, 0.2).setInteractive(); // Semi-transparent white
    this.playButtonBox.setStrokeStyle(3.5, 0x000000, 0.8); // Border with black tint
    this.playButtonText = this.add.text(400, 300, 'PLAY', {
      fontSize: '28px',
      fontFamily: 'Verdana',
      fill: '#444444', // Darker text color
      fontStyle: 'bold',
      shadow: { blur: 10, color: '#a1d8f2', fill: true }, // Soft blue glow
    }).setOrigin(0.5);

    // Button animation (scale pulsing effect)
    this.tweens.add({
      targets: this.playButtonBox,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.playButtonBox.on('pointerdown', () => {
      this.showDifficultySelection();
    });

    // Hover effects for the "Play" button
    this.playButtonBox.on('pointerover', () => this.onButtonHover(this.playButtonBox, this.playButtonText, 0.4));
    this.playButtonBox.on('pointerout', () => this.onButtonOut(this.playButtonBox, this.playButtonText));

    // Add tips section with a neon glow
    const tips = [
      'Tip: Shields block, but skill wins battles!',
      'Tip: Precision shots score big rewards!',
      'Tip: Stay sharp—enemies adapt fast!',
      'Tip: Power-ups can turn the tide!',
      'Tip: Dodge, aim, and dominate the sky!',
    ];

    const randomTip = tips[Phaser.Math.Between(0, tips.length - 1)];
    this.tipsText = this.add.text(400, 570, randomTip, {
      fontSize: '25px',
      fontFamily: 'Courier New',
      fill: '#FFD700',
      fontStyle: ' bold italic',
    }).setOrigin(0.5);

    // Neon glow effect for tips
    this.tweens.add({
      targets: this.tipsText,
      alpha: { from: 0.8, to: 1 },
      color: '#FFFF00',
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });
  }

  onButtonHover(button, text, alpha = 0.3) {
    button.setFillStyle(0x89cff0, alpha); // Highlight button with brighter fill
    text.setFill('#ffffe0'); // Change text to white on hover
    text.setShadow(0, 0, '#ffffff', 15, true, true); // Stronger text glow
  }

  onButtonOut(button, text) {
    button.setFillStyle(0xffffff, 0.2); // Reset to glassy appearance
    text.setFill('#000000'); // Reset text to darker color
    text.setShadow(0, 0, '#a1d8f2', 10, true, true); // Subtle shadow glow
  }

  showDifficultySelection() {
    // Hide Play screen elements
    // this.menuMusic.stop(); // Stop menu music when transitioning
    this.playButtonBox.setVisible(false);
    this.playButtonText.setVisible(false);
    this.tipsText.setVisible(false);
    this.descriptionText.setVisible(false);

    // Keep the title visible
    this.titleText.setVisible(true);

    // Add title for difficulty selection with a new text
    const difficultyTitle = this.add.text(400, 180, 'Pick Your Challenge', {
      fontSize: '48px',
      fill: '#ff8800', // Bright orange text
      stroke: '#ffffff',
      strokeThickness: 9,
    }).setOrigin(0.5);

    // Difficulty selection buttons with glassmorphism
    const difficulties = ['Beginner', 'Challenger', 'Expert'];
    this.difficultyButtons = [];

    difficulties.forEach((difficulty, index) => {
      const yPosition = 250 + index * 80;

      const buttonBox = this.add.rectangle(400, yPosition, 220, 60, 0xffffff, 0.10).setInteractive();
      buttonBox.setStrokeStyle(3.5, 0x000000, 0.8); // Black border
      const buttonText = this.add.text(400, yPosition, difficulty, {
        fontSize: '25px',
        fill: '#000000', // Darker text color for difficulty buttons
        fontStyle: 'bold', // Bold text
      }).setOrigin(0.5);

      buttonBox.on('pointerdown', () => {
        this.menuMusic.stop();
        this.scene.start('AlienInvasion', { difficulty: difficulty.toLowerCase() });
      });

      buttonBox.on('pointerover', () => this.onButtonHover(buttonBox, buttonText));
      buttonBox.on('pointerout', () => this.onButtonOut(buttonBox, buttonText));

      this.difficultyButtons.push({ box: buttonBox, text: buttonText });
    });
  }
}

export default MenuScene;
