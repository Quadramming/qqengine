import * as QQ from '../QQ.js';
import * as CONST from '../CONST/index.js';
import {Pointer} from '../Pointer.js';

function reset() {
	for ( const pointer of this._pointers ) {
		pointer.destructor();
	}
	this._pointers.clear();
	this._hudPointers.clear();
	this._blockPointers = false;
}

export function InputMix(base) {
	return class InputMix extends base {
		
		constructor(options) {
			super(options);
			this._pointers = new Map;
			this._hudPointers = new Set;
			this._blockPointers = undefined;
			reset.call(this);
		}
		
		destructor() {
			super.destructor();
			reset.call(this);
			this._pointers = undefined;
			this._hudPointers = undefined;
			this._blockPointers = undefined;
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this);
		}
		
		resetInput() {
			this.getHud().resetInput();
			reset.call(this);
		}
		
		blockInput(value = true) {
			this.getHud().blockInput(value);
			reset.call(this);
			this._blockPointers = value;
		}
		
		handleInput(queue) {
			if ( ! this._blockPointers ) {
				for ( const input of queue ) {
					switch ( input.type ) {
						case CONST.TOUCH.START:
							this._dispatchPointerDown(input.id, input.point);
						break;
						case CONST.TOUCH.MOVE:
							this._dispatchPointerMove(input.id, input.point);
						break;
						case CONST.TOUCH.END:
							this._dispatchPointerUp(input.id, input.point);
						break;
						default:
							alert('bad input type');
					}
				}
			}
			queue.length = 0;
		}
		
		pointerDown(id, point) {
			const pointer = new Pointer(this);
			this._pointers.set(id, pointer);
			pointer.down(point);
		}
		
		pointerMove(id, point) {
			const pointer = this._pointers.get(id);
			if ( pointer ) {
				pointer.move(point);
			}
		}
		
		pointerUp(id, point) {
			const pointer = this._pointers.get(id);
			if ( pointer ) {
				pointer.up(point);
				pointer.destructor();
				this._pointers.delete(id);
			}
		}
		
		_dispatchPointerDown(id, point) {
			let target = this;
			if ( this.getHud().isHitSomething(point) ) {
				this._hudPointers.add(id);
				target = this.getHud();
			}
			target.pointerDown(id, point);
		}
		
		_dispatchPointerMove(id, point) {
			let target = this._hudPointers.has(id) ? this.getHud() : this;
			target.pointerMove(id, point);
		}
		
		_dispatchPointerUp(id, point) {
			let target = this;
			if ( this._hudPointers.has(id) ) {
				this._hudPointers.delete(id);
				target = this.getHud();
			}
			target.pointerUp(id, point);
		}
		
	}
}
