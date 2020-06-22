import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Walk extends Idle {
	
	constructor(direction) {
		super();
		this._direction = direction.clone();
	}
	
	tick(delta) {
		const subj = this.subject();
		const walked = subj.getSpeed() * delta;
		
		const from = subj.getPosition();
		const to = from.clone().add(this._direction);
		
		const A = to.y() - from.y();
		const B = to.x() - from.x();
		const C = Math.sqrt(A*A + B*B);
		const sin = A/C;
		const cos = B/C;
		const a = cos * walked;
		const b = sin * walked;
		
		this._subj.addPosition(new Point(a, b));
	}
	
}
