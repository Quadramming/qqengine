const QQ = {};

QQ.start = function(cfg) {
	window.addEventListener('load', () => {
		
		function main() {
			while ( document.body.firstChild ) {
				document.body.removeChild( document.body.firstChild );
			}
			new QQ.Application(cfg);
		}
		
		if ( window.cordova ) {
			document.addEventListener('deviceready', () => {
				main();
			}, false);
		} else {
			main();
		}
	});
};
