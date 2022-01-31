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
		this.msg = [ 
		"Chronos - Embodiment of Time\nWelcome mortal, you must be confused why did we bring you here. You are here because Eldritch God from the cosmos is awakening. You are needed considering you are not bound by the rules of Myths. You must seek the Cosmic Instruments. Only they can return Azathoth to its slumber. No man can stand against Outer Gods. If you were to fail, your task will be given to another. Your race is like sand one might not change anything but thousands... Come to me if you need more guidance. You may also talk to my friend Crius."]
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0], true);
		//"CONTROLS:\nC - opens crafting menu on workbench\nV - crafts potion in crafting menu\nT - teleports on teleporter\nI - opens bigger inventory\nF - drinks a potion"
	}

	secondMsg()
	{
		this.msg2 = ["4", "5", "6"];
		this.dialog.init(this.msg2);
		this.dialog.setText(this.msg2[0], true);
	}

	pressF5()
	{
		this.msg3 = ["Fates - Rulers of Destiny\nYou died but don't give up yet. You can try again to rewrite your fate by pressing the magic button 'F5' or try to REFRESH it"];
		this.dialog.init(this.msg3);
		this.dialog.setText(this.msg3[0], true);
	}

	gameCleared()
	{
		this.msg4 = ["Fates - Rulers of Destiny\nYou found the Celestial Doors... but your journey ends here for now you can try again by the pressing the magic button 'F5' or try to REFRESH your adventure.\nTill next time."];
		this.dialog.init(this.msg4);
		this.dialog.setText(this.msg4[0], true);	
	}

	teleportActivated()
	{
		this.msg5 = ["Chronos - Embodiment of Time\nThe seal of yellow teleport leading to Celestial Instruments was broken. You only have to reach it."];
		this.dialog.init(this.msg5);
		this.dialog.setText(this.msg5[0], true);		
	}
	
	hornyFirst()
	{
		this.msg6 = ["Crius - Titan God of Heavenly Constellations\nYou can use crafting table above us to craft alchemic potions. You can gather herbs during your journey. I am sure you know how to use it."];
		this.dialog.init(this.msg6);
		this.dialog.setText(this.msg6[0], true);	
	}
	
	hornySecond()
	{
		this.msg7 = ["Crius - Titan God of Heavenly Constellations\nI once heard from Chronos about his vision. He told me that if you gather enough essence from killing monsters, portal to Celestial Instrument will open. He also foretold that they are seald behind Celestial Doors."];
		this.dialog.init(this.msg7);
		this.dialog.setText(this.msg7[0], true);	
	}

	hornyThird()
	{
		this.msg8 = ["Crius - Titan God of Heavenly Constellations\nHere are some tips that will help you during your journey. When vital points of monster drop to zero they die. You can't get hurt if you don't get hit. Remember to always be prepared by having potions. God Speed my little one."];
		this.dialog.init(this.msg8);
		this.dialog.setText(this.msg8[0], true);	
	}

	nothornyFirst()
	{
		this.msg9 = ["Chronos - Embodiment of Time\nThanks to the Almighty Gods your realm is not influenced so hardly by Azathoth. Soon it might change. Crius gave us space to bring tears in space and time made by Eldritch God. We call those tear islands. You can move between so called island by using teleports. My farsight tells me that yellow teleport leads to Cosmic Instuments."];
		this.dialog.init(this.msg9);
		this.dialog.setText(this.msg9[0], true);	
	}
	
	nothornySecond()
	{
		this.msg10 = ["Chronos - Embodiment of Time\nWe need you because we god are bound by the rules of Myths. Story of God is writen in Myths and Legends. We cannot break free from our destiny but your race exist by a fluke. That is why stories of humanity beginning are so inconsistent."];
		this.dialog.init(this.msg10);
		this.dialog.setText(this.msg10[0], true);	
	}

	nothornyThird()
	{
		this.msg11 = ["Chronos - Embodiment of Time\nGo forth, future of this world lies in your race hands."];
		this.dialog.init(this.msg11);
		this.dialog.setText(this.msg11[0], true);	
	}

	handlePlayerHealthChanged(health)
	{
		//this.secondMsg();
	}
}