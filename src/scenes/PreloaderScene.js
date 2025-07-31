// src/scenes/PreloaderScene.js

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // --- Display a loading bar ---
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
            this.scene.start('GameScene'); // Start the main game scene
        });

        // --- Load All Game Assets ---

        // 1. World Tileset
        this.load.image('tiles', 'assets/images/tilesets/tiles.png');
        
        // 2. Parallax Background
        this.load.image('background', 'assets/images/backgrounds/background.png');

        // 3. Player Spritesheet (with margin and spacing fix)
        this.load.spritesheet('player', 'assets/images/sprites/characters.png', {
            frameWidth: 24,
            frameHeight: 24,
            margin: 1,
            spacing: 1
        });

        // 4. Sound Effects
        this.load.audio('collect-coin', 'assets/audio/sfx/coin.wav');
    }
}
