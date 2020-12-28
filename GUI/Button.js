import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';
import * as Text from '../Text/index.js';

export class Button extends Subject.Sprite {
	
	#onButtonClickDown = () => {};
	#onButtonClick = () => {};

	constructor(options) {
		options.isClickable = true;
		super(options);
		if ( options.text ) {
			const text = new Text.Text({
				text: options.text,
				size: this.size()
			});
			this.addSubject(text);
		}
		if ( options.onButtonClickDown ) this.#onButtonClickDown = options.onButtonClickDown;
		if ( options.onButtonClick ) this.#onButtonClick = options.onButtonClick;
	}
	
	onClickDown(worldPoint) { // {O}
		super.onClickDown(worldPoint);
		this.#onButtonClickDown(worldPoint);
	}
	
	onClick(worldPoint) { // {O}
		super.onClick(worldPoint);
		this.#onButtonClick(worldPoint);
	}
	
}
