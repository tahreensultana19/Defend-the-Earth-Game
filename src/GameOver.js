
class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.win = data.win;
  }

  create() {
    const message = this.win ? 'You Win!' : 'Game Over!';
    this.add.text(200, 250, message, { fontSize: '64px', fill: '#fff' });
    this.add.text(200, 350, 'Press SPACE to Restart', { fontSize: '24px', fill: '#fff' });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('AlienInvasion');
    });
  }
}

export default GameOver;