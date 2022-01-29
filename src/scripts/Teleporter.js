

export default class Teleporter extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, index)
	{
		super(scene, x, y, 'tileitem', 294)
		
		this.scene = scene;

		this.create();

		this.setScale(3,3)


		this.startIndex = index;
		this.index = index;
	}

	create()
	{

	}

	teleportOnPress(player)
	{	
		this.scene.input.keyboard.on('keydown-T', () => 
		{ 
			this.scene.input.keyboard.resetKeys();
			this.teleporting(player);
		});
	}

	teleporting(player) // DANGER UZYWA SIE TAK DLUGO JAK TRZYMASZ PRZYCISK MOZE WYJEBAC PERFORMANCE TODO: fix?
	{
		if(Math.abs(player.x - this.x) < 35 && Math.abs(player.y - this.y) < 35)
		{
			if(this.index % 2 === 0)
			{
				const toIndex = this.index;
				player.x = this.scene.currentMap.teleporterLayer.objects[toIndex + 1].x * 2;
				player.y = this.scene.currentMap.teleporterLayer.objects[toIndex + 1].y * 2;
			}
			else
			{
				const toIndex = this.index;
				player.x = this.scene.currentMap.teleporterLayer.objects[toIndex - 1].x * 2;
				player.y = this.scene.currentMap.teleporterLayer.objects[toIndex - 1].y * 2;
			}
		}
	}
}