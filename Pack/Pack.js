import * as QQ from '../QQ.js';
import {Point, Size, Scale} from '../primitives/index.js';

export class Pack {
	
	constructor(options = {}) {
		// Set default
		this._size = new Size(1, 1);
		this._scale = new Scale(1, 1);
		this._position = new Point(0, 0);
		this._z = 0;
		this._anchor = new Point(0.5, 0.5),
		this._angle = 0;
		// Set options
		this._size.copy(options.size);
		this._scale.copy(options.scale);
		this._position.copy(options.position);
		if ( options.z !== undefined ) {
			this._z = options.z;
		}
		this._anchor.copy(options.anchor);
		if ( options.angle !== undefined ) {
			this._angle = options.angle;
		}
	}
	
	_update() {
		// Override me
	}
	
	size(size) {
		if ( size !== undefined ) {
			this._size.copy(size);
			this._update();
		}
		return this._size;
	}
	
	scale(scale) {
		if ( scale !== undefined ) {
			this._scale.copy(scale);
			this._update();
		}
		return this._scale;
	}
	
	position(position) {
		if ( position !== undefined ) {
			this._position.copy(position);
			this._update();
		}
		return this._position;
	}
	
	z(z) {
		if ( z !== undefined ) {
			this._z = z;
			this._update();
		}
		return this._z;
	}
	
	anchor(anchor) {
		if ( anchor !== undefined ) {
			this._anchor.copy(anchor);
			this._update();
		}
		return this._anchor;
	}
	
	angle(angle) {
		if ( angle !== undefined ) {
			this._angle = angle;
			this._update();
		}
		return this._angle;
	}
	
}
