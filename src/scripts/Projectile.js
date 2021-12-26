

export default class Projectile extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'projectile');

		scene.add.existing(this);
		scene.add.existing(this);

		this.speed = 300;
		this.maxDistance = 10;
		this.traveledDistance = 0;
		this.centerX = this.x;


		this.initEvents();
	}

	initEvents()
	{
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
	}

	preUpdate(time, delta)
	{
		super.preUpdate(time, delta);

		//this.traveledDistance += this.body.deltaAbsX();

	}



	update()
	{
		if(Math.abs(this.centerX - this.x) > this.maxDistance)
		{
			this.destroy();
		}
	}

	fireProjectile(initiator)
	{
		this.center = initiator.getCenter();

		this.projectile = this.scene.physics.add.sprite(this.center.x, this.center.y, 'projectile');
		this.scene.physics.moveTo(this.projectile ,this.scene.input.activePointer.x, this.scene.input.activePointer.y, 100);
	}

}