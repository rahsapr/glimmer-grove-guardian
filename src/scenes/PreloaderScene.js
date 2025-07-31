// src/scenes/PreloaderScene.js

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // --- Display a loading bar (no changes here) ---
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const loadingText = this.make.text({
            x: 400,
            y: 295,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('GameScene');
        });

        // --- Load All Game Assets ---

        // ** THE CRITICAL FIX IS HERE **
        // We must load the world tileset as a SPRITESHEET, not an image,
        // so Phaser knows how to handle the margin and spacing.
        this.load.spritesheet('tiles', 'assets/images/tilesets/tiles.png', {
            frameWidth: 18,
            frameHeight: 18,
            margin: 1,
            spacing: 1
        });
        
        // Parallax Background
        this.load.image('background', 'assets/images/backgrounds/background.png');

        // Player Spritesheet
        this.load.spritesheet('player', 'assets/images/sprites/characters.png', {
            frameWidth: 24,
            frameHeight: 24,
            margin: 1,
            spacing: 1
        });

        // Sound Effects
        this.load.audio('collect-coin', 'assets/audio/sfx/coin.wav');
    }
}
