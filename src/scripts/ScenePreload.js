

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
		


		this.load.image('projectile', 'assets/bomb.png');
		this.load.image('potion', 'assets/star.png');

		this.load.image('tiles', 'assets/dungeon_tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'assets/dungeonmap.json');	

		this.load.atlas('player', 'assets/fauna.png', 'assets/fauna.json');

		this.load.image('playerBase', 'assets/PlayerBase.png');
		this.load.spritesheet('playerFront', 'assets/PlayerFront.png', {frameWidth:21,frameHeight:41});
		this.load.spritesheet('playerBack', 'assets/PlayerBack.png', {frameWidth:21,frameHeight:41});
		this.load.spritesheet('playerSide', 'assets/PlayerSide.png', {frameWidth:23,frameHeight:41});
		this.load.spritesheet('throwFront', 'assets/ThrowFront.png', {frameWidth:26,frameHeight:41}); //25.8
		this.load.spritesheet('throwBack', 'assets/ThrowBack.png', {frameWidth:25,frameHeight:41}); // 24.8
		this.load.spritesheet('throwSide', 'assets/ThrowSide.png', {frameWidth:36.8,frameHeight:48}); // 36.8

		this.load.atlas('lizard', 'assets/lizard.png', 'assets/lizard.json');
		this.load.atlas('taurus', 'assets/enemies.png', 'assets/enemies_atlas.json');
		this.load.spritesheet('necromancer', 'assets/birdSprite.png',{frameWidth:32,frameHeight:32});
		this.load.image('boss', 'assets/boss.png');

		this.load.atlas('treasure', 'assets/treasure.png', 'assets/treasure.json');

		this.load.spritesheet('pots','assets/pots.png',{frameWidth:32,frameHeight:32});
		this.load.spritesheet('items','assets/items.png',{frameWidth:32,frameHeight:32});
		this.load.image('inventoryBackground', 'assets/HudSheet.png');
		this.load.spritesheet('tileitem','assets/dungeon_tiles.png',{frameWidth:16,frameHeight:16});

		this.load.spritesheet('healthBar', 'assets/HealthBarSheet.png',{frameWidth:16,frameHeight:26});

		this.load.image('titleBackground', 'assets/title_bg.jpg');
		this.load.image('title', 'assets/logo.png');
		this.load.image('startButton', 'assets/play_button.png');
		this.load.image('quitButton', 'assets/options_button.png');

		this.load.audio('menuBGM', [
			'audio/determination.ogg',
			'audio/determination.mp3'
		]);

		this.load.audio('gameBGM', [
			'audio/gameBGM.mp3'
		]);

		this.load.audio('potionBreak', [
			'audio/potionBreak.mp3'
		]);

		this.load.audio('blink', [
			'audio/blink.mp3'
		]);

		this.load.audio('skeletonSpawn', [
			'audio/skeletonSpawn.wav'
		]);

		this.load.audio('textScroll', [
			'audio/textScroll.mp3'
		]);

		this.load.audio('playerDamaged', [
			'audio/playerDamaged.mp3'
		]);
	

	}

	create() 
	{
		this.scene.start('SceneMenu');
	}
}