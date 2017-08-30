QQ.Sprite = class Sprite {
	
	constructor(readyImg) {
		if ( readyImg.complete === false ) {
			alert('QQ.Sprite: img must be completed');
		}
		this._alpha   = 1;
		this._img     = readyImg;
		this._manager = new Sprite.StaticMngr(
			readyImg.width,
			readyImg.height
		);
		this._isDisabled = false;
	}
	
	getSize() {
		return this._manager.getSize();
	}
	
	getRatio() {
		return this._manager.getRatio();
	}
	
	getDisabled() {
		return this._isDisabled;
	}
	
	setStatic() {
		this._manager = new Sprite.StaticMngr(
			this._img.width,
			this._img.height
		);
	}
	
	setDisabled(value) {
		this._isDisabled = value;
	}
	
	setAnimation(w, h, fps) {
		this._manager = new Sprite.AnimateMngr(
			w, h,
			fps,
			this._img.width
		);
	}
	
	setTileSize(x, y, w = this._img.width, h = this._img.height) {
		this._manager = new Sprite.TileMngr(x, y, w, h);
	}
	
	setClip(x, y, w, h) {
		this._manager = new Sprite.ClipMngr(x, y, w, h);
	}
	
	setClipLayer(x, y, w, h) {
		this._manager = new Sprite.ClipLayerMngr(x, y, w, h);
	}
	
	addClipLayer(x, y, w, h) {
		if ( this._manager instanceof QQ.Sprite.ClipLayerMngr ) {
			this._manager.addLayer(x, y, w, h);
		} else {
			this.setClipLayer(x, y, w, h);
		}
	}
	
	setAlpha(a) {
		this._alpha = a;
	}
	
	draw(ctx, inX, inY) {
		if ( this._isDisabled ) {
			return;
		}
		//================================================================
		const isX = (typeof inX === 'number');
		const isY = (typeof inY === 'number');
		let pivot, x, y;
		//================================================================
		// Input
		//================================================================
		if ( isX && isY ) {
			pivot = Sprite.Pivot.NONE;
			x     = inX;
			y     = inY;
		} else if ( isX && ! isY ) {
			pivot = inX;
		} else {
			pivot = Sprite.Pivot.CENTER;
		}
		//================================================================
		// Calc pivot
		//================================================================
		if ( pivot !== Sprite.Pivot.NONE ) {
			({x, y} = this._calcPosition(pivot));
		}
		if ( x === undefined || y === undefined ) {
			alert('Sprite.draw(): No X and Y provided');
			return;
		}
		//================================================================
		// Draw
		//================================================================
		const changeAlpha = (this._alpha !== 1);
		if ( changeAlpha ) {
			ctx.globalAlpha = this._alpha;
		}
		this._manager.draw(ctx, x, y, this._img);
		if ( changeAlpha ) {
			ctx.globalAlpha = 1;
		}
	}
	
	_calcPosition(pivot) {
		return this._manager.calcPosition(pivot);
	}
	
};
