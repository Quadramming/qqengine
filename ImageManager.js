// QQDOC

import * as QQ from './QQ.js';
import {WCanvas} from './WCanvas.js';

export class ImageManager {
	
	#url2Image = new Map(); // url => Image (ready only)
	#url2WCanvas = new Map(); // url => WCanvas
	#id2url = new Map(); // id => url
	#loadingImages = new Map(); // url => Image
	#loadingUrl = new Map(); // cb => url
	#loadingId = new Map(); // cb => id
	
	addImageId(images = []) {
		for ( const [id, url] of images ) {
			this.#id2url.set(id, url);
		}
	} // void
	
	preload(images = [], cb) {
		for ( let entity of images ) {
			if ( Array.isArray(entity) ) {
				this.#id2url.set(entity[0], entity[1]);
				entity = entity[1];
			}
			this.#loadingImages.set(entity, QQ.newImage(entity));
		}
		this.#doPreload(cb);
	} // void
	
	tick(delta) {
		this.#emplaceComplited();
		this.#tickLoadingUrl();
		this.#tickLoadingId();
	} // void
	
	#tickLoadingUrl() {
		for ( const [cb, url] of this.#loadingUrl ) {
			if ( this.isUrlLoaded(url) ) {
				this.#loadingUrl.delete(cb);
				cb();
			} else if ( ! this.#loadingImages.has(url) ) {
				this.#loadingImages.set(url, QQ.newImage(url));
			}
		}
	} // void
	
	#tickLoadingId() {
		for ( const [cb, id] of this.#loadingId ) {
			if ( this.isIdLoaded(id) ) {
				this.#loadingId.delete(cb);
				cb();
			} else {
				const url = this.#id2url.get(id);
				if ( url && ! this.#loadingImages.has(url) ) {
					this.#loadingImages.set(url, QQ.newImage(url));
				}
			}
		}
	} // void
	
	loadUrl(url, cb) {
		this.#loadingUrl.set(cb, url);
	} // void
	
	loadId(id, cb) {
		this.#loadingId.set(cb, id);
	} // void
	
	isUrlLoaded(url) {
		return this.#url2Image.has(url);
	} // boolean
	
	isIdLoaded(id) {
		return this.isUrlLoaded( this.#id2url.get(id) );
	} // boolean
	
	getImageByUrl(url) {
		const image = this.#url2Image.get(url);
		check(image, `ImageManager.getImageByUrl(): url not loaded ${url}`);
		return image;
	} // HTMLImageElement
	
	getImageById(id) {
		const url = this.#id2url.get(id);
		check(url, `ImageManager.getImageById(): no such id ${id}`);
		return this.getImageByUrl(url);
	} // HTMLImageElement
	
	getImageWCanvasByUrl(url) {
		if ( ! this.#url2WCanvas.has(url) ) {
			const image = this.getImageByUrl(url);
			const canvas = new WCanvas(image.width, image.height);
			canvas.drawImage(image, 0, 0);
			this.#url2WCanvas.set(url, canvas);
		}
		return this.#url2WCanvas.get(url);
	} // WCanvas
	
	getImageWCanvasById(id) {
		const url = this.#id2url.get(id);
		check(url, `ImageManager.getImageWCanvasById(): no such id ${id}`);
		return this.getImageWCanvasByUrl(url);
	} // WCanvas
	
	#doPreload(cb) {
		this.#emplaceComplited();
		this.#loadingImages.size ? // If something loading
			setTimeout(() => this.#doPreload(cb), 100) : // Wait
			cb(); // Or finish with callback
	} // void
	
	#emplaceComplited() {
		for ( const [url, image] of this.#loadingImages ) {
			if ( image.complete ) {
				this.#loadingImages.delete(url);
				this.#url2Image.set(url, image);
			}
		}
	} // void
	
}
