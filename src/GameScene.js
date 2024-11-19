// class GameScene extends Phaser.Scene {
//   constructor() {
//     super({ key: "GameScene" });
//   }

//   preload() {
//     this.load.image("sky", "assets/bg.png");
//     this.load.image("ground", "assets/platform.png");
//     this.load.image("star", "assets/star.png");
//     this.load.image("dude", "assets/dude.png");
//     this.load.audio("collect", "assets/collect.mp3"); // Placeholder for sound
//   }

//   create() {
//     // Background
//     this.add.image(400, 300, "sky");

//     // Platforms
//     const platforms = this.physics.add.staticGroup();
//     platforms.create(400, 568, "ground").setScale(2).refreshBody();

//     // Player
//     this.player = this.physics.add.sprite(100, 450, "dude");
//     this.player.setBounce(0.2);
//     this.player.setCollideWorldBounds(true);
//     this.physics.add.collider(this.player, platforms);

//     // Stars
//     this.stars = this.physics.add.group({
//       key: "star",
//       repeat: 11,
//       setXY: { x: 12, y: 0, stepX: 70 },
//     });
//     this.stars.children.iterate((star) => {
//       star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
//     });

//     this.physics.add.collider(this.stars, platforms);
//     this.physics.add.overlap(
//       this.player,
//       this.stars,
//       this.collectStar,
//       null,
//       this
//     );

//     // Score display
//     this.score = 0;
//     this.scoreText = this.add.text(16, 16, "Score: 0", {
//       fontSize: "32px",
//       fill: "#fff",
//     });

//     // Cursor keys for movement
//     this.cursors = this.input.keyboard.createCursorKeys();
//   }

//   update() {
//     if (this.cursors.left.isDown) {
//       this.player.setVelocityX(-160);
//     } else if (this.cursors.right.isDown) {
//       this.player.setVelocityX(160);
//     } else {
//       this.player.setVelocityX(0);
//     }

//     if (this.cursors.up.isDown && this.player.body.touching.down) {
//       this.player.setVelocityY(-330);
//     }
//   }

//   collectStar(player, star) {
//     star.disableBody(true, true);
//     this.score += 10;
//     this.scoreText.setText("Score: " + this.score);

//     // Play sound effect (add sound asset in the public/assets folder)
//     this.sound.play("collect");

//     if (this.stars.countActive(true) === 0) {
//       // Win condition: All stars are collected
//       this.scene.start("GameOver", { score: this.score });
//     }
//   }
// }

// export default GameScene;
