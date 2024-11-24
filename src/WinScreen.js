export default class WinScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScreen' });
        this.level = ''; // To store the level information
        this.score = 0; // To store the winning score
        this.difficulty = ''; // To store the difficulty level
    }

    preload() {
        this.load.image('winBackground', 'assets/win_background.jpg'); // Background image for the win screen
        this.load.audio('menuMusic', 'assets/menu_music.mp3'); // Background music
    }

    init(data) {
        // Get the data passed from the AlienInvasion scene
        this.level = data.level || 'beginner'; // Default to 'beginner' if no level passed
        this.score = data.score || 0; // Default to 0 score if no score passed
        this.difficulty = data.difficulty || 'Beginner'; // Default to 'Beginner' difficulty if none passed

        console.log(WinScreen -`Level: ${this.level}, Score: ${this.score}, Difficulty: ${this.difficulty}`);
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

        // Display the score
        this.add.text(width / 2, height / 2, `Score: ${this.score}`, {
            fontSize: '40px',
            color: '#ffcc00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Display the difficulty
        this.add.text(width / 2, height / 1.8, `Difficulty: ${this.difficulty}`, {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Replay button
        const replayButton = this.createStyledButton(
            width / 2,
            height / 1.5,
            'Replay',
            () => {
                this.stopMusic();
                this.scene.start('AlienInvasion', { level: this.level, difficulty: this.difficulty });
            }
        );

        // Main Menu button
        const menuButton = this.createStyledButton(
            width / 2,
            height / 1.25,
            'Main Menu',
            () => {
                this.stopMusic();
                this.scene.start('MenuScene');
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

    stopMusic() {
        if (this.winMusic) {
            this.winMusic.stop();
        }
    }
}