// QQDOC

export class NativeAudioSound {
	
	constructor(sounds = []) {
		for ( const sound of sounds ) {
			window.plugins.NativeAudio.preloadSimple(
				sound[0], sound[1],
				() => {}, () => {}
			);
		}
	}
	
	play(soundId) {
		window.plugins.NativeAudio.play(soundId);
	} // void
	
	control(soundId, options = {}) {
		if ( options.loop ) window.plugins.NativeAudio.loop(soundId);
		if ( options.pause ) window.plugins.NativeAudio.stop(soundId);
	} // void
	
}
