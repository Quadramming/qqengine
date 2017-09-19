QQ.Button = class Button extends QQ.Subject.Sprite {
	
	constructor(app, options = {}) {
		options.action = QQ.default(options.action, () => {});
		super(app, options);
		this._action = options.action;
	}
	
	onClickDown() {
		this._action();
	}
	
};
