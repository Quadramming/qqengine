import {Application} from './Application.js';

globalThis.c = c;
export function c(variable, ...rest) {
	let output = variable;
	if ( rest.length > 0 ) {
		output = String(output);
		for ( const variable of rest ) {
			output += ', ' + variable;
		}
	}
	if ( output === undefined ) {
		debugger;
	}
	console.log(output);
}

export let APP = null;

export function setApp(app) {
	if ( APP !== null ) {
		throw new Error('Only one application can be created');
	}
	APP = app;
}

export function dump(...rest) {
	for ( const variable of rest ) {
		console.log(variable);
	}
}

export function start(cfg) {
	const start = () => initApp(cfg);
	if ( window.cordova ) {
		document.addEventListener('deviceready', start, false);
	} else {
		window.addEventListener('load', start);
	}
}

export function initApp(cfg) {
	while ( document.body.firstChild ) {
		document.body.removeChild( document.body.firstChild );
	}
	new Application(cfg);
}

export function isObject(obj) {
	return obj === Object(obj);
}

export function mixins(...mixins) {
	let base = getLast(mixins);
	const from = getLastIndex(mixins)-1;
	for ( let i = from; i >= 0; --i ) {
		base = mixins[i](base);
	}
	return base;
}

export function changeBasePrototype(obj, target) {
	if ( obj instanceof Object ) {
		const proto = Object.getPrototypeOf(obj);
		if ( proto === Object.getPrototypeOf({}) ) {
			Object.setPrototypeOf(obj, target);
		} else {
			changeBasePrototype(proto, target);
		}
	}
}

export function clone(obj) {
	return Object.assign(
		Object.create( Object.getPrototypeOf(obj) ),
		obj
	);
}

export function useDefault(value, byDefault) {
	if ( value === undefined ) {
		return byDefault;
	}
	return value;
}

export function merge(...objs) {
	return Object.assign({}, ...objs);
}

export function isNumbers(...args) {
	for ( const arg of args ) {
		if ( typeof arg !== 'number' ) {
			return false;
		}
	}
	return true;
}

export function setTransform(ctx, matrix) {
	ctx.setTransform(
		matrix[0][0], matrix[1][0],
		matrix[0][1], matrix[1][1],
		matrix[0][2], matrix[1][2]
	);
}

export function cleanTransform(ctx) {
	ctx.setTransform(1,0,0,1,0,0);
}

export function getPixel(data, size, point) {
	if ( point.x() >= size.x() || point.y() >= size.y() ) {
		return null;
	}
	const index = (point.y()*size.x() + point.x())*4;
	return {
		r: data[index],
		g: data[index+1],
		b: data[index+2],
		a: data[index+3]
	};
}

export function getPixelQuick(data, size, x, y) {
	const index = (y*size.x() + x)*4;
	return (data[index+3]<<24) + (data[index]<<16) + (data[index+1]<<8) + data[index+2];
}

export function makeCanvas(size) {
	const cvs = document.createElement('canvas');
	cvs.width = size.w();
	cvs.height = size.h();
	const ctx = cvs.getContext('2d');
	const getPixels = () => ctx.getImageData(0, 0, size.w(), size.h()).data;
	return {cvs, size, ctx, getPixels};
}

export function getLast(array) {
	return array[array.length-1];
}

export function getLastIndex(array) {
	return array.length-1;
}

export function arrayOfNull(elements) {
	const result = [];
	for ( let i = 0; i < elements; ++i ) {
		result.push(null);
	}
	return result;
}
