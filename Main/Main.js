QQ        = {
	engine: {}
};

QQ.engine.start = function(imgs, appConfig) {
	for ( let img of imgs ) {
		QQ.imgManager.get(img);
	}
	
	(function me() {
		QQ.imgManager.isAllReady() ?
			QQ.engine.init(appConfig):
			setTimeout(me, 10);
	})();
};

QQ.engine.init = function(appConfig) {
	QQ.application = new QQ.Application(appConfig);
	QQ.seizures.init();
	QQ.application.init();
};