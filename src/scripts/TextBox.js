export default class TextBox
{
	constructor(scene, x, y)
	{
		this.scene = scene;

		//this.welcomeMsg()

		this.x = x;
		this.y = y;
	}


	welcomeMsg()
	{
		this.msg = ["1", "2", "3"];
		this.scene.dialog.init(this.msg);
		this.scene.dialog.setText(this.msg[0],true);

	}
}