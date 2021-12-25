import initAnims from './AnimsEnemy'
import { getTimeStamp } from './GetTimeStamp';

export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'lizard');

		scene.add.existing(this);
		scene.physics.add.existing(this);

		//this.scene.scene;

		initAnims(scene.anims);
		this.anims.play('lizard-idle');

		this.body.onCollide = true;

		this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);

		this.create();

	}

	create()
	{
		this.enemySpeed = 100;
		this.setupDirections();
		this.currentDirection = this.right;
		this.timeFromLastDirectionChange = null;
		this.directionChangeCooldown = 1000;
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
	
	preUpdate(time, deltaTime)
	{
		super.preUpdate(time, deltaTime);

		this.changeDirection()
	}

	handleTileCollision(go = Phaser.GameObjects.GameObject, tile = Phaser.Tilemaps.Tile)
	{
		if(go !== this) { return; }

		this.direction = Phaser.Math.Between(0, 3);
	}

	destroy()
	{
		super.destroy();
	}


}

