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
		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		});

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: { x: 20, y: 20, stepX: 32},
			setScale: {x: 2, y: 2},
			quantity: 3 // max hp
		})

		sceneEvents.on('playerHealthChanged', this.handlePlayerHealthChanged, this);

		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('playerHealthChanged', this.handlePlayerHealthChanged, this);
		})

		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;


		//this.welcomeMsg();
	}

	welcomeMsg()
	{
		this.msg = ["1", "2", "3"];
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0],true);

	}

	secondMsg()
	{
		this.msg2 = ["4", "5", "6"];
		console.log(this.msg2)
		this.dialog.init(this.ms2g);
		this.dialog.setText(this.msg2[0],true);
	}

	handlePlayerHealthChanged(health)
	{

		this.secondMsg();


		this.hearts.children.each((gameObject, index) => {
			this.heart = gameObject
			if(index < health)
			{
				this.heart.setTexture('ui-heart-full');
			}
			else 
			{
				this.heart.setTexture('ui-heart-empty');
			}
		})
	}
}