
export default class TeleporterFinal extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, index)
	{
		super(scene, x, y, 'tileitem', 294)
		
		this.scene = scene;

		this.create();
		this.setScale(2,2)

		this.activated = false;
		this.points = 50;

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

	activateTeleport()
	{
		if(this.scene.myPlayer.points > this.points && this.activated == false)
		{
			this.activated = true;
		}
		console.log(this.activated)	
	}

	teleporting(player) // DANGER UZYWA SIE TAK DLUGO JAK TRZYMASZ PRZYCISK MOZE WYJEBAC PERFORMANCE TODO: fix?
	{
		if(Math.abs(player.x - this.x) < 35 && Math.abs(player.y - this.y) < 35  && this.activated)
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