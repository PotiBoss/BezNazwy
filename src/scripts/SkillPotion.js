

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


		this.currentPotion = Math.floor(Math.random() * 2);
	}

	throw(initiator)
	{
		this.scene.physics.moveTo(this, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, this.speed);

		initiator.destroyPotion();

		this.timer = this.scene.time.addEvent({ 
			delay: 1000, 
			callback: this.destroyPotion, 
			callbackScope: this});
	}

	destroyPotion(enemy)
	{ 

		if(this.currentPotion === 0 && enemy !== undefined)
		{
			enemy.justFrozen = true;
			enemy.frozen = true;
		}

		else if( this.currentPotion === 1 && enemy !== undefined)
		{
			enemy.justBurned = true;
			enemy.burned = true;
		}
		this.destroy();

	}
}
