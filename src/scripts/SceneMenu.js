
export default class SceneMenu extends Phaser.Scene {
	constructor()
	{
		super('SceneMenu');	
	}
  
	preload()
	{

	}

	create()
	{
		this.add.image(0, 0, 'titleBackground').setOrigin(0);
		
		this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, 'title');

		this.startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.5, 'startButton');

		this.quitButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.6, 'quitButton');

		this.indicator = this.add.sprite(100, 100, 'treasure').setScale(2, 2).setVisible(false);


		this.startButton.setInteractive();
		this.quitButton.setInteractive();

		this.startButton.on('pointerover', () => {
			this.indicator.setVisible(true);
			this.indicator.x = this.startButton.x - this.startButton.width;
			this.indicator.y = this.startButton.y;
		});

		this.startButton.on('pointerout', () => {
			this.indicator.setVisible(false);
		});

		this.startButton.on('pointerdown', () => {
			this.scene.start('GameScene');
		});

		this.quitButton.on('pointerover', () => {
			this.indicator.setVisible(true);
			this.indicator.x = this.quitButton.x - this.quitButton.width;
			this.indicator.y = this.quitButton.y;

		});

		this.quitButton.on('pointerout', () => {
			this.indicator.setVisible(false);
		})
	};
}