// QQDOC

import * as QQ from '../QQ.js';
import * as Pack from '../Pack/index.js';
import {Rect, Point, XY} from '../primitives/index.js';
import {RelationshipMix} from './RelationshipMix.js';
import {SortByZMix} from './SortByZMix.js';
import {MatrixMix} from './MatrixMix.js';
import {DrawMix} from './DrawMix.js';
import {ClickableMix} from './ClickableMix.js';

export class Subject extends
	QQ.mixins(DrawMix, ClickableMix, MatrixMix, SortByZMix, RelationshipMix, Pack.Pack)
{
	
	#tickFn;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#tickFn = options.tickFn ?? null;
		options.init?.call(this);
	} // void
	
	tick(delta) {
		super.tick(delta);
		this.#tickFn?.(delta);
		this.forSubjects( subj => subj.tick(delta) );
	} // void
	
	isContains(worldPoint) {
		const local = this.worldToLocal(worldPoint);
		const rect = this.getLocalRect();
		return rect.isContains(local);
	} // boolean
	
	getWorldPosition() {
		return this.localToWorld(Point.NIL());
	} // new Point
	
	getBounds() {
		const rect = this.getLocalRect();
		return Rect.fromPoints(
			this.localToWorld(new Point(rect.left(), rect.top())),
			this.localToWorld(new Point(rect.right(), rect.top())),
			this.localToWorld(new Point(rect.left(), rect.bottom())),
			this.localToWorld(new Point(rect.right(), rect.bottom()))
		);
	} // new Rect
	
	getLocalRect() {
		return new Rect(
			-this.size().x()*this.anchor().x(),
			-this.size().y()*this.anchor().y(),
			this.size().w(),
			this.size().h()
		);
	} // new Rect
	
	addPosition(x, y) { // or (XY)
		if ( x instanceof XY ) {
			this.position().add(x);
		} else {
			this.position().add(new XY(x, y));
		}
	} // void
	
	movePosition(offset) {
		this.addPosition(offset);
	} // void
	
	fitInRect(rect) {
		this.anchor().set(0, 0);
		this.size().set(
			rect.right() - rect.left(),
			rect.bottom() - rect.top()
		);
		this.position().set(rect.left(), rect.top());
		this.angle(0);
		this.scale().set(1, 1);
	} // void
	
}
