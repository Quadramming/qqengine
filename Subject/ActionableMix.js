import * as QQ from '../QQ.js';
import {Idle} from '../Actions/Idle.js';

export function ActionableMix(base) {
	return class ActionableMix extends base {
		
		constructor(options) {
			super(options);
			this._idleAction = new Idle();
			this._action = null;
			ActionableMix.prototype.initialize.call(this, options, false);
		}
		
		initialize(options, initializeSuper = true) {
			if ( initializeSuper ) {
				super.initialize(options);
			}
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
			this._action.reset();
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
			if ( this._action === this._idleAction ) {
				alert('Do not redefine idle onEnd method');
			} else {
				this._action.setOnEnd(fn);
			}
		}
		
		setIdleAction() {
			this.setAction(this._idleAction);
		}
		
		forceIdleAction() {
			this.forceAction(this._idleAction);
		}
		
	}
}
