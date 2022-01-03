import Phaser from 'phaser';

import Player from './Player';
import Enemy from './Enemy';
import Map from './Map';
import { sceneEvents } from './EventCommunicator';


import { Mrpas } from 'mrpas'

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

		this.load.image('ui-heart-empty', 'assets/ui_heart_empty.png');
		this.load.image('ui-heart-full', 'assets/ui_heart_full.png');

		this.load.atlas('treasure', 'assets/treasure.png', 'assets/treasure.json');

		this.load.spritesheet('items','assets/items.png',{frameWidth:32,frameHeight:32});
    }

    create()
    {
		
		this.currentMap = new Map(this);

		this.hitCounter = 0;
		this.isCraftingActive = false;

		this.spawnPlayer();
		//this.changeCraftingScene();
		this.setupRaycast();
	
		//this.spawnEnemy();

		this.setupFOV();

		this.createFOW();
	}

	update(time, deltaTime)
	{
		this.myPlayer.updateMovement2();
		this.updateRaycast();
		this.myPlayer.handleState(deltaTime);
		this.myPlayer.handleAttack();

		//5. inv select in hand?

		this.updateFOV();
		this.updateFOW();
		

	}

	changeCraftingScene()
	{
		this.input.keyboard.on('keydown-C',() =>{
			if(this.scene.isActive('SceneCrafting')){
				this.isCraftingActive = false;
				this.scene.stop('SceneCrafting');
			}
			else
			{
				this.isCraftingActive = true;
				this.scene.run('SceneCrafting', {mainScene: this});
			}
		});
	}

	createFOW()
	{
		const groundLayer = this.currentMap.ground
		const wallLayer = this.currentMap.walls

		const width = 2000
		const height = 2000

		const rt = this.make.renderTexture({
			width,
			height
		}, true)

			// fill it with black
	rt.fill(0x000000, 1)

	// draw the floorLayer into it
	rt.draw(groundLayer)
	rt.draw(wallLayer)

	// set a dark blue tint
	rt.setTint(0x0a2948)



	this.vision = this.make.image({
		x: this.myPlayer.x,
		y: this.myPlayer.y,
		key: 'vision',
		add: false
	})
	this.vision.scale = 15

	rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision)
	rt.mask.invertAlpha = true
	}

	updateFOW()
	{
		this.fow = new Mrpas(this.currentMap.map.width, this.currentMap.map.height, (x, y) => {
			const tile = this.currentMap.ground.getTileAt(x, y)
			const tileWall = this.currentMap.walls.getTileAt(x, y)
			
			
			return tile && !tile.collides && !tileWall
		})

		if (this.vision)
		{
			this.vision.x = this.myPlayer.x
			this.vision.y = this.myPlayer.y
		}
	}


	spawnPlayer()
	{
		this.myPlayer = new Player(this, 250, 250);
		this.scene.run('UI', {mainScene: this});
		this.scene.run('SceneInventory', {mainScene: this});
	//	this.scene.run('SceneCrafting', {mainScene: this});
		this.setFollowingCamera(this.myPlayer);
		this.setColliders();
	}

	spawnEnemy()
	{
		this.myEnemy = new Enemy(this, 500, 400);
	}

	setColliders()
	{
		this.physics.add.collider(this.myPlayer, this.currentMap.walls);
		this.physics.add.collider(this.currentMap.lizards, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.lizards, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.lizards, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.walls, this.handleProjectilesWallsCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.chests, this.handlePlayerChestCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.potions, this.handlePlayerPickupCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.workbenches, this.handlePlayerWorkbenchCollision, undefined, this);
	}

	setupRaycast()
	{
		this.raycaster = this.raycasterPlugin.createRaycaster();

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


		  // fov raycast
		  this.rayFOV = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y
			},
			autoSlice: true,  //automatically slice casting result into triangles
			collisionRange: 15,
			 //ray's field of view range
		  });


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

		this.rayFOV.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionFOV = this.rayFOV.castCircle();
		
	}

	
	setupFOV()
	{
		this.fov = new Mrpas(this.currentMap.map.width, this.currentMap.map.height, (x, y) => {
			const tile = this.currentMap.ground.getTileAt(x, y)
			const tileWall = this.currentMap.walls.getTileAt(x, y)
			
			
			return tile && !tile.collides && !tileWall
		})
		
		
	}

	updateFOV()
	{
		if(!this.fov || !this.currentMap || !this.currentMap.ground || !this.myPlayer) { return; }

		const camera = this.cameras.main

		const bounds = new Phaser.Geom.Rectangle(
			this.currentMap.map.worldToTileX(camera.worldView.x) - 1,
			this.currentMap.map.worldToTileY(camera.worldView.y) - 1,
			this.currentMap.map.worldToTileX(camera.worldView.width) + 2,
			this.currentMap.map.worldToTileX(camera.worldView.height) + 3
		)


		for (let y = bounds.y; y < bounds.y + bounds.height; y++)
		{
			for (let x = bounds.x; x < bounds.x + bounds.width; x++)
			{
				if (y < 0 || y >= this.currentMap.map.height || x < 0 || x >= this.currentMap.map.width)
				{
					
					continue
					
				}
	
				const tile = this.currentMap.ground.getTileAt(x, y)
				if (!tile)
				{
					continue
				}
	
				tile.alpha = 1
				tile.tint = 0x404040
			}
		}
	
		// calculate fov here...

		// get player's position
	const px = this.currentMap.map.worldToTileX(this.myPlayer.x)
	const py = this.currentMap.map.worldToTileY(this.myPlayer.y)
	
	// compute fov from player's position
	this.fov.compute(
		px,
		py,
		7,
		(x, y) => {
			const tile = this.currentMap.ground.getTileAt(x, y)
			



			if (!tile)
			{
				
				return false
			}

			

			return tile.tint === 0xffffff
		},
		(x, y) => {
			const tile = this.currentMap.ground.getTileAt(x, y)




			if (!tile)
			{
				
				return false
			}
			const d = Phaser.Math.Distance.Between(py, px, y, x)
			const alpha = Math.min(2 - d / 6, 1)
			tile.tint = 0xffffff
			tile.alpha =  alpha
		}
	)
	}

	setFollowingCamera(player)
	{
		//this.physics.world.setBounds()
		this.cameras.main.startFollow(player);
	}

	handlePlayerEnemyCollision(player, enemy)
	{
		this.collidedEnemy = enemy;

		this.xImpactSide = this.myPlayer.x - this.collidedEnemy.x;
		this.yImpactSide = this.myPlayer.y - this.collidedEnemy.y;

		this.directionVector = new Phaser.Math.Vector2(this.xImpactSide, this.yImpactSide).normalize().scale(200);

		this.myPlayer.handleDamage(this.directionVector);

		sceneEvents.emit('playerHealthChanged', this.myPlayer.health);
		
	}

	handleProjectilesEnemyCollision(projectile, enemy)
	{
		projectile.destroy();

		enemy.setVelocity(0,0); // wyzerowac knockback
		enemy.timeFromLastDirectionChange = enemy.directionChangeCooldown; // zmienic kierunek (i tak pewnie useless bo ma gonic)

		enemy.enemyHealth -= projectile.projectileDamage;
		enemy.updateHP();
		console.log(enemy.enemyHealth)
	}

	handleProjectilesWallsCollision(projectile, wall)
	{
		projectile.destroy();
	}

	handlePlayerChestCollision(player, chest)
	{
		this.myPlayer.setChest(chest)
		
		if(this.myPlayer.keyF.isDown)
		{
			if(this.myPlayer.currentChest)
			{
				this.myPlayer.currentChest.openChest();
			}
		}
	}

	handlePlayerPickupCollision(player, item)
	{	
		//this.myPlayer.inventory.addItem({name: item.name, quantity: 1});
		this.myPlayer.inventory.addItem({name: 'health_potion', frame: 11, quantity: 1});
		item.destroy();
	}

	handlePlayerWorkbenchCollision(player, workbench)
	{

		this.myPlayer.setWorkbench(workbench)
		
		if(this.myPlayer.currentWorkbench !== undefined)
		{
			this.input.keyboard.on('keydown-C',() =>{
				if(this.scene.isActive('SceneCrafting')){
					this.isCraftingActive = false;
					this.scene.stop('SceneCrafting');
				}
				else
				{
					this.isCraftingActive = true;
					this.scene.run('SceneCrafting', {mainScene: this});
				}
			});
		}
	}
}

