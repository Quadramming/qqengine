QQ.SubjectPhysics = class extends
	QQ.SubjectSpriteMix(QQ.SubjectPhysicsMix(QQ.SubjectBase))
{
	
	constructor(options, img, w, h) {
		super(img, w, h);
		if ( options ) {
			this.setDefaultPhysics(options);
		}
	}
	
};
