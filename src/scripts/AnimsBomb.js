export default anims => {
	anims.create({
		key: 'bombAnimation',
		frames: anims.generateFrameNames('bombs'),
		repeat: -1,
		frameRate: 12
	})
}