
import GameScene from "./scripts/gameScene";
import SceneInventory from "./scripts/SceneInventory";
import UI from "./scripts/UI";
import SceneCrafting from "./scripts/SceneCrafting";

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
	scene: [GameScene, UI, SceneInventory, SceneCrafting],
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

//game.scene.add('GameScene', GameScene);

//asgame.scene.start('GameScene');