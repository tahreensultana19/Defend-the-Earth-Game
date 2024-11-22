import MenuScene from './MenuScene.js';
import GameOver from './GameOver.js';
import AlienInvasion from './AlienInvasion.js';
import WinScreen from './WinScreen.js'; 
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [MenuScene, AlienInvasion, GameOver, WinScreen], 
};

const game = new Phaser.Game(config);
