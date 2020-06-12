const sin = ( a => Math.sin(a) );
const cos = ( a => Math.cos(a) );
const abs = ( a => Math.abs(a) );

export function copy(A, B) {
	for ( let i = 0; i < B.length; ++i ) {
		for ( let j = 0; j < B[i].length; ++j ) {
			B[i][j] = A[i][j];
		}
	}
}

export function getIdentity() {
	return [[1, 0, 0],
					[0, 1, 0],
					[0, 0, 1]];
}

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
}

export function getScale(scale) {
	const x = scale.x();
	const y = scale.y();
	return [[x, 0, 0],
					[0, y, 0],
					[0, 0, 1]];
}

export function getMove(offset) {
	const x = offset.x();
	const y = offset.y();
	return [[1, 0, x],
					[0, 1, y],
					[0, 0, 1]];
}

export function getRotate(A) {
	return [[cos(A), -sin(A), 0],
					[sin(A),  cos(A), 0],
					[     0,       0, 1]];
}

export function determinant(A) {
	let N = A.length;
	let B = [];
	let denom = 1;
	let exchanges = 0;
	for ( let i = 0; i < N; ++i ) {
		B[i] = [];
		for ( let j = 0; j < N; ++j ) {
			B[i][j] = A[i][j];
		}
	}
	for ( let i = 0; i < N-1; ++i ) {
		let maxN = i;
		let maxValue = abs(B[i][i]);
		for ( let j = i+1; j < N; ++j ) {
			let value = abs(B[j][i]);
			if ( value > maxValue ) {
				maxN = j; maxValue = value;
			}
		}
		if ( maxN > i ) {
			let t = B[i];
			B[i] = B[maxN];
			B[maxN] = t;
			++exchanges;
		} else {
			if ( maxValue === 0 ) {
				return maxValue;
			}
		}
		let value1 = B[i][i];
		for ( let j = i+1; j < N; ++j ) {
			let value2 = B[j][i];
			B[j][i] = 0;
			for ( let k = i+1; k < N; ++k ) {
				B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
			}
		}
		denom = value1;
	}
	if ( exchanges % 2 ) {
		return -B[N-1][N-1];
	} else {
		return B[N-1][N-1];
	}
}

export function inverse(A) {
	let det = determinant(A);
	if ( det === 0 ) {
		throw new Error(`Matrix inverse error`);
	}
	let N = A.length;
	let invA = [];
	for ( let i = 0; i < N; ++i ) {
		invA[i] = [];
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
			invA[i][j] = sign * determinant(B) / det;
		}
	}
	return invA;
}

export function mul(A, B) {
	let rowsA = A.length;
	let colsA = A[0].length;
	let rowsB = B.length;
	let colsB = B[0].length;
	let C = [];
	if ( colsA !== rowsB ) {
		throw new Error(`Matrix mul error`);
	}
	for ( let i = 0; i < rowsA; ++i ) {
		C[i] = [];
	}
	for ( let k = 0; k < colsB; ++k ) {
		for ( let i = 0; i < rowsA; ++i ) {
			let temp = 0;
			for ( let j = 0; j < rowsB; ++j ) {
				temp += A[i][j]*B[j][k];
			}
			C[i][k] = temp;
		}
	}
	return C;
}
