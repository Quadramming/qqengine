import {Point} from '../../primitives/Point.js';

function check(value, message = 'False value') {
	if ( ! value ) {
		throw new Error(message);
	}
}

/*
		it('', function() {
		});
*/

describe('Point', function() {
	describe('Static', function() {
		it('ZERO', function() {
			check(Point.ZERO().isEquals(0, 0));
			check(Point.ZERO() instanceof Point);
		});
		it('clone', function() {
			const a = new Point(1, 2);
			const b = a.clone();
			check(b.isEquals(a));
			check(a !== b);
			check(b instanceof Point);
		});
	});
});
