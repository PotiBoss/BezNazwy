import EnemyBase from "./EnemyBase";

export default class Necromancer extends EnemyBase
{
	constructor(scene, name, x, y)
		{
		super(scene, x, y, 'necromancer');

		this.scene.physics.add.existing(this);

		this.x = x;
		this.y = y;
		this.scene = scene;
		this.body.onCollide = true;
		this.setPushable(false)
		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
		this.setupDirections();
		this.enemyMaxHealth = 40;
				
		this.enemySpeed = 60;
		this.enemyHealth = 40;
		
		this.visionRange = 300;

		this.skeletonSpawnCooldown = 5000;
		this.skeletonSpawnFlag = true;

		this.damageTime = 0;
		this.damagedInvulnerability = 500;
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

		//	this.seenPlayer();
		}
	}

	seenPlayer()
	{
		if(this.skeletonSpawnFlag)
		{
			this.skeletonSpawnFlag = false;
			this.timerPlayerSeen = this.scene.time.addEvent({ 
				delay: this.skeletonSpawnCooldown, 
				callback: this.spawnSkeleton, 
				callbackScope: this});
		}

	}

	spawnSkeleton()
	{
		this.scene.currentMap.skeletons.get(this.x + this.width, this.y);
		this.scene.currentMap.skeletons.get(this.x - this.width, this.y);
		this.skeletonSpawnFlag = true;
		this.skeletonSound = this.scene.sound.add('skeletonSpawn', {
			volume: 0.3,
		});
		this.skeletonSound.play();

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
