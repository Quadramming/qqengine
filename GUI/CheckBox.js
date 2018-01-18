QQ.CheckBox = class CheckBox extends QQ.Subject.Sprite {
	
	constructor(options) {
		options.img = 'checkBoxEmpty';
		super(options);
		this._onChange = QQ.default(options.onChange, () => {});
		this._isChecked = QQ.default(options.isChecked, false);
		this._isTouch = QQ.default(options.isTouch, false);
		this.refreshImg();
	}
	
	refreshImg() {
		if ( this._isChecked ) {
			this.setSprite('checkBoxChecked');
		} else {
			this.setSprite('checkBoxEmpty');
		}
	}
	
	change() {
		this._isChecked = ! this._isChecked;
		this._onChange(this._isChecked);
		this.refreshImg();
	}
	
	onClickDown(worldPoint) {
		super.onClickDown(worldPoint);
		if ( this._isTouch ) {
			this.change();
		}
	}
	
	onClick(worldPoint) {
		super.onClick(worldPoint);
		if ( ! this._isTouch ) {
			this.change();
		}
	}
	
};
