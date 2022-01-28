export default anims => {
	anims.create({
		key: 'ranged-Down',
		frames: anims.generateFrameNames('ranged', { start: 15, end: 19}),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'ranged-Up',
		frames: anims.generateFrameNames('ranged', { start: 25, end: 29}),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'ranged-Side',
		frames: anims.generateFrameNames('ranged', { start: 20, end: 24}),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'rangedAttack-Down',
		frames: anims.generateFrameNames('ranged', { start: 10, end: 14}),
		//repeat: -1,
		frameRate: 4
	})

	anims.create({
		key: 'rangedAttack-Up',
		frames: anims.generateFrameNames('ranged', { start: 5, end: 9}),
		//repeat: -1,
		frameRate: 4
	})

	anims.create({
		key: 'rangedAttack-Side',
		frames: anims.generateFrameNames('ranged', { start: 0, end: 4}),
		//repeat: -1,
		frameRate: 4
	})
}

