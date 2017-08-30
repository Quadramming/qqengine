QQ.Subject = {};

QQ.Subject.make = function(app, options = {}) {
	if ( options.imgSrc && options.tiled ) {
		return new QQ.Subject.TileSprite(app, options);
	}
	if ( options.imgSrc ) {
		return new QQ.Subject.Sprite(app, options);
	}
	return new QQ.Subject.Base(app, options);
};
