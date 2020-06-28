import * as QQ from '../QQ.js';
import {Point, Size, Scale, Anchor} from '../primitives/index.js';

function reset(options = {}) {
	this._size.copyOrSet(options.size, 1, 1);
	this._scale.copyOrSet(options.scale, 1, 1);
	this._position.copyOrSet(options.position, 0, 0);
	this._anchor.copyOrSet(options.anchor, 0.5, 0.5);
	this._angle = QQ.useDefault(options.angle, 0);
	this._z = QQ.useDefault(options.z, 0);
}

export class Pack {
	
	constructor(options) {
		this._size = new Size;
		this._scale = new Scale;
		this._position = new Point;
		this._anchor = new Anchor,
		this._angle = undefined;
		this._z = undefined;
		reset.call(this, options);
	}
	
	reset(options) {
		reset.call(this, options);
	}
	
	size(size) {
		if ( size !== undefined ) {
			this._size.copy(size);
			this._packUpdate();
		}
		return this._size;
	}
	
	scale(scale) {
		if ( scale !== undefined ) {
			this._scale.copy(scale);
			this._packUpdate();
		}
		return this._scale;
	}
	
	position(position) {
		if ( position !== undefined ) {
			this._position.copy(position);
			this._packUpdate();
		}
		return this._position;
	}
	
	anchor(anchor) {
		if ( anchor !== undefined ) {
			this._anchor.copy(anchor);
			this._packUpdate();
		}
		return this._anchor;
	}
	
	angle(angle) {
		if ( angle !== undefined ) {
			this._angle = angle;
			this._packUpdate();
		}
		return this._angle;
	}
	
	z(z) {
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
