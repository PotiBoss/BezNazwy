import Skeleton from "./Skeleton";
import Chest from "./Chest";
import Workbench from "./Workbench";
import Taurus from "./Taurus";
import Teleporter from "./Teleporter";
import Necromancer from "./Necromancer";
import RangeEnemy from "./RangeEnemy";
import BossEnemy from "./BossEnemy";

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
		this.map = this.scene.make.tilemap({ key: 'dungeon'});
		
		const tileset = this.map.addTilesetImage('dungeon', 'tiles');
		
		this.teleporters = this.scene.physics.add.group({
			classType: Teleporter
		})
		this.teleporterLayer = this.map.getObjectLayer('teleporter');

		this.teleportIndex = 0;
		this.teleporterLayer.objects.forEach(teleporterObject => {
			this.teleporters.get(teleporterObject.x * 2 + teleporterObject.width, teleporterObject.y * 2 - teleporterObject.height, this.teleportIndex++); // * 2 bo skalowalem tilemape
		})

		this.ground = this.map.createLayer('ground', tileset).setScale(2,2);
		this.walls = this.map.createLayer('walls', tileset).setScale(2,2);
	
		this.chestLayer = this.map.getObjectLayer('chests');
		this.chests = this.scene.physics.add.staticGroup({
			classType: Chest
		})
		this.chestLayer.objects.forEach(chest => {
			this.chests.get(chest.x * 2 + chest.width , chest.y * 2 - chest.height).setScale(1.5, 1.5)
		})

		this.healthBushLayer = this.map.getObjectLayer('healthBushes');
		this.healthBush = this.scene.physics.add.staticGroup();
		this.healthBushLayer.objects.forEach(object => {
			let healthBush = this.healthBush.create(object.x * 2, object.y * 2, 'pots', 12) ; 
		})

		this.cooldownBushLayer = this.map.getObjectLayer('cooldownBushes');
		this.cooldownBush = this.scene.physics.add.staticGroup();
		this.cooldownBushLayer.objects.forEach(object => {
			let cooldownBush = this.cooldownBush.create(object.x * 2, object.y * 2, 'pots', 13) ; 
		})

		this.speedBushLayer = this.map.getObjectLayer('speedBushes');
		this.speedBush = this.scene.physics.add.staticGroup();
		this.speedBushLayer.objects.forEach(object => {
			let speedBush = this.speedBush.create(object.x * 2, object.y * 2, 'pots', 14) ; 
		})

		this.damageBushLayer = this.map.getObjectLayer('damageBushes');
		this.damageBush = this.scene.physics.add.staticGroup();
		this.damageBushLayer.objects.forEach(object => {
			let damageBush = this.damageBush.create(object.x * 2, object.y * 2, 'pots', 10) ; 
		})

		this.workbenchLayer = this.map.getObjectLayer('workbenches');
		this.workbenches = this.scene.physics.add.staticGroup({
			classType: Workbench
		});
		this.workbenchLayer.objects.forEach(object => {
			let workbench = this.workbenches.create(object.x * 2, object.y * 2);
		})

		this.skeletons = this.scene.physics.add.group({
			classType: Skeleton
		})
		const skeletonLayer = this.map.getObjectLayer('skeleton');
		skeletonLayer.objects.forEach(enemyObject => {
			this.skeletons.get(enemyObject.x * 2 + enemyObject.width * 0.5, enemyObject.y * 2 + enemyObject.height * 0.5); // * 2 bo skalowalem tilemape
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
			let necromancer = this.necromancers.get(this.scene, object.x * 2, object.y * 2);
		})

		this.rangeEnemies = this.scene.physics.add.group({
			classType: RangeEnemy
		});
		const rangeEnemyLayer = this.map.getObjectLayer('range');
		rangeEnemyLayer.objects.forEach(object => {
			let ranged = this.rangeEnemies.get(this.scene, object.x * 2, object.y * 2);
		})

		this.boss = this.scene.physics.add.group({
			classType: BossEnemy
		});
		const bossLayer = this.map.getObjectLayer('boss');
		bossLayer.objects.forEach(object => {
			let boss = this.boss.get(this.scene, object.x * 2, object.y * 2);
		})




		this.activateColliders();




	}

	activateColliders()
	{
		this.walls.setCollisionByProperty({ collides: true });
	}
}