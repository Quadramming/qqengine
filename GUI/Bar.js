import * as QQ from '../QQ.js';
import * as Text from '../Text/index.js';
import * as Subject from '../Subject/index.js';
import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Style} from '../Style/Style.js';

export class Bar extends Subject.Sprite {
	
	constructor(options) {
		options.img = QQ.useDefault(options.image, 'bar');
		options.anchor = QQ.useDefault(options.anchor, new Point(0.5, 0.5));
		super(options);
		this._percent = 0;
		this._maxSize = QQ.useDefault(options.maxSize, 10);
		this._text = new Text.Text( Style.use('bar', {size: new Size(this._maxSize, 2)}) );
		this.addSubject(this._text);
		this.setBarValue(options.percent);
	}
	
	setText(percent) {
		if ( percent > 50 ) {
			let text = String(percent);
			if ( text.length > 5 ) {
				text = text.substring(0, 5);
			}
			this._text.setText(text + '%');
			this._text.show();
		} else {
			this._text.hide();
		}
	}
	
	setBarValue(percent = 0) {
		this._percent = percent;
		this.setText(percent);
		const width = (this._maxSize*percent)/100;
		super.setSize(new Size(width, 2));
	}
	
}
