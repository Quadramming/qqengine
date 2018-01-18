QQ.Sprite = class Sprite {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(readyImg) {

		this._isDisabled = false;
		this._anchor     = new QQ.Point(0, 0);
		this._alpha      = 1;
		this._img        = null;
		this._manager    = null;
		this.setImg(readyImg);
		this.setStatic();
	}
	
	//================================================================
	// Common
	//================================================================
	
	isDisabled() {
		return this._isDisabled;
	}
	
	setImg(readyImg) {
		if ( readyImg.complete === false ) {
			alert('QQ.Sprite: img must be completed');
		}
		this._img = readyImg;
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
	
	setSize(size) {
		return this._manager.setSize(size);
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
	
	setAnimation(frames, fps) {
		const size = this._manager.getSize();
		const imgSize = new QQ.Point(this._img.width, this._img.height);
		this._manager = new Sprite.AnimateMngr(frames, fps, size, imgSize);
	}
	
	//================================================================
	// Tile manager
	//================================================================
	
	setTileSize(tileSize, size = null) {
		if ( size === null ) {
			size = new QQ.Point(this._img.width, this._img.height);
		}
		this._manager = new Sprite.TileMngr(tileSize, size);
	}
	
	//================================================================
	// Clip manager
	//================================================================
	
	setClip(rect, size) {
		this._manager = new Sprite.ClipMngr(rect, size);
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
	// Draw & tick
	//================================================================
	
	draw(ctx) {
		if ( this._isDisabled ) {
			return;
		}
		const drawPoint   = this._calcDrawPoint();
		const changeAlpha = (this._alpha !== 1);
		if ( changeAlpha ) {
			ctx.globalAlpha = this._alpha;
		}
		this._manager.draw(ctx, drawPoint, this._img);
		if ( changeAlpha ) {
			ctx.globalAlpha = 1;
		}
	}
	
	tick(delta) {
		this._manager.tick(delta);
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
