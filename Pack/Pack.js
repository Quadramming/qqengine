// QQDOC

import * as QQ from '../QQ.js';
import {Point, Size, Scale, Anchor} from '../primitives/index.js';

function reset(options = {}) {
	this._size.copyOrSet(options.size, 1, 1);
	this._scale.copyOrSet(options.scale, 1, 1);
	this._position.copyOrSet(options.position, 0, 0);
	this._anchor.copyOrSet(options.anchor, 0.5, 0.5);
	this._angle = options.angle ?? 0;
	this._z = options.z ?? 0;
}

export class Pack {
	
	_size = new Size;
	_scale = new Scale;
	_position = new Point;
	_anchor = new Anchor;
	_angle;
	_z;
	
	constructor(options) {
		reset.call(this, options);
	}
	
	destructor() {
	}
	
	reset(options) {
		reset.call(this, options);
	}
	
	size(size) { // {F}
		if ( size !== undefined ) {
			this._size.copy(size);
			this._packUpdate();
		}
		return this._size;
	}
	
	scale(scale) { // {F}
		if ( scale !== undefined ) {
			this._scale.copy(scale);
			this._packUpdate();
		}
		return this._scale;
	}
	
	position(position) { // {F}
		if ( position !== undefined ) {
			this._position.copy(position);
			this._packUpdate();
		}
		return this._position;
	}
	
	anchor(anchor) { // {F}
		if ( anchor !== undefined ) {
			this._anchor.copy(anchor);
			this._packUpdate();
		}
		return this._anchor;
	}
	
	angle(angle) { // {F}
		if ( angle !== undefined ) {
			this._angle = angle;
			this._packUpdate();
		}
		return this._angle;
	}
	
	z(z) { // {F}
		if ( z !== undefined ) {
			this._z = z;
			this._packUpdate();
		}
		return this._z;
	}
	
	_packUpdate() {
		// Override me
	}
	
}
