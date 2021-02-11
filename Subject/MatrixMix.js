// QQDOC

import * as matrix from '../matrix.js';
import {Point} from '../primitives/index.js';
import {Cache} from '../Cache.js';

export function MatrixMix(base) { // Mix MatrixMix to base
	return class MatrixMix extends base {
		
		#matrixCache = new Cache();
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#matrixCache.reset();
		} // void
		
		calcMatrix() {
			let M = matrix.getScale(this.scale());
			M = matrix.mul(matrix.getRotate(this.angle()), M);
			M = matrix.mul(matrix.getMove(this.position()), M);
			return M;
		} // new array
		
		getMatrix(withParent = true) {
			let M;
			if ( this.#matrixCache.isChanged(this) ) {
				M = this.calcMatrix();
				this.#matrixCache.set(M);
			} else {
				M = this.#matrixCache.get();
			}
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
} // class MatrixMix extends base
