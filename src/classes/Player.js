export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add the player to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Player physics properties
        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
        this.body.setSize(20, 32); // Adjust hitbox to be tighter

        // Cursors for input
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // Initialize animations
        this.initAnims();
    }

    initAnims() {
        // Create animations if they don't already exist
        if (!this.scene.anims.exists('idle')) {
            this.scene.anims.create({
                key: 'idle',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('run')) {
            this.scene.anims.create({
                key: 'run',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update() {
        // Player Movement Logic
        const speed = 200;

        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true); // Flip sprite to the left
            this.anims.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false); // Normal sprite orientation
            this.anims.play('run', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('idle', true);
        }

        // Jumping
        if (this.cursors.up.isDown && this.body.blocked.down) {
            this.setVelocityY(-380);
        }
    }
}
