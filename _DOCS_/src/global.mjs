globalThis.c = function(x) {
	console.log(x);
}

globalThis.push = function(array, element) {
	array.push(element);
	return element;
}

globalThis.check = function(expression, message = 'Check failed') {
	if ( ! expression ) {
		throw Error(message);
	}
}
