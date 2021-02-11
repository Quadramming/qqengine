// QQDOC

import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';
import {ORDER} from '../CONST/index.js';
import {Cache} from '../Cache.js';
import {SPRITE as S} from '../CONST/SPRITE.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';
import {WCanvas} from '../WCanvas.js';
import {Scale} from '../primitives/index.js';

function fixOptions(options) {
	if ( options.imageId && options.image ) {
		throw Error('Soulde be only one image source');
	} if ( options.imageId ) {
		options.image = QQ.APP.getImageById(options.imageId);
	} else if ( options.image ) {
		check(typeof options.image !== 'string', 'image should has content');
	} else { // No any source
		const wcanvas = new WCanvas(1, 1);
		wcanvas.fillStyle('#FF0000');
		wcanvas.fillRect(0, 0, 1, 1);
		options.image = wcanvas.getCanvas();
	}
} // void

export function SpriteMix(base) { // Mix SpriteMix to base
	return class SpriteMix extends base {
		
		#matrixCache = new Cache();
		#alpha;
		#imageId; // Image ID
		#image; // Image content (HTMLImageElement, Canvas, ...)
		#drawOrder;
		#sprite;
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#matrixCache.reset();
			this.#drawOrder = options.spriteDrawOrder ?? ORDER.FIRST;
			this.#imageId = options.imageId ?? null;
			this.#image = options.image;
			this.#alpha = options.alpha ?? 1;
			this.setSprite(S.SOLID); // Will set this.#sprite
		} // void
		
		tick(delta) { // {O}
			super.tick(delta);
			this.#sprite.tick(delta);
		} // void
		
		draw(context) { // {O}
			if ( this.#drawOrder === ORDER.FIRST ) {
				this.#draw(context);
			}
			super.draw(context);
			if ( this.#drawOrder === ORDER.LAST ) {
				this.#draw(context);
			}
		} // void
		
		getSprite() {
			return this.#sprite;
		} // Sprite
		
		setSprite(type, ...args) {
			switch ( type ) {
				case S.SOLID: this.#sprite = new Sprite(this.#image, ...args); break;
				case S.ANIMATE: this.#sprite = new AnimateSprite(this.#image, ...args); break;
				case S.CLIP: this.#sprite = new ClipSprite(this.#image, ...args); break;
				case S.LAYERS: this.#sprite = new LayersSprite(this.#image, ...args); break;
				case S.TILE: this.#sprite = new TileSprite(this.#image, ...args); break;
			}
		} // void
		
		setTileOffset(offset) {
			check(this.#sprite instanceof TileSprite);
			this.#sprite.setTileOffset(offset);
		} // void
		
		setTileSize(size) {
			check(this.#sprite instanceof TileSprite);
			this.#sprite.setTileSize(size);
		} // void
		
		addSpriteLayer(layer) {
			check(this.#sprite instanceof LayersSprite);
			this.#sprite.addLayer(layer);
		} // void
		
		#draw(wcontext) {
			const spriteSize = this.#sprite.getFrameSize();
			const size = this.size();
			const scale = new Scale(
				size.x()/spriteSize.x(),
				size.y()/spriteSize.y()
			);
			let M;
			if ( this.#matrixCache.isChanged(size, scale) ) {
				M = matrix.getScale(scale);
				M = matrix.mul(
					matrix.getMove(maths.getOffset(this.size(), this.anchor())),
					M
				);
				this.#matrixCache.set(M);
			} else {
				M = this.#matrixCache.get();
			}
			M = matrix.mul(this.getMatrix(), M);
			wcontext.transform(M);
			
			const context = wcontext.get();
			const changeAlpha = (this.#alpha !== 1);
			if ( changeAlpha ) {
				context.globalAlpha = this.#alpha;
			}
			this.#sprite.draw(context);
			if ( changeAlpha ) {
				context.globalAlpha = 1;
			}
		} // void
		
		alpha(alpha) { // {F}
			if ( alpha !== undefined ) {
				this.#alpha = alpha;
			}
			return this.#alpha;
		} // number
		
		imageId(imageId) { // {F} Set image by id to sprite
			if ( imageId !== undefined ) {
				this.#imageId = imageId;
				this.#image = QQ.APP.getImageById(imageId);
				this.#sprite.image(this.#image);
			}
			return this.#imageId;
		} // string
		
		image(image) { // {F}
			if ( image !== undefined ) {
				this.#imageId = null;
				this.#image = image;
				this.#sprite.image(image);
			}
			return this.#image;
		} // Canvas | HTMLImageElement
		
	}
} // class SpriteMix extends base
