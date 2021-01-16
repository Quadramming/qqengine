// QQDOC

// TODO Split to different classes

export class Sound {
	
	#sounds = new Map();
	//#type = 'plugin-nativeAudio'; // html5 plugin-media
	//#type = 'plugin-media';
	#type = 'html5';
	
	constructor(sounds = []) {
		this.set(sounds);
	}
	
	set(sounds) {
		if ( this.#type === 'html5' ) {
			for ( const sound of sounds ) {
				this.#sounds.set(sound[0], new Audio(sound[1]));
			}
		} else if ( this.#type === 'plugin-nativeAudio' ) {
			for ( const sound of sounds ) {
				window.plugins.NativeAudio.preloadSimple(
					sound[0], sound[1],
					() => {}, () => {}
				);
			}
		} else if ( this.#type === 'plugin-media' ) {
			for ( const sound of sounds ) {
				this.#sounds.set(sound[0],
					new Media(
						sound[1],
						() => {}, () => {}
					)
				);
			}
		}
	} // void
	
	play(soundId) {
		if ( this.#type === 'html5' ) {
			const sound = this.#sounds.get(soundId);
			sound.currentTime = 0;
			sound.play();
		} else if ( this.#type === 'plugin-nativeAudio' ) {
			window.plugins.NativeAudio.play(soundId);
		} else if ( this.#type === 'plugin-media' ) {
			const sound = this.#sounds.get(soundId);
			sound.play();
		}
	} // void
	
	control(soundId, options = {}) {
		if ( this.#type === 'html5' ) {
			const sound = this.#sounds.get(soundId);
			if ( ! sound ) return;
			if ( options.loop ) sound.loop = options.loop;
			if ( options.pause ) sound.pause();
			if ( options.play ) this.play(soundId);
		} else if ( this.#type === 'plugin-nativeAudio' ) {
			if ( options.loop ) window.plugins.NativeAudio.loop(soundId);
			if ( options.pause ) window.plugins.NativeAudio.stop(soundId);
		} else if ( this.#type === 'plugin-media' ) {
			// TODO
		}
	} // void
	
}
