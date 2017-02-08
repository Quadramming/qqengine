QQ.Sprite = class Sprite {
	
	constructor(readyImg) {
		if ( readyImg.complete === false) {
			alert('QQ.Sprite: img must be completed');
		}
		this._alpha   = 1;
		this._img     = readyImg;
		this._ctx     = Sprite.globalContext();
		this._manager = new QQ.Sprite.StaticSprite(
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
		this._manager = new QQ.Sprite.AnimateSprite(
			w, h,
			fps,
			this._img.width
		);
	}

	setAlpha(a) {
		this._alpha = a;
	}

	draw(inX, inY) {
		const isX = (typeof inX === 'number');
		const isY = (typeof inY === 'number');
		if ( this._ctx ) {
			let pivot, x, y;
			//================================================================
			// Input
			//================================================================
			if ( isX && isY ) {
				pivot = QQ.Sprite.pivot.NONE;
				x     = inX;
				y     = inY;
			} else if ( isX && ! isY ) {
				pivot = inX;
			} else {
				pivot = QQ.Sprite.pivot.CENTER;
			}
			//================================================================
			// Calc pivot
			//================================================================
			if ( pivot !== QQ.Sprite.pivot.NONE ) {
				({x, y} = this._calcPosition(pivot));
			}
			//================================================================
			// Draw
			//================================================================
			const changeAlpha = (this._alpha !== 1);
			if ( changeAlpha ) {
				this._ctx.globalAlpha = this._alpha;
			}
			this._manager.draw(x, y, this._img, this._ctx);
			if ( changeAlpha ) {
				this._ctx.globalAlpha = 1;
			}
		}
	}
	
	_calcPosition(pivot) {
		return this._manager.calcPosition(pivot);
	}
	
};

QQ.Sprite.SpriteManager = class SpriteManager {
	
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

QQ.Sprite.StaticSprite = class StaticSprite extends QQ.Sprite.SpriteManager {
	
	constructor(w, h) {
		super(w, h);
	}
	
	draw(x, y, img, ctx) {
		ctx.drawImage(
			img,
			x, y,
			this._width, this._height
		);
	}
	
};

QQ.Sprite.AnimateSprite = class AnimateSprite extends QQ.Sprite.SpriteManager {
	
	constructor(w, h, fps, fullWidth) {
		super(w, h);
		this._fps       = fps;
		this._tpf       = Math.round(1000 / fps);
		this._frames    = fullWidth / w;
		this._startTime = Date.now();
	}
	
	draw(x, y, img, ctx) {
		const diff         = Date.now() - this._startTime;
		const passedFrames = Math.round(diff/this._tpf);
		this._curFrame     = passedFrames % this._frames;
		ctx.drawImage(
			img,
			this._width * this._curFrame, 0,
			this._width, this._height,
			x, y,
			this._width, this._height
		);
	}
	
};

QQ.Sprite.globalContext = function globalContext(ctx) {
	if ( ctx ) {
		globalContext.value = ctx;
	} else if ( ! globalContext.value ) {
		alert('Sprite global context is undefined');
	}
	return globalContext.value;
};

QQ.Sprite.pivot = {
	NONE:         0,
	CENTER:       1,
	LEFTTOP:      2,
	CENTERBOTTOM: 3,
	CENTERTOP:    4
};
