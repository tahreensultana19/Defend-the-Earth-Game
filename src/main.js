import MenuScene from './MenuScene.js';
import AlienInvasion from './AlienInvasion.js';
import GameOver from './GameOver.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [MenuScene, AlienInvasion, GameOver], // Both scenes are used
};

const game = new Phaser.Game(config);
