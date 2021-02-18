// QQDOC

import './global.js';
import {Application} from './Application.js';
import {Sprite} from './Sprite/index.js';
import {WCanvas} from './WCanvas.js';

export let APP = new Application();

export function sz() {
	return APP.getActiveSz();
} // Seizure

export function start(config) {
	APP.initFonts(config.fonts);
	const start = () => APP.init(config);
	if ( window.cordova ) {
		document.addEventListener('deviceready', start, false);
	} else {
		window.addEventListener('load', start);
	}
} // void

export function isObject(obj) {
	return obj === Object(obj);
} // boolean

export function mixins(...mixins) {
	let base = getLast(mixins);
	const from = getLastIndex(mixins)-1;
	for ( let i = from; i >= 0; --i ) {
		base = mixins[i](base);
	}
	return base;
} // Class

export function changeBasePrototype(obj, target) {
	if ( obj instanceof Object ) {
		const proto = Object.getPrototypeOf(obj);
		if ( proto === Object.getPrototypeOf({}) ) {
			Object.setPrototypeOf(obj, target);
		} else {
			changeBasePrototype(proto, target);
		}
	}
} // void

export function clone(obj) {
	return Object.assign(
		Object.create( Object.getPrototypeOf(obj) ),
		obj
	);
} // Object

export function useDefault(value, byDefault) {
	return value !== undefined ? value : byDefault;
} // mixed

export function merge(...objs) {
	return Object.assign({}, ...objs);
} // Object

export function isNumbers(...args) {
	for ( const arg of args ) {
		if ( typeof arg !== 'number' ) {
			return false;
		}
	}
	return true;
} // boolean

export function setTransform(matrix, context) {
	if ( context instanceof WCanvas ) {
		context = context.getContext();
	}
	context.setTransform(
		matrix[0][0], matrix[1][0],
		matrix[0][1], matrix[1][1],
		matrix[0][2], matrix[1][2]
	);
} // void

export function cleanTransform(ctx) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
} // void

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
} // number

export function getLastIndex(array) {
	return array.length-1;
} // number

export function getLast(array) {
	check(array.length > 0, 'Array is empty');
	return array[getLastIndex(array)];
} // mixed

export function newArrayOfNull(elements) {
	const result = [];
	for ( let i = 0; i < elements; ++i ) {
		result.push(null);
	}
	return result;
} // new array

export function createSpriteById(imageId) {
	return new Sprite( APP.getImageManager().getImageById(imageId) );
} // new Sprite

export function createSpriteByUrl(imageUrl) {
	return new Sprite( APP.getImageManager().get(imageUrl) );
} // new Sprite

export function isEmpty(array) {
	return array.length === 0;
} // boolean

export function isActive(thing) {
	return thing?.isActive() ?? false;
} // boolean

export function isInactive(pointer) {
	return ! isActive(pointer);
} // boolean

export function cleanHtml() {
	while ( document.body.firstChild ) { // Clean all on page (Font loaders)
		document.body.removeChild( document.body.firstChild );
	}
} // void

export function newImage(url) {
	const image = new Image();
	image.src = url;
	return image;
}

export function isImage(image) {
	if ( image instanceof WCanvas ) {
		return true;
	} else if ( image instanceof HTMLCanvasElement ) {
		return true;
	} else if ( image instanceof HTMLImageElement ) {
		return image.complete;
	}
	return false;
} // boolean
