export default anims => {
	anims.create({
		key: 'skeletonFrontAnim',
		frames: anims.generateFrameNames('skeletonFront'),
		repeat: -1,
		frameRate: 10
	}) 

	anims.create({
		key: 'skeletonBackAnim',
		frames: anims.generateFrameNames('skeletonBack'),
		repeat: -1,
		frameRate: 10
	}) 

	anims.create({
		key: 'skeletonSideAnim',
		frames: anims.generateFrameNames('skeletonSide'),
		repeat: -1,
		frameRate: 10
	}) 
}