QQ.Button = class Button extends QQ.Subject.Sprite {
	
	constructor(options) {
		super(options);
		this.onBtnClickDown = QQ.default(options.onBtnClickDown, () => {});
		this.onBtnClick     = QQ.default(options.onBtnClick,     () => {});
	}
	
	onClickDown(worldPoint) {
		super.onClickDown(worldPoint);
		this.onBtnClickDown(worldPoint);
	}
	
	onClick(worldPoint) {
		super.onClick(worldPoint);
		this.onBtnClick(worldPoint);
	}
	
};
