// QQDOC

import * as Subject from '../Subject/index.js';
import * as Text from '../Text/index.js';
import * as style from '../style/index.js';

function fixOptions(options) {
	options.isClickable = true;
	options.textStyle ??= 'default';
} // void

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
			new Text.Text(style.use({
				addTo: this,
				text: options.text,
				size: this.size()
			}, options.textStyle));
		}
		this.#onButtonClickDown = options.onButtonClickDown ?? null;
		this.#onButtonClick = options.onButtonClick ?? null;
	} // void
	
	onClickDown(worldPoint, pointer) { // {O}
		super.onClickDown(worldPoint, pointer);
		this.#onButtonClickDown?.(worldPoint);
	} // void
	
	onClick(worldPoint, pointer) { // {O}
		super.onClick(worldPoint, pointer);
		this.#onButtonClick?.(worldPoint);
	} // void
	
}
