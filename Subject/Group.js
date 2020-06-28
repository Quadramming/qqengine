import * as Pack from '../Pack/index.js';
import * as QQ from '../QQ.js';
import {Offset, Point, Rect, Size, Anchor} from '../primitives/index.js';
import {RelationshipMix} from './RelationshipMix.js';
import {SortByZMix} from './SortByZMix.js';
import {MatrixMix} from './MatrixMix.js';

function reset(options) {
	this._tickFn = QQ.useDefault(options.tickFn, null);
	if ( options.init ) {
		options.init.call(this);
	}
	if ( options.selfAdd === true ) {
		this.parent().addSubject(this);
	}
}

function fixOptions(options) {
	options.size = new Size(0, 0);
}

export class Group extends
	QQ.mixins(MatrixMix, SortByZMix, RelationshipMix, Pack.Pack)
{
	
	constructor(options = {}) {
		fixOptions(options);
		super(options);
		this._tickFn = undefined;
		reset.call(this, options);
	}
	
	reset(options = {}) {
		fixOptions(options);
		super.reset(options);
		reset.call(this, options);
	}
	
	tick(delta) {
		super.tick(delta);
		if ( this._tickFn ) {
			this._tickFn(delta);
		}
		this.forSubjects( subj => subj.tick(delta) );
	}
	
	draw(context) {
		this.forSubjects( subj => subj.draw(context) );
	}
	
	getWorldPosition() {
		return this.localToWorld(new Point(0, 0));
	}
	
	getWorld() {
		return this.parent().getWorld();
	}
	
	addPosition(offset) {
		this.position().add(offset);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
	}
	
}
