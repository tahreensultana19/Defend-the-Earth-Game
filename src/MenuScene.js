class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      // Load assets for the menu (background, button images, etc.)
      this.load.image('sky', 'assets/bg.png');
      this.load.image('button', 'assets/button.png'); // Button image for selecting difficulty
    }
  
    create() {
      // Add background image
      this.add.image(400, 300, 'sky');
  
      // Title text
      const title = this.add.text(400, 100, 'Alien Invasion', {
        fontSize: '48px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      // Instructions text
      const instructions = this.add.text(400, 180, 'Select Difficulty', {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      // Easy difficulty button
      const easyButton = this.add.sprite(400, 250, 'button').setInteractive();
      easyButton.on('pointerdown', () => {
        this.startGame('easy');
      });
      this.add.text(400, 240, 'Easy', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  
      // Medium difficulty button
      const mediumButton = this.add.sprite(400, 350, 'button').setInteractive();
      mediumButton.on('pointerdown', () => {
        this.startGame('medium');
      });
      this.add.text(400, 340, 'Medium', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  
      // Hard difficulty button
      const hardButton = this.add.sprite(400, 450, 'button').setInteractive();
      hardButton.on('pointerdown', () => {
        this.startGame('hard');
      });
      this.add.text(400, 440, 'Hard', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }
  
    startGame(difficulty) {
      // Start the game scene and pass the selected difficulty level
      this.scene.start('AlienInvasion', { difficulty });
    }
  }
  
  export default MenuScene;
  
  