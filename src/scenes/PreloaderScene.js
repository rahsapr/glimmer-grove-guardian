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
        // ... (rest of loading bar code is fine) ...
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('GameScene');
        });

        // --- Load All Game Assets ---

        // ** THE FIRST PART OF THE FIX **
        // Load the tileset as a single IMAGE.
        this.load.image('tiles', 'assets/images/tilesets/tiles.png');
        
        // Load other assets as before
        this.load.image('background', 'assets/images/backgrounds/background.png');
        this.load.spritesheet('player', 'assets/images/sprites/characters.png', {
            frameWidth: 24, frameHeight: 24, margin: 1, spacing: 1
        });
        this.load.audio('collect-coin', 'assets/audio/sfx/coin.wav');
    }
}
