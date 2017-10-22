QQ.Sprite.Mngr = class Mngr {
	
	constructor(size) {
		this._size = size.clone();
	}
	
	setSize(size) {
		this._size = size.clone();
	}
	
	getSize() {
		return this._size;
	}
	
	getRatio() {
		return this._size.getRatio();
	}
	
	tick(delta) {
	}
	
};
