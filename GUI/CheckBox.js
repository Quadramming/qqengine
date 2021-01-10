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
	} // void
	
	#reset(options) {
		this.#onChange = options.onChange ?? null;
		this.#isChecked = options.isChecked ?? false;
		this.#isByTouch = options.isTouch ?? false;
		this.#refreshImage();
	} // void
	
	change() {
		this.#isChecked = ! this.#isChecked;
		this.#onChange?.(this.#isChecked);
		this.#refreshImage();
	} // void
	
	isChecked() {
		return this.#isChecked;
	} // boolean
	
	onClickDown(worldPoint) { // {O}
		super.onClickDown(worldPoint);
		if ( this.#isByTouch ) this.change();
	} // void
	
	onClick(worldPoint) { // {O}
		super.onClick(worldPoint);
		if ( ! this.#isByTouch ) this.change();
	} // void
	
	#refreshImage() {
		this.imageId(this.#isChecked ? 'checkBoxChecked' : 'checkBoxEmpty');
	} // void
	
}
