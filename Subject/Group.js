import * as Pack from '../Pack/index.js';
import * as QQ from '../QQ.js';
import {Offset, Point, Rect, Size, Anchor} from '../primitives/index.js';
import {RelationshipMix} from './RelationshipMix.js';
import {SortByZMix} from './SortByZMix.js';
import {MatrixMix} from './MatrixMix.js';

function fixOptions(options) {
	options.size = Size.NIL();
}

export class Group extends
	QQ.mixins(MatrixMix, SortByZMix, RelationshipMix, Pack.Pack)
{
	
	#tickFn; // Tick function
	
	constructor(options = {}) {
		fixOptions(options);
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) {
		fixOptions(options);
		super.reset(options);
		this.#reset(options);
	}
	
	reset(options = {}) {
		super.reset(options);
		this.#reset(options);
	}
	
	#reset(options) {
		this.#tickFn = options.tickFn ?? null;
		options.init?.call(this);
	}
	
	tick(delta) {
		super.tick(delta);
		this.#tickFn?.(delta);
		this.forSubjects( subj => subj.tick(delta) );
	}
	
	draw(context) {
		this.forSubjects( subj => subj.draw(context) );
	}
	
	getWorldPosition() {
		return this.localToWorld(Point.NIL());
	}
	
	addPosition(offset) {
		this.position().add(offset);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
	}
	
}
