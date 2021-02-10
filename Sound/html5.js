// QQDOC

export class Html5Sound {
	
	#sounds = new Map();
	
	constructor(sounds = []) {
		for ( const sound of sounds ) {
			this.#sounds.set(sound[0], new Audio(sound[1]));
		}
	}
	
	play(soundId) {
		const sound = this.#sounds.get(soundId);
		sound.currentTime = 0;
		sound.play();
	} // void
	
	control(soundId, options = {}) {
		const sound = this.#sounds.get(soundId);
		if ( ! sound ) return;
		if ( options.loop ) sound.loop = options.loop;
		if ( options.pause ) sound.pause();
		if ( options.play ) this.play(soundId);
	} // void
	
}
