
export default class SceneMenu extends Phaser.Scene {
	constructor()
	{
		super('SceneMenu');	
	}
  
	preload()
	{
		this.load.scenePlugin({
			key: 'DialogModalPlugin',
			url: 'src/scripts/Dialog.js',
			sceneKey: 'dialog'
		});
	}

	create()
	{
		this.add.image(0, -180, 'titleBackground').setOrigin(0)
		

		this.startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.5, 'Play');

		this.quitButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.65, 'Credits');

		this.indicator = this.add.sprite(100, 100, 'indi').setScale(2, 2).setVisible(false);

		this.highlightStart = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.5, 'PlayHighlight').setVisible(false).setDepth(2);
		this.highlightCredits = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.65, 'CreditsHighlight').setVisible(false).setDepth(2);


		this.startButton.setInteractive();
		this.quitButton.setInteractive();

		this.startButton.on('pointerover', () => {
			this.indicator.setVisible(true);
			this.indicator.x = this.startButton.x - this.startButton.width;
			this.indicator.y = this.startButton.y;
			this.highlightStart.setVisible(true);
		});

		this.startButton.on('pointerout', () => {
			this.indicator.setVisible(false);
			this.highlightStart.setVisible(false);
		});

		this.startButton.on('pointerdown', () => {
			this.menuBGM.stop();
			this.scene.start('GameScene');
		});

		this.quitButton.on('pointerover', () => {
			this.indicator.setVisible(true);
			this.indicator.x = this.quitButton.x - this.quitButton.width;
			this.indicator.y = this.quitButton.y;
			this.highlightCredits.setVisible(true);
		});

		this.quitButton.on('pointerout', () => {
			this.indicator.setVisible(false);
			this.highlightCredits.setVisible(false);
		})

		this.quitButton.on('pointerdown', () => {
			this.usedAssets();
		});

		this.menuBGM = this.sound.add('menuBGM', {
			volume: 0.08,
			loop: true
		});
		this.menuBGM.play();
	}

	usedAssets()
	{
		this.msg = ["Artwork: Dominik Bujniak\nPrograming: Mikołaj Potera\nSound and Design: Wiktoria Gołos\nUsed assets on next page."
		,"Used assets:\nPotion break sound: https://www.youtube.com/watch?v=0aaPMzWYL2A\nSkeleton spawn sound: https://www.youtube.com/watch?v=xR3u2yRRzkw\nPlayer damaged sound/Pickup sound: https://www.youtube.com/watch?v=HDRVzwNkV20\nTeleport sound: https://www.youtube.com/watch?v=7sOBMWW688I\nPotion drink sound: https://www.youtube.com/watch?v=zOqqJAudlWE",
		"Enemy being hit sound: https://www.youtube.com/watch?v=_0BqWUmMTnU\nScrolling text sound: https://www.youtube.com/watch?v=phBBtaESoMI\nMenu music: https://www.youtube.com/watch?v=LPi5OMTwMkY\nGame music: https://www.youtube.com/watch?v=n6-YcT9_qzc\nBoss music: https://www.youtube.com/watch?v=Zkzw9zZJUXc\nMost of the assets have been modified to suit the project"];
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0], true);
	}
}