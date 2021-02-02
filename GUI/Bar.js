// QQDOC

import * as Text from '../Text/index.js';
import * as Subject from '../Subject/index.js';
import * as style from '../style/index.js';
import {Point} from '../primitives/index.js';

function fixOptions(options) {
	options.imageId ??= 'bar';
	options.anchor ??= new Point(0.5, 0.5);
} // void

export class Bar extends Subject.Sprite {
	
	#text = new Text.Text(style.use('bar'));
	#maxSize;
	#percent;
	
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
		this.#text.reset();
		this.#text.size(this.size());
		this.addSubject(this.#text);
		this.#maxSize = this.size().w();
		this.percent(options.percent ?? 0); // Will set #percent
	} // void
	
	#updateText() {
		if ( this.#percent > 50 ) {
			let text = String(this.#percent);
			if ( text.length > 5 ) {
				text = text.substring(0, 5);
			}
			this.#text.setText(text + '%');
			this.#text.show();
		} else {
			this.#text.hide();
		}
	} // void
	
	percent(percent) { // {F}
		if ( percent !== undefined ) {
			this.#percent = percent;
			this.#updateText();
			this.size().w( this.#maxSize*(percent/100) );
		}
		return this.#percent;
	} // void
	
}
