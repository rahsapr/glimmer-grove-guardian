// A simple scene for our Phase 1 setup
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // Preload is not needed for this phase as we have no assets
    preload() {}

    // Create is called once when the scene starts
    create() {
        // Create our "player"—a white rectangle
        // Arguments: x, y, width, height, color
        this.player = this.add.rectangle(100, 450, 50, 50, 0xffffff);

        // Add physics to our player
        this.physics.add.existing(this.player);

        // Make sure the player can't go outside the screen
        this.player.body.setCollideWorldBounds(true);

        // Create a static platform for the player to stand on
        // A static group is not affected by gravity or other forces
        const platforms = this.physics.add.staticGroup();
        const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00); // Green ground
        platforms.add(ground);

        // Add collision between the player and the platform
        this.physics.add.collider(this.player, platforms);

        // Set up keyboard input to move the player
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Update is called every frame
    update() {
        // --- Player Movement ---

        // Left movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-200);
        }
        // Right movement
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(200);
        }
        // No horizontal movement
        else {
            this.player.body.setVelocityX(0);
        }

        // Jumping
        // 'touching.down' checks if the player is on a surface
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-400);
        }
    }
}

// The configuration object for our game
const config = {
    type: Phaser.AUTO, // Automatically choose between WebGL or Canvas
    width: 800,
    height: 600,
    parent: 'game-container', // The ID of the div to inject the canvas into
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true // IMPORTANT: Shows physics bodies and velocities
        }
    },
    scene: [GameScene] // The scene(s) to include in the game
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);
