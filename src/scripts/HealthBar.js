

export default class HealthBar extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, object)
	{
		super(scene);
		this.scene = scene;
		this.gameObject = object;

		this.fullWidth = this.gameObject.width / 100;

		this.create();
	}	


	preUpdate(time, deltaTime)
	{
		if(this.gameObject == this.scene.myPlayer)
		{
	
			this.middle.x = this.gameObject.x;
			this.middle.y = this.gameObject.y + 300;
		}
		else
		{
			this.middle.x = this.gameObject.x;
			this.middle.y = this.gameObject.y - this.gameObject.height / 1.5;
		}

	}


	create()
	{

		if(this.gameObject.displayList !== null)
		{
			this.fullWidth = this.gameObject.width / 10;
		}

		const y = 9999 //XD	
		const x = 9999 //XD
		if(this.gameObject.displayList === null) 
		{ 
			this.middle = this.scene.add.image(x , y, 'healthBar', 1).setOrigin(0.5, 0.5).setScale(1, 0.3);
		}
		else
		{
			this.middle = this.scene.add.image(x , y, 'healthBar', 0).setOrigin(0.5, 0.5).setScale(1, 0.3);
		}
		this.setMeterPercentage();	
	}

	setMeterPercentage(percent = 100)
	{

	if(percent < 0) {percent = 0}

	const width = this.fullWidth * percent

	if(percent === 100 && this.gameObject.displayList === null)
	{
		this.middle.setScale(0,0)
	}
	else
	{
		this.middle.setScale(1, 0.3)
	}

	this.middle.displayWidth = width
	}


}



