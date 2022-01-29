import EnemyBase from "./EnemyBase";


export default class BossEnemy extends EnemyBase
{
	constructor(scene, name, x, y)
		{
		super(scene, x, y, 'boss');

		scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.dead = false;
		this.x;
		this.y;
		this.scene = scene;

		this.body.onCollide = true;
		//this.setPushable(false);
		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
		this.setupDirections();

		this.enemyMaxHealth = 6;
		this.enemyHealth = 6;	
		this.enemySpeed = 10;
		
		this.visionRange = 300;
		this.attackRange = 200;

		this.damageTime = 0;
		this.damagedInvulnerability = 500;

		this.actionFlag = true;
		this.actionCooldown = 5000;

		this.circleFlag = true;
		this.circleCooldown = 25;
		this.circleX = -100;
		this.circleY = -100;

		this.shootFlag = true;
		this.shootCooldown = 75;
		
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
		this.myPlayer = this.scene.myPlayer;
		if(Math.abs(this.x - this.myPlayer.x) < this.visionRange && Math.abs(this.y - this.myPlayer.y) < this.visionRange)
		{
			this.scene.physics.moveToObject(this, this.myPlayer, 100);
			if(Math.abs(this.x - this.myPlayer.x) < this.attackRange && Math.abs(this.y - this.myPlayer.y) < this.attackRange)
			{
				this.setVelocity(0,0);
				this.newAction();

			}
		}
	}

	newAction()
	{
		if(this.actionFlag)
		{
			this.action = Math.floor(Math.random() * 2);
			switch(this.action)
			{
				case 0:
					this.volleyAttack();
					break;
				case 1:
					this.circleAttack();
					break;
			}
			this.actionFlag = false;

			this.timerActionOn = this.scene.time.addEvent({ 
				delay: this.actionCooldown, 
				callback: () => this.actionFlag = true, 
				callbackScope: this});
		}
	}

	circleAttack()
	{
		this.circleFlag = false;


		this.timerPlayerSeen = this.scene.time.addEvent({ 
			delay: this.circleCooldown, 
			callback: this.shootCircle,
			repeat: Math.floor(Math.random() * 25) + 70,
			callbackScope: this});
	}

	shootCircle()
	{
		if(this.dead) { return; }
		this.circleFlag = true;
		this.projectile = this.projectilesEnemy.get(this.x, this.y, this);
		
		if(this.circleX <= 100 && this.circleY <= -100 && this.circleY >= -100)
		{
			this.circleX += 10;
		}
		else if(this.circleX >= 100  && this.circleY <= 100 && this.circleY >= -100)
		{
			this.circleY += 10; 
		}
		else if(this.circleY >= 100 && this.circleX <= 110 && this.circleX >= -100)
		{
			this.circleX -= 10;
		}
		else if(this.circleY <= 110 && this.circleX <= 100 && this.circleX >= -110)
		{
			this.circleY -= 10;
		}



		this.projectile.circleProjectile(this, this.circleX, this.circleY);	
		
	}

	volleyAttack()
	{
		this.shootFlag = false;
		this.timerPlayerSeen = this.scene.time.addEvent({ 
			delay: this.shootCooldown, 
			callback: this.shootPlayerVolley,
			repeat: 32,
			callbackScope: this});
	}

	shootPlayerVolley()
	{
		if(this.dead) { return; }
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
	}

	destroy()
	{
		this.scene.bossFlag = true;
		this.dead = true;
		super.destroy();
	}
}