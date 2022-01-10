

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
		this.potion.x = this.gameObject.x - this.gameObject.width / 2;
		this.potion.y = this.gameObject.y + this.gameObject.height / 3;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.potion = this.scene.add.image(x , y, 'potion').setScale(0.4, 0.4);
	}

	destroy()
	{
		this.potion.x = 9999; //XD^2`
		this.potion.y = 9999;
	}

}
