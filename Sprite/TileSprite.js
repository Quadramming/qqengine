// QQDOC

import {Sprite} from './Sprite.js';
import {Point, Size} from '../primitives/index.js';

// TOFIX avoid real pixels
export class TileSprite extends Sprite {
	
	#tileSize = new Size(1, 1);
	#tileOffset = new Point(0, 0);
	
	constructor(image, tileSize, tileOffset) {
		super(image);
		this.setTileSize(tileSize ?? this.#tileSize); // Will recalc this.#tileSize as anchor
		if ( tileOffset ) this.setTileOffset(tileOffset);
	}
	
	setTileSize(tileSize) {
		this.#tileSize.set(
			this._size.x()*tileSize.x(),
			this._size.y()*tileSize.y()
		);
	}
	
	setTileOffset(offset) {
		this.#tileOffset.set(
			this._size.x()*(offset.x() % this.#tileSize.x()) - this.#tileSize.x(),
			this._size.y()*(offset.y() % this.#tileSize.y()) - this.#tileSize.y()
		);
	}
	
	drawImage(ctx) { // {O}
		ctx.save(); // save for resetore
		ctx.beginPath(); // clean before clip
		ctx.rect(0, 0, this._size.w(), this._size.h());
		ctx.clip();
		let coveredX = this.#tileOffset.x();
		let coveredY = this.#tileOffset.y();
		while ( coveredY < this._size.h() ) {
			while ( coveredX < this._size.w() ) {
				ctx.drawImage(
					this._image,
					coveredX, coveredY,
					this.#tileSize.w(), this.#tileSize.h()
				);
				coveredX += this.#tileSize.w();
			}
			coveredX = this.#tileOffset.x();
			coveredY += this.#tileSize.h();
		}
		ctx.beginPath(); // reset path
		ctx.restore(); // reset clip
	}
	
}
