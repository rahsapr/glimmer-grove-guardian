// src/scenes/GameScene.js
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
    }

    create() {
        // --- Background ---
        // This is working correctly, no changes needed here.
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2).setScrollFactor(0.25);
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2).setScrollFactor(0.5);

        // --- Tilemap Setup ---
        const map = this.make.tilemap({
            // A fresh level layout using the correct tile indices.
            // Gem = 136, Spike = 154, Flag Top = 156, Flag Pole = 176
            data: [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,156,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,176,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,136,-1,-1,-1,154,154,154,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,176,-1,-1],
                [-1,-1,-1,136,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1, 1, 2, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,176,-1,-1],
                [-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,21,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,176,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,136,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,176,-1,-1],
                 [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,176,-1,-1],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,23,-1,-1,-1,-1,154,154,154,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,176,-1,-1],
                [21,22,22,22,22,22,22,22,22,22,22,22,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,176,-1,-1]
            ],
            tileWidth: 18,
            tileHeight: 18
        });
        const tileset = map.addTilesetImage('tiles', 'tiles', 18, 18, 1, 1);
        const worldLayer = map.createLayer(0, tileset, 0, 0);
        worldLayer.setScale(2);

        // --- **THE BIG FIX** ---
        // 1. Tell Phaser which tiles should be solid walls.
        // We will specify the ground and dirt blocks directly.
        worldLayer.setCollisionBetween(0, 45); // Set all ground/dirt tiles to be collidable

        // 2. Explicitly make our trigger tiles NON-colliding.
        map.setCollision(136, false, true, 0); // Gem
        map.setCollision(154, false, true, 0); // Spike
        map.setCollision(156, false, true, 0); // Flag Top
        map.setCollision(176, false, true, 0); // Flag Pole

        // --- Player ---
        this.player = new Player(this, 100, 300);
        this.player.setScale(2);

        // --- UI ---
        this.scoreText = this.add.text(16, 16, 'Gems: 0', { fontSize: '24px', fill: '#FFF', stroke: '#000', strokeThickness: 4 })
            .setScrollFactor(0);

        // --- Collisions & Triggers ---
        // This is for solid collisions (player vs. ground)
        this.physics.add.collider(this.player, worldLayer);
        
        // These are for triggers (player overlapping specific tiles)
        // By setting collision to 'false' above, these overlap checks will now work perfectly.
        map.setTileIndexCallback(136, this.collectGem, this);
        map.setTileIndexCallback(154, this.playerHit, this);
        map.setTileIndex-Callback(156, this.playerWin, this);
        this.physics.add.overlap(this.player, worldLayer);
        
        // --- Camera ---
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);
    }

    collectGem(player, tile) {
        if (tile && tile.layer) {
            this.sound.play('collect-coin', { volume: 0.5 });
            this.score++;
            this.scoreText.setText('Gems: ' + this.score);
            // This line removes the tile from the map after collection
            tile.layer.tilemapLayer.removeTileAt(tile.x, tile.y);
        }
    }

    playerHit(player, tile) {
        if (tile) {
            player.setTint(0xff0000);
            this.physics.pause();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.score = 0;
                this.scene.restart();
            });
        }
    }

    playerWin(player, tile) {
        if (tile) {
            this.physics.pause();
            player.setTint(0x00ff00);
            this.scoreText.setText('YOU WIN! Gems: ' + this.score);
            this.cameras.main.fade(1000, 255, 255, 255);
            this.time.delayedCall(2000, () => {
                this.score = 0;
                this.scene.restart();
            });
        }
    }

    update() {
        this.player.update();
    }
}
