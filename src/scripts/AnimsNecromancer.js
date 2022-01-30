export default anims => {
	anims.create({
		key: 'necromancerFront',
		frames: [{ key: 'necromancerFront', frame: 0}]
	})

	anims.create({
		key: 'necromancerBack',
		frames: [{ key: 'necromancerBack', frame: 0}]
	})

	anims.create({
		key: 'necromancerSide',
		frames: [{ key: 'necromancerSide', frame: 0}]
	})

	anims.create({
		key: 'necromancerFrontAnim',
		frames: anims.generateFrameNames('necromancerFront'),
		repeat: -1,
		frameRate: 10
	}) 

	anims.create({
		key: 'necromancerBackAnim',
		frames: anims.generateFrameNames('necromancerBack'),
		repeat: -1,
		frameRate: 10
	}) 

	anims.create({
		key: 'necromancerSideAnim',
		frames: anims.generateFrameNames('necromancerSide'),
		repeat: -1,
		frameRate: 10
	}) 
}