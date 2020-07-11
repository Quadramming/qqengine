import {Point} from './primitives/index.js';

const SCREEN_NEAR_PX = 10;

export class Pointer {
	
	constructor(seizure) {
		this._seizure = undefined;
		this._isActive = undefined;
		this._isNearStart = undefined;
		this._startPosition = {
			screen: new Point,
			world: new Point
		};
		this._position = {
			screen: new Point,
			world: new Point
		};
		this.reset(seizure);
	}
	
	destructor() {
		this._seizure = undefined;
		this._isActive = undefined;
		this._isNearStart = undefined;
		this._startPosition = undefined;
		this._position = undefined;
	}
	
	reset(seizure) {
		if ( seizure ) {
			this._seizure = seizure;
		}
		this._isActive = false;
		this._isNearStart = false;
		this._unset(this._position);
		this._unset(this._startPosition);
	}
	
	getScreenPoint() {
		return this._position.screen;
	}
	
	getWorldPoint() {
		this.update();
		return this._position.world;
	}
	
	getStartWorldPoint() {
		this.update();
		return this._startPosition.world;
	}
	
	isActive() {
		return Boolean(this._isActive);
	}
	
	isInactive() {
		return ! this._isActive;
	}
	
	down(point) {
		this._set(this._startPosition, point);
		this._set(this._position, point);
		this._isNearStart = true;
		this._isActive = true;
		this._seizure.onClickDown(this._position.world, this);
	}
	
	move(point) {
		this._set(this._position, point);
		if ( this._isNearStart ) {
			this._isNearStart = this._position.screen.isNear(
				this._startPosition.screen, SCREEN_NEAR_PX
			);
			// May be consider world movement
		}
	}
	
	up(point) {
		this._set(this._position, point);
		this._seizure.onClickUp(this._position.world, this);
		if ( this._isNearStart ) {
			this._seizure.onClick(this._position.world, this);
		}
		this.reset();
	}
	
	update() {
		this._set(this._position, this._position.screen);
	}
	
	_set(position, point) {
		position.screen.copy(point);
		position.world.copy( this._seizure.getWorldFromScreen(point) );
	}
	
	_unset(position) {
		if ( ! position ) debugger;
		position.screen.set(NaN);
		position.world.set(NaN);
	}
	
}
