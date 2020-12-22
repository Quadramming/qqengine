export class Sound {
	
	constructor() {
		this._sounds = new Map();
		this._type = 'plugin-nativeAudio'; // html5 plugin-media
		this._type = 'plugin-media';
		this._type = 'html5';
	}
	
	set(input = []) {
		if ( this._type === 'html5' ) {
			for ( const sound of input ) {
				this._sounds.set(sound[0], new Audio(sound[1]));
			}
		} else if ( this._type === 'plugin-nativeAudio' ) {
			for ( const sound of input ) {
				window.plugins.NativeAudio.preloadSimple(
					sound[0], sound[1],
					() => {}, () => {}
				);
			}
		} else if ( this._type === 'plugin-media' ) {
			for ( const sound of input ) {
				this._sounds.set(sound[0],
					new Media(
						sound[1],
						() => {}, () => {}
					)
				);
			}
		}
	}
	
	play(strSound) {
		if ( this._type === 'html5' ) {
			const sound = this._sounds.get(strSound);
			sound.currentTime = 0;
			sound.play();
		} else if ( this._type === 'plugin-nativeAudio' ) {
			window.plugins.NativeAudio.play(strSound);
		} else if ( this._type === 'plugin-media' ) {
			const sound = this._sounds.get(strSound);
			sound.play();
		}
	}
	
	control(strSound, options = {}) {
		if ( this._type === 'html5' ) {
			const sound = this._sounds.get(strSound);
			if ( ! sound ) {
				return;
			}
			if ( options.loop !== undefined ) {
				sound.loop = options.loop;
			}
			if ( options.pause ) {
				sound.pause();
			}
			if ( options.play ) {
				this.play(strSound);
			}
		} else if ( this._type === 'plugin-nativeAudio' ) {
			if ( options.loop !== undefined ) {
				window.plugins.NativeAudio.loop(strSound);
			}
			if ( options.pause ) {
				window.plugins.NativeAudio.stop(strSound);
			}
		} else if ( this._type === 'plugin-media' ) {
			// TODO
		}
	}
	
}
