import initAnims from './AnimsBomb'

export default class SkillBomb extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y,owner )
	{
		super(scene, x , y,'bombs', 1);

		scene.add.existing(this);

		initAnims(scene.anims);

		this.scene = scene;
		this.speed = 250;
		this.potionRange = 1000; //tak naprawde to dlugosc lotu
		this.timeToDestroy = null;

		this.player = owner;

		this.damage = 10;
		this.shrapnels = 8;

		this.potionDamage = 0;


		this.currentPotion = Math.floor(Math.random() * 2);
	}

	throw(initiator)
	{
		
		this.scene.physics.moveTo(this, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, this.speed);
	
		this.scene = initiator.scene;

		this.initiator = initiator;
		if(this.player.skillDamageBonus > 0)
		{
			this.player.skillDamageBonus--;
			this.damage = 20;
		}
		
		this.anims.play('bombAnimation', true);

		this.timer = this.scene.time.addEvent({ 
			delay: 1000, 	
			callback: this.explode,
			callbackScope: this});
	}
	
	destroyPotion()
	{ 
		this.destroy();
	}

	explode(initiator)
	{
		this.timer.remove();

		for(let i = 0; i <= this.shrapnels; i++)
		{
			this.dirX = Math.floor(Math.random() * 960);
			this.dirY = Math.floor(Math.random() * 540);
			let shotDirection = new Phaser.Math.Vector2(this.dirX, this.dirY);
			this.projectile = this.initiator.projectiles.get(this.x, this.y, this);
			this.projectile.fireShrapnel(this, shotDirection);
		}
		this.destroy();
	}
}



