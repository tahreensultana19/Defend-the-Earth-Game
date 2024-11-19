import AlienInvasion from './AlienInvasion.js';
import GameOver from './GameOver.js';
import MenuScene from './MenuScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [AlienInvasion, GameOver,MenuScene]  // Define your scenes here
};

const game = new Phaser.Game(config);
