

export default class ProjectileEnemy extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'projectiles', 3);

		scene.add.existing(this);
 
		this.setScale(0.75, 0.75);

		this.speed = 250;
		//this.maxDistance = 10;
		//this.traveledDistance = 0;
		this.projectileDamage = 10;

	}

	fireProjectile(player)
	{
		this.scene.physics.moveTo(this, player.x, player.y, this.speed);
	}

	circleProjectile(enemy, targetX, targetY)
	{	

		this.scene.physics.moveTo(this, enemy.x + targetX, enemy.y + targetY, this.speed);
	}

}