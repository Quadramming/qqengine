QQ.Button = class Button extends QQ.Subject.Sprite {
	
	constructor(options) {
		super(options);
		this._onBtnClickDown = QQ.default(options.onBtnClickDown, () => {});
		this._onBtnClick = QQ.default(options.onBtnClick, () => {});
	}
	
	onClickDown(worldPoint) {
		super.onClickDown(worldPoint);
		this._onBtnClickDown(worldPoint);
	}
	
	onClick(worldPoint) {
		super.onClick(worldPoint);
		this._onBtnClick(worldPoint);
	}
	
};
