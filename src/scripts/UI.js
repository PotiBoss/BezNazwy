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
		sceneEvents.on('gameCleared', this.gameCleared, this);
		sceneEvents.on('teleportActivated', this.teleportActivated, this);
		sceneEvents.on('hornyFirst', this.hornyFirst, this);
		sceneEvents.on('hornySecond', this.hornySecond, this);
		sceneEvents.on('hornyThird', this.hornyThird, this);
		sceneEvents.on('NothornyFirst', this.nothornyFirst, this);
		sceneEvents.on('NothornySecond', this.nothornySecond, this);
		sceneEvents.on('NothornyThird', this.nothornyThird, this);

		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('playerDeath', this.pressF5, this);
			sceneEvents.off('gameCleared', this.gameCleared, this);
			sceneEvents.off('teleportActivated', this.teleportActivated, this);
		})
	}

	welcomeMsg()
	{
		this.msg = ["STEROWANIE:\nC - opens crafting menu on workbench\nV - crafts potion in crafting menu\nT - teleports on teleporter\nI - opens bigger inventory\nF - drinks a potion"];
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

	gameCleared()
	{
		this.msg4 = ["You Won!\nThanks for playing"];
		this.dialog.init(this.msg4);
		this.dialog.setText(this.msg4[0], true);	
	}

	teleportActivated()
	{
		this.msg5 = ["Teleport activated, now find the yellow teleporter and face the Boss!"];
		this.dialog.init(this.msg5);
		this.dialog.setText(this.msg5[0], true);		
	}
	
	hornyFirst()
	{
		this.msg6 = ["Horny Desu"];
		this.dialog.init(this.msg6);
		this.dialog.setText(this.msg6[0], true);	
	}
	
	hornySecond()
	{
		this.msg7 = ["Horny ."];
		this.dialog.init(this.msg7);
		this.dialog.setText(this.msg7[0], true);	
	}

	hornyThird()
	{
		this.msg8 = ["Horny ja"];
		this.dialog.init(this.msg8);
		this.dialog.setText(this.msg8[0], true);	
	}

	nothornyFirst()
	{
		this.msg9 = ["Not Horny Desu"];
		this.dialog.init(this.msg9);
		this.dialog.setText(this.msg9[0], true);	
	}
	
	nothornySecond()
	{
		this.msg10 = ["Not Horny ."];
		this.dialog.init(this.msg10);
		this.dialog.setText(this.msg10[0], true);	
	}

	nothornyThird()
	{
		this.msg11 = ["Not Horny ja"];
		this.dialog.init(this.msg11);
		this.dialog.setText(this.msg11[0], true);	
	}

	handlePlayerHealthChanged(health)
	{
		this.secondMsg();
	}
}