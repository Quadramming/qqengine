// QQDOC

import * as matrix from '../matrix.js';
import * as Pack from '../Pack/index.js';
import {Point} from '../primitives/index.js';

export function MatrixMix(base) {
	return class MatrixMix extends base {
		
		#matrix;
		
		constructor(options = {}) {
			super(options);
			this.#matrix = new Pack.MatrixCache;
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#matrix.reset({
				parent: this,
			});
		} // void
		
		calcMatrix() {
			let M = matrix.getScale(this.scale());
			M = matrix.mul(matrix.getRotate(this.angle()), M);
			M = matrix.mul(matrix.getMove(this.position()), M);
			return M;
		} // new array
		
		getMatrix(withParent = true) {
			let M = this.#matrix.get();
			if ( withParent && this.parent() ) {
				M = matrix.mul(this.parent().getMatrix(), M);
			}
			return M;
		} // array
		
		worldToLocal(point) {
			let M = matrix.inverse(this.getMatrix());
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		} // new Point
		
		localToWorld(point) {
			let M = this.getMatrix();
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		} // new Point
		
		localToParent(point) {
			let M = this.getMatrix(false);
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		} // new Point
		
		parentToLocal(point) {
			let M = matrix.inverse(this.getMatrix(false));
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		} // new Point
		
		debugPointConvertings(worldPoint) {
			c("World:" + worldPoint);
			let local = this.worldToLocal(worldPoint);
			c("worldToLocal:" + local);
			const world = this.localToWorld(local);
			c("localToWorld:" + world);
			const parent = this.localToParent(local);
			c("localToParent:" + parent);
			local = this.parentToLocal(parent);
			c("parentToLocal:" + local);
		}
		
	}
}
