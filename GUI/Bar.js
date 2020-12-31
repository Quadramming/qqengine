import * as Text from '../Text/index.js';
import * as Subject from '../Subject/index.js';
import * as style from '../style/index.js';
import {Point} from '../primitives/index.js';

function fixOptions(options) {
	options.imageId ??= 'bar';
	options.anchor ??= new Point(0.5, 0.5);
}

export class Bar extends Subject.Sprite {
	
	#text = new Text.Text(style.use('bar'));
	#percent;
	#maxSize;
	
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
		this.#maxSize = this.size().w();
		this.#text.reset();
		this.#text.size(this.size());
		this.addSubject(this.#text);
		this.percent(options.percent ?? 0); // Will set #percent
	} // Void
	
	percent(percent) { // {F}
		if ( percent !== undefined ) {
			this.#percent = percent;
			this.#updateText();
			const width = (this.#maxSize*percent)/100;
			this.size().w(width);
		}
		return this.#percent;
	} // Void
	
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
	} // Void
	
}
