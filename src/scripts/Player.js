import initAnims from './AnimsPlayer'
import Projectile from './Projectile';

import { getTimeStamp } from './GetTimeStamp';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'player');

		scene.add.existing(this);
		scene.physics.add.existing(this);
		initAnims(scene.anims);

		//this.scene.scene;
		this.square2 = 1.41;

		this.create();
	}

	create()
	{
		this.playerSpeed = 150;
		this.health = 3;
		this.maxHealth = 3;
		this.healthState = 0;
		this.damageTime = 0;
		this.damagedInvulnerability = 300;
		//this.projectiles = null;


		this.teleportCooldown = 1000;
		this.timeFromLastTeleport = null;

		//this.projectiles = new Projectile(this.scene,-1000, 0);


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
	}

	setupStates()
	{
		this.unharmed = 0;
		this.damaged = 1;
		this.dead = 2;
	}

	setupProjectiles(projectile)
	{
		this.projectiles = projectile
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
			this.anims.play('idleDown');
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

		if(this.healthState === this.damaged || this.healthState === this.dead) {return;}


		if(this.keyD.isDown && this.keyW.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.setVelocityY(-this.playerSpeed);
			this.anims.play('run-Up', true);
		}

		else if(this.keyD.isDown && this.keyS.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.setVelocityY(this.playerSpeed);
			this.anims.play('run-Down', true);
		}

		else if(this.keyA.isDown && this.keyS.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.setVelocityY(this.playerSpeed);
			this.flipX = true;
			this.anims.play('run-Down', true);
		}

		else if(this.keyA.isDown && this.keyW.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.setVelocityY(-this.playerSpeed);
			this.anims.play('run-Up', true);
		}

		else if(this.keyA.isDown)
		{
			this.setVelocityX(-this.playerSpeed);
			this.flipX = true;
			this.anims.play('run-Side', true);
		}

		else if(this.keyD.isDown)
		{
			this.setVelocityX(this.playerSpeed);
			this.flipX = false;
			this.anims.play('run-Side', true);
		}

		else if(this.keyW.isDown)
		{
			this.setVelocityY(-this.playerSpeed);
			this.anims.play('run-Up', true);
		}

		else if(this.keyS.isDown)
		{
			this.setVelocityY(this.playerSpeed);
			this.anims.play('run-Down', true);
		}
		
		else // NIE RUSZAC to gowno nie dzialalo przez 2 godziny i nagle zaczelo dzialac :)
		{
			if(this.anims.currentAnim != null){
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
			this.teleportRightDown(this.body.velocity, this.scene.intersectionRightDown);
		}

		else if(this.keyA.isDown && this.keyS.isDown && this.keySpace.isDown)
		{
			this.teleportLeftDown(this.body.velocity, this.scene.intersectionLeftDown);
		}

		else if(this.keyA.isDown && this.keyW.isDown && this.keySpace.isDown)
		{
			this.teleportLeftUp(this.body.velocity, this.scene.intersectionLeftUp);
		}

		else if(this.keyD.isDown && this.keyW.isDown && this.keySpace.isDown)
		{
			this.teleportRightUp(this.body.velocity, this.scene.intersectionRightUp);
		}

		else if(this.keyD.isDown && this.keySpace.isDown)
		{
			this.teleportRight(this.body.velocity, this.scene.intersectionRight);
		}
		
		else if(this.keyA.isDown && this.keySpace.isDown)
		{
			this.teleportLeft(this.body.velocity, this.scene.intersectionLeft);
		}

		else if(this.keyW.isDown && this.keySpace.isDown)
		{
			this.teleportUp(this.body.velocity, this.scene.intersectionUp);
		}

		else if(this.keyS.isDown && this.keySpace.isDown)
		{
			this.teleportDown(this.body.velocity, this.scene.intersectionDown);
		}
	}
	


	lookAtMouse(pointer)
	{
		this.angleBetweenPlayerAndMouse = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
		this.angleDetla = (this.angleBetweenPlayerAndMouse - this.rotation);

		//this.directionPointer(this.angle);

	}

	directionPointer(angle)
	{
		if(this.angleDetla > -22.5 &&  this.angleDetla <= 22.5)
		{
			console.log("prawo");
		}
		else if( this.angleDetla > 22.5 && this.angleDetla <= 67.5)
		{
			console.log("prawodol");
		}
		else if( this.angleDetla > 67.5 && this.angleDetla <= 112.5)
		{
			console.log("dol");
		}
		else if( this.angleDetla > 112.5 && this.angleDetla <= 157.5)
		{
			console.log("lewodol");
		}
		else if( this.angleDetla > 157.5 || this.angleDetla <= -157.5)
		{
			console.log("lewo");
		}
		else if( this.angleDetla > -157.5 && this.angleDetla <= -112.5)
		{
			console.log("lewogora");
		}
		else if( this.angleDetla > -112.5 && this.angleDetla <= -67.5)
		{
			console.log("gora");
		}
		else if( this.angleDetla > -67.5 && this.angleDetla <= -22.5)
		{
			console.log("prawogora");
		}
	}

	teleportRightDown(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x-16, 0, this.playerSpeed) / this.square2;
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y-16, 0, this.playerSpeed) / this.square2;
	}

	teleportLeftDown(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x+16, -this.playerSpeed, 0) / this.square2;
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y-16, 0, this.playerSpeed) / this.square2;
	}

	teleportLeftUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x+16, -this.playerSpeed, 0) / this.square2;
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y+16, -this.playerSpeed, 0) / this.square2;
	}

	teleportRightUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x-16, 0, this.playerSpeed) / this.square2;
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y+16, -this.playerSpeed, 0) / this.square2;
	}

	teleportRight(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x-16, 0, this.playerSpeed);
	}

	teleportLeft(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.x += Phaser.Math.Clamp(raycastIntersection.x-this.x+16, -this.playerSpeed, 0);
	}

	teleportUp(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y+16, -this.playerSpeed, 0);
	}

	teleportDown(playerVelocity, raycastIntersection)
	{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  getTimeStamp()){ return; }
			this.timeFromLastTeleport = getTimeStamp();
			this.y += Phaser.Math.Clamp(raycastIntersection.y-this.y-16, 0, this.playerSpeed);
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
		this.scene.input.on('pointerdown', () => {
			this.projectiles.fireProjectile(this);
			
		  })
		
	}

	handleDamage(knockbackDirection)
	{
		if(this.health <= 0) { return; }

		if(this.healthState === this.damaged) { return ;}

		--this.health;

		if (this.health <= 0)
		{
			this.healthState = this.dead
			this.setVelocity(0, 0)
			this.setImmovable();
			this.anims.play('faint');
			console.log('DEAD');
		}

		else
		{
			this.setVelocity(knockbackDirection.x, knockbackDirection.y)

			this.setTint(0xff0000)

			this.healthState = this.damaged
			this.damageTime = 0
		}
	}

	getMaxHealth()
	{
		return this.maxHealth;
	}

	getHealth()
	{
		return this.health;
	}	
}
