import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Walk extends Idle {
	
	#direction = new Point();
	#power = 1;
	
	constructor(options = {}) {
		super(options);
		this.#direction.copy(options.direction);
		if ( options.power ) this.#power = options.power;
	}
	
	set(direction, power) {
		this.#direction.copy(direction);
		if ( power ) this.#power = power;
	}
	
	tick(delta) {
		super.tick(delta);
		const subj = this.subject();
		const walked = subj.getSpeed() * delta * this.#power;
		
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
