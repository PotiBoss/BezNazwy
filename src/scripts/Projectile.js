

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
		console.log(this.scene.myPlayer.damageBonus)
		this.projectileDamage =  this.scene.myPlayer.damageBonus * this.projectileDamage;
		this.scene.physics.moveTo(this, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY, this.speed);
	}

	fireShrapnel(initiator, pointer)
	{
		this.scene.physics.moveTo(this, pointer.x + this.scene.cameras.main.scrollX - (initiator.x - this.x), pointer.y + this.scene.cameras.main.scrollY  - (initiator.y - this.y), this.speed);
	}

}