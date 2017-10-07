QQ.Sprite.ClipLayerMngr = class Layer extends QQ.Sprite.Mngr {
	
	constructor(rect) {
		super( new QQ.Size(rect.width(), rect.height()) );
		this._clips = [];
		this.addLayer(rect);
	}
	
	addLayer(rect) {
		if ( rect instanceof QQ.Rect ) {
			this._clips.push(rect);
		} else {
			this._clips.push(new QQ.Rect(
				rect.x(), rect.y(),
				this._size.w(), this._size.h())
			);
		}
	}
	
	draw(ctx, point, img) {
		for ( const rect of this._clips ) {
			ctx.drawImage(
				img,
				rect.x(), rect.y(),
				rect.width(), rect.height(),
				point.x(), point.y(),
				this._size.w(), this._size.h()
			);
		}
	}
	
};
