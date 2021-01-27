// QQDOC

import * as QQ from '../QQ.js';
import * as Pack from '../Pack/index.js';
import {Point, Size} from '../primitives/index.js';
import {RelationshipMix} from './RelationshipMix.js';
import {SortByZMix} from './SortByZMix.js';
import {MatrixMix} from './MatrixMix.js';

function fixOptions(options) {
	options.size = Size.NIL();
}

export class Group extends
	QQ.mixins(MatrixMix, SortByZMix, RelationshipMix, Pack.Pack)
{
	
	constructor(options = {}) {
		fixOptions(options);
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) {
		fixOptions(options);
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		options.init?.call(this);
	} // void
	
	tick(delta) { // {O}
		super.tick(delta);
		this.forSubjects( subj => subj.tick(delta) );
	} // void
	
	draw(context) {
		this.forSubjects( subj => subj.draw(context) );
	} // void
	
	addPosition(offset) {
		this.position().add(offset);
	} // void
	
	getWorldPosition() {
		return this.localToWorld(Point.NIL());
	} // void
	
	movePosition(offset) {
		this.addPosition(offset);
	} // void
	
}
