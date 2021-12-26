
export default anims => {

	anims.create({
		key: 'idle-Down',
		frames: [{ key: 'player', frame: 'walk-down-3.png'}]
	})

	anims.create({
		key: 'idle-Up',
		frames: [{ key: 'player', frame: 'walk-up-3.png'}]
	})

	anims.create({
		key: 'idle-Side',
		frames: [{ key: 'player', frame: 'walk-side-3.png'}]
	})

	anims.create({
		key: 'run-Down',
		frames: anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15

	})

	anims.create({
		key: 'run-Up',
		frames: anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15

	})

	anims.create({
		key: 'run-Side',
		frames: anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15

	})

	anims.create({
		key: 'faint',
		frames: anims.generateFrameNames('player', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
		frameRate: 15

	})
}