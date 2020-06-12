import * as QQ from '../QQ.js';
import * as Subject from '../Subject/index.js';

export class CheckBox extends Subject.Sprite {
	
	constructor(options) {
		options.image = 'checkBoxEmpty';
		super(options);
		this._onChange = QQ.useDefault(options.onChange, () => {});
		this._isChecked = QQ.useDefault(options.isChecked, false);
		this._isByTouch = QQ.useDefault(options.isTouch, false);
		this.refreshImage();
	}
	
	refreshImage() {
		if ( this._isChecked ) {
			this.setSprite('checkBoxChecked');
		} else {
			this.setSprite('checkBoxEmpty');
		}
	}
	
	change() {
		this._isChecked = ! this._isChecked;
		this._onChange(this._isChecked);
		this.refreshImage();
	}
	
	onClickDown(worldPoint) {
		super.onClickDown(worldPoint);
		if ( this._isByTouch ) {
			this.change();
		}
	}
	
	onClick(worldPoint) {
		super.onClick(worldPoint);
		if ( ! this._isByTouch ) {
			this.change();
		}
	}
	
};
