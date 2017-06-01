QQ.Sprite.Mngr = class Mngr {
	
	constructor(w, h) {
		this._width  = w;
		this._height = h;
	}
	
	getRatio() {
		return this._width / this._height;
	}
	
	getSize() {
		return {
			width:  this._width,
			height: this._height
		};
	}
	
	calcPosition(pivot) {
		let x, y;
		if ( pivot === QQ.Sprite.pivot.LEFTTOP ) {
			x = 0;
			y = 0;
		} else if ( pivot === QQ.Sprite.pivot.CENTER ) {
			x = -this._width/2;
			y = -this._height/2;
		} else if ( pivot === QQ.Sprite.pivot.CENTERBOTTOM ) {
			x = -this._width/2;
			y = -this._height;
		} else if ( pivot === QQ.Sprite.pivot.CENTERTOP ) {
			x = -this._width/2;
			y = 0;
		}
		return {x, y};
	}
	
};
