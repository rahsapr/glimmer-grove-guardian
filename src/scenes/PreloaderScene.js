export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Display a loading bar
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
            this.scene.start('GameScene'); // Start the main game scene
        });

        // Load our assets
        this.load.image('tiles', 'assets/images/tilesets/grove-tileset.png');
        this.load.spritesheet('player', 'assets/images/sprites/glimmer-sprite.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }
}
