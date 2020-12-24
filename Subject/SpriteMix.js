// QQDOC

import * as QQ from '../QQ.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';
import {ORDER} from '../CONST/index.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';
import {Point, Size, Scale} from '../primitives/index.js';

// TOFIX: maybe some how split diffrent sprites?

function fixOptions(options) {
	if ( ! options.image ) {
		const memoryImage = QQ.makeCanvas( new Size(1, 1) );
		memoryImage.ctx.fillStyle = 'red';
		memoryImage.ctx.fillRect(0, 0, 1, 1);
		options.image = memoryImage.cvs;
	}
}

export function SpriteMix(base) {
	return class SpriteMix extends base {
		
		#drawOrder;
		#image;
		#sprite;
		#alpha;
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) {
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		}
		
		#reset(options) {
			this.#drawOrder = options.spriteDrawOrder ?? ORDER.FIRST;
			this.#image = options.image;
			this.#sprite = null;
			this.#alpha = options.alpha ?? 1;
			this.setStaticSprite();
		}
		
		setSpriteImage(image) {
			this.#image = image;
			this.#sprite.setImage(
				QQ.APP.getImg(image)
			);
		}
		
		getSprite() {
			return this.#sprite;
		}
		
		getImage() {
			return this.#image;
		}
		
		tick(delta) {
			super.tick(delta);
			this.#sprite.tick(delta);
		}
		
		draw(context) {
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
		
		setStaticSprite() {
			this.#sprite = new Sprite(
				QQ.APP.getImg(this.#image)
			);
		}
		
		setClipSprite(...args) {
			this.#sprite = new ClipSprite(
				QQ.APP.getImg(this.#image),
				...args
			);
		}
		
		setAnimateSprite(...args) {
			this.#sprite = new AnimateSprite(
				QQ.APP.getImg(this.#image),
				...args
			);
		}
		
		setClipSprite(...args) {
			this.#sprite = new ClipSprite(
				QQ.APP.getImg(this.#image),
				...args
			);
		}
		
		setLayersSprite(...args) {
			this.#sprite = new LayersSprite(
				QQ.APP.getImg(this.#image),
				...args
			);
		}
		
		setTileSprite(...args) {
			this.#sprite = new TileSprite(
				QQ.APP.getImg(this.#image),
				...args
			);
		}
		
		setTileOffset(offset) {
			if ( this.#sprite instanceof TileSprite ) {
				this.#sprite.setTileOffset(offset);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		setTileSize(size) {
			if ( this.#sprite instanceof TileSprite ) {
				this.#sprite.setTileSize(size);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		addSpriteLayer(layer) {
			if ( this.#sprite instanceof LayersSprite ) {
				this.#sprite.addLayer(layer);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		alpha(alpha) {
			if ( alpha !== undefined ) {
				this.#alpha = alpha;
			}
			return this.#alpha;
		}
		
	}
}
