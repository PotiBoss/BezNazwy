
import Enemy from "./Enemy";

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

		

		this.ground = map.createLayer('ground', tileset).setScale(2,2);
		this.walls = map.createLayer('walls', tileset).setScale(2,2);
		this.activateColliders();

		this.lizards = this.scene.physics.add.group({
			classType: Enemy	
		})

		this.lizards.get(200,150);
	}

	activateColliders()
	{
		this.walls.setCollisionByProperty({ collides: true });
	}

	createColliders()
	{

	}

}