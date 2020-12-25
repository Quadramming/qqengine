import {WCanvas} from './WCanvas.js';

export class ImageManager {
	
	#url2Image = new Map(); // url => Image
	#id2WCanvas = new Map(); // id => WCanvas
	#id2url; // Map: id => url
	
	constructor(nameToUrlArray) {
		this.#id2url = new Map(nameToUrlArray);
		for ( const url of this.#id2url.values() ) {
			this.#create(url);
		}
	}
	
	isReady() {
		for ( const image of this.#url2Image.values() ) {
			if ( image.complete === false ) {
				return false;
			}
		}
		return true;
	}
	
	getImageByUrl(imageUrl) {
		return this.#get(imageUrl);
	} // HTMLImageElement
	
	getImageById(imageId) {
		if ( this.#id2url.has(imageId) ) {
			const url = this.#id2url.get(imageId);
			return this.#get(url);
		}
		throw Error(`Application.getImageById(): no such img ${imageId}`);
	} // HTMLImageElement
	
	getImageCanvasByUrl(imageUrl) {
		for ( const [id, url] of this.#id2url ) {
			if ( url === imageUrl ) {
				return this.getImageCanvasById(id);
			}
		}
		throw Error(`Application.getImageCanvasByUrl(): no such url ${imageUrl}`);
	} // WCanvas
	
	getImageCanvasById(imageId) {
		if ( ! this.#id2WCanvas.has(imageId) ) {
			const image = this.getImageById(imageId);
			const canvas = new WCanvas(image.width, image.height);
			canvas.drawImage(image, 0, 0);
			this.#id2WCanvas.set(imageId, canvas);
		}
		return this.#id2WCanvas.get(imageId);
	} // WCanvas
	
	#create(url) {
		check( ! this.#url2Image.has(url), 'Already has that url');
		const image = new Image();
		image.src = url;
		this.#url2Image.set(url, image);
		return image;
	}
	
	#get(url) {
		if ( this.#url2Image.has(url) ) {
			return this.#url2Image.get(url);
		}
		return this.create(url);
	}
	
}
