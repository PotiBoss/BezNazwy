

export default class UI extends Phaser.Scene
{

	constructor()
	{
		super('UI');
		
		this.fullWidth = 1;
		
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

		this.gameWidth = this.sys.game.config.width;
		this.gameHeight = this.sys.game.config.height;

		this.welcomeMsg();
	}

	welcomeMsg()
	{
		this.msg = ["1", "2", "3"];
		this.dialog.init(this.msg);
		this.dialog.setText(this.msg[0], true);

	}

	secondMsg()
	{
		this.msg2 = ["4", "5", "6"];
		this.dialog.init(this.msg2);
		this.dialog.setText(this.msg2[0], true);
	}

	handlePlayerHealthChanged(health)
	{
		this.secondMsg();
	}
}