

export default class ScenePreload extends Phaser.Scene 
{
	constructor()
	{
		super("ScenePreload");

	}

	preload() 
		{
		var width = this.cameras.main.width;
		var height = this.cameras.main.height;

		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x111111, 0.5);
		//progressBox.fillRect(240, 270, 320, 50);
		progressBox.fillRect(width/3, height/3, 320, 25)
		

		var loadingText = this.make.text({
			x: width / 2 + 10,
			y: height / 3 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);
		
		var percentText = this.make.text({
			x: width / 2,
			y: height / 3 - 15,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);
		
		var assetText = this.make.text({
			x: width / 2,
			y: height / 3 + 50,
			text: '',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		assetText.setOrigin(0.5, 0.5);
		
		this.load.on('progress', function (value) {
			percentText.setText(parseInt(value * 100) + '%');
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(width / 3, height / 3, 320 * value, 25);
		});
		
		this.load.on('fileprogress', function (file) {
		//	assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});
		
	//	this.load.image('logo', 'assets/zenvalogo.png');
	//	for (var i = 0; i < 500; i++) {
	//		this.load.image('logo'+i, 'assets/zenvalogo.png');
	//	}

		//load

		this.load.image('projectile', 'assets/bomb.png');
		this.load.image('potion', 'assets/star.png');

		this.load.image('tiles', 'assets/dungeon_tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'assets/dungeonmap.json');	

		this.load.atlas('player', 'assets/fauna.png', 'assets/fauna.json');
		this.load.atlas('lizard', 'assets/lizard.png', 'assets/lizard.json');
		this.load.atlas('taurus', 'assets/enemies.png', 'assets/enemies_atlas.json');


		this.load.image('ui-heart-empty', 'assets/ui_heart_empty.png');
		this.load.image('ui-heart-full', 'assets/ui_heart_full.png');

		this.load.atlas('treasure', 'assets/treasure.png', 'assets/treasure.json');


		this.load.spritesheet('items','assets/items.png',{frameWidth:32,frameHeight:32});
		this.load.spritesheet('tileitem','assets/dungeon_tiles.png',{frameWidth:16,frameHeight:16});


		this.load.image('middle', 'assets/barHorizontal_green_mid.png');

		this.load.image('titleBackground', 'assets/title_bg.jpg');
		this.load.image('title', 'assets/logo.png');
		this.load.image('startButton', 'assets/play_button.png');
		this.load.image('quitButton', 'assets/options_button.png');

	}

	create() 
	{
		this.scene.start('SceneMenu');
	}
}