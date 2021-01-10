globalThis.a = a;
globalThis.c = c;
globalThis.d = d;
globalThis.check = check;
globalThis.dump = dump;

function a(message) {
	alert(message);
}

function c(variable, ...rest) {
	let output = variable;
	if ( rest.length > 0 ) {
		output = String(output);
		for ( const variable of rest ) {
			output += ', ' + variable;
		}
	}
	if ( output === undefined ) {
		debugger;
	}
	console.log(output);
}

function d() {
	debugger;
}

function check(condition, message = 'Check error') {
	if ( ! condition ) {
		throw Error(message);
	}
}

function dump(...rest) {
	for ( const variable of rest ) {
		console.log(variable);
	}
}
