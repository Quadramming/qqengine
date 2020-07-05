import {Point} from './primitives/index.js';

export class WorldPointer {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor() {
		this._isBlocked = false;
		this._isClicked = false;
		this._isNearStart = false;
		this._onDown = () => {};
		this._onUp = () => {};
		this._onClick = () => {};
		this._convertToWorldFromScreen = () => {};
		this._position = {};
		this._startPosition = {};
		this.reset();
	}
	
	//================================================================
	// Set functions
	//================================================================
	
	setConverterToWorldFromScreen(fn) {
		this._convertToWorldFromScreen = fn;
	}
	
	setActions(down, up, click) {
		this._onDown = down;
		this._onUp = up;
		this._onClick = click;
	}
	
	reset() {
		this._process(this._position, null);
		this._process(this._startPosition, null);
		this._isClicked = false;
		this._isNearStart = false;
	}
	
	//================================================================
	// Gets
	//================================================================
	
	isClicked() {
		return this._isClicked;
	}
	
	getScreenPoint() {
		return this._position.screen;
	}
	
	getWorldPoint() {
		return this._position.world;
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
			this._isClicked = true;
			this._isNearStart = true;
			this._process(this._startPosition, point);
			this._process(this._position, point);
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
			this._process(this._position, point);
		}
		if ( this._isClicked ) {
			this._onUp(this._position.world);
			if ( this._isNearStart ) {
				this._onClick(this._position.world);
			}
		}
		if ( point === false ) {
			this._process(this._position, null);
		}
		this._process(this._startPosition, null);
		this._isClicked = false;
		c('unclick');
		this._isNearStart = false;
	}
	
	move(point) {
		if ( this._isBlocked ) {
			return;
		}
		if ( point ) {
			this._process(this._position, point);
			if ( this._isClicked && this._isNearStart ) {
				const isFar = ! this._position.screen.isNear(
					this._startPosition.screen, 10
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
	
	update() {
		this._process(this._position, this._position.screen);
	}
	
	//================================================================
	// Process point
	//================================================================
	
	_process(position, point) {
		if ( point ) {
			position.screen.copy(point);
			position.world.copy(point);
			this._convertToWorldFromScreen(position.world);
		} else {
			if ( position.screen ) {
				position.screen.set(NaN);
			} else {
				position.screen = new Point(NaN);
			}
			if ( position.world ) {
				position.world.set(NaN);
			} else {
				position.world = new Point(NaN);
			}
		}
	}
	
}
