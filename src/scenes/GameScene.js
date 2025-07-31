// src/scenes/GameScene.js
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
    }

    create() {
        // --- Add a Parallax Background ---
        // 'this.add.image' places a static image. 'setScrollFactor' creates the parallax effect.
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2).setScrollFactor(0.25);
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2).setScrollFactor(0.5);

        // --- Create the Tilemap ---
        const map = this.make.tilemap({
            // Correct tile indices: Gem=136, Spike=154, Flag Top=156, Flag Pole=176
            data: [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,156,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,136,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,136,-1,-1,-1, 1, 2, 2, 2, 2, 3,176,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,22,22,22,23,176,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,21,22,23,-1,-1,136,-1,-1, 1, 2, 3,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,176,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,154,154,154,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,176,-1,-1,-1,-1,-1],
                 [ 1, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,176,-1,-1,-1,-1,-1],
                [21,22,22,22,22,23,-1,-1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3,-1,-1,-1,-1,-1,21,22,22,22,22,22,22,22,22,22,22,22,22,22,23,176,-1,-1,-1,-1,-1],
                [21,22,22,22,22,23,-1,-1,21,22,22,22,22,22,22,22,22,23,-1,-1,154,-1,-1,21,22,22,22,22,22,22,22,22,22,22,22,22,22,23,176,-1,-1,-1,-1,-1],
                [21,22,22,22,22,23,-1,-1,21,22,22,22,22,22,22,22,22,23,-1,154,154,154,-1,21,22,22,22,22,22,22,22,22,22,22,22,22,22,23,176,-1,-1,-1,-1,-1]
            ],
            tileWidth: 18,
            tileHeight: 18
        });
        const tileset = map.addTilesetImage('tiles', 'tiles', 18, 18, 1, 1);
        const worldLayer = map.createLayer(0, tileset, 0, 0);
        worldLayer.setScale(2);

        // --- BUG FIX: Set collision ONLY on specific tiles ---
        worldLayer.setCollisionByExclusion([-1, 136, 156, 176]); // Exclude empty space, gems, and flag parts

        // --- Player ---
        this.player = new Player(this, 100, 350);
        this.player.setScale(2);

        // --- Score & UI ---
        this.scoreText = this.add.text(16, 16, 'Gems: 0', { fontSize: '24px', fill: '#FFF', stroke: '#000', strokeThickness: 4 })
            .setScrollFactor(0);

        // --- Collisions ---
        this.physics.add.collider(this.player, worldLayer);
        map.setTileIndexCallback(136, this.collectGem, this); // Correct gem index
        map.setTileIndexCallback(154, this.playerHit, this);   // Spike index
        map.setTileIndexCallback(156, this.playerWin, this);   // Flag top index
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
            tile.layer.tilemapLayer.removeTileAt(tile.x, tile.y);
        }
    }

    playerHit(player, tile) {
        // The callback gives us the player and the tile, so we only act if the tile exists
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
            player.setTint(0x00ff00); // Tint green for victory
            this.scoreText.setText('YOU WIN! Gems: ' + this.score);
            this.cameras.main.fade(1000, 255, 255, 255); // Fade to white
            // After 2 seconds, restart the game
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
