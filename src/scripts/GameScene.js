import Phaser from 'phaser';

import  Game  from 'phaser';
import Player from './Player';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
		super("GameScene");


    }

    preload()
    {
    	this.load.image('sky', 'assets/sky.png');
		this.load.spritesheet('player', 'assets/move_sprite.png', { frameWidth: 32, frameHeight: 64 });
		this.load.image('projectile', 'assets/bomb.png');
		///


		


		this.load.image('tiles', 'assets/dungeon_tiles.png')
		this.load.tilemapTiledJSON('dungeon', 'assets/dungeonmap.json')
		
    }

    create()
    {
    	console.log("GameScene started")


		const map = this.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('dungeon', 'tiles');

		

		const ground = map.createLayer('ground', tileset).setScale(3,3);
		const walls = map.createLayer('walls', tileset).setScale(3,3);



		walls.setCollisionByProperty({ collides: true });

		

		this.spawnPlayer(walls);
		this.setColliders();
	}



	spawnPlayer(walls)
	{
		this.myPlayer = new Player(this, 300, 300);
		this.setFollowingCamera(this.myPlayer);
		this.physics.add.collider(this.myPlayer, walls);
	}

	update()
	{

	}

	setColliders()
	{
		this.physics.add.collider(this.myPlayer, this.walls);

	}

	setFollowingCamera(player)
	{
		//this.physics.world.setBounds()
		this.cameras.main.startFollow(player);
	}

}