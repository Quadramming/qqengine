import * as QQ from '../QQ.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';
import {Point, Size} from '../primitives/index.js';

// TOFIX: maybe some how split diffrent sprites?

export function SpriteMix(base) {
	return class SpriteMix extends base {
		
		constructor(options = {}) {
			super(options);
			this.fixImage(options);
			this._image = options.image;
			this._sprite = null;
			this._alpha = QQ.useDefault(options.alpha, 1);
			if ( options.animateSprite ) {
				this.setAnimateSprite(...options.animateSprite);
			} else if ( options.clipSprite ) {
				this.setClipSprite(...options.clipSprite);
			} else {
				this.setStaticSprite();
			}
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
		
		draw(ctx) {
			ctx.transform(this.getMatrix());
			this._sprite.draw(ctx.get());
			super.draw(ctx);
		}
		
		setStaticSprite() {
			this._sprite = new Sprite(
				QQ.APP.getImg(this._image)
			);
			this._setSpriteSettings();
		}
		
		setClipSprite(...args) {
			this._sprite = new ClipSprite(
				QQ.APP.getImg(this._image),
				...args
			);
			this._setSpriteSettings();
		}
		
		setAnimateSprite(...args) {
			this._sprite = new AnimateSprite(
				QQ.APP.getImg(this._image),
				...args
			);
			this._setSpriteSettings();
		}
		
		setClipSprite(...args) {
			this._sprite = new ClipSprite(
				QQ.APP.getImg(this._image),
				...args
			);
			this._setSpriteSettings();
		}
		
		setLayersSprite(...args) {
			this._sprite = new LayersSprite(
				QQ.APP.getImg(this._image),
				...args
			);
			this._setSpriteSettings();
		}
		
		setTileSprite(...args) {
			this._sprite = new TileSprite(
				QQ.APP.getImg(this._image),
				...args
			);
			this._setSpriteSettings();
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
		
		setAlpha(alpha) {
			this._alpha = alpha;
			this._sprite.alpha(alpha);
		}
		
		setAnchor(point) {
			super.setAnchor(point);
			this._sprite.anchor(point);
		}
		
		setSize(size) {
			super.setSize(size);
			this._sprite.size(size);
		}
		
		_setSpriteSettings() {
			const newSize = this.getSize().clone();
			newSize.fixNaNToSimilar(this._sprite.getImageFrameSize());
			this.setSize(newSize);
			this.setAnchor(this.getAnchor());
			this.setAlpha(this._alpha);
		}
		
	}
}
