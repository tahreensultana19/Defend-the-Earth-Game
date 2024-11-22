export default class WinScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScreen' });
    }

    preload() {
        // Preload the background image and music
        this.load.image('winBackground', 'assets/win_background.jpg'); // Replace with your background image path
        this.load.audio('menuMusic', 'assets/menu_music.mp3'); // Load the same music as MenuScene
    }

    create() {
        const { width, height } = this.scale;

        // Add the background image
        this.add.image(width / 2, height / 2, 'winBackground').setDisplaySize(width, height);

        // Play background music
        this.winMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        this.winMusic.play();

        // Title text
        this.add.text(width / 2, height / 4, 'You Won!', {
            fontSize: '64px',
            color: '#ffcc00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Description text
        this.add.text(width / 2, height / 2.5, 'The Earth is saved from aliens!', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Replay button
        const replayButton = this.createStyledButton(
            width / 2,
            height / 2,
            'Replay',
            () => {
                this.stopMusic();
                this.scene.start('AlienInvasion'); // Replace with your main game scene key
            }
        );

        // Main Menu button
        const menuButton = this.createStyledButton(
            width / 2,
            height / 1.5,
            'Main Menu',
            () => {
                this.stopMusic();
                this.scene.start('MenuScene'); // Replace with your menu scene key
            }
        );
    }

    // Helper function to create styled buttons
    createStyledButton(x, y, text, onClick) {
        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#1a1a1a', // Button background
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
            borderRadius: 10,
            align: 'center',
        }).setOrigin(0.5).setInteractive();

        // Hover effect
        buttonText.on('pointerover', () => {
            buttonText.setStyle({ backgroundColor: '#3333ff', color: '#ffcc00' }); // Highlight on hover
        });

        // Out effect
        buttonText.on('pointerout', () => {
            buttonText.setStyle({ backgroundColor: '#1a1a1a', color: '#ffffff' }); // Restore default
        });

        // Click effect
        buttonText.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonText,
                scale: 0.9, // Shrink slightly on click
                duration: 100,
                yoyo: true, // Return to original size
            });
            onClick();
        });

        return buttonText;
    }

    // Stop the background music
    stopMusic() {
        if (this.winMusic) {
            this.winMusic.stop();
        }
    }
}