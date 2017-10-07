QQ.Sprite = class Sprite {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(readyImg) {
		if ( readyImg.complete === false ) {
			alert('QQ.Sprite: img must be completed');
		}
		this._isDisabled = false;
		this._anchor     = new QQ.Point(0, 0);
		this._alpha      = 1;
		this._img        = readyImg;
		this._manager    = null;
		this.setStatic();
	}
	
	//================================================================
	// Common
	//================================================================
	
	isDisabled() {
		return this._isDisabled;
	}
	
	setAlpha(a) {
		this._alpha = a;
	}
	
	setAnchor(point) {
		this._anchor.copy(point);
	}
	
	setDisabled(value) {
		this._isDisabled = value;
	}
	
	getSize() {
		return this._manager.getSize();
	}
	
	getRatio() {
		return this._manager.getRatio();
	}
	
	//================================================================
	// Static manager
	//================================================================
	
	setStatic() {
		this._manager = new Sprite.StaticMngr( new QQ.Size(
			this._img.width,
			this._img.height
		));
	}
	
	//================================================================
	// Animation manager
	//================================================================
	
	setAnimation(size, fps) {
		this._manager = new Sprite.AnimateMngr(size, fps, this._img.width);
	}
	
	//================================================================
	// Tile manager
	//================================================================
	
	setTileSize(tileSize, size = null) {
		if ( size === null ) {
			size = new QQ.Pont(this._img.width, this._img.height);
		}
		this._manager = new Sprite.TileMngr(tileSize, size);
	}
	
	//================================================================
	// Clip manager
	//================================================================
	
	setClip(rect) {
		this._manager = new Sprite.ClipMngr(rect);
	}
	
	//================================================================
	// Layer manager
	//================================================================
	
	setClipLayer(rect) {
		if ( rect instanceof QQ.Rect ) {
			this._manager = new Sprite.ClipLayerMngr(rect);
		} else {
			alert('setClipLayer error');
		}
	}
	
	addClipLayer(rect) {
		if ( this._manager instanceof QQ.Sprite.ClipLayerMngr ) {
			this._manager.addLayer(rect);
		} else {
			this.setClipLayer(rect);
		}
	}
	
	//================================================================
	// Draw
	//================================================================
	
	draw(ctx) {
		if ( this._isDisabled ) {
			return;
		}
		const point       = this._calcDrawPoint();
		const changeAlpha = (this._alpha !== 1);
		if ( changeAlpha ) {
			ctx.globalAlpha = this._alpha;
		}
		this._manager.draw(ctx, point, this._img);
		if ( changeAlpha ) {
			ctx.globalAlpha = 1;
		}
	}
	
	//================================================================
	// Private
	//================================================================
	
	_calcDrawPoint() {
		return new QQ.Point(
			this._anchor.x() * (-this._manager._size.x()),
			this._anchor.y() * (-this._manager._size.y())
		);
	}
	
};
