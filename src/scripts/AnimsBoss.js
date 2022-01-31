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
		key: 'bossAttack-Up',
		frames: anims.generateFrameNames('bossBack'),
		//repeat: -1,
		frameRate: 5
	})

	anims.create({
		key: 'bossAttack-Side',
		frames: anims.generateFrameNames('bossSide'),
		//repeat: -1,
		frameRate: 5
	})

	anims.create({
		key: 'bossAttack-Down',
		frames: anims.generateFrameNames('bossFront'),
		//repeat: -1,
		frameRate: 5
	})
}