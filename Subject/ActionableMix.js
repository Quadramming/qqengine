QQ.Subject.ActionableMix = base => class ActionableMix extends base {
	
	constructor(app, width, height) {
		super(app, width, height);
		this._action = new QQ.Actions.Base(this._app, this);
		this.setIdleAction();
	}
	
	tick(delta) {
		super.tick(delta);
		this._action.tick(delta);
	}
	
	draw() {
		super.draw();
		this._action.draw();
	}
	
	setAction(action) {
		if ( this._action.isAbortable() ) {
			this._action.onAbort();
			this._action = action;
		}
	}
	
	setIdleAction() {
		this.setAction(
			new QQ.Actions.Base(this._app, this)
		);
	}
	
};
