
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
	}
}

const game = new Phaser.Game(config)

game.scene.add('GameScene', GameScene);
game.scene.start('GameScene');