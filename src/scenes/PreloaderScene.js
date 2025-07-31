// src/scenes/PreloaderScene.js
export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // --- Loading Bar, no changes here ---
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('GameScene');
        });

        // --- Load OUR NEW Assets ---
        // Load the world tileset image
        this.load.image('tiles', 'assets/images/tilesets/tiles.png');

        // Load the character spritesheet, specifying its properties
// In src/scenes/PreloaderScene.js

// ... inside the preload() function ...

// Load the character spritesheet, specifying its properties
this.load.spritesheet('player', 'assets/images/sprites/characters.png', {
    frameWidth: 24,
    frameHeight: 24,
    margin: 1,      // <-- THE FIX: 1px margin around the whole sheet
    spacing: 1      // <-- The 1px space between each frame

});

this.load.audio('collect-coin', 'assets/audio/sfx/coin.wav');

    }
}
