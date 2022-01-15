import EnemyBase from "./EnemyBase";
import ProjectileEnemy from "./ProjectileEnemy";

export default class RangeEnemy extends EnemyBase
{
	constructor(scene, name, x, y)
		{
		super(scene, x, y, 'treasure',);

		scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.x;
		this.y;
		this.scene = scene;

		this.body.onCollide = true;
		//this.setPushable(false);
		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
		this.setupDirections();

		this.enemyMaxHealth = 30;
		this.enemyHealth = 30;	
		this.enemySpeed = 60;
		
		this.visionRange = 300;
		this.attackRange = 200;

		this.damageTime = 0;
		this.damagedInvulnerability = 500;

		this.shootFlag = true;
		this.shootCooldown = 1500;
		
		this.projectilesEnemy = this.scene.enemyProj; // nie wiem czemu undefined jest ale zrobienie tego w scenie na poczatku naprawia 

		this.setScale(2, 2);
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
		this.myPlayer = this.scene.myPlayer;
		if(Math.abs(this.x - this.myPlayer.x) < this.visionRange && Math.abs(this.y - this.myPlayer.y) < this.visionRange)
		{
			this.scene.physics.moveToObject(this, this.myPlayer, 100);
			if(Math.abs(this.x - this.myPlayer.x) < this.attackRange && Math.abs(this.y - this.myPlayer.y) < this.attackRange)
			{
				this.setVelocity(0,0);
			}

			this.inRangePlayer();
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
		}
	}

	shootPlayer()
	{
		this.shootFlag = true; 
		this.projectile = this.projectilesEnemy.get(this.x, this.y, this);
		this.projectile.fireProjectile(this.myPlayer);
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