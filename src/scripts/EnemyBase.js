import { getTimeStamp } from './GetTimeStamp';
import HealthBar from './HealthBar';

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, sprite)
	{
		super(scene, x, y, sprite);

		this.scene = scene
		this.currentDirection = this.right;
		this.timeFromLastDirectionChange = null;
		this.directionChangeCooldown = 1000;
		this.timeFromLastDamaged = null;

		this.frozen = false;
		this.justFrozen = false;
		this.freezeDuration = 1000;
		
		this.setupDirections();

		this.healthbar = new HealthBar(this.scene, this);


		this.enemySpeed = 100;
		this.enemyHealth = 30;
		this.visionRange = 200;
		this.justDamaged = false;
		this.damagedTintTime = 500;
	}

	setupDirections()
	{
		this.up = 0;
		this.right = 1;
		this.down = 2;
		this.left = 3;

	}

	changeDirection()
	{
		this.date = new Date();
		if(this.timeFromLastDirectionChange && this.timeFromLastDirectionChange + this.directionChangeCooldown >  this.date){ return; }
		this.timeFromLastDirectionChange = getTimeStamp();

		this.direction = Phaser.Math.Between(0, 3);


		this.setVelocityY(0);
		this.setVelocityX(0);
		
		switch(this.direction)
		{
			case this.right:
				this.setVelocityX(this.enemySpeed);
				break;
			case this.down:
				this.setVelocityY(this.enemySpeed);
				break;
			case this.left:
				this.setVelocityX(-this.enemySpeed);
				break;
			case this.up:
				this.setVelocityY(-this.enemySpeed);
		}
		
	}
	
	handleTileCollision(go = Phaser.GameObjects.GameObject, tile = Phaser.Tilemaps.Tile)
	{
		if(go !== this) { return; }
		this.direction = Phaser.Math.Between(0, 3);
	}

	chasePlayer()
	{
		this.myPlayer = this.scene.myPlayer
		if(this.myPlayer != undefined)
		{
			if(Math.abs(this.x - this.myPlayer.x) < this.visionRange && Math.abs(this.y - this.myPlayer.y) < this.visionRange)
			{
				this.scene.physics.moveToObject(this, this.myPlayer, this.enemySpeed);
			}
		}

	}

	updateHP()
	{
		this.setTint(0xff0000)
		if(this.enemyHealth <= 0)
		{
			this.destroy();
		}
		this.handleState();
	}

	unfreeze()
	{
		this.frozen = false;
		this.clearTint();
	}
	
	handleState(deltaTime)
	{

		if(this.frozen === true)
		{
			this.setVelocity(0,0);
		}
	

		if(this.justFrozen === true)
		{
			
			console.log('freeeze')
			this.justFrozen = false;
			this.setTint(0x17A8E6) // jasnoniebieski
			this.scene.time.addEvent({ 
			delay: this.freezeDuration, 
			callback: this.unfreeze, 
			callbackScope: this});
		}
	}

	clearTint()
	{
		this.setTint(0xffffff);
	}


	destroy()
	{
		super.destroy();
	}

}


/*
		this.damageTime += deltaTime;
		
		
		console.log(this.damageTime);

		if(this.damageTime >= this.damagedInvulnerability && !this.frozen)
		{
			this.healthState = this.unharmed;
			console.log("uwu")
			
			this.damageTime = 0;
		}
*/

