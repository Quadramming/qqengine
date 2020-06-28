import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';
import {Point, Scale, Size, Rect, Offset, Anchor} from '../primitives/index.js';
import * as Pack from '../Pack/index.js';

function reset(options = {}) {
	this._matrix.reset({
		parent: this,
	});
}

export function MatrixMix(base) {
	return class MatrixMix extends base {
		
		constructor(options) {
			super(options);
			this._matrix = new Pack.MatrixCache;
			reset.call(this, options);
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
		calcMatrix() {
			let M = matrix.getMove(maths.getOffset(this.size(), this.anchor()));
			M = matrix.mul(matrix.getScale(this.scale()), M);
			M = matrix.mul(matrix.getRotate(this.angle()), M);
			M = matrix.mul(matrix.getMove(this.position()), M);
			return M;
		}
		
		getMatrix(withParent = true) {
			let M = this._matrix.get();
			if ( withParent && this.parent() ) {
				M = matrix.mul(this.parent().getMatrix(), M);
			}
			return M;
		}
		
		worldToLocal(point) {
			let M = matrix.getMove(maths.getOffset(this.size(), this.anchor()));
			M = matrix.mul(M, matrix.inverse(this.getMatrix()));
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		}
		
		localToWorld(point) {
			let M = this.getMatrix();
			M = matrix.mul(M, matrix.getInverseMove(maths.getOffset(this.size(), this.anchor())));
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		}
		
		parentToLocal(point) {
			let M = matrix.getMove(maths.getOffset(this.size(), this.anchor()));
			M = matrix.mul(M, matrix.inverse(this.getMatrix(false)));
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		}
		
		localToParent(point) {
			let M = this.getMatrix(false);
			M = matrix.mul(M, matrix.getInverseMove(maths.getOffset(this.size(), this.anchor())));
			M = matrix.mul(M, matrix.getVector(point));
			return new Point(M);
		}
		
	}
}
