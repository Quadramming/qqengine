import * as QQ from '../QQ.js';
import {Point, Rect} from '../primitives/index.js';

function isActive(pointer) {
	return Boolean( pointer && pointer.isActive() );
}

function isInactive(pointer) {
	return ! isActive(pointer);
}

function reset(options = {}) {
	this._scroll.scrollable = QQ.useDefault(options.scrollable, false);
	this._scroll.pointer = null;
	if ( options.scrollClip ) {
		this._scroll.clip = options.scrollClip.clone();
	} else {
		this._scroll.clip = null;
	}
}

export function ScrollMix(base) {
	return class ScrollMix extends base {
		
		constructor(options) {
			super(options);
			this._scroll = {
				scrollable: undefined,
				pointer: undefined,
				clip: undefined
			}
			reset.call(this, options);
		}
		
		destructor() {
			super.destructor();
			this._scroll = undefined;
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
		tick(delta) {
			super.tick(delta);
			const pointer = this._scroll.pointer;
			if ( isActive(pointer) ) {
				const offset = Point.subtraction(
					pointer.getStartWorldPoint(),
					pointer.getWorldPoint()
				);
				const position = Point.addition(
					this.getCamera().getPosition(),
					offset
				);
				this._scroll.clip?.enclose(position);
				this.getCamera().setPosition(position);
			}
		}
		
		onClickDown(point, pointer) {
			const isHit = super.onClickDown(point, pointer);
			if ( this._scroll.scrollable && ! isHit ) {
				if ( isInactive(this._scroll.pointer) ) {
					this._scroll.pointer = pointer;
				}
			}
			return isHit;
		}
		
		
	}
}
