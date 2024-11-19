import MenuScene from './MenuScene.js';
import DefendEarth from './DefendEarth.js';
import GameOver from './GameOver.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [MenuScene, DefendEarth, GameOver], // Both scenes are used
};

const game = new Phaser.Game(config);
