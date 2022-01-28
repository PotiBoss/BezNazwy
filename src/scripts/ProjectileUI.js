export default class ProjectileUI extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, object)
	{
		super(scene);
		this.scene = scene;
		this.gameObject = object;

		this.create();
	}	


	preUpdate(time, deltaTime)
	{
		this.projectile.x = this.gameObject.x - 90;
		this.projectile.y = this.gameObject.y + 275;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.projectile = this.scene.add.image(x , y, 'skillHud', 2).setScale(1.5);	
	}

	cooldown()
	{
		this.projectile.setTint(0x0a2948)
	}

	destroy()
	{
		this.projectile.x = 9999; //XD^2`
		this.projectile.y = 9999;
	}

}
