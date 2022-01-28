export default class TeleportUI extends Phaser.Physics.Arcade.Sprite 
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
		this.teleport.x = this.gameObject.x + 90;
		this.teleport.y = this.gameObject.y + 275;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.teleport = this.scene.add.image(x , y, 'skillHud', 3).setScale(1.5);	
	}

	cooldown()
	{
		this.teleport.setTint(0x0a2948);
	}

	destroy()
	{
		this.teleport.x = 9999; //XD^2`
		this.teleport.y = 9999;
	}

}
