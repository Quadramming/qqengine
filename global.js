// QQDOC

globalThis.a = a;
globalThis.c = c;
globalThis.d = d;
globalThis.l = l;
globalThis.check = check;
globalThis.dump = dump;

function a(message) { // Alert
	alert(message);
} // void

function c(variable, ...rest) { // Console output
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
} // void

function d() { // Debugger
	debugger;
} //  void

function l(...strings) { // To one line with \n separator
	return [].join.call(strings, '\n');
} // string

function check(condition, message = 'Check error') {
	if ( ! condition ) {
		throw Error(message);
	}
} // void

function dump(...rest) { // Show variables
	for ( const variable of rest ) {
		console.log(variable);
	}
} // void
