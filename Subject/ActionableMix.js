import * as QQ from '../QQ.js';
import {Idle} from '../Actions/Idle.js';

export function ActionableMix(base) {
	return class ActionableMix extends base {
		
		constructor(options) {
			super(options);
			this._idleAction = new Idle();
			this._action = undefined;
			
			this._initializeActionableMix(options);
		}
		
		initialize(options) {
			super.initialize(options);
			_initializeActionableMix(options);
		}
		
		_initializeActionableMix(options) {
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
			this._action.subject(this);
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
				throw new Error('Do not redefine idle onEnd method');
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
