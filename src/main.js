import PreloaderScene from './scenes/PreloaderScene.js';
import GameScene from './scenes/GameScene.js';

// The configuration object for our game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480, // Adjusted height for a 16:10 aspect ratio
    parent: 'game-container',
    backgroundColor: '#1d212d', // A dark blue/grey for the background
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            // debug: true // Set to true to see physics boxes
        }
    },
    // The scenes are now imported and listed here
    scene: [PreloaderScene, GameScene]
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);
