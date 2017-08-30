QQ.Sprite.Mngr = class Mngr {
	
	constructor(w, h) {
		this._width  = w;
		this._height = h;
	}
	
	getSize() {
		return {
			width:  this._width,
			height: this._height
		};
	}
	
	getRatio() {
		return this._width / this._height;
	}
	
	calcPosition(pivot) {
		let x, y;
		if ( pivot === QQ.Sprite.Pivot.LEFTTOP ) {
			x = 0;
			y = 0;
		} else if ( pivot === QQ.Sprite.Pivot.CENTER ) {
			x = -this._width/2;
			y = -this._height/2;
		} else if ( pivot === QQ.Sprite.Pivot.CENTERBOTTOM ) {
			x = -this._width/2;
			y = -this._height;
		} else if ( pivot === QQ.Sprite.Pivot.CENTERTOP ) {
			x = -this._width/2;
			y = 0;
		}
		return {x, y};
	}
	
};
