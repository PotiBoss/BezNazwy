import Phaser from 'phaser';

import  Game  from 'phaser';
import Player from './Player';
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

		this.load.image('tiles', 'assets/dungeon_tiles.png')
		this.load.tilemapTiledJSON('dungeon', 'assets/dungeonmap.json')	

		this.load.atlas('player', 'assets/fauna.png', 'assets/fauna.json')
    }

    create()
    {
    	console.log("GameScene started");
		this.currentMap = new Map(this);
		this.spawnPlayer();
		this.createFOV(this);
///
		this.raycaster = this.raycasterPlugin.createRaycaster();
		console.log(this.raycaster);

		this.ray = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  //automatically slice casting result into triangles
			//collisionRange: 250, //ray's field of view range
		  });

		this.ray.enablePhysics();
		this.raycaster.debugOptions.enabled = true;



		this.raycaster.mapGameObjects(this.currentMap.walls, false, {
			collisionTiles: [1,2,3,33,34,35,224,225,226,227,256,257,258,259,260,261,288,289,290,291,292,293,322,323] //array of tile types which collide with rays
		  });

		this.wallsRaycast = this.add.group(this.currentMap.walls);
		this.raycaster.mapGameObjects(this.wallsRaycast.getChildren());
		this.raycaster.mapGameObjects(this.currentMap.ground);
		this.intersection = this.ray.cast();

		this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xff00ff } });
//



//

///


	}

	update()
	{
		this.myPlayer.updateMovement2();

		///
  //rotate ray
  			this.ray.setAngle(this.ray.angle + 0.01);
  //cast ray
  			this.intersection = this.ray.cast();
  
  //draw ray
 			this.graphics.clear();
  			this.line = new Phaser.Geom.Line(this.myPlayer.x, this.myPlayer.y, this.intersection.x, this.intersection.y);
  		//	this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3)
  			this.graphics.strokeLineShape(this.line);

		///
	}


	spawnPlayer()
	{
		this.myPlayer = new Player(this, 300, 300);
		this.setFollowingCamera(this.myPlayer);
		this.setColliders(this.myPlayer);
	}

	setColliders(player)
	{
		this.physics.add.collider(player, this.currentMap.walls)
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

}