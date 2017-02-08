QQ = window.QQ || {};

QQ.engine = {};

QQ.engine.start = function(imgs) {
	for ( let img of imgs ) {
		QQ.imgManager.get(img);
	}
	
	(function me() {
		QQ.imgManager.isAllReady() ?
			QQ.engine.init():
			setTimeout(me, 10);
	})();
};

QQ.engine.init = function() {
	QQ.application = new QQ.Application();
	QQ.seizures.init();
	QQ.application.init();
};