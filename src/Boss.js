
// export default class Boss extends Phaser.GameObjects.Sprite {
//   constructor(scene, x, y, texture, health = 100) {
//     super(scene, x, y, texture); // Call parent constructor
//     this.scene = scene; // Store scene context
//     this.health = health; // Boss health
//     this.setOrigin(0.5);
//     this.setScale(0.5);

//     // Add the sprite to the scene
//     scene.add.existing(this);

//     // Create health bar
//     this.healthBar = this.scene.add.(graphics);
//     this.updateHealthBar();

//     // Boss actions (e.g., attack patterns) can go here
//   }

//   updateHealthBar() {
//     this.healthBar.clear();
//     this.healthBar.fillStyle(0xff0000, 1);
//     const healthBarWidth = 200 * (this.health / 100);
//     this.healthBar.fillRect(this.x - 100, this.y - 50, healthBarWidth, 10);
//   }

//   takeDamage(damage) {
//     this.health -= damage;
//     this.updateHealthBar();
//     if (this.health <= 0) {
//       this.die();
//     }
//   }

//   die() {
//     this.healthBar.destroy();
//     this.destroy();
//     console.log("Boss defeated!");
//   }
// }
