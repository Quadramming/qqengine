import {Point} from '../Point.js';
import {Idle} from './Idle.js';

export class WalkTo extends Idle {
	
	constructor(options) {
		super(options);
		this._to = options.to;
	}
	
	setTarget(to) {
		this._to = to;
	}
	
	getTarget() {
		return this._to;
	}
	
	tick(delta) {
		const walked = this._subj.getSpeed() * delta;
		const from = this._subj.getPosition();
		const to = this._to;
		const A = to.y() - from.y();
		const B = to.x() - from.x();
		const C = Math.sqrt(A*A + B*B);
		const sin = A/C;
		const cos = B/C;
		const a = cos * walked;
		const b = sin * walked;
		if ( walked < C ) {
			this._subj.addPosition(new Point(a, b));
		} else {
			this._subj.setPosition(to);
			this.finishAction();
		}
	}
	
}
