import {Point} from '../Point.js';
import {Idle} from './Idle.js';

export class AngleMove extends Idle {
	
	constructor(input) {
		super(input);
		this._from = input.from;
		this._to = input.to;
	}
	
	/*
	tick(delta) {
		super.tick(delta);
		const s = Math.sign;
		const a = Math.abs;
		const dist = new Point(
			this._to.x() - this._from.x(),
			this._to.y() - this._from.y()
		);
		let dist = a(dist.x()) + a(dist.y());
		dist *= this._progress;
		const progress = new Point(
			dist > a(xDist) ? a(xDist) : dist,
			dist - a(xDist) < 0 ? 0 : dist - a(xDist)
		);
		const point = new Point(
			this._from.x() + progress.x() * s(dist.x()),
			this._from.y() + progress.y() * s(dist.y())
		);
		this._subj.setPosition(point);
	}
	*/
	
}
