export default anims => {
	anims.create({
		key: 'potionFront',
		frames: anims.generateFrameNames('potionFront'),
		repeat: -1,
		frameRate: 36
	})

	anims.create({
		key: 'potionSide',
		frames: anims.generateFrameNames('potionSide'),
		repeat: -1,
		frameRate: 36
	})

	anims.create({
		key: 'potionSideBlue',
		frames: anims.generateFrameNames('potionSideBlue'),
		repeat: -1,
		frameRate: 36
	})

	anims.create({
		key: 'potionFrontBlue',
		frames: anims.generateFrameNames('potionFrontBlue'),
		repeat: -1,
		frameRate: 36
	})

}