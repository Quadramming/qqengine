QQ.Sound = class Sound {
	
	constructor() {
		this._sounds = new Map();
	}
	
	set(input) {
		for ( const sound of input ) {
			this._sounds.set(sound[0], new Audio(sound[1]));
		}
	}
	
	play(strSound) {
		const sound = this._sounds.get(strSound);
		sound.currentTime = 0;
		sound.play();
	}
	
};
