export default anims => {
	anims.create({
		key: 'chargeBallAnim',
		frames: anims.generateFrameNames('chargeBall'),
		repeat: -1,
		frameRate: 10
	})
}
