import * as QQ from '../QQ.js';
import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Idle} from './Idle.js';

export class Shake extends Idle {
	
	constructor(input = {}) {
		super(input);
		this._dispersion = new Size(1, 1);
		if ( input.dispersion ) {
			this._dispersion.copy(input.dispersion);
		}
		this._period = QQ.useDefault(input.period, 1);
		this._position = this._subj.getPosition();
	}
	
	onStart() {
		this._subj.setPosition(this._calcPosition());
	}
	
	tick(delta) {
		super.tick(delta);
		this._subj.setPosition(this._calcPosition());
	}
	
	_calcPosition() {
		const time = this._lasting * Math.PI*2 / this._period;
		return new Point(
			this._position.x() + this._dispersion.w() * Math.sin(time)/2,
			this._position.y() + this._dispersion.h() * Math.cos(time)/2
		);
	}
	
}
