globalThis.c = function(x) {
	console.log(x);
}

globalThis.push = function(array, element) {
	array.push(element);
	return element;
}

globalThis.check = function(expr, message = 'Check failed') {
	if ( ! expr ) {
		throw Error(message);
	}
}
