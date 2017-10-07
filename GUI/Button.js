QQ.Button = class Button extends QQ.Subject.Sprite {
	
	constructor(options = {}) {
		super(options);
		this.onClickDown = QQ.default(options.onClickDown, () => {});
		this.onClick     = QQ.default(options.onClick,     () => {});
	}
	
};
