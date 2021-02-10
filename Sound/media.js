// QQDOC

export class MediaSound {
	
	#sounds = new Map();
	
	constructor(sounds = []) {
		for ( const sound of sounds ) {
			this.#sounds.set(sound[0],
				new Media(
					sound[1],
					() => {}, () => {}
				)
			);
		}
	}
	
	play(soundId) {
		const sound = this.#sounds.get(soundId);
		sound.play();
	} // void
	
	control(soundId, options = {}) {
		// Make me
	} // void
	
}
