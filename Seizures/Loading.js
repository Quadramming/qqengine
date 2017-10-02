QQ.Seizures.register.set('Loading',
	class SeizureLoading
		extends QQ.Seizures.Base
	{
		
		constructor(input) {
			super(input);
			this._camera.init();
			/*
			this._world.addSubject(
				new QQ.Text(app, 'Loading')
			);
			*/
		}
		
	}
);
