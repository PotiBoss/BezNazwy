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

		this.deathFlag = false;

		this.spawnPlayer();
		//this.changeCraftingScene();
		this.setupRaycast();
	
		//this.spawnEnemy();

		//this.setupFOV();
		this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.lateUpdate, this)
		//this.createFOW();

		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;
		
		this.gameBGM = this.sound.add('gameBGM', {
			volume: 0.00,
			loop: true
		});
		this.gameBGM.play();

		this.addBackgroundBuffs();

		this.endingFlag = false;
		this.bossFlag = false;
	}

	update(time, deltaTime)
	{
		this.myPlayer.updateMovement2();
		//this.updateRaycast(); JAK TO WLONCZE TO FPSY ROBIA BRRRRRRRRRRR
		this.myPlayer.handleState(deltaTime);
		this.myPlayer.handleAttack();

		//this.updateFOV();
		//this.updateFOW();

		//console.log(this.myPlayer.x)
		this.checkDialog();
	}

	checkDialog()
	{
		if(this.myPlayer.health <= 0  && this.deathFlag == false)
		{
			this.deathFlag = true;
			sceneEvents.emit('playerDeath');
		}
		
	}

	lateUpdate(time, deltaTime)
	{
		this.myPlayer.healthbar.preUpdate();
		if(this.myPlayer.potionHand !== undefined)
		{
			this.myPlayer.potionHand.preUpdate();
		}
		if(this.myPlayer.skillUI !== undefined)
		{
			this.myPlayer.skillUI.preUpdate();
		}
		if(this.myPlayer.attackUI !== undefined)
		{
			this.myPlayer.attackUI.preUpdate();
		}
		if(this.myPlayer.bombUI !== undefined)
		{
			this.myPlayer.bombUI.preUpdate();
		}
		if(this.myPlayer.teleportUI !== undefined)
		{
			this.myPlayer.teleportUI.preUpdate();
		}

		this.backgroundRegen.x = this.myPlayer.x - 456;  
		this.backgroundCooldown.x = this.myPlayer.x - 420;	
		this.backgroundSpeed.x = this.myPlayer.x - 384;
		this.backgroundDamage.x = this.myPlayer.x - 348;	
		this.backgroundSkillDamage.x = this.myPlayer.x - 312;	
		this.backgroundLifeSteal.x = this.myPlayer.x - 276; 
		this.backgroundProjectileSpeed.x = this.myPlayer.x - 240;	
		this.backgroundAttackCooldown.x = this.myPlayer.x - 204; 
		this.backgroundAttackSpeed.x = this.myPlayer.x - 168;	
		this.backgroundRegen.y = this.myPlayer.y - 360; 
		this.backgroundCooldown.y = this.myPlayer.y - 360;	
		this.backgroundSpeed.y = this.myPlayer.y - 360;
		this.backgroundDamage.y = this.myPlayer.y - 360; 
		this.backgroundSkillDamage.y = this.myPlayer.y - 360;	
		this.backgroundLifeSteal.y = this.myPlayer.y - 360; 
		this.backgroundProjectileSpeed.y = this.myPlayer.y - 360;	
		this.backgroundAttackCooldown.y = this.myPlayer.y - 360; 
		this.backgroundAttackSpeed.y = this.myPlayer.y - 360;
	
		
		if(this.regenBuff !== undefined)
		{
			this.regenBuff.x = this.backgroundRegen.x;
			this.regenBuff.y = this.backgroundRegen.y;
		}
		if(this.speedBuff !== undefined)
		{
			this.speedBuff.x = this.backgroundSpeed.x;
			this.speedBuff.y = this.backgroundSpeed.y;
		}
		if(this.cooldownBuff !== undefined)
		{
			this.cooldownBuff.x = this.backgroundCooldown.x;
			this.cooldownBuff.y = this.backgroundCooldown.y;
		}
		if(this.damageBuff !== undefined)
		{
			this.damageBuff.x = this.backgroundDamage.x;
			this.damageBuff.y = this.backgroundDamage.y;
		}
		if(this.skillDamageBuff !== undefined)
		{
			this.skillDamageBuff.x = this.backgroundSkillDamage.x;
			this.skillDamageBuff.y = this.backgroundSkillDamage.y;
		}
		if(this.lifeStealBuff !== undefined)
		{
			this.lifeStealBuff.x = this.backgroundLifeSteal.x;
			this.lifeStealBuff.y = this.backgroundLifeSteal.y;
		}
		if(this.projectileSpeedBuff !== undefined)
		{
			this.projectileSpeedBuff.x = this.backgroundProjectileSpeed.x;
			this.projectileSpeedBuff.y = this.backgroundProjectileSpeed.y;
		}
		if(this.attackCooldownBuff !== undefined)
		{
			this.attackCooldownBuff.x = this.backgroundAttackCooldown.x;
			this.attackCooldownBuff.y = this.backgroundAttackCooldown.y;
		}
		if(this.attackSpeedBuff !== undefined)
		{
			this.attackSpeedBuff.x = this.backgroundAttackSpeed.x;
			this.attackSpeedBuff.y = this.backgroundAttackSpeed.y;
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
				this.myPlayer.setVelocity(0,0)
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
		this.myPlayer = new Player(this, 5500, 4750);
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
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.walls, this.handlePotionsWallsCollision, undefined, this);
		this.physics.add.collider(this.myPlayer, this.currentMap.door, this.handlePlayerDoorCollision, undefined, this);
		//skeleton
		this.physics.add.collider(this.currentMap.skeletons, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.skeletons, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.skeletons, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.skeletons, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.skeletons, this.handleBombEnemyCollision, undefined, this);
		this.physics.add.collider(this.currentMap.skeletons, this.currentMap.skeletons)
		this.physics.add.collider(this.currentMap.tauroses, this.currentMap.skeletons)
		this.physics.add.collider(this.currentMap.necromancers, this.currentMap.skeletons)
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.skeletons)
		this.physics.add.collider(this.currentMap.boss, this.currentMap.skeletons)
		//tauros
		this.physics.add.collider(this.currentMap.tauroses, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.tauroses, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.tauroses, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.tauroses, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.tauroses, this.handleBombEnemyCollision, undefined, this);
		this.physics.add.collider(this.currentMap.tauroses, this.currentMap.tauroses)
		this.physics.add.collider(this.currentMap.necromancers, this.currentMap.tauroses)
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.tauroses)
		this.physics.add.collider(this.currentMap.boss, this.currentMap.tauroses)
		//necro
		this.physics.add.collider(this.currentMap.necromancers, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.necromancers, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.necromancers, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.necromancers, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.necromancers, this.handleBombEnemyCollision, undefined, this);
		this.physics.add.collider(this.currentMap.necromancers, this.currentMap.necromancers)
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.necromancers)
		this.physics.add.collider(this.currentMap.boss, this.currentMap.necromancers)
		//range
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.rangeEnemies, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.rangeEnemies, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.rangeEnemies, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.enemyProj, this.currentMap.walls, this.handleProjectilesWallsCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.rangeEnemies, this.handleBombEnemyCollision, undefined, this);
		this.physics.add.collider(this.currentMap.rangeEnemies, this.currentMap.rangeEnemies)
		this.physics.add.collider(this.currentMap.boss, this.currentMap.rangeEnemies)
		//boss
		this.physics.add.collider(this.currentMap.boss, this.currentMap.walls);
		this.physics.add.collider(this.myPlayer, this.currentMap.boss, this.handlePlayerEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.projectiles, this.currentMap.boss, this.handleProjectilesEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.potions, this.currentMap.boss, this.handlePotionEnemyCollision, undefined, this);
		this.physics.add.collider(this.myPlayer.bombs, this.currentMap.boss, this.handleBombEnemyCollision, undefined, this);
		this.physics.add.collider(this.currentMap.boss, this.currentMap.boss)	
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


		  //
		  this.rayRightUpper = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y-16
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayRightUpper.setAngleDeg(0);

		  this.rayRightLower = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y+16
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayRightLower.setAngleDeg(0);

		  this.rayDownLeft = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x-16,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayDownLeft.setAngleDeg(90);

		  this.rayDownRight = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x+16,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayDownRight.setAngleDeg(90);

		  this.rayLeftUpper = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y-16
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayLeftUpper.setAngleDeg(180)

		  this.rayLeftLower = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x,
			  y: this.myPlayer.y+16
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayLeftLower.setAngleDeg(180);

		  this.rayUpLeft = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x-16,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayUpLeft.setAngleDeg(270);

		  this.rayUpRight = this.raycaster.createRay({
			origin: {
			  x: this.myPlayer.x+16,
			  y: this.myPlayer.y
			},
			autoSlice: true, 
			collisionRange: this.myPlayer.playerSpeed, 
		  });
		  this.rayUpRight.setAngleDeg(270);

		this.raycaster.debugOptions.enabled = true;



		this.raycaster.mapGameObjects(this.currentMap.walls, false, {
			collisionTiles: [14,15,16,17,18,33,34,35,36,37,52,53,54,55,56,71,72,73,74,75,79,80,81,82,98,99,100,101,117,118,119,120,163,164,165,166,167,168,169,170,361,362,363,364,365,366,367,368,369,
				370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,
				408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,
				446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,
				484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,
				522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,
				560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,
				598,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,620,621,622,623,624,632,633,634,635,636,637,638] 
		});
		
		

		this.wallsRaycast = this.add.group(this.currentMap.walls);
		this.raycaster.mapGameObjects(this.wallsRaycast.getChildren());
		this.updateRaycast();
	}

	updateRaycast()
	{ 
		this.rayRightDown.setOrigin(this.myPlayer.x, this.myPlayer.y); //
		this.rayLeftDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayLeftUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayRightUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
  		this.rayRight.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayLeft.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.rayFOV.setOrigin(this.myPlayer.x, this.myPlayer.y);
			

		this.intersectionRightDown = this.rayRightDown.cast(); 
		this.intersectionLeftDown = this.rayLeftDown.cast();
		this.intersectionLeftUp = this.rayLeftUp.cast();
		this.intersectionRightUp = this.rayRightUp.cast();
		this.intersectionRight = this.rayRight.cast();
		this.intersectionLeft = this.rayLeft.cast();
		this.intersectionUp = this.rayUp.cast();
		this.intersectionDown = this.rayDown.cast();		
		this.intersectionFOV = this.rayFOV.castCircle();		
	}

	updateRaycastRightDown()
	{
		this.rayRightDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionRightDown = this.rayRightDown.cast();
	}

	updateRaycastLeftDown()
	{
		this.rayLeftDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionLeftDown = this.rayLeftDown.cast();
	}

	updateRaycastLeftUp()
	{
		this.rayLeftUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionLeftUp = this.rayLeftUp.cast();
	}

	updateRaycastRightUp()
	{
		this.rayRightUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionRightUp = this.rayRightUp.cast();
	}

	updateRaycastRight()
	{
		this.rayRight.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionRight = this.rayRight.cast();
		this.rayRightUpper.setOrigin(this.myPlayer.x, this.myPlayer.y-16);
		this.intersectionRightUpper = this.rayRightUpper.cast();
		this.rayRightLower.setOrigin(this.myPlayer.x, this.myPlayer.y+16);
		this.intersectionRightLower = this.rayRightLower.cast();
	}

	updateRaycastLeft()
	{
		this.rayLeft.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionLeft = this.rayLeft.cast();
		this.rayLeftUpper.setOrigin(this.myPlayer.x, this.myPlayer.y-16);
		this.intersectionLeftUpper = this.rayLeftUpper.cast();
		this.rayLeftLower.setOrigin(this.myPlayer.x, this.myPlayer.y+16);
		this.intersectionLeftLower = this.rayLeftLower.cast();
	}

	updateRaycastUp()
	{
		this.rayUp.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionUp = this.rayUp.cast();
		this.rayUpLeft.setOrigin(this.myPlayer.x-16, this.myPlayer.y);
		this.intersectionUpLeft = this.rayUpLeft.cast();
		this.rayUpRight.setOrigin(this.myPlayer.x+16, this.myPlayer.y);
		this.intersectionUpRight = this.rayUpRight.cast();
	}

	updateRaycastDown()
	{
		this.rayDown.setOrigin(this.myPlayer.x, this.myPlayer.y);
		this.intersectionDown = this.rayDown.cast();
		this.rayDownLeft.setOrigin(this.myPlayer.x-16, this.myPlayer.y);
		this.intersectionDownLeft = this.rayDownLeft.cast();
		this.rayDownRight.setOrigin(this.myPlayer.x+16, this.myPlayer.y);
		this.intersectionDownRight = this.rayDownRight.cast();
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

	addBackgroundBuffs()
	{
		this.backgroundRegen = this.add.image(24 + 0 * 32, 24, 'buffBackground');	
		this.backgroundCooldown = this.add.image(24 + 1 * 32, 24, 'buffBackground');	
		this.backgroundSpeed = this.add.image(24 + 2 * 32, 24, 'buffBackground');
		this.backgroundDamage = this.add.image(24 + 3 * 32, 24, 'buffBackground');	
		this.backgroundSkillDamage = this.add.image(24 + 4 * 32, 24, 'buffBackground');	
		this.backgroundLifeSteal = this.add.image(24 + 5 * 32, 24, 'buffBackground');	
		this.backgroundProjectileSpeed = this.add.image(24 + 6 * 32, 24, 'buffBackground');	
		this.backgroundAttackCooldown = this.add.image(24 + 7 * 32, 24, 'buffBackground');	
		this.backgroundAttackSpeed = this.add.image(24 + 8 * 32, 24, 'buffBackground');	
			
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
		this.pickUp = this.sound.add('pickUp', {
			volume: 0.1,
		});
		this.pickUp.play();
		item.destroy();
	}

	handlePlayerCooldownBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'cooldownHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 18);
		this.pickUp = this.sound.add('pickUp', {
			volume: 0.1,
		});
		this.pickUp.play();
		item.destroy();
	}

	handlePlayerSpeedBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'speedHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 19);
		this.pickUp = this.sound.add('pickUp', {
			volume: 0.1,
		});
		this.pickUp.play();
		item.destroy();
	}

	handlePlayerDamageBushCollision(player, item)
	{	
		this.myPlayer.inventory.addItem({name: 'damageHerb', quantity: 1});
		this.add.sprite(item.x, item.y, 'pots', 15);
		this.pickUp = this.sound.add('pickUp', {
			volume: 0.1,
		});
		this.pickUp.play();
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
			if(this.myPlayer.health > this.myPlayer.maxHealth) {this.myPlayer.health = this.myPlayer.maxHealth}
			this.myPlayer.healthbar.setMeterPercentage(this.myPlayer.health * 100 / this.myPlayer.maxHealth);
		}

		if(this.myPlayer.attackCooldownReduction)
		{
			this.myPlayer.timeFromLastPotion -= this.myPlayer.potionCooldown / 2;
			this.myPlayer.timeFromLastBomb -= this.myPlayer.bombCooldown / 2;
		}

		enemy.enemyHealth -= projectile.projectileDamage;
		enemy.updateHP();

		this.collsionSound = this.sound.add('projectileHit', {
			volume: 0.065,
		});
		this.collsionSound.play();

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

	handlePotionsWallsCollision(potion, wall)
	{
		potion.destroyPotion(wall);
	}

	handlePlayerDoorCollision(player, door)
	{
		if(this.endingFlag == false && this.bossFlag == true)
		{
			this.myPlayer.healthState = 2;
			this.myPlayer.anims.stop();
			this.endingFlag = true;
			sceneEvents.emit('gameCleared');
		}
	}
}

