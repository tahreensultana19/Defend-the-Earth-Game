class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, score) {
        super(scene, scene.game.config.width / 2, -50, 'alien');
        
        // Bind the shoot method to the class instance
        this.shoot = this.shoot.bind(this);
        
        this.scene = scene;
        this.score = score;
        
        // Add boss to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set boss properties
        this.setScale(2);
        this.health = 100;
        this.maxHealth = 100;
        
        // Movement properties
        this.moveSpeed = 150;
        this.phase = 'entrance';
        
        // Attack properties
        this.projectiles = scene.physics.add.group();
        this.lastShot = 0;
        this.shotDelay = 1000;
        
        // Create health bar
        this.healthBar = scene.add.rectangle(
            this.x,
            this.y - 40,
            100,
            10,
            0xff0000
        );
        
        // Enter animation
        scene.tweens.add({
            targets: this,
            y: 100,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.phase = 'battle';
                this.startAttackPattern();
            }
        });

        // Initialize animations
        if (!scene.anims.exists('bossProjectileAnim')) {
            scene.anims.create({
                key: 'bossProjectileAnim',
                frames: [
                    { key: 'bossProjectile1' },
                    { key: 'bossProjectile2' },
                    { key: 'bossProjectile3' },
                    { key: 'bossProjectile4' },
                    { key: 'bossProjectile5' },
                    { key: 'bossProjectile6' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }

        // Add bullet collider
        scene.physics.add.collider(
            this,
            scene.bullets,
            this.onHit,
            null,
            this
        );
    }
    
    startAttackPattern() {
        // Movement pattern
        this.movePattern = this.scene.tweens.add({
            targets: this,
            x: '+=200',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Start shooting with proper context binding
        this.shootTimer = this.scene.time.addEvent({
            delay: this.shotDelay,
            callback: this.shoot,  // This will now maintain proper context
            callbackScope: this,   // Explicitly set the callback scope
            loop: true
        });
    }

    createProjectile(x, y) {
        const projectile = this.projectiles.create(x, y, 'bossProjectile1');
        projectile.play('bossProjectileAnim');
        projectile.setScale(0.8);
        return projectile;
    }
    
    shoot() {
        if (!this.scene || this.phase !== 'battle') return;
        
        const angles = [-15, 0, 15];
        angles.forEach(angle => {
            const projectile = this.createProjectile(this.x, this.y + 20);
            
            const speed = 300;
            const radians = Phaser.Math.DegToRad(90 + angle);
            projectile.setVelocity(
                Math.cos(radians) * speed,
                Math.sin(radians) * speed
            );
            
            // Use a safe reference to the scene
            const currentScene = this.scene;
            if (currentScene && currentScene.time) {
                currentScene.time.delayedCall(3000, () => {
                    if (projectile && projectile.active) {
                        projectile.destroy();
                    }
                });
            }
        });
        
        // Add collision between projectiles and player if not already added
        if (!this.projectileCollider && this.scene && this.scene.player) {
            this.projectileCollider = this.scene.physics.add.collider(
                this.scene.player,
                this.projectiles,
                (player, projectile) => {
                    projectile.destroy();
                    if (!this.scene.shieldActive) {
                        this.scene.loseHealth();
                    }
                }
            );
        }
    }
    
    onHit(boss, bullet) {
        if (!this.scene) return;
        
        bullet.destroy();
        this.scene.sound.play('explosion');
        
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true
        });
        
        this.health -= 10;
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.setScale(healthPercent, 1);
        
        if (this.health <= 0) {
            this.defeat();
        }
    }
    
    defeat() {
        if (!this.scene) return;
        
        if (this.movePattern) this.movePattern.stop();
        if (this.shootTimer) this.shootTimer.destroy();
        
        this.projectiles.clear(true, true);
        
        if (this.projectileCollider) {
            this.projectileCollider.destroy();
        }
        
        this.scene.tweens.add({
            targets: [this, this.healthBar],
            alpha: 0,
            scale: 2,
            duration: 500,
            onComplete: () => {
                if (!this.scene) return;
                
                this.scene.score += 200;
                this.healthBar.destroy();
                
                // Just destroy the boss - the event handler in AlienInvasion will handle the rest
                this.destroy();
            }
        });
    }
    update() {
        if (!this.scene) return;
        
        this.healthBar.setPosition(this.x, this.y - 40);
        
        this.projectiles.children.each(projectile => {
            if (projectile.y > this.scene.game.config.height) {
                projectile.destroy();
            }
        });
    }
}

export default Boss;