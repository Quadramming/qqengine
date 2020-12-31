// QQDOC

import * as Subject from '../Subject/index.js';

function fixOptions(options) {
	options.imageId = 'checkBoxEmpty';
	options.isClickable = true;
}

export class CheckBox extends Subject.Sprite {
	
	#onChange;
	#isChecked;
	#isByTouch;
	
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
		this.#onChange = options.onChange ?? null;
		this.#isChecked = options.isChecked ?? false;
		this.#isByTouch = options.isTouch ?? false;
		this.#refreshImage();
	} // Void
	
	change() {
		this.#isChecked = ! this.#isChecked;
		this.#onChange?.(this.#isChecked);
		this.#refreshImage();
	} // Void
	
	isChecked() {
		return this.#isChecked;
	} // Boolean
	
	onClickDown(worldPoint) { // {O}
		super.onClickDown(worldPoint);
		if ( this.#isByTouch ) this.change();
	} // Void
	
	onClick(worldPoint) { // {O}
		super.onClick(worldPoint);
		if ( ! this.#isByTouch ) this.change();
	} // Void
	
	#refreshImage() {
		this.imageId(this.#isChecked ? 'checkBoxChecked' : 'checkBoxEmpty');
	} // Void
	
};
