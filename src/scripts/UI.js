import { sceneEvents } from "./EventCommunicator";

export default class UI extends Phaser.Scene
{

	constructor()
	{
		super('UI');	
	}

	preload()
	{
			this.load.scenePlugin({
			key: 'DialogModalPlugin',
			url: 'src/scripts/Dialog.js',
			sceneKey: 'dialog'
		});
	}

	init(scene)
	{
		let { mainScene } = scene;
		this.mainScene = mainScene;
	}

	create()
	{

		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;

		this.welcomeMsg();

		sceneEvents.on('playerDeath', this.pressF5, this);

		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('playerDeath', this.pressF5, this);
		})
	}

	welcomeMsg()
	{
		this.msg = ["STEROWANIE:\nC - opens crafting menu on workbench\nV - crafts potion in crafting menu\nT - teleports on teleport", "I - opens bigger inventory\nF - drinks a potion"];
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0], true);
	}

	secondMsg()
	{
		this.msg2 = ["4", "5", "6"];
		this.dialog.init(this.msg2);
		this.dialog.setText(this.msg2[0], true);
	}

	pressF5()
	{
		this.msg3 = ["Game Over \nPlease refresh this page UwU"];
		this.dialog.init(this.msg3);
		this.dialog.setText(this.msg3[0], true);
	}

	handlePlayerHealthChanged(health)
	{
		this.secondMsg();
	}
}