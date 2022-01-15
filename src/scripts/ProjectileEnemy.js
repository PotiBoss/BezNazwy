

export default class ProjectileEnemy extends Phaser.Physics.Arcade.Sprite 
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

	fireProjectile(player)
	{
		this.scene.physics.moveTo(this, player.x, player.y, this.speed);
	}

}