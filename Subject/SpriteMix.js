// QQDOC
// TD

import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';
import {ORDER} from '../CONST/index.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';
import {WCanvas} from '../WCanvas.js';
import {Point, Size, Scale} from '../primitives/index.js';

// TOFIX: maybe some how split diffrent sprites?

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
}

export function SpriteMix(base) {
	return class SpriteMix extends base {
		
		#drawOrder;
		#imageId; // Image ID
		#image; // Image content (HTMLImageElement, Canvas, ...)
		#sprite;
		#alpha;
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		}
		
		#reset(options) {
			this.#drawOrder = options.spriteDrawOrder ?? ORDER.FIRST;
			this.#imageId = options.imageId ?? null;
			this.#image = options.image;
			this.#alpha = options.alpha ?? 1;
			this.setStaticSprite(); // Will set this.#sprite
		}
		
		getSprite() {
			return this.#sprite;
		}
		
		getImage() {
			return this.#image;
		}
		
		tick(delta) { // {O}
			super.tick(delta);
			this.#sprite.tick(delta);
		}
		
		draw(context) { // {O}
			if ( this.#drawOrder === ORDER.FIRST ) {
				this.#draw(context);
			}
			super.draw(context);
			if ( this.#drawOrder === ORDER.LAST ) {
				this.#draw(context);
			}
		}
		
		#draw(context) {
			// TOFIX need cache
			const spriteSize = this.#sprite.getFrameSize();
			const size = this.size();
			const scale = new Scale(
				size.x()/spriteSize.x(),
				size.y()/spriteSize.y()
			);
			
			let M = matrix.getScale(scale);
			M = matrix.mul(
				matrix.getMove(maths.getOffset(this.size(), this.anchor())),
				M
			);
			M = matrix.mul(this.getMatrix(), M);
			context.transform(M);
			
			const ctx = context.get();
			const changeAlpha = (this.#alpha !== 1);
			if ( changeAlpha ) {
				ctx.globalAlpha = this.#alpha;
			}
			this.#sprite.draw(ctx);
			if ( changeAlpha ) {
				ctx.globalAlpha = 1;
			}
		}
		
		// set Sprites
		
		setStaticSprite() {
			this.#sprite = new Sprite(this.#image);
		}
		
		setAnimateSprite(...args) {
			this.#sprite = new AnimateSprite(this.#image, ...args);
		}
		
		setClipSprite(...args) {
			this.#sprite = new ClipSprite(this.#image, ...args);
		}
		
		// LayerSprite
		
		setLayersSprite(...args) {
			this.#sprite = new LayersSprite(this.#image, ...args);
		}
		
		addSpriteLayer(layer) {
			check(this.#sprite instanceof LayersSprite);
			this.#sprite.addLayer(layer);
		}
		
		// TileSprite
		
		setTileSprite(...args) {
			this.#sprite = new TileSprite(this.#image, ...args);
		}
		
		setTileOffset(offset) {
			check(this.#sprite instanceof TileSprite);
			this.#sprite.setTileOffset(offset);
		}
		
		setTileSize(size) {
			check(this.#sprite instanceof TileSprite);
			this.#sprite.setTileSize(size);
		}
		
		// Fields
		
		alpha(alpha) { // {F}
			if ( alpha !== undefined ) {
				this.#alpha = alpha;
			}
			return this.#alpha;
		}
		
		imageId(imageId) { // {F} Set image by id to sprite
			if ( imageId !== undefined ) {
				this.#imageId = imageId;
				this.#image = QQ.APP.getImageById(imageId);
				this.#sprite.image(this.#image);
			}
			return this.#imageId;
		}
		
		image(image) {
			if ( image !== undefined ) {
				this.#imageId = null;
				this.#image = image;
				this.#sprite.image(this.#image);
			}
			return this.#image;
		}
		
	}
}
