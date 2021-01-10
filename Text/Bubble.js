// QQDOC

import * as QQ from '../QQ.js';
import * as Actions from '../Actions/index.js';
import * as style from '../style/index.js';
import {END_STRATEGY} from '../CONST/index.js';
import {ActionableMix} from '../Subject/ActionableMix.js';
import {Point} from '../primitives/index.js';
import {Text} from './Text.js';

export class Bubble extends
	QQ.mixins(ActionableMix, Text)
{
	
	#upHeight;
	#durationUp;
	#durationDisapper;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#upHeight = 0.5;
		this.#durationUp = 1;
		this.#durationDisapper = 0.5;
		this.#up();
	} // void
		
	#up() {
		new Actions.MoveTo({
			applyTo: this,
			to: new Point(this.position().x(), this.position().y() - this.#upHeight),
			duration: this.#durationUp,
			onEnd: () => {
				this.#disappear();
				return END_STRATEGY.SKIP_NEXT;
			}
		});
	} // void
	
	#disappear() {
		new Actions.Disappear({
			applyTo: this,
			duration: this.#durationDisapper,
			onEnd: () => {
				this.destructor();
				return END_STRATEGY.SKIP_NEXT;
			}
		});
	} // void
	
	static make(options) {
		const bubble = new Bubble(
			style.use('bubbleText', options)
		);
		if ( options.world ) {
			options.world.addSubject(bubble);
		}
		return bubble;
	} // Text.Bubble
	
}
