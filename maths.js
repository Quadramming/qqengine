import {Size} from './Size.js';
import {Scale} from './Scale.js';
import {PIVOT} from './PIVOT.js';

export const PIx2 = Math.PI * 2;

export function rand(min = 0, max = 1, round = true) {
	if ( round ) {
		return Math.round(Math.random() * (max - min)) + min;
	} else {
		return Math.random() * (max - min) + min;
	}
}

export function any(...args) {
	return args[rand(0, args.length-1)];
}

/* TOFIX what is it?
export function randDispersion(x) {
	return x * Math.random() * any(1, -1);
}
*/

export function increaseToRatio(size, target) {
	if ( size.getRatio() < target ) {
		return new Size(size.h()*target, size.h());
	} else {
		return new Size(size.w(), size.w()/target);
	}
}

export function reduceToSize(size, value) {
	const scale = new Scale(1, 1);
	if ( size.w() > value ) {
		scale.w(value / size.w());
	}
	if ( size.h() > value ) {
		scale.h(value / size.h());
	}
	return Math.min(scale.w(), scale.h());
}

export function scaleToSize(size, value) {
	const scale = new Scale(
		value / size.w(),
		value / size.h()
	);
	return Math.min(scale.w(), scale.h());
}

export function devidePeriod(value, period) {
	if ( value > period ) {
		value %= period;
	}
	return value;
}

export function devideAngle(angle) {
	while ( angle < -Math.PI || Math.PI < angle ) {
		if ( angle < -Math.PI ) {
			angle += Math.PI*2;
		} else {
			angle -= Math.PI*2;
		}
	}
	return angle;
}

export function sinBetweenVectors(A, B) {
	const mul = A.x()*B.x() + A.y()*B.y();
	const cos = mul / (A.getLength() * B.getLength());
	let arg = 1 - cos*cos;
	if ( arg < 0 ) {
		arg = 0;
	}
	return Math.sqrt(arg);
}

export function calcProgress(start, duration) {
	const passed = Date.now() - start;
	const progress = passed / duration;
	return progress < 1 ? progress : 1;
}

export function getSign(x) {
	 return x >= 0 ? 1 : -1;
}

export function secToMs(x) {
	 return x * 1000;
}

export function isEqual(a, b, epsilon) {
	return (b - epsilon) < a && a < (b + epsilon);
}

export function calcPivotX(pivot, x, w) {
	if ( pivot === PIVOT.CENTER_TOP ) {
		return x;
	} else if ( pivot === PIVOT.CENTER_BOTTOM ) {
		return x;
	} else if ( pivot === PIVOT.CENTER ) {
		return x;
	} else if ( pivot === PIVOT.LEFT_TOP ) {
		return x + w/2;
	}
	throw new Error(`PIVOT is wrong`);
}

export function calcPivotY(pivot, y, h, yAxis = 1) {
	if ( pivot === PIVOT.CENTER_TOP ) {
		return y - yAxis*(h/2);
	} else if ( pivot === PIVOT.CENTER_BOTTOM ) {
		return y + yAxis*(h/2);
	} else if ( pivot === PIVOT.CENTER ) {
		return y;
	} else if ( pivot === PIVOT.LEFT_TOP ) {
		return y - yAxis*(h/2);
	}
	throw new Error(`PIVOT is wrong`);
}
