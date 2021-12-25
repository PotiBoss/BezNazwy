import Phaser from 'phaser';

import  Game  from 'phaser';
import Player from './Player';
import Enemy from './Enemy';
import Map from './Map';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
		super("GameScene");
    }

    preload()
    {
		this.load.image('projectile', 'assets/bomb.png');

		this.load.image('tiles', 'assets/dungeon_tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'assets/dungeonmap.json');

		this.load.atlas('player', 'assets/fauna.png', 'assets/fauna.json');
		this.load.atlas('lizard', 'assets/lizard.png', 'assets/lizard.json');
    }

    create()
    {
    	console.log("GameScene started");
		this.currentMap = new Map(this);

		this.hitCounter = 0;

		this.spawnPlayer();
		//this.createFOV(this);
		this.setupRaycast();

		//this.spawnEnemy();


	}

	update(time, deltaTime)
	{
		this.myPlayer.updateMovement2();
		this.updateRaycast();
		this.myPlayer.handleState(deltaTime);
	}


	spawnPlayer()
	{
		this.myPlayer = new Player(this, 300, 300);
		this.setFollowingCamera(this.myPlayer);
		this.setColliders(this.myPlayer);
	}

	spawnEnemy()
	{
		this.myEnemy = new Enemy(this, 500, 400);
	}

	setColliders(player)
	{
		this.physics.add.collider(player, this.currentMap.walls);
		this.physics.add.collider(this.currentMap.lizards, this.currentMap.walls);
		this.physics.add.collider(player, this.currentMap.lizards, this.handlePlayerEnemyCollision, undefined, this);
	}

	setupRaycast()
	{
		this.raycaster = this.raycasterPlugin.createRaycaster();
		console.log(this.raycaster);

		this.rayRightDown = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayRightDown.setAngleDeg(45);

		 this.rayLeftDown = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayLeftDown.setAngleDeg(135);
		
		this.rayLeftUp = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayLeftUp.setAngleDeg(225);

		this.rayRightUp = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayRightUp.setAngleDeg(315);

		this.rayRight = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayRight.setAngleDeg(0);

		  this.rayLeft = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayLeft.setAngleDeg(180);

		  this.rayUp = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayUp.setAngleDeg(270);

		  this.rayDown = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayDown.setAngleDeg(90);

		this.raycaster.debugOptions.enabled = true;



		this.raycaster.mapGameObjects(this.currentMap.walls, false, {
			collisionTiles: [1,2,3,33,34,35,224,225,226,227,256,257,258,259,260,261,288,289,290,291,292,293,322,323] //ID tilow z Tiled
		  });

		this.wallsRaycast = this.add.group(this.currentMap.walls);
		this.raycaster.mapGameObjects(this.wallsRaycast.getChildren());
	}

	updateRaycast()
	{
		this.rayRightDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayLeftDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayLeftUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayRightUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
  		this.rayRight.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayLeft.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayDown.setOrigin(this.myPlayer.x, this.myPlayer.y);

		this.intersectionRightDown = this.rayRightDown.cast();
		this.intersectionLeftDown = this.rayLeftDown.cast();
		this.intersectionLeftUp = this.rayLeftUp.cast();
		this.intersectionRightUp = this.rayRightUp.cast();
		this.intersectionRight = this.rayRight.cast();
		this.intersectionLeft = this.rayLeft.cast();
		this.intersectionUp = this.rayUp.cast();
		this.intersectionDown = this.rayDown.cast();

 	//	this.graphics.clear();
  	//	this.line = new Phaser.Geom.Line(this.myPlayer.x, this.myPlayer.y, this.intersectionRight.x, this.intersectionRight.y);
  	//	this.graphics.fillPoint(this.rayRight.origin.x, this.rayRight.origin.y, 3)
  	//	this.graphics.strokeLineShape(this.line);
	}


	setFollowingCamera(player)
	{
		//this.physics.world.setBounds()
		this.cameras.main.startFollow(player);
	}
	

	createFOV(scene){
		this.maskGraphics = scene.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 }});
		this.mask = new Phaser.Display.Masks.GeometryMask(scene, this.maskGraphics);
		this.mask.setInvertAlpha();
		this.fow = scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } }).setDepth(29);
		this.fow.setMask(this.mask);
		this.fow.fillRect(0, 0, 800, 600);
	}

	handlePlayerEnemyCollision(player, enemy)
	{
		this.collidedEnemy = enemy;

		this.xImpactSide = this.myPlayer.x - this.collidedEnemy.x;
		this.yImpactSide = this.myPlayer.y - this.collidedEnemy.y;

		this.directionVector = new Phaser.Math.Vector2(this.xImpactSide, this.yImpactSide).normalize().scale(200);

		this.myPlayer.handleDamage(this.directionVector);

	}
}