import Player from "./Player";

export default class Map
{
	constructor(scene)
	{
		this.scene = scene;

		this.interactiveObjects = [];

		this.createMap();
	}

	createMap()
	{
		const map = this.scene.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('dungeon', 'tiles');

		

		const ground = map.createLayer('ground', tileset).setScale(2,2);
		this.walls = map.createLayer('walls', tileset).setScale(2,2);

		this.activateColliders();
	}

	activateColliders()
	{
		this.walls.setCollisionByProperty({ collides: true });
	}

}