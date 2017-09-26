QQ.Button = class Button extends QQ.Subject.Sprite {
	
	constructor(app, options = {}) {
		super(app, options);
		this.onClickDown = QQ.default(options.onClickDown, () => {});
		this.onClick     = QQ.default(options.onClick,     () => {});
	}
	
};
