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

	update()
	{
		this.myPlayer.updateMovement2();
	}

	setFollowingCamera(player)
	{
		//this.physics.world.setBounds()
		this.cameras.main.startFollow(player);
	}

}