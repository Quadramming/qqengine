import * as QQ from '../QQ.js';
import {Sprite} from '../Sprite/Sprite.js';
import {ClipSprite} from '../Sprite/ClipSprite.js';
import {AnimateSprite} from '../Sprite/AnimateSprite.js';
import {LayersSprite} from '../Sprite/LayersSprite.js';
import {TileSprite} from '../Sprite/TileSprite.js';

// TOFIX: maybe some how split diffrent sprites?

export function SpriteMix(base) {
	return class SpriteMix extends base {
		
		constructor(options) {
			super(options);
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
		
		setSprite(image) {
			this._sprite.setImage(
				QQ.APP.getImg(image)
			);
			this._image = image;
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
		
		setSize(size) {
			super.setSize(size);
			this._sprite.setSize(size);
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
			this._sprite.setAlpha(alpha);
		}
		
		setAnchor(point) {
			super.setAnchor(point);
			this._sprite.setAnchor(point);
		}
		
		setSize(size) {
			super.setSize(size);
			this._sprite.setSize(size);
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
