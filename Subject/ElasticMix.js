import * as QQ from '../QQ.js';
import {Point, Rect} from '../primitives/index.js';
import * as Actions from '../Actions/index.js';

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
}

function fixOptions(options) {
	options.isClickable = true;
}

export function ElasticMix(base) {
	return class ElasticMix extends base {
		
		constructor(options) {
			fixOptions(options);
			super(options);
			this._DnD = {
				isActive: undefined,
				pointer: undefined,
				start: new Point,
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
				this.setAction(new Actions.WalkTo({
					subj: this,
					to: pointer.getWorldPoint()
				}));
				/*
				const offset = Point.subtraction(
					this.worldToLocal(pointer.getWorldPoint()),
					this._DnD.start
				);
				const position = Point.addition(
					this.position(),
					offset
				);
				this.position(position);
				*/
			} else if ( this._DnD.isActive ) {
				this._DnD.isActive = false;
				this.onDrop(this.getWorldPosition());
			}
		}
		
	}
}
