export default class Workbench extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'workbench');

		this.setScale(1.5)
	}
}