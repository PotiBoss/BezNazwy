import { getTimeStamp } from './GetTimeStamp';
import HealthBar from './HealthBar';
import { sceneEvents } from './EventCommunicator';

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

		this.burned = false;
		this.justBurned = false;
		this.burnTicks = 5;
		this.burnTimer = 5;
		this.burnIntervals = 500;

		this.showedDialog = false;
		
		this.setupDirections();

		this.healthbar = new HealthBar(this.scene, this);


		this.enemySpeed = 100;
		this.health = 30;
		this.maxHealth = 30;
		this.enemyHealth = 30;
		this.visionRange = 450;
		this.justDamaged = false;
		this.damagedTintTime = 100;
		this.collisionDamage = 10;
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
		this.changeHP();
	}

	unfreeze()
	{
		this.frozen = false;
		this.clearTint();
	}

	unburn()
	{
		this.burned = false;
		this.clearTint();
	}

	applyBurn()
	{
		this.scene.time.addEvent({
			delay: this.burnIntervals,                
			callback: this.applyBurnDamage,
			callbackScope: this,
			repeat: this.burnTicks - 1
		});
	}
	
	applyBurnDamage()
	{
		if(this.scene == undefined || this == undefined) {return;}
		this.enemyHealth = this.enemyHealth - 5;
		this.updateHP();

		this.burnTimer--;
		if(this.burnTimer <= 0)
		{
			this.unburn();
			this.burnTimer = this.burnTicks;
		}
	}
	
	handleState(deltaTime)
	{
		if(this.body == undefined){return;}

		if(this.enemyHealth <= 0)
		{
			this.destroy();
		}

		if(this.frozen === true)
		{
			this.setVelocity(0,0);
		}
	

		if(this.justFrozen === true)
		{
			this.justFrozen = false;
			this.setTint(0x17A8E6) // jasnoniebieski
			this.scene.time.addEvent({ 
				delay: this.freezeDuration, 
				callback: this.unfreeze, 
				callbackScope: this});
		}

		if(this.justBurned === true)
		{
			this.justBurned = false;
			this.setTint(0x371a45);
			this.scene.time.addEvent({ 
				delay: 0, 
				callback: this.applyBurn, 
				callbackScope: this});
		}
	}

	clearTint()
	{
		this.setTint(0xffffff);
	}

	destroy()
	{
		this.scene.myPlayer.points += 25;

	//	console.log(this.scene.teleportPoints - this.scene.myPlayer.points)

		if(this.scene.myPlayer.points >= this.scene.teleportPoints && this.scene.showedDialog == false)
		{
			this.scene.showedDialog = true;
			this.scene.activatedTeleport = true;
			sceneEvents.emit('teleportActivated');

			this.scene.add.image(3327.45, 4480.72, 'finalTeleport', 1).setScale(2).setDepth(-1);
		}

		super.destroy();
	}

}

