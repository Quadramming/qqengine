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
	}
	
	getRatio() {
		return this._manager.getRatio();
	}
	
	getSize() {
		return this._manager.getSize();
	}
	
	setAnimation(w, h, fps) {
		this._manager = new Sprite.AnimateMngr(
				w, h,
				fps,
				this._img.width
			);
	}
	
	setTileSize(x, y) {
		this._manager = new Sprite.TileMngr(
			this._img.width,
			this._img.height
		);
		this._manager.setTileSize(x, y);
	}
	
	setAlpha(a) {
		this._alpha = a;
	}
	
	draw(ctx, inX, inY) {
		const isX = (typeof inX === 'number');
		const isY = (typeof inY === 'number');
		let pivot, x, y;
		//================================================================
		// Input
		//================================================================
		if ( isX && isY ) {
			pivot = Sprite.pivot.NONE;
			x     = inX;
			y     = inY;
		} else if ( isX && ! isY ) {
			pivot = inX;
		} else {
			pivot = Sprite.pivot.CENTER;
		}
		//================================================================
		// Calc pivot
		//================================================================
		if ( pivot !== Sprite.pivot.NONE ) {
			({x, y} = this._calcPosition(pivot));
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

QQ.Sprite.pivot = {
	NONE:         0,
	CENTER:       1,
	LEFTTOP:      2,
	CENTERBOTTOM: 3,
	CENTERTOP:    4
};
