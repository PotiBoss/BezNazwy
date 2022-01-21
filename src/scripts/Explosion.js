export default class Explosion extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'potion');
		
		scene.add.existing(this);

		this.scene = scene;

		this.checkAOE();
	}

	checkAOE()
	{
		console.log("aoe")
	//	this.scene.physics.add.overlap(this, this.scene.myPlayer, this.handleExplosionEnemyCollision, undefined, this);
		//this.scene.physics.add.collider(this, this.scene.currentMap.tauroses, this.handleExplosionEnemyCollision, undefined, this);
	}

	handleExplosionEnemyCollision(explosion, enemy)
	{
		explosion.destroy();
		enemy.destroy();
	}
}