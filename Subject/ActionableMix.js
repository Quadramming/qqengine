QQ.Subject.ActionableMix = base => class ActionableMix extends base {
	
	constructor(options) {
		super(options);
		this._idle = new QQ.Actions.Base();
		this.forceIdleAction();
	}
	
	tick(delta) {
		super.tick(delta);
		this._action.tick(delta);
	}
	
	draw(ctx) {
		super.draw(ctx);
		this._action.draw(ctx);
	}
	
	getAction() {
		return this._action;
	}
	
	forceAction(action) {
		this._action = action;
		this._action.setApp(this._app);
		this._action.setSubject(this);
		this._action.onStart();
	}
	
	setAction(action) {
		if ( this._action.isAbortable() ) {
			this._action.onAbort();
			this.forceAction(action);
			return true;
		}
		return false;
	}
	
	setActionOnEnd(fn) {
		if ( this._action === this._idle ) {
			alert('Do not redefine idle onEnd method');
		} else {
			this._action.setOnEnd(fn);
		}
	}
	
	setIdleAction() {
		this.setAction(this._idle);
	}
	
	forceIdleAction() {
		this.forceAction(this._idle);
	}
	
};
