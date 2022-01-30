import initAnims from './AnimsPlayer'
import Projectile from './Projectile';
import { getTimeStamp } from './GetTimeStamp';
import Inventory from './Inventory';
import Crafting from './Crafting'
import SkillPotion from './SkillPotion';
import HealthBar from './HealthBar';
import PotionInHand from './PotionInHand';
import SkillBomb from './SkillBomb';
import SkillBackgroundUI from './SkillBackgroundUI';
import ProjectileUI from './ProjectileUI';
import BombUI from './BombUI';
import TeleportUI from './TeleportUI';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'playerBase');

		scene.add.existing(this);
		scene.physics.add.existing(this);
		initAnims(scene.anims);

		this.scene = scene;
		this.square2 = 1.41;
		

		this.create();
	}

	create()
	{
		this.playerSpeed = 150;
		this.health = 100;
		this.maxHealth = 100;
		this.healthState = 0;
		this.damageTime = 0;
		this.damagedInvulnerability = 500;

		this.points = 0;

		this.fireRate = 1000;
		this.timeFromLastShot = null;

		this.teleportCooldown = 1000;
		this.timeFromLastTeleport = null;

		this.potionCooldown = 3000;
		this.timeFromLastPotion = null;
		this.potionAnimation = "potionSide";
		this.bombAnimation = "bombSide";

		this.bombCooldown = 5000;
		this.timeFromLastBomb = null;
		
		this.projectiles = this.scene.physics.add.group({classType:Projectile});
		this.potions = this.scene.physics.add.group({classType:SkillPotion});
		this.bombs = this.scene.physics.add.group({classType:SkillBomb});

		this.inventory = new Inventory(this.scene);
		this.crafting = new Crafting(this);
		this.healthbar = new HealthBar(this.scene, this);	

		//this.skillUI = new SkillBackgroundUI(this.scene, this);

		this.attackUI = new ProjectileUI(this.scene, this);
		this.potionHand = new PotionInHand(this.scene, this);
		this.bombUI = new BombUI(this.scene, this);
		this.teleportUI = new TeleportUI(this.scene, this);


		this.skillDamageBonus = 0;
		this.cooldownReduction = 1.0;
		this.damageBonus = 1.0
		this.lifesteal = 0;
		this.projectileSpeedBonus = 1.0;
		this.attackCooldownReduction = false;
		this.attackSpeedReduction = 1.0;

		this.anims.play('run-Down', true);

		//this.setCollideWorldBounds();
		this.setupMovement();
		this.setupStates();
	}

	setupMovement()
	{
		this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

		this.left = 0
		this.right = 0
		this.down = 0
		this.up = 0

		this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
		this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
	}

	setupStates()
	{
		this.unharmed = 0;
		this.damaged = 1;
		this.dead = 2;
		this.craftingNow = 3;
	}

	updateMovement() // nie wiem co pilem jak myslalem ze to super smart pomysl ale nie dosyc ze to overkill to do tego chujowo dziala
	{
		// zmieniamy boole na zakres 1 0 -1 dla kierunku ruchu
		if(this.keyA.isDown)
		{
			this.left = 1;
		//	this.anims.play('runUp', true);
			//this.flipX = true;
		}
		if(this.keyD.isDown)
		{
			this.right = 1;
			//this.anims.play('runSide', true);
			//this.flipX = false;
		}
		if(this.keyS.isDown)
		{
			this.down = 1;
			//this.anims.play('runDown', true);
			//this.flipY = false;
		}
		if(this.keyW.isDown)
		{
			this.up = 1;
			//this.flipY = true;
		}

		if(this.keyA.isUp)
		{
			this.left = 0;
		}
		if(this.keyD.isUp)
		{
			this.right = 0;
			//this.anims.play('idleSide');
		}
		if(this.keyS.isUp)
		{
			this.down = 0;
			//this.anims.play('idleDown');
		}
		if(this.keyW.isUp)
		{
			this.up = 0;
		}
		
		// odejmujemy od siebie kierunku by dostac kierunek postaci
		this.hInput = this.right - this.left;
		this.vInput = this.down - this.up;

		if(this.hInput != 0 || this.vInput != 0)
		{
			this.setVelocityY(this.vInput * this.playerSpeed);
			this.setVelocityX(this.hInput * this.playerSpeed);
		}
		else // zerujemy gdy nic nie jest nacisniete
		{
			this.setVelocityY(0);
			this.setVelocityX(0);
		}

		this.teleport(this.scene.input.activePointer);
	}

	updateMovement2()
	{

		if(this.healthState === this.damaged || this.healthState === this.dead || this.healthState === this.craftingNow) {return;}


		if(this.keyD.isDown && this.keyW.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.setVelocityY(-this.playerSpeed);
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side')  && (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Up', true);
			}
		}

		else if(this.keyD.isDown && this.keyS.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.setVelocityY(this.playerSpeed);
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Down', true);
			}
		}

		else if(this.keyA.isDown && this.keyS.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.setVelocityY(this.playerSpeed);
			this.flipX = true;
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Down', true);
			}
		}

		else if(this.keyA.isDown && this.keyW.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.setVelocityY(-this.playerSpeed);
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Up', true);
			}
		}

		else if(this.keyA.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.flipX = true;
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Side', true);
			}
		}

		else if(this.keyD.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.flipX = false;
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Side', true);
			}
		}

		else if(this.keyW.isDown)
		{
			this.setVelocityY(-this.playerSpeed);
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Up', true);
			}
		}

		else if(this.keyS.isDown)
		{
			this.setVelocityY(this.playerSpeed);
			if(this.anims.currentAnim != null && (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side') && (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side') && (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side'))
			{
				this.anims.play('run-Down', true);
			}
		}
		
		else // NIE RUSZAC to gowno nie dzialalo przez 2 godziny i nagle zaczelo dzialac :)
		{
			if(this.anims.currentAnim != null 
				&& (this.anims.currentAnim.key != 'throw-Up' && this.anims.currentAnim.key != 'throw-Down' && this.anims.currentAnim.key != 'throw-Side')
				&& (this.anims.currentAnim.key != '2throw-Up' && this.anims.currentAnim.key != '2throw-Down' && this.anims.currentAnim.key != '2throw-Side')
				&& (this.anims.currentAnim.key != '3throw-Up' && this.anims.currentAnim.key != '3throw-Down' && this.anims.currentAnim.key != '3throw-Side')
				&& this.healthState != 2)
			{
				const parts = this.anims.currentAnim.key.split('-')
				parts[0] = 'idle'
				this.anims.play(parts.join('-'))
				this.setVelocity(0, 0)
			}
		}


		if(this.keyA.isUp && this.keyD.isUp)
		{
			this.setVelocityX(0);
		}

		if(this.keyW.isUp && this.keyS.isUp)
		{
			this.setVelocityY(0);
		}

		if(this.keyD.isDown && this.keyS.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportRightDown(this.body.velocity, this.scene.intersectionRightDown);
		}

		else if(this.keyA.isDown && this.keyS.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportLeftDown(this.body.velocity, this.scene.intersectionLeftDown);
		}

		else if(this.keyA.isDown && this.keyW.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportLeftUp(this.body.velocity, this.scene.intersectionLeftUp);
		}

		else if(this.keyD.isDown && this.keyW.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportRightUp(this.body.velocity, this.scene.intersectionRightUp);
		}

		else if(this.keyD.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportRight(this.body.velocity, this.scene.intersectionRight);
		}
		
		else if(this.keyA.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportLeft(this.body.velocity, this.scene.intersectionLeft);
		}

		else if(this.keyW.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportUp(this.body.velocity, this.scene.intersectionUp);
		}

		else if(this.keyS.isDown && this.keySpace.isDown)
		{
			//this.scene.updateRaycast();
			this.teleportDown(this.body.velocity, this.scene.intersectionDown);
		}

		//this.scene.input.keyboard.resetKeys(); 

	}
	


	lookAtMouse(pointer)
	{
		this.angleBetweenPlayerAndMouse = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY);
		this.angleDetla = (this.angleBetweenPlayerAndMouse - this.rotation);
		this.directionPointer();
	}

	lookAtMouse2(pointer)
	{
		this.angleBetweenPlayerAndMouse = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY);
		this.angleDetla = (this.angleBetweenPlayerAndMouse - this.rotation);
		this.directionPointer2();
	}

	directionPointer()
	{
		if(this.angleDetla > -22.5 &&  this.angleDetla <= 22.5)
		{
			this.flipX = false;
			if(this.currentPotion == 0)
			{
				this.anims.play('throw-Side', true);
			}
			else
			{
				this.anims.play('throw-Side', true);
			}
			this.potionAnimation = 'potionSide';
			this.bombAnimation = 'bombSide';
		}
		else if( this.angleDetla > 22.5 && this.angleDetla <= 67.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Down', true);
			}
			else
			{
				this.anims.play('throw-Down', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 67.5 && this.angleDetla <= 112.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Down', true);
			}
			else
			{
				this.anims.play('throw-Down', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 112.5 && this.angleDetla <= 157.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Down', true);
			}
			else
			{
				this.anims.play('throw-Down', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 157.5 || this.angleDetla <= -157.5)
		{
			this.flipX = true;
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Side', true);
			}
			else
			{
				this.anims.play('throw-Side', true);
			}
			this.potionAnimation = 'potionSide';
			this.bombAnimation = 'bombSide';
		}
		else if( this.angleDetla > -157.5 && this.angleDetla <= -112.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Up', true);
			}
			else
			{
				this.anims.play('throw-Up', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > -112.5 && this.angleDetla <= -67.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Up', true);
			}
			else
			{
				this.anims.play('throw-Up', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > -67.5 && this.angleDetla <= -22.5)
		{
			if(this.currentPotion == 0)
			{
				this.anims.play('2throw-Up', true);
			}
			else
			{
				this.anims.play('throw-Up', true);
			}
			this.potionAnimation = 'potionFront';
			this.bombAnimation = 'bombFront';
		}
	}

	directionPointer2()
	{
		if(this.angleDetla > -22.5 &&  this.angleDetla <= 22.5)
		{
			this.flipX = false;
			this.anims.play('2throw-Side', true);
			this.bombAnimation = 'bombSide';
		}
		else if( this.angleDetla > 22.5 && this.angleDetla <= 67.5)
		{
			this.anims.play('2throw-Down', true);
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 67.5 && this.angleDetla <= 112.5)
		{
			this.anims.play('2throw-Down', true);
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 112.5 && this.angleDetla <= 157.5)
		{
			this.anims.play('2throw-Down', true);
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > 157.5 || this.angleDetla <= -157.5)
		{
			this.flipX = true;
			this.anims.play('2throw-Side', true);
			this.bombAnimation = 'bombSide';
		}
		else if( this.angleDetla > -157.5 && this.angleDetla <= -112.5)
		{
			this.anims.play('2throw-Up', true);
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > -112.5 && this.angleDetla <= -67.5)
		{
			this.anims.play('2throw-Up', true);
			this.bombAnimation = 'bombFront';
		}
		else if( this.angleDetla > -67.5 && this.angleDetla <= -22.5)
		{
			this.anims.play('2throw-Up', true);
			this.bombAnimation = 'bombFront';
		}
	}

	teleportRightDown(playerVelocity, raycastIntersection)
	{

			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastRightDown();
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(this.scene.intersectionRightDown.x-this.x-16, 0, 150) / this.square2;
			this.y += Phaser.Math.Clamp(this.scene.intersectionRightDown.y-this.y-16, 0, 150) / this.square2;
			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	teleportLeftDown(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastLeftDown();
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(this.scene.intersectionLeftDown.x-this.x+16, -150, 0) / this.square2;
			this.y += Phaser.Math.Clamp(this.scene.intersectionLeftDown.y-this.y-16, 0, 150) / this.square2;
			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	teleportLeftUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastLeftUp();
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(this.scene.intersectionLeftUp.x-this.x+16, -150, 0) / this.square2;
			this.y += Phaser.Math.Clamp(this.scene.intersectionLeftUp.y-this.y+16, -150, 0) / this.square2;
			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	teleportRightUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastRightUp();
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(this.scene.intersectionRightUp.x-this.x-16, 0, 150) / this.square2;
			this.y += Phaser.Math.Clamp(this.scene.intersectionRightUp.y-this.y+16, -150, 0) / this.square2;
			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();	
	}

	teleportRight(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastRight();
			this.timeFromLastTeleport = getTimeStamp();

			if(Math.abs(this.scene.intersectionRightUpper.x - this.x) < 150 && Math.abs(this.x - this.scene.intersectionRightLower.x) > Math.abs(this.scene.intersectionRightUpper.x - this.x) && this.scene.intersectionRightUpper.x !== this.scene.intersectionRight.x)
			{
				console.log("upper")
				this.x += Phaser.Math.Clamp(this.scene.intersectionRight.x-this.x-16, 0, 150);
				this.y += 16;
			}
			else if(Math.abs(this.x - this.scene.intersectionRightLower.x) < 150 && Math.abs(this.x - this.scene.intersectionRightLower.x) < Math.abs(this.scene.intersectionRightUpper.x - this.x) && this.scene.intersectionRightLower.x !== this.scene.intersectionRight.x)
			{
				console.log("lower")
				this.x += Phaser.Math.Clamp(this.scene.intersectionRight.x-this.x-16, 0, 150);
				this.y -= 16;	
			}
			else
			{
				this.x += Phaser.Math.Clamp(this.scene.intersectionRight.x-this.x-16, 0, 150);
			}

			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();

			this.destroyTeleport();
	}

	teleportLeft(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastLeft();
			this.timeFromLastTeleport = getTimeStamp();

			if(Math.abs(this.scene.intersectionLeftUpper.x - this.x) < 150 && Math.abs(this.x - this.scene.intersectionLeftLower.x) > Math.abs(this.scene.intersectionLeftUpper.x - this.x) && this.scene.intersectionLeftUpper.x !== this.scene.intersectionLeft.x)
			{
				this.x += Phaser.Math.Clamp(this.scene.intersectionLeft.x-this.x+16, -150, 0);
				this.y += 16;
			}
			else if(Math.abs(this.x - this.scene.intersectionLeftLower.x) < 150 && Math.abs(this.x - this.scene.intersectionLeftLower.x) < Math.abs(this.scene.intersectionLeftUpper.x - this.x) && this.scene.intersectionLeftLower.x !== this.scene.intersectionLeft.x)
			{
				this.x += Phaser.Math.Clamp(this.scene.intersectionLeft.x-this.x+16, -150, 0);
				this.y -= 16;
			}
			else 
			{
				this.x += Phaser.Math.Clamp(this.scene.intersectionLeft.x-this.x+16, -150, 0);
			}

			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	teleportUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastUp();
			this.timeFromLastTeleport = getTimeStamp();

			if(Math.abs(this.scene.intersectionUpLeft.y - this.y) < 150 && Math.abs(this.y - this.scene.intersectionUpLeft.y) < Math.abs(this.y - this.scene.intersectionUpRight.y) && this.scene.intersectionUpLeft.y !== this.scene.intersectionUp.y)
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionUp.y-this.y+16, -150, 0);
				this.x += 16;	
			}
			else if(Math.abs(this.scene.intersectionUpRight.y - this.y) < 150 && Math.abs(this.y - this.scene.intersectionUpLeft.y) > Math.abs(this.y - this.scene.intersectionUpRight.y) && this.scene.intersectionUpRight.y !== this.scene.intersectionUp.y)
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionUp.y-this.y+16, -150, 0);
				this.x -= 16;	
			}
			else
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionUp.y-this.y+16, -150, 0);
			}

			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	teleportDown(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.scene.updateRaycastDown();
			this.timeFromLastTeleport = getTimeStamp();

			if(Math.abs(this.scene.intersectionDownLeft.y - this.y) < 150 && Math.abs(this.y - this.scene.intersectionDownLeft.y) < Math.abs(this.y - this.scene.intersectionDownRight.y) && this.scene.intersectionDownLeft.y !== this.scene.intersectionDown.y)
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionDown.y-this.y-16, 0, 150);
				this.x += 16;
			}
			else if(Math.abs(this.scene.intersectionDownRight.y - this.y) < 150 && Math.abs(this.y - this.scene.intersectionDownLeft.y) > Math.abs(this.y - this.scene.intersectionDownRight.y) && this.scene.intersectionDownRight.y !== this.scene.intersectionDown.y)
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionDown.y-this.y-16, 0, 150);
				this.x -= 16;
			}
			else
			{
				this.y += Phaser.Math.Clamp(this.scene.intersectionDown.y-this.y-16, 0, 150);
			}


			this.blink = this.scene.sound.add('blink', {
				volume: 0.035,
			});
			this.blink.play();
			this.destroyTeleport();
	}

	handleState(deltaTime)
	{
		
		switch(this.healthState)
		{
			case this.unharmed:
				
				break;
			case this.damaged:
				this.damageTime += deltaTime;
				if(this.damageTime >= this.damagedInvulnerability)
				{
					this.healthState = this.unharmed;
					this.setTint(0xffffff);
					this.damageTime = 0
				}
				break;
		}
	}

	handleAttack() 
	{
		this.fireball();
		this.potionThrow();
		this.bombThrow();
	}

	fireball()
	{
		this.scene.input.on('pointerdown', (pointer) => 
		{
			if(this.healthState != this.unharmed) {return;}
			this.date = new Date();
			if(this.timeFromLastShot && this.timeFromLastShot + this.fireRate * this.attackSpeedReduction >  this.date){ return; }
			this.timeFromLastShot = getTimeStamp();

			if(this.lifesteal > 0)
			{
				this.lifesteal--;
			}

			if(this.scene.lifeStealBuff != undefined)
			{
				if(this.lifesteal <= 0)
				{
					this.inventory.removeLifeStealPotion();
				}
			}
			

			this.projectile = this.projectiles.get(this.x, this.y, this);
			this.projectile.fireProjectile(this, pointer);
			this.destroyProjectile();
		});
	}

	potionThrow()
	{
		
		this.scene.input.keyboard.on('keydown-Q', () => 
		{ 
			if(this.healthState != this.unharmed) {return;}
			this.date = new Date();
			if(this.timeFromLastPotion && this.timeFromLastPotion + this.potionCooldown * this.cooldownReduction >  this.date){ return; }
			//this.potionHand = new PotionInHand(this.scene, this);
			this.timeFromLastPotion = getTimeStamp();

			this.currentPotion = Math.floor(Math.random() * 2);
			
			this.lookAtMouse(this.scene.input.activePointer);


			var potionTimer = this.scene.time.addEvent({ 
				delay: 60, 
				callback: this.potionDelay,  
				callbackScope: this});

			this.on('animationcomplete', () =>
			{
				const parts = this.anims.currentAnim.key.split('-')
				parts[0] = 'idle'
				this.anims.play(parts.join('-'))
			})
		});
	}

	potionDelay()
	{
		this.potion = this.potions.get(this.x, this.y, this);
		this.potion.throw(this);
	}

	bombThrow()
	{
		
		this.scene.input.keyboard.on('keydown-E', () => 
		{
			if(this.healthState != this.unharmed) {return;}
			this.date2 = new Date();
			if(this.timeFromLastBomb && this.timeFromLastBomb + this.bombCooldown * this.cooldownReduction >  this.date2){ return; }
			this.timeFromLastBomb = getTimeStamp();

			this.lookAtMouse2(this.scene.input.activePointer);

			var bombTimer = this.scene.time.addEvent({ 
				delay: 60, 
				callback: this.bombDelay,  
				callbackScope: this});

			this.destroyBomb();

			if(this.scene.skillDamageBuff != undefined)
			{
				if(this.skillDamageBonus <= 0)
				{
					this.inventory.removeSkillDamagePotion();
				}
			}

			this.on('animationcomplete', () =>
			{
				const parts = this.anims.currentAnim.key.split('-')
				parts[0] = 'idle'
				this.anims.play(parts.join('-'))
			})
		});
	}

	bombDelay()
	{
		this.bomb = this.bombs.get(this.x, this.y, this);
		this.bomb.throw(this);
	}

	handleDamage(knockbackDirection, damage)
	{
		if(this.health <= 0) { return; }

		if(this.healthState === this.damaged) { return ;}

		this.health -= damage

		this.healthbar.setMeterPercentage(this.health * 100 / this.maxHealth);

		this.playerDamaged = this.scene.sound.add('playerDamaged', {
			volume: 0.1,
		});
		this.playerDamaged.play();

		if (this.health <= 0)
		{
			this.healthState = this.dead
			this.setVelocity(0, 0)
			this.setImmovable();
			this.anims.play('faint');
		}

		else
		{
			this.setVelocity(knockbackDirection.x, knockbackDirection.y)

			this.setTint(0xff0000)

			this.healthState = this.damaged
			this.damageTime = 0
		}
	}
	
	setChest(chest)
	{
		this.currentChest = chest;
	}

	setWorkbench(workbench)
	{
		this.currentWorkbench = workbench;
	}

	getMaxHealth()
	{
		return this.maxHealth;
	}

	getHealth()
	{
		return this.health;
	}	

	addPotion()
	{
		this.potionHand.potion.setTint(0xffffff);
		//this.potionHand = new PotionInHand(this.scene, this);
	}

	addProjectile()
	{
		this.attackUI.projectile.setTint(0xffffff);
	}

	addBomb()
	{
		this.bombUI.projectile.setTint(0xffffff);
	}

	addTeleport()
	{
		this.teleportUI.teleport.setTint(0xffffff);
	}

	destroyPotion()
	{

		this.potionHand.cooldown();


		var timerPotion = this.scene.time.addEvent({ 
			delay: this.potionCooldown * this.cooldownReduction, 
			callback: this.addPotion, 
			callbackScope: this});
	}

	destroyProjectile()
	{

		this.attackUI.cooldown();
	
		var timerProjectile = this.scene.time.addEvent({ 
			delay: this.fireRate * this.cooldownReduction, 
			callback: this.addProjectile, 
			callbackScope: this});
	}

	destroyBomb()
	{
		this.bombUI.cooldown();

		var timerBomb = this.scene.time.addEvent({ 
			delay: this.bombCooldown * this.cooldownReduction, 
			callback: this.addBomb, 
			callbackScope: this});
	}

	destroyTeleport()
	{
		this.teleportUI.cooldown();

		var timerTeleport = this.scene.time.addEvent({ 
			delay: this.teleportCooldown - 50 * this.cooldownReduction, 
			callback: this.addTeleport, 
			callbackScope: this});
	}
}
