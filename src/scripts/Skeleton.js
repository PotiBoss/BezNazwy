import initAnims from './AnimsEnemy'
import EnemyBase from './EnemyBase';
import { getTimeStamp } from './GetTimeStamp';

export default class Skeleton extends EnemyBase
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'skeletonFront');

		scene.physics.add.existing(this);


		initAnims(scene.anims);
		//this.anims.play('lizard-idle');

		this.body.onCollide = true;

		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);

		this.create();	
	}

	create()
	{
		this.enemySpeed = 100;
		this.enemyMaxHealth = 30;
		this.enemyHealth = 30;
		this.visionRange = 200;

		this.setupDirections();
		this.currentDirection = this.right;
		this.timeFromLastDirectionChange = null;
		this.directionChangeCooldown = 1000;
		this.setPushable(false)
	}

	preUpdate(time, deltaTime)
	{
		super.preUpdate(time, deltaTime);

		this.changeDirection()

		this.healthbar.preUpdate();

		this.handleState(deltaTime);
		this.chasePlayer(); //TODO: WLACZYC
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

	changeHP()
	{
		this.healthbar.setMeterPercentage(this.enemyHealth / this.enemyMaxHealth * 100);
	}



}

