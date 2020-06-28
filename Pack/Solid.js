import {Pack} from './Pack.js';
import {Point, Size, Rect, Offset} from '../primitives/index.js';
import * as CONST from '../CONST/index.js';
import * as QQ from '../QQ.js';

function reset(options = {}) {
	this._offset.copyOrSet(options.offset, 0, 0);
	this._getBasis = QQ.useDefault(options.getBasis, null);
	this._type = QQ.useDefault(options.type, CONST.SOLID.STATIC);
	this._weight = QQ.useDefault(options.weight, 1);
}

export class Solid extends Pack {
	
	constructor(options) {
		super(options);
		this._offset = new Offset;
		this._getBasis = undefined;
		this._type = undefined;
		this._weight = undefined;
		reset.call(this, options);
	}
	
	reset(options) {
		super.reset(options);
		reset.call(this, options);
	}
	
	position(position) { // override
		if ( this._getBasis ) {
			const basis = this._getBasis().clone();
			basis.add(this._offset);
			return basis;
		}
		return super.position(position);
	}
	
	weight(weight) {
		if ( weight !== undefined ) {
			this._weight = weight;
			this._packUpdate();
		}
		return this._weight;
	}
	
	type(type) {
		if ( type !== undefined ) {
			this._type = type;
			this._packUpdate();
		}
		return this._type;
	}
	
	rect() {
		const position = this.position();
		const size = this.size();
		const anchor = this.anchor();
		return new Rect(
			position.x() - size.w()*anchor.x(),
			position.y() - size.h()*anchor.y(),
			size.w(),
			size.h()
		);
	}
	
}
