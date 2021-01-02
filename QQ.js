import {Application} from './Application.js';
import {Sprite} from './Sprite/index.js';
import { WCanvas } from './WCanvas.js';

globalThis.a = a;
globalThis.c = c;
globalThis.d = d;
globalThis.check = check;
globalThis.dump = dump;

export function a(message) {
	alert(message);
}

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

export function d() {
	debugger;
}

export function check(condition, message = 'Check error') {
	if ( ! condition ) {
		throw Error(message);
	}
}

export function dump(...rest) {
	for ( const variable of rest ) {
		console.log(variable);
	}
}

export let APP = null;

export function sz() {
	return APP?.getActiveSz();
}

export function setApp(app) {
	check( ! APP, 'Only one application can be created');
	APP = app;
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
	while ( document.body.firstChild ) { // Clean all on page (Font loaders)
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

export function setTransform(context, matrix) {
	if ( context instanceof WCanvas ) {
		context = context.getContext();
	}
	context.setTransform(
		matrix[0][0], matrix[1][0],
		matrix[0][1], matrix[1][1],
		matrix[0][2], matrix[1][2]
	);
}

export function cleanTransform(ctx) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
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
} // null | {r, g, b, a}

export function getPixelQuick(data, size, x, y) {
	const index = (y*size.x() + x)*4;
	return (data[index+3]<<24) + (data[index]<<16) + (data[index+1]<<8) + data[index+2];
}

export function getLastIndex(array) {
	return array.length-1;
}

export function getLast(array) {
	check(array.length > 0, 'Array is empty');
	return array[getLastIndex(array)];
}

export function newArrayOfNull(elements) {
	const result = [];
	for ( let i = 0; i < elements; ++i ) {
		result.push(null);
	}
	return result;
}

export function createSpriteById(imageId) {
	return new Sprite( APP.getImageManager().getImageById(imageId) );
} // new Sprite

export function createSpriteByUrl(imageUrl) {
	return new Sprite( APP.getImageManager().get(imageUrl) );
} // new Sprite

