import initAnims from './AnimsPotion'

export default class SkillPotion extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x , y, 'potionFront', 3);

		scene.add.existing(this);

		this.setScale(1.35, 1.35);

		this.scene = scene;
		this.speed = 250;
		this.potionRange = 1000; //tak naprawde to dlugosc lotu
		this.timeToDestroy = null;


		initAnims(scene.anims);

		this.currentPotion = this.scene.myPlayer.currentPotion;
	}

	throw(initiator)
	{
		this.scene.physics.moveTo(this, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, this.speed);

		initiator.destroyPotion();

		if(this.currentPotion == 0)
		{
			console.log("XD")
			this.anims.play(this.scene.myPlayer.potionAnimation + "Blue", true);
		}
		else
		{
			this.anims.play(this.scene.myPlayer.potionAnimation, true);	
		}
		

		this.timer = this.scene.time.addEvent({ 
			delay: 1000, 
			callback: this.destroyPotion, 
			callbackScope: this});
	}

	destroyPotion(enemy)
	{ 
		this.timer.remove();
		this.potionBreak = this.scene.sound.add('potionBreak', {
			volume: 0.035,
		});
		this.potionBreak.play();

		if(this.currentPotion === 0 && enemy !== undefined)
		{
			enemy.justFrozen = true;
			enemy.frozen = true;
		}

		else if(this.currentPotion === 1 && enemy !== undefined)
		{
			enemy.justBurned = true;
			enemy.burned = true;
		}
		this.destroy();

	}
}
