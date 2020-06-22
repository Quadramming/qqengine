import {Pack} from './Pack.js';
import {Point, Size, Rect, Offset} from '../primitives/index.js';
import * as CONST from '../CONST/index.js';

export class Solid extends Pack {
	
	constructor(options = {}) {
		super(options);
		// Set default
		this._offset = new Offset(0, 0);
		this._getBasis = null;
		this._rect = new Rect();
		this._type = CONST.SOLID.STATIC;
		this._weight = 1;
		// Set options
		this._offset.copy(options.offset);
		if ( options.getBasis !== undefined ) {
			this._getBasis = options.getBasis;
		}
		if ( options.type !== undefined ) {
			this._type = options.type;
		}
		if ( options.weight !== undefined ) {
			this._weight = options.weight;
		}
	}
	
	position(position) { // override
		if ( this._getBasis ) {
			const basis = this._getBasis().clone();
			basis.add(this._offset);
			this._position.copy(basis);
		} else if ( position !== undefined ) {
			this._position.copy(position);
			this._update();
		}
		return this._position;
	}
	
	weight(weight) {
		if ( weight !== undefined ) {
			this._weight = weight;
			this._update();
		}
		return this._weight;
	}
	
	type(type) {
		if ( type !== undefined ) {
			this._type = type;
			this._update();
		}
		return this._type;
	}
	
	rect() {
		const position = this.position();
		const size = this.size();
		const anchor = this.anchor();
		const rect = this._rect;
		rect.x(position.x() - size.w()*anchor.x());
		rect.y(position.y() - size.h()*anchor.y());
		rect.w(size.w());
		rect.h(size.h());
		return rect;
	}
	
}
