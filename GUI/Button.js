// QQDOC

import * as Subject from '../Subject/index.js';
import * as Text from '../Text/index.js';

function fixOptions(options) {
	options.isClickable = true;
}

export class Button extends Subject.Sprite {
	
	#text = new Text.Text();
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
	} // Void
	
	#reset(options) {
		if ( options.text ) {
			this.#text.reset({
				text: options.text,
				size: this.size()
			});
			this.addSubject(this.#text);
		}
		this.#onButtonClickDown = options.onButtonClickDown ?? null;
		this.#onButtonClick = options.onButtonClick ?? null;
	} // Void
	
	onClickDown(worldPoint) { // {O}
		super.onClickDown(worldPoint);
		this.#onButtonClickDown?.(worldPoint);
	} // Void
	
	onClick(worldPoint) { // {O}
		super.onClick(worldPoint);
		this.#onButtonClick?.(worldPoint);
	} // Void
	
}
