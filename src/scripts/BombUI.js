export default class BombUI extends Phaser.Physics.Arcade.Sprite 
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
		this.projectile.x = this.gameObject.x - 350;
		this.projectile.y = this.gameObject.y + 300;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.projectile = this.scene.add.image(x , y, 'skillHud', 1);	
	}

	cooldown()
	{
		this.projectile.setTint(0x0a2948);
	}

	destroy()
	{
		this.projectile.x = 9999; //XD^2`
		this.projectile.y = 9999;
	}

}