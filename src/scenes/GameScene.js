// src/scenes/GameScene.js
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
    }

    create() {
        // Background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2).setScrollFactor(0.25);

        // Tilemap Setup
        const map = this.make.tilemap({
            data: [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,156,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1, 2, 3,176,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,136,-1,-1,-1,-1,-1,-1,154,154,154,-1,-1,-1,-1,-1,-1,-1,-1,21,22,23,176,-1,-1],
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
        
        // Now that the 'tiles' key points to a pre-sliced spritesheet, this line works correctly.
        const tileset = map.addTilesetImage('tiles');
        const worldLayer = map.createLayer(0, tileset, 0, 0);
        worldLayer.setScale(2);
        
        // Set collisions on the ground tiles
        worldLayer.setCollisionBetween(0, 45);

        // Player
        this.player = new Player(this, 100, 300);
        this.player.setScale(2);

        // UI
        this.scoreText = this.add.text(16, 16, 'Gems: 0', { fontSize: '24px', fill: '#FFF', stroke: '#000', strokeThickness: 4 })
            .setScrollFactor(0);

        // Physics and Triggers
        this.physics.add.collider(this.player, worldLayer);
        map.setTileIndexCallback([136, 154, 156], this.handleTileTrigger, this);
        this.physics.add.overlap(this.player, worldLayer);
        
        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);
    }
    
    // A single, cleaner function to handle all tile triggers
    handleTileTrigger(player, tile) {
        if (!tile) return;

        switch (tile.index) {
            case 136: // Gem
                this.collectGem(player, tile);
                break;
            case 154: // Spike
                this.playerHit(player, tile);
                break;
            case 156: // Flag
                this.playerWin(player, tile);
                break;
        }
    }

    collectGem(player, tile) {
        if (tile.layer) {
            this.sound.play('collect-coin', { volume: 0.5 });
            this.score++;
            this.scoreText.setText('Gems: ' + this.score);
            tile.layer.tilemapLayer.removeTileAt(tile.x, tile.y);
        }
    }

    playerHit(player, tile) {
        player.setTint(0xff0000);
        this.physics.pause();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.score = 0;
            this.scene.restart();
        });
    }

    playerWin(player, tile) {
        this.physics.pause();
        player.setTint(0x00ff00);
        this.scoreText.setText('YOU WIN! Gems: ' + this.score);
        this.cameras.main.fade(1000, 255, 255, 255);
        this.time.delayedCall(2000, () => {
            this.score = 0;
            this.scene.restart();
        });
    }

    update() {
        this.player.update();
    }
}
