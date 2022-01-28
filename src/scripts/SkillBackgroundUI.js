
export default class SkillBackgroundUI extends Phaser.Physics.Arcade.Sprite 
{
	constructor(scene, object)
	{
		super(scene);
		this.scene = scene;
		this.gameObject = object;

		this.create();
	}	


	preUpdate(time, deltaTime)
	{
		this.backgroundAttack.x = this.gameObject.x - 450;
		this.backgroundAttack.y = this.gameObject.y + 325;
		this.backgroundPotion.x = this.gameObject.x - 400;
		this.backgroundPotion.y = this.gameObject.y + 325;
		this.backgroundBomb.x = this.gameObject.x - 350;
		this.backgroundBomb.y = this.gameObject.y + 325;
		this.backgroundTeleport.x = this.gameObject.x - 300;
		this.backgroundTeleport.y = this.gameObject.y + 325;
	}


	create()
	{
		const y = 9999 //XD	
		const x = 9999 //XD

		this.backgroundAttack = this.scene.add.image(x , y, 'inventoryBackground');
		this.backgroundPotion = this.scene.add.image(x , y, 'inventoryBackground');
		this.backgroundBomb = this.scene.add.image(x , y, 'inventoryBackground');
		this.backgroundTeleport = this.scene.add.image(x , y, 'inventoryBackground');
	}

	destroy()
	{
		console.log('dest')
		this.backgroundAttack.x = 9999; //XD^2`
		this.backgroundAttack.y = 9999;
		this.backgroundPotion.x = 9999; //XD^2`
		this.backgroundPotion.y = 9999;
		this.backgroundBomb.x = 9999; //XD^2`
		this.backgroundBomb.y = 9999;
	}

}