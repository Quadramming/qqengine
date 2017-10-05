QQ.WorldPointer = class WorldPointer {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor() {
		this._onDown             = () => {};
		this._onUp               = () => {};
		this._onClick            = () => {};
		this._getWorldFromScreen = () => {};
		this._isBlocked          = false;
		this._position           = this._processPoint();
		this._startPoint         = this._processPoint();
		this._isClicked          = false;
		this._isNearStart        = false;
	}
	
	//================================================================
	// Set functions
	//================================================================
	
	setWorldFromScreen(fn) {
		this._getWorldFromScreen = fn;
	}
	
	setActions(down, up, click) {
		this._onDown      = down;
		this._onUp        = up;
		this._onClick     = click;
	}
	
	reset() {
		this._position    = this._processPoint();
		this._startPoint  = this._processPoint();
		this._isClicked   = false;
		this._isNearStart = false;
	}
	
	//================================================================
	// Check
	//================================================================
	
	isClicked() {
		return this._isClicked;
	}
	
	//================================================================
	// Block
	//================================================================
	
	block(value) {
		this._isBlocked = value;
		this.reset();
	}
	
	//================================================================
	// Actions
	//================================================================
	
	down(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point ) {
			this._isClicked   = true;
			this._isNearStart = true;
			this._startPoint  = this._processPoint(point);
			this._position    = this._processPoint(point);
			this._onDown(this._position.world);
		} else {
			this.reset();
		}
	}
	
	up(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point ) {
			this._position = this._processPoint(point);
		}
		if ( this._isClicked ) {
			this._onUp(this._position.world);
			if ( this._isNearStart ) {
				this._onClick(this._position.world);
			}
		}
		if ( point === false ) {
			this._position = this._processPoint();
		}
		this._startPoint  = this._processPoint();
		this._isClicked   = false;
		this._isNearStart = false;
	}
	
	move(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point ) {
			this._position = this._processPoint(point);
			if ( this._isClicked && this._isNearStart ) {
				const isFar = ! this._position.screen.isNear(
					this._startPoint.screen, 10
				);
				if ( isFar ) {
					this._isNearStart = false;
				}
			}
		} else {
			if ( this._isClicked ) {
				this.up(point);
			} else {
				this.reset();
			}
		}
	}
	
	//================================================================
	// Process point
	//================================================================
	
	_processPoint(point) {
		if ( point ) {
			return {
				screen: point.clone(),
				world:  this._getWorldFromScreen(point)
			};
		} else {
			return {
				screen: false,
				world:  false
			};
		}
	}
	
};
