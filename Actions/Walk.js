import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Walk extends Idle {
	
	#direction = new Point();
	
	constructor(options = {}) {
		super(options);
		this.#direction.copy(options.direction);
	}
	
	tick(delta) {
		const subj = this.subject();
		const walked = subj.getSpeed() * delta;
		
		const from = subj.position();
		const to = from.clone().add(this.#direction);
		
		const A = to.y() - from.y();
		const B = to.x() - from.x();
		const C = Math.sqrt(A*A + B*B);
		const sin = A/C;
		const cos = B/C;
		const a = cos * walked;
		const b = sin * walked;
		
		subj.addPosition(a, b);
	}
	
}
