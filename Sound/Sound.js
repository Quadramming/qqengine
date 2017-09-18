QQ.Sound = class Sound {
	
	constructor() {
		this._sounds = new Map();
	}
	
	set(input) {
		for ( let sound of input ) {
			this._sounds.set(sound[0], new Audio(sound[1]));
		}
	}
	
	play(strSound) {
		const sound = this._sounds.get(strSound);
		// const copy = new Audio(sound.src);
		sound.currentTime = 0;
		sound.play();
	}
	
};
