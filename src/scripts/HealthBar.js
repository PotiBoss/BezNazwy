
export default class HealthBar extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, object)
	{
		super(scene);
		this.scene = scene;
		this.gameObject = object;

		this.fullWidth = 30 / 100;

		this.create();
	}	


	preUpdate(time, deltaTime)
	{
		
		this.middle.x = this.gameObject.x - this.gameObject.width / 2;
		this.middle.y = this.gameObject.y - this.gameObject.height / 2;

	}


	create()
	{

		const y = 9999 //XD	
		const x = 9999 //XD

		this.middle = this.scene.add.image(x , y, 'middle').setOrigin(0, 0.5).setScale(1, 0.3)
		this.setMeterPercentage();
				
		this.middle.x = this.gameObject.x - this.gameObject.width / 2;
		this.middle.y = this.gameObject.y - this.gameObject.height / 2;

	}

	setMeterPercentage(percent = 100)
	{

	const width = this.fullWidth * percent

	this.middle.displayWidth = width
	}


}



