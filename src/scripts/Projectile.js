import initAnims from './AnimsProjectile'

export default class Projectile extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'projectiles', 4);

		scene.add.existing(this);

		this.setScale(0.75, 0.75);

		initAnims(scene.anims);

		this.speed = 250;
		this.projectileDamage = 10;

	}

	fireProjectile(initiator, pointer)
	{
		this.anims.play('projectileExplosion', true);
		this.projectileDamage =  this.scene.myPlayer.damageBonus * this.projectileDamage;
		this.scene.physics.moveTo(this, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY, this.speed * this.scene.myPlayer.projectileSpeedBonus);
	}

	fireShrapnel(initiator, pointer)
	{
		this.scene.physics.moveTo(this, pointer.x + this.scene.cameras.main.scrollX - (initiator.x - this.x), pointer.y + this.scene.cameras.main.scrollY  - (initiator.y - this.y), this.speed);
	}

	destroyAnimation()
	{
		this.anims.play('projectileExplosion', true);
	}

}