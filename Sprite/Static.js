QQ.Sprite.Static = class Static extends QQ.Sprite.Manager {
	
	constructor(w, h) {
		super(w, h);
	}
	
	draw(ctx, x, y, img) {
		ctx.drawImage(
			img,
			x, y,
			this._width, this._height
		);
	}
	
};
