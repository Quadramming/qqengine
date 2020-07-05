import * as QQ from '../QQ.js';
import {Point, Rect} from '../primitives/index.js';

function isActive(pointer) {
	return Boolean( pointer && pointer.isActive() );
}

function isInactive(pointer) {
	return ! isActive(pointer);
}

function reset(options) {
	this._DnD.isActive = false;
	this._DnD.pointer = null;
	this._DnD.start.set(NaN);
	if ( options.clip ) {
		this._DnD.clip = options.clip.clone();
	} else {
		this._DnD.clip = null;
	}
}

function fixOptions(options) {
	options.isClickable = true;
}

export function DragAndDropMix(base) {
	return class DragAndDropMix extends base {
		
		constructor(options) {
			fixOptions(options);
			super(options);
			this._DnD = {
				isActive: undefined,
				pointer: undefined,
				start: new Point,
				clip: undefined
			};
			reset.call(this, options);
		}
		
		destructor() {
			this._DnD = undefined;
		}
		
		reset(options = {}) {
			fixOptions(options);
			super.reset(options);
			reset.call(this, options);
		}
		
		onClickDown(point, pointer) {
			super.onClickDown(point, pointer);
			this._DnD.pointer = pointer;
			this._DnD.start = this.worldToLocal(point);
			this._DnD.isActive = true;
		}
		
		onDrop(point) {
		}
		
		tick(delta) {
			super.tick(delta);
			const pointer = this._DnD.pointer;
			if ( isActive(pointer) ) {
				const offset = Point.subtraction(
					this.worldToLocal(pointer.getWorldPoint()),
					this._DnD.start
				);
				const position = Point.addition(
					this.position(),
					offset
				);
				if ( this._DnD.clip ) {
					this._DnD.clip.enclose(position);
				}
				this.position(position);
			} else if ( this._DnD.isActive ) {
				this._DnD.isActive = false;
				this.onDrop(this.getWorldPosition());
			}
		}
		
		setClip(rect) {
			if ( this._DnD.clip ) {
				this._DnD.clip.copy(rect);
			} else {
				this._DnD.clip = rect.clone();
			}
		}
		
	}
}
