QQ.Seizures.register.set('Loading',
	class SeizureLoading
		extends QQ.Seizures.Base
	{
		
		constructor(input) {
			super(input);
			this._camera.init(new QQ.Point(), new QQ.Point());
			/*
			this._world.addSubject(
				new QQ.Text(app, 'Loading')
			);
			*/
		}
		
	}
);
