import {XY} from '../../primitives/XY.js';

function check(value, message = 'False value') {
	if ( ! value ) {
		throw new Error(message);
	}
}

/*
		it('', function() {
		});
*/

describe('XY', function() {
	describe('Static', function() {
		it('ZERO', function() {
			check(XY.ZERO().isEquals(0, 0));
		});
		it('addition', function() {
			const a = new XY(1, 1);
			const b = new XY(2, 2);
			const c = XY.addition(a, b);
			check(a.isEquals(1, 1));
			check(b.isEquals(2, 2));
			check(c.isEquals(3, 3));
			check(c !== a && c !== b);
		});
		it('subtraction', function() {
			const a = new XY(1, 1);
			const b = new XY(2, 2);
			const c = XY.subtraction(a, b);
			check(a.isEquals(1, 1));
			check(b.isEquals(2, 2));
			check(c.isEquals(-1, -1));
			check(c !== a && c !== b);
		});
	});
	describe('Methods', function() {
		it('constructor', function() {
			const a = new XY(1, 2);
			check(a.isEquals(1, 2));
			const b = new XY(1);
			check(b.isEquals(1, 1));
			const c = new XY();
			check(c.isEquals(0, 0));
			const d = new XY(NaN);
			check(d.isEquals(NaN, NaN));
			const e = new XY([[1],[2],[0]]);
			check(e.isEquals(1, 2));
		});
		it('set', function() {
			const a = new XY(1, 2);
			check(a.isEquals(1, 2));
			a.set(3, 4);
			check(a.isEquals(3, 4));
			a.set(5);
			check(a.isEquals(5, 5));
			a.set();
			check(a.isEquals(0, 0));
			a.set(NaN);
			check(a.isEquals(NaN, NaN));
			const b = a.set(0);
			check(a === b);
		});
		it('copy', function() {
			const a = new XY(1, 2);
			const b = new XY(3, 4);
			const c = a.copy(b);
			check(a.isEquals(3, 4));
			check(a !== b);
			check(a === c);
			a.copy(false);
			check(a.isEquals(3, 4));
		});
		it('isEquals', function() {
			const a = new XY(NaN);
			check(a.isEquals(NaN, NaN));
			const b = new XY(NaN);
			check(b.isEquals(a));
		});
		
	});
});
