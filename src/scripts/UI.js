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

	create()
	{
		sceneEvents.on('playerHealthChanged', this.handlePlayerHealthChanged, this);

		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('playerHealthChanged', this.handlePlayerHealthChanged, this);
		})

		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;


		this.welcomeMsg();
	}

	welcomeMsg()
	{
		this.msg = ["1", "2", "3"];
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0], true);

	}

	secondMsg()
	{
		this.msg2 = ["4", "5", "6"];
		this.dialog.init(this.msg2);
		this.dialog.setText(this.msg2[0], true);
	}

	handlePlayerHealthChanged(health)
	{

		this.secondMsg();


	}
}