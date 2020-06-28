import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import {Pack} from './Pack.js';
import {Point, Size, Rect, Offset} from '../primitives/index.js';

function reset(options = {}) {
	this._parent = options.parent;
	if ( this._parent ) {
		this._matrix = this._parent.calcMatrix();
	} else {
		this._matrix = matrix.getIdentity();
	}
}

export class MatrixCache extends Pack {
	
	constructor(options) {
		super(options);
		this._parent = undefined;
		this._matrix = undefined;
		reset.call(this, options);
	}
	
	reset(options) {
		super.reset(options);
		reset.call(this, options);
	}
	
	get() {
		if ( this.isChanged() ) {
			this._matrix = this._parent.calcMatrix();
			this.position().copy(this._parent.position());
			this.size().copy(this._parent.size());
			this.scale().copy(this._parent.scale());
			this.anchor().copy(this._parent.anchor());
			this.angle(this._parent.angle());
		}
		return this._matrix;
	}
	
	isChanged() {
		if ( ! this.position().isEquals(this._parent.position()) ) {
			return true;
		}
		if ( ! this.size().isEquals(this._parent.size()) ) {
			return true;
		}
		if ( ! this.scale().isEquals(this._parent.scale()) ) {
			return true;
		}
		if ( ! this.anchor().isEquals(this._parent.anchor()) ) {
			return true;
		}
		if ( this.angle() !== this._parent.angle() ) {
			return true;
		}
		return false;
	}
	
}
