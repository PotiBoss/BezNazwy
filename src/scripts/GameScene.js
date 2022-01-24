import Phaser from 'phaser';

import Player from './Player';
import Map from './Map';
import { sceneEvents } from './EventCommunicator';

import { Mrpas } from 'mrpas'

import ProjectileEnemy from './ProjectileEnemy';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
		super("GameScene");
		
    }

    preload()
    {

    }

    create()
    {

		this.enemyProj = this.physics.add.group({classType:ProjectileEnemy});
		this.currentMap = new Map(this);
		
		this.hitCounter = 0;
		this.isCraftingActive = false;
		this.fullWidth = 300;

		this.spawnPlayer();
		//this.changeCraftingScene();
		this.setupRaycast();
	
		//this.spawnEnemy();

		this.setupFOV();
		this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.lateUpdate, this)
		this.createFOW();


		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;
		
		this.gameBGM = this.sound.add('gameBGM', {
			volume: 0.05,
			loop: true
		});
		this.gameBGM.play();
	}

	update(time, deltaTime)
	{
		this.myPlayer.updateMovement2();
		this.updateRaycast();
		this.myPlayer.handleState(deltaTime);
		this.myPlayer.handleAttack();

		this.updateFOV();
		this.updateFOW();

	}

	lateUpdate(time, deltaTime)
	{
		this.myPlayer.healthbar.preUpdate();
		if(this.myPlayer.potionHand !== undefined)
		{
			this.myPlayer.potionHand.preUpdate();
		}
		
	
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
				sceneEvents.emit('startCrafting');
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
		this.UI = this.scene.run('UI', {mainScene: this});
		this.scene.run('SceneInventory', {mainScene: this});
		this.setFollowingCamera(this.myPlayer);
		this.setColliders();		
	}

	setColliders()
	{
		//player
		this.physics.add.collider(this.myPlayer, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.walls, this.handleProjectilesWallsCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.chests, this.handlePlayerChestCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.healthBush, this.handlePlayerHealthBushCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.cooldownBush, this.handlePlayerCooldownBushCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.speedBush, this.handlePlayerSpeedBushCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.damageBush, this.handlePlayerDamageBushCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.rangeEnemies.projectiles, this.handlePlayerProjectilesCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.workbenches, this.handlePlayerWorkbenchCollision, undefined, this);
		this.physics.add.overlap(this.myPlayer, this.currentMap.teleporters, this.handlePlayerTeleporterCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.enemyProj, this.handlePlayerProjectilesCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.walls, this.handleBombsWallsCollision, undefined, this);
		//skeleton
		this.physics.add.collider(this.currentMap.skeletons, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.skeletons, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.skeletons, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.skeletons, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.skeletons, this.handleBombEnemyCollision, undefined, this);
		//tauros
		this.physics.add.collider(this.currentMap.tauroses, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.tauroses, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.tauroses, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.tauroses, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.tauroses, this.handleBombEnemyCollision, undefined, this);
		//necro
		this.physics.add.collider(this.currentMap.necromancers, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.necromancers, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.necromancers, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.necromancers, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.necromancers, this.handleBombEnemyCollision, undefined, this);
		//range
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.rangeEnemies, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.rangeEnemies, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.rangeEnemies, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.enemyProj, this.currentMap.walls, this.handleProjectilesWallsCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.rangeEnemies, this.handleBombEnemyCollision, undefined, this);
		//boss
		this.physics.add.collider(this.currentMap.boss, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.boss, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.boss, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.boss, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.boss, this.handleBombEnemyCollision, undefined, this);	
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

	handlePlayerSkeletonCollision(player, enemy)
	{
		this.collidedEnemy = enemy;

		this.xImpactSide = this.myPlayer.x - this.collidedEnemy.x;
		this.yImpactSide = this.myPlayer.y - this.collidedEnemy.y;

		this.directionVector = new Phaser.Math.Vector2(this.xImpactSide, this.yImpactSide).normalize().scale(200);

		this.myPlayer.handleDamage(this.directionVector);

		sceneEvents.emit('playerHealthChanged', this.myPlayer.health);
		
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

	handlePlayerHealthBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'healthHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 17);
		item.destroy();
	}

	handlePlayerCooldownBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'cooldownHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 18);
		item.destroy();
	}

	handlePlayerSpeedBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'speedHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 19);
		item.destroy();
	}

	handlePlayerDamageBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'damageHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 15);
		item.destroy();
	}

	handlePlayerWorkbenchCollision(player, workbench)
	{
	
		this.myPlayer.setWorkbench(workbench);
		if(this.myPlayer.currentWorkbench !== undefined)
		{
			this.input.keyboard.on('keydown-C',() =>{
				if(this.scene.isActive('SceneCrafting'))
				{
					this.myPlayer.healthState = this.myPlayer.unharmed;
					this.isCraftingActive = false;
					this.scene.stop('SceneCrafting');					
				}
				else
				{
					if(Math.abs(player.x - workbench.x) < 35 && Math.abs(player.y - workbench.y) < 35)
					{
						this.isCraftingActive = true;
						this.myPlayer.healthState = this.myPlayer.craftingNow;
						this.scene.run('SceneCrafting', {mainScene: this});
					}
				}
			});
		}
	}

	handlePlayerEnemyCollision(player, enemy)
	{
		this.xImpactSide = this.myPlayer.x - enemy.x;
		this.yImpactSide = this.myPlayer.y - enemy.y;

		this.directionVector = new Phaser.Math.Vector2(this.xImpactSide, this.yImpactSide).normalize().scale(250);

		this.myPlayer.handleDamage(this.directionVector, enemy.collisionDamage);

		sceneEvents.emit('playerHealthChanged', this.myPlayer.health);
	}

	handleProjectilesEnemyCollision(projectile, enemy)
	{
		projectile.destroyAnimation();
		projectile.destroy();


		//projectile.destroy();

		enemy.setVelocity(0,0); // wyzerowac knockback
		enemy.timeFromLastDirectionChange = enemy.directionChangeCooldown; // zmienic kierunek (i tak pewnie useless bo ma gonic)
		
		enemy.damageTime = 0;

		if(this.myPlayer.lifesteal > 0)
		{ 
			this.myPlayer.health += 5;
			this.myPlayer.healthbar.setMeterPercentage(this.myPlayer.health * 100 / this.myPlayer.maxHealth);
		}

		if(this.myPlayer.attackCooldownReduction)
		{
			this.myPlayer.timeFromLastPotion -= this.myPlayer.potionCooldown / 2;
			this.myPlayer.timeFromLastBomb -= this.myPlayer.bombCooldown / 2;
		}

		enemy.enemyHealth -= projectile.projectileDamage;
		enemy.updateHP();

		this.timerEnemyDamaged = this.time.addEvent({ 
			delay: 1000, 
			callback: enemy.clearTint, 
			callbackScope: enemy});
	}

	handlePotionEnemyCollision(potion, enemy)
	{
		potion.destroyPotion(enemy);
		enemy.setVelocity(0,0); 
		enemy.changeDirection(); // ???
	}

	handlePlayerTeleporterCollision(player, teleporter) 
	{
		teleporter.teleportOnPress(player);
	}

	handlePlayerProjectilesCollision(player, projectile)
	{
		this.xImpactSide = this.myPlayer.x - projectile.x;
		this.yImpactSide = this.myPlayer.y - projectile.y;

		projectile.destroy();

		this.directionVector = new Phaser.Math.Vector2(this.xImpactSide, this.yImpactSide).normalize().scale(250);

		this.myPlayer.handleDamage(this.directionVector, projectile.projectileDamage);

		sceneEvents.emit('playerHealthChanged', this.myPlayer.health);
	}

	handleBombEnemyCollision(bomb, enemy)
	{
		bomb.explode(enemy);
		enemy.enemyHealth -= bomb.damage;
		enemy.updateHP();
		enemy.damageTime = 0;
		this.timerEnemyDamaged = this.time.addEvent({ 
			delay: 1000, 
			callback: enemy.clearTint, 
			callbackScope: enemy});
	}

	handleExplosionEnemyCollision(explosion, enemy)
	{
		explosion.destroy();
	}

	handleBombsWallsCollision(explosion, wall)
	{
		explosion.explode(this.myPlayer);
	}
}

