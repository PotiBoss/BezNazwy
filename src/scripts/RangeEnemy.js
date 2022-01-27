import EnemyBase from "./EnemyBase";
import initAnims from './AnimsRanged'


export default class RangeEnemy extends EnemyBase
{
	constructor(scene, name, x, y)
		{
		super(scene, x, y, 'ranged', 10);

		scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.x;
		this.y;
		this.scene = scene;

		initAnims(scene.anims);

		this.anims.currentAnim = 1;

		this.body.onCollide = true;
		//this.setPushable(false);
		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
		this.setupDirections();

		this.enemyMaxHealth = 30;
		this.enemyHealth = 30;	
		this.enemySpeed = 60;
		
		this.visionRange = 500;
		this.attackRange = 150;
		

		this.damageTime = 0;
		this.damagedInvulnerability = 500;

		this.shootFlag = true;
		this.shootCooldown = 1500;
		
		this.projectilesEnemy = this.scene.enemyProj; // nie wiem czemu undefined jest ale zrobienie tego w scenie na poczatku naprawia 

	}

	preUpdate(time, deltaTime)
	{
		super.preUpdate(time, deltaTime);
			
		if(!this.isCharging)
		{
			this.changeDirection()
		}



		this.chasePlayer();  //TODO: WLACZYC

		this.healthbar.preUpdate();
		
		this.handleState(deltaTime);
	}

	chasePlayer()
	{	
		this.enemyPlayerOffsetX = this.x - this.scene.myPlayer.x;
		this.enemyPlayerOffsetY = this.y - this.scene.myPlayer.y;

		if(this.enemyPlayerOffsetX >= 0  && Math.abs(this.enemyPlayerOffsetX) >= Math.abs(this.enemyPlayerOffsetY) && (this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Up' && this.anims.currentAnim.key != 'rangedAttack-Side')) //lewo
		{
			this.flipX = true;
			this.anims.play('ranged-Side', true);
		} 
		else if(this.enemyPlayerOffsetY <= 0  && Math.abs(this.enemyPlayerOffsetY) >= Math.abs(this.enemyPlayerOffsetX) && (this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down')) //dol
		{
			this.anims.play('ranged-Down', true);
		} 
		else if(this.enemyPlayerOffsetX <= 0  && Math.abs(this.enemyPlayerOffsetX) >= Math.abs(this.enemyPlayerOffsetY) && (this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down')) //prawo
		{
			this.flipX = false;
			this.anims.play('ranged-Side', true);
		}
		else if(this.enemyPlayerOffsetY >= 0  && Math.abs(this.enemyPlayerOffsetY) >= Math.abs(this.enemyPlayerOffsetX) && (this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down' && this.anims.currentAnim.key != 'rangedAttack-Down')) //gora
		{
			this.anims.play('ranged-Up', true);
		} 

		//console.log(this.currentAnim.key)

		this.myPlayer = this.scene.myPlayer;
		if(Math.abs(this.x - this.myPlayer.x) < this.visionRange && Math.abs(this.y - this.myPlayer.y) < this.visionRange)
		{
			this.scene.physics.moveToObject(this, this.myPlayer, 100);
			if(Math.abs(this.x - this.myPlayer.x) < this.attackRange && Math.abs(this.y - this.myPlayer.y) < this.attackRange)
			{
				this.setVelocity(0,0);
				this.inRangePlayer();  //TODO: WLACZ
			}
		}
	}

	inRangePlayer()
	{
		if(this.shootFlag)
		{
			this.shootFlag = false;
			this.timerPlayerSeen = this.scene.time.addEvent({ 
				delay: this.shootCooldown, 
				callback: this.shootPlayer, 
				callbackScope: this});

			this.anims.play('rangedAttack-Down', true);

			
		}
	}

	shootPlayer()
	{
		this.shootFlag = true; 
		this.projectile = this.projectilesEnemy.get(this.x, this.y, this);
		this.projectile.fireProjectile(this.myPlayer);

		this.anims.play('ranged-Down', true);
	}

	handleTileCollision(go = Phaser.GameObjects.GameObject, tile = Phaser.Tilemaps.Tile)
	{
		if(this.isCharging && !go)
		{
			this.setupChargeLocation();
		}

		if(go !== this) { return; }
		this.direction = Phaser.Math.Between(0, 3);
	}

	changeHP()
	{
		this.healthbar.setMeterPercentage(this.enemyHealth / this.enemyMaxHealth * 100);
	//	console.log(this.enemyHealth)
	}

}