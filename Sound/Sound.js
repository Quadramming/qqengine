QQ.Sound = class Sound {
	
	constructor() {
		this._sounds = new Map();
		this._type = 'plugin-nativeAudio'; // html5 plugin-media
		this._type = 'plugin-media';
		this._type = 'html5';
	}
	
	set(input) {
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
		} else if ( this._type ==='plugin-media' ) {
			const sound = this._sounds.get(strSound);
			sound.play();
		}
	}
	
};
