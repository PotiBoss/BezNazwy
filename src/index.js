
import GameScene from "./scripts/gameScene";
import SceneInventory from "./scripts/SceneInventory";
import UI from "./scripts/UI";
import SceneCrafting from "./scripts/SceneCrafting";
import ScenePreload from "./scripts/ScenePreload";
import SceneMenu from "./scripts/SceneMenu";

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
	scene: [ScenePreload, SceneMenu, GameScene, UI, SceneInventory, SceneCrafting],
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

//game.scene.start('GameScene');