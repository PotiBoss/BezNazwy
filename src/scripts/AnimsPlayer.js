
export default anims => {

	anims.create({
		key: 'idle-Down',
		frames: [{ key: 'playerFront', frame: 0}]
	})

	anims.create({
		key: 'idle-Up',
		frames: [{ key: 'playerBack', frame: 0}]
	})

	anims.create({
		key: 'idle-Side',
		frames: [{ key: 'playerSide', frame: 0}]
	})

	anims.create({
		key: 'run-Down',
		frames: anims.generateFrameNames('playerFront'),
		repeat: -1,
		frameRate: 14
	})

	anims.create({
		key: 'run-Up',
		frames: anims.generateFrameNames('playerBack'),
		repeat: -1,
		frameRate: 12
	})

	anims.create({
		key: 'run-Side',
		frames: anims.generateFrameNames('playerSide'),
		repeat: -1,
		frameRate: 12
	})

	anims.create({
		key: 'faint',
		frames: anims.generateFrameNames('player', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
		frameRate: 15
	})
}