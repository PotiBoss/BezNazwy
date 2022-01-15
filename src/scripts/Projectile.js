

export default class Projectile extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'projectile');

		scene.add.existing(this);

		this.speed = 250;
		//this.maxDistance = 10;
		//this.traveledDistance = 0;
		this.projectileDamage = 10;

	}

	fireProjectile(initiator, pointer)
	{
		this.scene.physics.moveTo(this, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY, this.speed);
	}

}