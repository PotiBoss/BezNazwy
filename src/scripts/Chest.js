import initAnims from './AnimsChest'

export default class Chest extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'treasure');

		initAnims(scene.anims);
		this.anims.play('chest-closed');
	}


	openChest()
	{
		if (this.anims.currentAnim.key !== 'chest-closed')
		{
			return 0
		}
		this.play('chest-open')
	}
}