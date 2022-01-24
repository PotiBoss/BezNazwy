export default anims => {
	anims.create({
		key: 'projectileExplosion',
		frames: anims.generateFrameNames('projectiles', {start:4, end:7}),
		repeat: -1,
		frameRate: 12
	})
}