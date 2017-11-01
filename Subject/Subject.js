QQ.Subject = {};

QQ.Subject.make = function(options = {}) {
	if ( options.img && options.tiled ) {
		return new QQ.Subject.TileSprite(options);
	}
	if ( options.img ) {
		let subj = null;
		if ( options.isActionable ) {
			subj = new QQ.Subject.Actionable(options);
		} else {
			subj = new QQ.Subject.Sprite(options);
		}
		if ( options.clip ) {
			subj.setClip(options.clip);
		}
		return subj;
	}
	return new QQ.Subject.Base(options);
};
