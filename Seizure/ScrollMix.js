// QQDOC

import * as QQ from '../QQ.js';
import {Point} from '../primitives/index.js';

export function ScrollMix(base) {
	return class ScrollMix extends base {
		
		#isScrollable;
		#isAlwaysScroll;
		#pointer;
		#clip;
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		#reset(options) {
			this.#isScrollable = options.isScrollable ?? false;
			this.#isAlwaysScroll = options.isAlwaysScroll ?? false;
			this.#pointer = null;
			this.#clip = options.scrollClip ? options.scrollClip.clone() : null;
		} // void
		
		onClickDown(point, pointer) { // {O}
			const isHit = super.onClickDown(point, pointer);
			if (
				this.#isScrollable &&
				(this.#isAlwaysScroll || ! isHit) &&
				QQ.isInactive(this.#pointer)
			) {
				this.#pointer = pointer;
			}
			return isHit;
		} // void
		
		tick(delta) { // {O}
			super.tick(delta);
			if ( QQ.isActive(this.#pointer) ) {
				const offset = Point.subtraction(
					this.#pointer.getStartWorldPoint(),
					this.#pointer.getWorldPoint()
				);
				const position = Point.addition(
					this._camera.position(),
					offset
				);
				this.#clip?.enclose(position);
				this._camera.position(position);
			}
		} // void
		
	}
}
