import Projectile from './Projectile';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'player');

		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.create();

	}

	create()
	{
		this.playerSpeed = 150;


		this.teleportCooldown = 1000;
		this.timeFromLastTeleport = null;

		this.projectiles = new Projectile(this.scene,-1000, 0);


		//this.setCollideWorldBounds();
		this.setupMovement();
		this.setupAnimation();

	}

	update()
	{
		//this.updateMovement();
		//this.lookAtMouse(this.scene.input.activePointer);
		//this.handleAttack();
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

	setupAnimation()
	{

		this.anims.create({
			key: 'idle-Down',
			frames: [{ key: 'player', frame: 'walk-down-3.png'}]
		})

		this.anims.create({
			key: 'idle-Up',
			frames: [{ key: 'player', frame: 'walk-up-3.png'}]
		})

		this.anims.create({
			key: 'idle-Side',
			frames: [{ key: 'player', frame: 'walk-side-3.png'}]
		})

		this.anims.create({
			key: 'run-Down',
			frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15

		})

		this.anims.create({
			key: 'run-Up',
			frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15

		})

		this.anims.create({
			key: 'run-Side',
			frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15

		})
		

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

		this.teleport2(this.body.velocity);


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


	getTimeStamp()
	{
		this.date = new Date();
		return this.date.getTime();
	}


	teleport(pointer)
	{
		if(this.keySpace.isDown)
			
		{

			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  this.getTimeStamp()){ return; }

			this.timeFromLastTeleport = this.getTimeStamp();

			//this.x -= Phaser.Math.Clamp(this.x - pointer.x, -this.teleportRange, this.teleportRange);
			//this.y -= Phaser.Math.Clamp(this.y - pointer.y, -this.teleportRange, this.teleportRange);

			console.log("pointx: " + pointer.x);
			console.log("pointy: " + pointer.y);

			console.log("charx: " + this.x);
			console.log("chary: " + this.y);
			//console.log(this.x)

			// tylko bog teraz wie co tu liczy i nie liczy 
			if(Math.abs(pointer.x - this.x) > Math.abs(pointer.y - this.y))
			{
			 	this.teleportStandardX = pointer.x / pointer.y

				if(this.teleportStandardX > 1)
				{
					this.x -= Phaser.Math.Clamp(this.x - pointer.x, -this.teleportRange, this.teleportRange);
					this.y -= Phaser.Math.Clamp(this.y - pointer.y, -this.teleportRange / this.teleportStandardX, this.teleportRange / this.teleportStandardX);
					console.log("1");
				}
				else 
				{
					this.x -= Phaser.Math.Clamp(this.x - pointer.x, -this.teleportRange, this.teleportRange);
					this.y -= Phaser.Math.Clamp(this.y - pointer.y, -this.teleportRange * this.teleportStandardX, this.teleportRange * this.teleportStandardX);
					console.log("2");
				}
			}
			else
			{
			 	this.teleportStandardY = pointer.y / pointer.x
				if(this.teleportStandardY > 1)
				{
					this.x -= Phaser.Math.Clamp(this.x - pointer.x, -this.teleportRange / this.teleportStandardY, this.teleportRange / this.teleportStandardY);
					this.y -= Phaser.Math.Clamp(this.y - pointer.y, -this.teleportRange, this.teleportRange);
					console.log("3");
				}
				else
				{
					this.x -= Phaser.Math.Clamp(this.x - pointer.x, -this.teleportRange * this.teleportStandardY, this.teleportRange * this.teleportStandardY);
					this.y -= Phaser.Math.Clamp(this.y - pointer.y, -this.teleportRange, this.teleportRange);
					console.log("4");
				}
			}
		}
	}

	teleport2(playerVelocity)
	{
		if(this.keySpace.isDown)
		{
			if(this.timeFromLastTeleport && this.timeFromLastTeleport + this.teleportCooldown >  this.getTimeStamp()){ return; }

			this.timeFromLastTeleport = this.getTimeStamp();

			console.log(playerVelocity);
			this.x += playerVelocity.x;
			this.y += playerVelocity.y;
		}

	}

	handleAttack() 
	{
		this.scene.input.on('pointerdown', () => {
			this.projectiles.fireProjectile(this);
			
		  })
		
	}
}
