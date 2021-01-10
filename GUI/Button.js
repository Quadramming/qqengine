// QQDOC

import * as Subject from '../Subject/index.js';
import * as Text from '../Text/index.js';

function fixOptions(options) {
	options.isClickable = true;
}

export class Button extends Subject.Sprite {
	
	#onButtonClickDown;
	#onButtonClick;

	constructor(options = {}) {
		fixOptions(options);
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		fixOptions(options);
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		if ( options.text ) {
			new Text.Text({
				addTo: this,
				text: options.text,
				size: this.size()
			});
		}
		this.#onButtonClickDown = options.onButtonClickDown ?? null;
		this.#onButtonClick = options.onButtonClick ?? null;
	} // void
	
	onClickDown(worldPoint) { // {O}
		super.onClickDown(worldPoint);
		this.#onButtonClickDown?.(worldPoint);
	} // void
	
	onClick(worldPoint) { // {O}
		super.onClick(worldPoint);
		this.#onButtonClick?.(worldPoint);
	} // void
	
}
