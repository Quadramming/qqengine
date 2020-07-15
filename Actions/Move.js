import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Move extends Idle {
	
	constructor(options) {
		super(options);
		this._from = options.from.clone();
		this._to = options.to.clone();
		this._distance = new Point(
			this._to.x() - this._from.x(),
			this._to.y() - this._from.y()
		);
	}
	
	tick(delta) {
		super.tick(delta);
		this._subj.position(new Point(
			this._from.x() + this._progress * this._distance.x(),
			this._from.y() + this._progress * this._distance.y()
		));
		c(this._progress);
	}
	
}
