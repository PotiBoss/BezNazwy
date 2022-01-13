
import Skeleton from "./Skeleton";
import Chest from "./Chest";
import Workbench from "./Workbench";
import Taurus from "./Taurus";
import Teleporter from "./Teleporter";
import Necromancer from "./Necromancer";

export default class Map
{
	constructor(scene)
	{
		this.scene = scene;

		//this.interactiveObjects = [];

		this.createMap();
	}

	createMap()
	{
		this.map = this.scene.make.tilemap({ key: 'dungeon' });
		const tileset = this.map.addTilesetImage('dungeon', 'tiles');
		

		this.ground = this.map.createLayer('ground', tileset).setScale(2,2);
		this.walls = this.map.createLayer('walls', tileset).setScale(2,2);
	
		this.chestLayer = this.map.getObjectLayer('chests');
		this.chests = this.scene.physics.add.staticGroup({
			classType: Chest
		})
		this.chestLayer.objects.forEach(chest => {
			this.chests.get(chest.x * 2 + chest.width , chest.y * 2 - chest.height).setScale(1.5, 1.5)
		})

		this.potionLayer = this.map.getObjectLayer('potions');
		this.potions = this.scene.physics.add.staticGroup();
		this.potionLayer.objects.forEach(object => {
			let potion = this.potions.create(object.x * 2, object.y * 2, 'items', 144) ; 
		})

		this.workbenchLayer = this.map.getObjectLayer('workbenches');
		this.workbenches = this.scene.physics.add.staticGroup({
			classType: Workbench
		});
		this.workbenchLayer.objects.forEach(object => {
			let workbench = this.workbenches.create(object.x * 2, object.y * 2);
		})

		this.tauroses = this.scene.physics.add.group({
			classType: Taurus
		});
		const taurosLayer = this.map.getObjectLayer('taurus');
		taurosLayer.objects.forEach(object => {
			let tauros = this.tauroses.get(this.scene, object.x * 2, object.y * 2, 'items', 144);
		})

		this.necromancers = this.scene.physics.add.group({
			classType: Necromancer
		});
		const necromancerLayer = this.map.getObjectLayer('necromancer');
		necromancerLayer.objects.forEach(object => {
			let necromancer = this.necromancers.get(this.scene, object.x * 2, object.y * 2, 'items', 144);
		})



		//this.enemies = this.map.createLayer('enemyTile', tileset).setScale(2,2);
		this.activateColliders();

		this.lizards = this.scene.physics.add.group({
			classType: Skeleton
		})
		const enemyLayer = this.map.getObjectLayer('enemy');
		enemyLayer.objects.forEach(enemyObject => {
			this.lizards.get(enemyObject.x * 2 + enemyObject.width * 0.5, enemyObject.y * 2 + enemyObject.height * 0.5); // * 2 bo skalowalem tilemape
		})

		this.teleporters = this.scene.physics.add.group({
			classType: Teleporter
		})
		this.teleporterLayer = this.map.getObjectLayer('teleporter');

		this.teleportIndex = 0;
		this.teleporterLayer.objects.forEach(teleporterObject => {
			this.teleporters.get(teleporterObject.x * 2 + teleporterObject.width * 0.5, teleporterObject.y * 2 + teleporterObject.height * 0.5, this.teleportIndex++); // * 2 bo skalowalem tilemape
		})

	}

	activateColliders()
	{
		this.walls.setCollisionByProperty({ collides: true });
	}
}