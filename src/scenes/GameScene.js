// src/scenes/GameScene.js
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
    }

    create() {
        // --- Create a more complex Tilemap with multiple layers ---
        const map = this.make.tilemap({
            // Tile indices from your tileset: -1 is empty, 154 is spike, 138 is gem
            data: [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,138,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,138,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,138,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 2, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,138,-1,-1],
                 [ 1, 2, 3,-1,-1, 1, 2, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,-1,-1],
                [21,22,23,-1,-1,21,22,22,22,22,22,23,-1,-1,-1,-1,154,154,154,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                 [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23]
            ],
            tileWidth: 18,
            tileHeight: 18
        });
        const tileset = map.addTilesetImage('tiles', 'tiles', 18, 18, 1, 1); // Use margin and spacing

        // --- Create Layers ---
        const groundLayer = map.createLayer(0, tileset, 0, 0);
        groundLayer.setScale(2);
        groundLayer.setCollisionByProperty({ collides: true }); // A more robust way to set collision
        // Manually set collision on a range of tiles for simplicity
        map.setCollisionBetween(1, 100, true, false, 0); // Ground tiles
        map.setCollision(154, true, false, 0); // Spike tile
        
        // --- Player ---
        this.player = new Player(this, 100, 250);
        this.player.setScale(2);

        // --- Score Text ---
        this.scoreText = this.add.text(16, 16, 'Gems: 0', { fontSize: '32px', fill: '#FFF' })
            .setScrollFactor(0); // Make it stick to the camera

        // --- Collisions ---
        this.physics.add.collider(this.player, groundLayer);
        
        // --- Hazard Collision ---
        // When player hits a spike, call the playerHit method
        this.physics.add.collider(this.player, groundLayer, (player, tile) => {
            if (tile.index === 154) { // Check if the tile is a spike
                this.playerHit(player);
            }
        });

        // --- Collectible Overlap ---
        // Check for overlap with gems and make them collectible
        map.setTileIndexCallback(138, this.collectGem, this); // 138 is the gem index
        this.physics.add.overlap(this.player, groundLayer);

        // --- Camera ---
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);
    }
    
    // --- New methods for game logic ---
    collectGem(player, tile) {
        // Make sure the tile has a parent layer and exists
        if (tile && tile.layer) {
            this.sound.play('collect-coin', { volume: 0.5 });
            this.score += 1;
            this.scoreText.setText('Gems: ' + this.score);
            tile.layer.tilemapLayer.removeTileAt(tile.x, tile.y); // Remove the gem tile
        }
    }

    playerHit(player) {
        // TINT the player red
        player.setTint(0xff0000);
        // PAUSE physics
        this.physics.pause();
        // FADE OUT camera
        this.cameras.main.fadeOut(500, 0, 0, 0);
        // ON FADE COMPLETE, restart the scene
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.score = 0; // Reset score
            this.scene.restart();
        });
    }

    update() {
        this.player.update();
    }
}
