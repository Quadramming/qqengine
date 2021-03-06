// QQDOC

import {Size, Scale, Offset} from './primitives/index.js';
import {PIVOT} from './CONST/index.js';
import * as CONST from './CONST/index.js';

export const PIx2 = Math.PI * 2;

export function randIndex(array) {
	return rand(0, array.length-1);
} // number

export function rand(min = 0, max = 1, round = true) {
	if ( round ) {
		return Math.round(Math.random() * (max - min)) + min;
	} else {
		return Math.random() * (max - min) + min;
	}
} // number

export function any(...args) {
	return args[rand(0, args.length-1)];
} // mixed

export function shuffleArray(a) {
	for ( let i = a.length - 1; i > 0; i-- ) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
} // void

export function randDispersion(x) {
	return x * Math.random() * any(1, -1);
} // number

export function increaseToRatio(size, target) {
	if ( size.getRatio() < target ) {
		return new Size(size.h()*target, size.h());
	} else {
		return new Size(size.w(), size.w()/target);
	}
} // new Size

export function getOffset(size, anchor) {
	return new Offset(
		-size.x()*anchor.x(),
		-size.y()*anchor.y()
	);
} // new Offset

export function reduceToSize(size, value) {
	const scale = new Scale(1, 1);
	if ( size.w() > value ) {
		scale.w(value / size.w());
	}
	if ( size.h() > value ) {
		scale.h(value / size.h());
	}
	return Math.min(scale.w(), scale.h());
} // number

export function scaleToSize(size, value) {
	const scale = new Scale(
		value / size.w(),
		value / size.h()
	);
	return Math.min(scale.w(), scale.h());
} // number

export function devidePeriod(value, period) {
	if ( value > period ) {
		value %= period;
	}
	return value;
} // number

export function getAngle(point) {
	return Math.atan2(point.x(), point.y());
} // number

export function devideAngle(angle) {
	while ( angle < -Math.PI || Math.PI < angle ) {
		if ( angle < -Math.PI ) {
			angle += Math.PI*2;
		} else {
			angle -= Math.PI*2;
		}
	}
	return angle;
} // number

export function sinBetweenVectors(A, B) {
	const mul = A.x()*B.x() + A.y()*B.y();
	const cos = mul / (A.getLength() * B.getLength());
	let arg = 1 - cos*cos;
	if ( arg < 0 ) {
		arg = 0;
	}
	return Math.sqrt(arg);
} // number

export function calcProgress(start, duration) {
	const passed = Date.now() - start;
	const progress = passed / duration;
	return progress < 1 ? progress : 1;
} // number

export function getSign(x) {
	 return x >= 0 ? 1 : -1;
} // number

export function absMin(a, b) {
	 return Math.abs(a) < Math.abs(b) ? a : b;
} // number

export function secToMs(x) {
	 return x * 1000;
} // number

export function isEqual(a, b, epsilon) {
	return (b - epsilon) < a && a < (b + epsilon);
} // boolean

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
	throw Error(`PIVOT is wrong`);
} // number

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
	throw Error(`PIVOT is wrong`);
} // number

export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
} // number

export function msToSeconds(ms) {
	return ms / CONST.MS_IN_SECOND;
} // number
