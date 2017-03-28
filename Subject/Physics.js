QQ.Subject.Physics = class extends
	QQ.Subject.SpriteMix(QQ.Subject.PhysicsMix(QQ.Subject.Base))
{
	
	constructor(app, options, img, w, h) {
		super(app, img, w, h);
		if ( options ) {
			this.setDefaultPhysics(options);
		}
	}
	
};
