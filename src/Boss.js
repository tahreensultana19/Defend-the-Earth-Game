class Boss extends Phaser.GameObjects.Sprite {
  constructor(scene, score) {
    super(scene, scene.game.config.width / 2, -50, "alien");

    this.events = new Phaser.Events.EventEmitter();

    this.scene = scene;
    this.score = score;

    // Set boss health based on score
    this.maxHealth = this.calculateHealth(score);
    this.health = this.maxHealth;
    this.bulletDamage = 5;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Fix physics body
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    this.setScale(2);
    this.isInvulnerable = false;

    this.moveSpeed = 150;
    this.phase = "entrance";

    this.projectiles = scene.physics.add.group({
      allowGravity: false,
    });

    // Add collision between projectiles and player
    scene.physics.add.collider(
      scene.player,
      this.projectiles,
      this.hitPlayer,
      null,
      this
    );

    this.lastShot = 0;
    this.shotDelay = 1000;

    // Create health bar container
    this.healthBarWidth = 100;
    this.healthBarHeight = 10;

    this.healthBarBackground = scene.add.rectangle(
      this.x,
      this.y - 40,
      this.healthBarWidth,
      this.healthBarHeight,
      0x333333
    );

    this.healthBar = scene.add.rectangle(
      this.x - this.healthBarWidth / 2,
      this.y - 40,
      this.healthBarWidth,
      this.healthBarHeight,
      0x00ff00
    );
    this.healthBar.setOrigin(0, 0.5);

    this.debugText = scene.add.text(10, 50, "", {
      fontSize: "16px",
      fill: "#fff",
    });

    // Entrance animation using physics instead of tween
    this.body.reset(scene.game.config.width / 2, -50);
    this.body.setVelocityY(100);

    // Check for reaching battle position
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.y >= 100 && this.phase === "entrance") {
          this.body.setVelocityY(0);
          this.y = 100;
          this.phase = "battle";
          this.startAttackPattern();
        }
      },
      loop: true,
    });

    if (!scene.anims.exists("bossProjectileAnim")) {
      scene.anims.create({
        key: "bossProjectileAnim",
        frames: [
          { key: "bossProjectile1" },
          { key: "bossProjectile2" },
          { key: "bossProjectile3" },
          { key: "bossProjectile4" },
          { key: "bossProjectile5" },
          { key: "bossProjectile6" },
        ],
        frameRate: 12,
        repeat: -1,
      });
    }
  }

  // Calculate boss health based on score
  calculateHealth = (score) => {
    let baseHealth = 100;

    if (score >= 1000) {
      baseHealth = 200; // More health at higher scores
    }
    if (score >= 1500) {
      baseHealth = 300; // Even more health at very high scores
    }

    return baseHealth;
  };

  // Handle player collision with boss projectiles
  hitPlayer = (player, projectile) => {
    if (!this.scene.shieldActive) {
      // Check if player's shield is active
      projectile.destroy();
      this.scene.loseHealth(); // This will reduce player health by 1
    } else {
      projectile.destroy(); // Just destroy projectile if shield is active
    }
  };

  startAttackPattern = () => {
    this.moveDirection = 1;
    this.body.setVelocityX(this.moveSpeed);

    this.moveTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.x >= this.scene.game.config.width - 50) {
          this.moveDirection = -1;
          this.body.setVelocityX(-this.moveSpeed);
        } else if (this.x <= 50) {
          this.moveDirection = 1;
          this.body.setVelocityX(this.moveSpeed);
        }
      },
      loop: true,
    });

    this.shootTimer = this.scene.time.addEvent({
      delay: this.shotDelay,
      callback: this.shoot,
      loop: true,
    });
  };

  shoot = () => {
    if (!this.scene || this.phase !== "battle") return;

    const angles = [-30, 0, 30];
    angles.forEach((angle) => {
      const projectile = this.createProjectile(this.x, this.y + 20);

      const speed = 300;
      const radians = Phaser.Math.DegToRad(90 + angle);
      projectile.setVelocity(
        Math.cos(radians) * speed,
        Math.sin(radians) * speed
      );

      if (this.scene && this.scene.time) {
        this.scene.time.delayedCall(3000, () => {
          if (projectile && projectile.active) {
            projectile.destroy();
          }
        });
      }
    });
  };

  // Rest of the methods remain the same...
  createProjectile = (x, y) => {
    const projectile = this.projectiles.create(x, y, "bossProjectile1");
    projectile.play("bossProjectileAnim");
    projectile.setScale(0.8);
    projectile.setAngle(90);
    return projectile;
  };

  takeDamage = (amount) => {
    if (this.isInvulnerable || this.phase !== "battle") return;

    this.health -= amount;

    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    this.updateHealthBar();

    if (this.health <= 0) {
      this.defeat();
    }
  };

  // Keep the rest of the methods the same...
  onHit = (bullet) => {
    if (this.phase !== "battle" || this.isInvulnerable) return;

    bullet.destroy();
    this.scene.sound.play("explosion");
    this.takeDamage(this.bulletDamage);
  };

  updateHealthBar = () => {
    if (!this.scene) return;

    const healthPercent = Math.max(0, this.health) / this.maxHealth;
    this.healthBar.width = this.healthBarWidth * healthPercent;

    this.debugText.setText(
      `Boss Health: ${Math.round(this.health)}/${this.maxHealth}`
    );

    let color;
    if (healthPercent > 0.6) {
      color = 0x00ff00;
    } else if (healthPercent > 0.3) {
      color = 0xffff00;
    } else {
      color = 0xff0000;
    }
    this.healthBar.setFillStyle(color);
  };

  defeat = () => {
    if (!this.scene || this.phase === "defeated") return;

    this.phase = "defeated";
    this.isInvulnerable = true;

    this.body.setVelocity(0, 0);
    if (this.moveTimer) this.moveTimer.destroy();
    if (this.shootTimer) this.shootTimer.destroy();
    this.projectiles.clear(true, true);

    this.scene.tweens.add({
      targets: [this, this.healthBarBackground, this.healthBar],
      alpha: 0,
      rotation: 2,
      scaleX: 0,
      scaleY: 0,
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        if (!this.scene) return;

        this.scene.score += 100;
        this.healthBarBackground.destroy();
        this.healthBar.destroy();
        this.debugText.destroy();

        this.events.emit("destroy");
        this.destroy();
      },
    });
  };

  update = () => {
    if (!this.scene) return;

    this.healthBarBackground.setPosition(this.x, this.y - 40);
    this.healthBar.setPosition(this.x - this.healthBarWidth / 2, this.y - 40);

    this.projectiles.children.each((projectile) => {
      if (projectile.y > this.scene.game.config.height) {
        projectile.destroy();
      }
    });
  };
}

export default Boss;
