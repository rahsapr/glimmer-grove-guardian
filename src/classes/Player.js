// src/classes/Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the 'player' texture key, start with frame 0 (green character idle)
        super(scene, x, y, 'player', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);

        // Adjust hitbox to be tighter for the 24x24 sprite
        this.body.setSize(16, 22).setOffset(4, 2);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.initAnims();
    }

    initAnims() {
        // Animations for the green character
        if (!this.scene.anims.exists('idle')) {
            this.scene.anims.create({
                key: 'idle',
                frames: [{ key: 'player', frame: 0 }], // Frame 0 is idle
                frameRate: 1,
            });
        }
        if (!this.scene.anims.exists('run')) {
            this.scene.anims.create({
                key: 'run',
                // Frame 1 is the running frame
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [0, 1] }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    update() {
        const speed = 250;
        const onGround = this.body.blocked.down;

        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
            if (onGround) this.anims.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
            if (onGround) this.anims.play('run', true);
        } else {
            this.setVelocityX(0);
            if (onGround) this.anims.play('idle', true);
        }

        if (this.cursors.up.isDown && onGround) {
            this.setVelocityY(-400);
        }
        
        // Show a "jumping" frame if in the air
        if (!onGround) {
            this.setTexture('player', 1);
        }
    }
}
