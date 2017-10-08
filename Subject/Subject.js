QQ.Subject = {};

QQ.Subject.make = function(options = {}) {
	if ( options.img && options.tiled ) {
		return new QQ.Subject.TileSprite(options);
	}
	if ( options.img ) {
		return new QQ.Subject.Sprite(options);
	}
	return new QQ.Subject.Base(options);
};
