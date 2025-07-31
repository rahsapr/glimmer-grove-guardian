// src/classes/Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
        this.body.setSize(16, 22).setOffset(4, 2);

        // --- NEW: Jump tracking properties ---
        this.jumpCount = 0;
        this.jumpMax = 2; // Set how many jumps we allow

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.initAnims();
    }

    initAnims() {
        if (!this.scene.anims.exists('idle')) {
            this.scene.anims.create({
                key: 'idle',
                frames: [{ key: 'player', frame: 0 }],
                frameRate: 1,
            });
        }
        if (!this.scene.anims.exists('run')) {
            this.scene.anims.create({
                key: 'run',
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [0, 1] }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    update() {
        const speed = 250;
        const onGround = this.body.blocked.down;
        
        // Reset jump count when on the ground
        if (onGround) {
            this.jumpCount = 0;
        }

        // --- Horizontal Movement ---
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

        // --- JUMPING LOGIC ---
        // Use JustDown to detect a single press
        const didPressJump = Phaser.Input.Keyboard.JustDown(this.cursors.up);

        if (didPressJump && this.jumpCount < this.jumpMax) {
            this.jumpCount++;
            this.setVelocityY(-350); // The jump force
        }
        
        // Show a "jumping" frame if in the air
        if (!onGround) {
            this.setTexture('player', 1);
        }
    }
}
