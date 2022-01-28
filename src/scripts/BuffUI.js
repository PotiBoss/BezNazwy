export default class BuffUI extends Phaser.Physics.Arcade.Sprite 
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
		this.teleport.x = this.gameObject.x - 300;
		this.teleport.y = this.gameObject.y + 300;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.teleport = this.scene.add.image(x , y, 'projectiles', 4);	
	}

	destroy()
	{
		this.teleport.x = 9999; //XD^2`
		this.teleport.y = 9999;
	}

}
