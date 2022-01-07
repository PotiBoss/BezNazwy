

export default class SkillPotion extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'potion');

		scene.add.existing(this);

		this.scene = scene;
		this.speed = 250;
		this.potionRange = 1000; //tak naprawde to dlugosc lotu
		this.timeToDestroy = null;
		this.index = 0;

		this.projectileDamage = 10;

		this.currentPotion = "freeze";

	}

	throw(initiator)
	{
		this.scene.physics.moveTo(this, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, this.speed);

		this.timer = this.scene.time.addEvent({ 
			delay: 1000, 
			callback: this.destroyPotion, 
			callbackScope: this});
	}

	destroyPotion(enemy)
	{

		if(this.currentPotion === "freeze" && enemy !== undefined)
		{
			enemy.justFrozen = true;
			enemy.frozen = true;
		
		}
		this.destroy();

	}
}


/*
throw(initiator)
{

	if(this.scene.input.mousePointer.x > this.scene.input.mousePointer.y)
	{
		this.maxX = Phaser.Math.Clamp(this.scene.input.mousePointer.x, 0, this.potionRange);
		this.maxY = Phaser.Math.Clamp(this.scene.input.mousePointer.y / this.scene.input.mousePointer.x * this.potionRange, 0, this.potionRange);
	}
	else if(this.scene.input.mousePointer.x < this.scene.input.mousePointer.y)
	{
		this.maxX = Phaser.Math.Clamp(this.scene.input.mousePointer.x / this.scene.input.mousePointer.x * this.potionRange, 0, this.potionRange);
		this.maxY = Phaser.Math.Clamp(this.scene.input.mousePointer.y, 0, this.potionRange);
	} 
	else
	{
		this.maxX = Phaser.Math.Clamp(this.scene.input.mousePointer.x, 0, this.potionRange);
		this.maxY = Phaser.Math.Clamp(this.scene.input.mousePointer.y, 0, this.potionRange);
	}
	console.log(this.maxX + this.scene.cameras.main.scrollX);
	console.log(this.maxY + this.scene.cameras.main.scrollY)
	
	this.scene.physics.moveTo(this, this.maxX + this.scene.cameras.main.scrollX, this.maxY + this.scene.cameras.main.scrollY, this.speed);
} */