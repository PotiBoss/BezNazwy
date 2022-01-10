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

		this.dialog.init();
		this.dialog.setText('OwO Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. UwU 2137', true);
	}

	handlePlayerHealthChanged(health)
	{
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