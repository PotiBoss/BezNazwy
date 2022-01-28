

export default class PotionInHand extends Phaser.Physics.Arcade.Sprite 
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
		this.potion.x = this.gameObject.x - 400;
		this.potion.y = this.gameObject.y + 300;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.potion = this.scene.add.image(x , y, 'skillHud', 5);	
	}

	cooldown()
	{
		this.potion.setTint(0x0a2948);
	}

	destroy()
	{
		this.potion.x = 9999; //XD^2`
		this.potion.y = 9999;
	}

}
