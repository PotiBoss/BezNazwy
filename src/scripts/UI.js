import { sceneEvents } from "./EventCommunicator";

export default class UI extends Phaser.Scene
{

	constructor()
	{
		super('UI');
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