// src/scenes/GameScene.js
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // --- Create the Tilemap ---
        const map = this.make.tilemap({
            // A simple level layout using tile indices from your tileset
            // -1 = empty, 21 = dirt, 1 = grass top
            data: [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1, 1, 2, 3,-1,21,22,23,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,21,22,23,-1,21,22,23,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1],
                 [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23]
            ],
            tileWidth: 18,
            tileHeight: 18
        });

        // Add the tileset image to the map, specifying the 1px spacing
        const tileset = map.addTilesetImage('tiles', 'tiles', 18, 18, 0, 1);
        
        // Create the world layer and scale it up to be more visible
        const worldLayer = map.createLayer(0, tileset, 0, 0);
        worldLayer.setScale(2);

        // Set collision for the layer
        worldLayer.setCollisionByExclusion([-1]);

        // --- Create the Player ---
        // We'll use the green character (frame 0)
        this.player = new Player(this, 200, 100);
        this.player.setScale(2); // Scale the player up too

        // --- Collisions and Camera ---
        this.physics.add.collider(this.player, worldLayer);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, worldLayer.width * 2, worldLayer.height * 2);
    }

    update() {
        this.player.update();
    }
}
