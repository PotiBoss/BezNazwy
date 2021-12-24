
import GameScene from "./scripts/gameScene";

const config = 
{
	width: 960,
	heigth: 540,
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	},
	plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}

const game = new Phaser.Game(config)

game.scene.add('GameScene', GameScene);
game.scene.start('GameScene');