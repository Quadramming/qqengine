// QQDOC

import * as QQ from '../QQ.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';
import {Point, Size, Scale} from '../primitives/index.js';
import * as matrix from '../matrix.js';
import * as maths from '../maths.js';

// TOFIX: maybe some how split diffrent sprites?

export function SpriteMix(base) {
	return class SpriteMix extends base {
		
		constructor(options = {}) {
			super(options);
			this.fixImage(options);
			this._image = options.image;
			this._sprite = null;
			this._alpha = QQ.useDefault(options.alpha, 1);
			this.setStaticSprite();
		}
		
		fixImage(options) {
			if ( options.image === undefined ) {
				const memoryImage = QQ.makeCanvas( new Size(1, 1) );
				memoryImage.ctx.fillStyle = 'red';
				memoryImage.ctx.fillRect(0, 0, 1, 1);
				options.image = memoryImage.cvs;
			}
		}
		
		setSpriteImage(image) {
			this._image = image;
			this._sprite.setImage(
				QQ.APP.getImg(image)
			);
		}
		
		getSprite() {
			return this._sprite;
		}
		
		getImage() {
			return this._image;
		}
		
		tick(delta) {
			super.tick(delta);
			this._sprite.tick(delta);
		}
		
		draw(context) {
			super.draw(context);
			// TOFIX need cache
			const spriteSize = this._sprite.getFrameSize();
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
			const changeAlpha = (this._alpha !== 1);
			if ( changeAlpha ) {
				ctx.globalAlpha = this._alpha;
			}
			this._sprite.draw(ctx);
			if ( changeAlpha ) {
				ctx.globalAlpha = 1;
			}
		}
		
		setStaticSprite() {
			this._sprite = new Sprite(
				QQ.APP.getImg(this._image)
			);
		}
		
		setClipSprite(...args) {
			this._sprite = new ClipSprite(
				QQ.APP.getImg(this._image),
				...args
			);
		}
		
		setAnimateSprite(...args) {
			this._sprite = new AnimateSprite(
				QQ.APP.getImg(this._image),
				...args
			);
		}
		
		setClipSprite(...args) {
			this._sprite = new ClipSprite(
				QQ.APP.getImg(this._image),
				...args
			);
		}
		
		setLayersSprite(...args) {
			this._sprite = new LayersSprite(
				QQ.APP.getImg(this._image),
				...args
			);
		}
		
		setTileSprite(...args) {
			this._sprite = new TileSprite(
				QQ.APP.getImg(this._image),
				...args
			);
		}
		
		setTileOffset(offset) {
			if ( this._sprite instanceof TileSprite ) {
				this._sprite.setTileOffset(offset);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		setTileSize(size) {
			if ( this._sprite instanceof TileSprite ) {
				this._sprite.setTileSize(size);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		addSpriteLayer(layer) {
			if ( this._sprite instanceof LayersSprite ) {
				this._sprite.addLayer(layer);
			} else {
				throw new Error('Wrong sprite type');
			}
		}
		
		alpha(alpha) {
			if ( alpha !== undefined ) {
				this._alpha = alpha;
			}
			return this._alpha;
		}
		
	}
}
