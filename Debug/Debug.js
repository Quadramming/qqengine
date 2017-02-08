QQ.Debug     = {
	log(str) {
		console.log(str);
	}
};

c = function(str) {
	QQ.Debug.log(str);
};

c('Using QQ.Debug:');
c('function c(str) - Quick log');

// for ( let x of Object.getOwnPropertyNames(window) ) { console.log(x) };
