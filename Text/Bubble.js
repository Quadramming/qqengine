import * as QQ from '../QQ.js';
import * as Actions from '../Actions/index.js';
import * as style from '../style/index.js';
import {ActionableMix} from '../Subject/ActionableMix.js';
import {Point} from '../primitives/index.js';
import {Text} from './Text.js';

export class Bubble extends
	QQ.mixins(ActionableMix, Text)
{
	
	constructor(options) {
		super(options);
		this._alpha = 1;
		this._upHeight = 2.5;
		this._durationUp = 10.5;
		this._durationDisapper = 0.5;
		this.up();
	}
	
	up() {
		const thisPos = this.getPosition();
		this.setAction(
			new Actions.MoveTo({
				subj: this,
				to: new Point(thisPos.x(), thisPos.y() - this._upHeight),
				duration: this._durationUp,
				onEnd: () => {
					this.disappear();
				}
			})
		);
	}
	
	disappear() {
		this.setAction(
			new Actions.Disappear({
				duration: this._durationDisapper,
				onEnd: () => {
					this.deleteMe();
				}
			})
		);
	}
	
	static make(options) {
		const bubble = new Bubble(
			style.use('bubbleText', options)
		);
		if ( options.world ) {
			options.world.addSubject(bubble);
		}
		return bubble;
	}
	
}
