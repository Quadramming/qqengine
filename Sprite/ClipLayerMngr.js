QQ.Sprite.ClipLayerMngr = class Layer extends QQ.Sprite.Mngr {
	
	constructor(x, y, w, h) {
		super(w, h);
		this._clips = [];
		this.addLayer(x, y, w, h);
	}
	
	addLayer(x, y, w = this._width, h = this._height) {
		this._clips.push({x, y, w, h});
	}
	
	draw(ctx, x, y, img) {
		for ( let l of this._clips ) {
			ctx.drawImage(
				img,
				l.x, l.y,
				l.w, l.h,
				x, y,
				this._width, this._height
			);
		}
	}
	
};
