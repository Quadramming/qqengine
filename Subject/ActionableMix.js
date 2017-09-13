QQ.Subject.ActionableMix = base => class ActionableMix extends base {
	
	constructor(app, options = {}) {
		super(app, options);
		this._action = new QQ.Actions.Base(this._app, {subj: this});
	}
	
	tick(delta) {
		super.tick(delta);
		this._action.tick(delta);
	}
	
	draw(ctx) {
		super.draw(ctx);
		this._action.draw(ctx);
	}
	
	setAction(action) {
		if ( this._action.isAbortable() ) {
			this._action.onAbort();
			this._action = action;
			return true;
		}
		return false;
	}
	
	setIdleAction() {
		this.setAction(
			new QQ.Actions.Base(this._app, {subj: this})
		);
	}
	
};
