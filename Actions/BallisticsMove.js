import {Point, Size} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class BallisticsMove extends Idle {
	
	constructor(input) {
		super(input);
		this._from = this._subj.position();
		this._to = input.to;
		this._size = this._subj.size().clone();
	}
	
	tick(delta) {
		super.tick(delta);
		const dist = new Point(
			this._to.x() - this._from.x(),
			this._to.y() - this._from.y()
		);
		const point = new Point(
			this._from.x() + this._progress * dist.x(),
			this._from.y() + this._progress * dist.y()
		);
		this._subj.setPosition(point);
		const value = (0.5 - Math.abs(this._progress-0.5))*1.5;
		const size = new Size(
			this._size.w() + value * this._size.w()*2,
			this._size.h() + value * this._size.h()*2
		);
		this._subj.setSize(size);
	}
	
	finishAction() {
		this._subj.setSize(this._size);
		this._subj.setPosition(this._to);
		super.finishAction();
	}
	
}
