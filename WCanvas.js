// QQDOC

import {Size} from './primitives/index.js';

export class WCanvas {
	
	#canvas = document.createElement('canvas');
	#context = this.#canvas.getContext('2d');
	#size = new Size();
	
	constructor(x, y) {
		this.#canvas.width = x;
		this.#canvas.height = y;
		this.#size.set(x, y);
	}
	
	static newRedPixel() {
		const wcanvas = new WCanvas(1, 1);
		wcanvas.fillStyle('#FF0000');
		wcanvas.fillRect(0, 0, 1, 1);
		return wcanvas;
	} // new WCanvas
	
	static newTransparentPixel() {
		const wcanvas = new WCanvas(1, 1);
		wcanvas.alpha(0);
		wcanvas.fillStyle('#000000');
		wcanvas.fillRect(0, 0, 1, 1);
		return wcanvas;
	} // new WCanvas
	
	drawImage(...args) {
		this.#context.drawImage(...args);
	} // void
	
	fillStyle(color) {
		this.#context.fillStyle = color;
	} // void
	
	fillRect(x, y, w, h) {
		this.#context.fillRect(x, y, w, h);
	} // void
	
	getCanvas() {
		return this.#canvas;
	} // canvas
	
	getContext() {
		return this.#context;
	} // context
	
	getPixels() {
		return this.#context.getImageData(0, 0, this.#size.x(), this.#size.y()).data;
	} // data
	
	alpha(alpha) { // {F}
		if ( alpha !== undefined ) {
			this.#context.globalAlpha = alpha;
		}
		return this.#context.globalAlpha;
	} // number
	
}
