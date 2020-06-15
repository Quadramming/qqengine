import {Sprite} from './Sprite.js';
import {Point, Size} from '../primitives/index.js';

export class TileSprite extends Sprite {
	
	constructor(image, tileSize, tileOffset) {
		super(image);
		this._tileSize = new Size(1, 1);
		this._tileOffset = new Point(0, 0);
		if ( tileSize ) {
			this.setTileSize(tileSize);
		}
		if ( tileOffset ) {
			this.setTileOffset(tileOffset);
		}
	}
	
	setTileSize(tileSize) {
		this._tileSize.copy(tileSize);
	}
	
	setTileOffset(offset) {
		this._tileOffset = new Point(
			(offset.x() % this._tileSize.x()) - this._tileSize.x(),
			(offset.y() % this._tileSize.y()) - this._tileSize.y()
		);
	}
	
	drawImage(ctx, drawPoint) {
		ctx.save(); // save for resetore
		ctx.beginPath(); // clean before clip
		ctx.rect(drawPoint.x(), drawPoint.y(), this._size.w(), this._size.h());
		ctx.clip();
		let coveredX = this._tileOffset.x();
		let coveredY = this._tileOffset.y();
		while ( coveredY < this._size.h() ) {
			while ( coveredX < this._size.w() ) {
				ctx.drawImage(
					this._image,
					drawPoint.x() + coveredX, drawPoint.y() + coveredY,
					this._tileSize.w(), this._tileSize.h()
				);
				coveredX += this._tileSize.w();
			}
			coveredX = this._tileOffset.x();
			coveredY += this._tileSize.h();
		}
		ctx.beginPath(); // reset path
		ctx.restore(); // reset clip
	}
	
}
