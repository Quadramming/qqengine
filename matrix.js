// QQDOC

const sin = a => Math.sin(a);
const cos = a => Math.cos(a);
const abs = a => Math.abs(a);

export function copy(A, B) {
	for ( let i = 0; i < B.length; ++i ) {
		for ( let j = 0; j < B[i].length; ++j ) {
			B[i][j] = A[i][j];
		}
	}
} // void

export function getIdentity() {
	return [[1, 0, 0],
					[0, 1, 0],
					[0, 0, 1]];
} // new array

export function setIdentity(matrix) {
	matrix[0][0] = 1;
	matrix[0][1] = 0;
	matrix[0][2] = 0;
	matrix[1][0] = 0;
	matrix[1][1] = 1;
	matrix[1][2] = 0;
	matrix[2][0] = 0;
	matrix[2][1] = 0;
	matrix[2][2] = 1;
} // void

export function getVector(point) {
	return [[point.x()], [point.y()], [1]];
} // new array

export function getReflect() {
	return [[1,  0, 0],
					[0, -1, 0],
					[0,  0, 1]];
} // new array

export function getScale(scale) {
	const x = scale.x();
	const y = scale.y();
	return [[x, 0, 0],
					[0, y, 0],
					[0, 0, 1]];
} // new array

export function getMove(offset) {
	const x = offset.x();
	const y = offset.y();
	return [[1, 0, x],
					[0, 1, y],
					[0, 0, 1]];
} // new array

export function getInverseMove(offset) {
	const x = offset.x();
	const y = offset.y();
	return [[1, 0, -x],
					[0, 1, -y],
					[0, 0,  1]];
} // new array

export function getRotate(A) {
	return [[ cos(A), sin(A), 0],
					[-sin(A), cos(A), 0],
					[     0,       0, 1]];
} // new array

export function determinant(A) {
	if ( A[0].length === 2 ) {
		return (A[0][0] * A[1][1]) - (A[0][1] * A[1][0]);
	} else {
		return A[0][0] * (A[1][1]*A[2][2] - A[1][2]*A[2][1]) -
			A[0][1] * (A[1][0]*A[2][2] - A[1][2]*A[2][0]) +
			A[0][2] * (A[1][0]*A[2][1] - A[1][1]*A[2][0]);
	}
} // number

export function inverse(A) {
	let det = determinant(A);
	// Hope det !== 0 ;)
	let N = A.length;
	let inverse = [];
	for ( let i = 0; i < N; ++i ) {
		inverse[i] = [];
		for ( let j = 0; j < N; ++j ) {
			let B = [];
			let sign = ((i+j) % 2 === 0) ? 1 : -1;
			for ( let m = 0; m < j; ++m ) {
				B[m] = [];
				for ( let n = 0; n < i; ++n ) {
					B[m][n] = A[m][n];
				}
				for ( let n = i+1; n < N; ++n ) {
					B[m][n-1] = A[m][n];
				}
			}
			for ( let m = j+1; m < N; ++m ) {
				B[m-1] = [];
				for ( let n = 0; n < i; ++n ) {
					B[m-1][n] = A[m][n];
				}
				for ( let n = i+1; n < N; ++n ) {
					B[m-1][n-1] = A[m][n];
				}
			}
			inverse[i][j] = sign * determinant(B) / det;
		}
	}
	return inverse;
} // new array

export function mul(A, B) {
	const rowsA = A.length;
	const colsA = A[0].length;
	const rowsB = B.length;
	const colsB = B[0].length;
	// Hope colsA === rowsB ;)
	const result = [];
	for ( let i = 0; i < rowsA; ++i ) {
		result[i] = [];
	}
	for ( let k = 0; k < colsB; ++k ) {
		for ( let i = 0; i < rowsA; ++i ) {
			let temp = 0;
			for ( let j = 0; j < rowsB; ++j ) {
				temp += A[i][j]*B[j][k];
			}
			result[i][k] = temp;
		}
	}
	return result;
} // new array

export function iterate(array, fn) { // Iterate 2D array
	for ( const [y, line] of array.entries() ) {
		for ( const [x, value] of line.entries() ) {
			fn(value, x, y);
		}
	}
} // void

export function rotate(array) {
	const rotated = [];
	array.forEach(function (a, i, A) {
		a.forEach(function (b, j) {
			rotated[j] = rotated[j] || [];
			rotated[j][A.length-i-1] = b;
		});
	});
	return rotated;
} // new array
