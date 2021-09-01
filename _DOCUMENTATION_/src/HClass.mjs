const reClassDefine = /^(?<tabs>\s*)(return |export )?class (?<class>[a-zA-Z0-9]*)( extends (?<extends>[a-zA-Z0-9]*))?.*?( \/\/ (?<description>.*))?$/;
const reClassEnd = /^(?<tabs>\s*)}/;

const reClassMixins = /QQ\.mixins\((?<mixins>[,a-zA-Z0-9 ]*)\)/;

const reStaticField = /^(?<tabs>\s*)static (?<field>([a-zA-Z0-9][_a-zA-Z0-9]*))(;| )[^\/]*(\/\/ (?<description>.*))?/;
const rePublicField = /^(?<tabs>\s*)(?<field>([a-zA-Z0-9][_a-zA-Z0-9]*))(;| =)[^\/]*(\/\/ (?<description>.*))?/;
const reProtectedField = /^(?<tabs>\s*)(?<field>_[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;
const rePrivateField = /^(?<tabs>\s*)(?<field>#[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;

const reMethodFlags = /\/\/ {(?<flags>[^{]*)}/;

const reDeclaredMethod = /^\s*\/\/D\\\\( (?<return>.*?))? (?<method>#?[_a-zA-Z0-9]+)\((?<args>.*?)\)( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reStaticMethod = /^(?<tabs>\s*)static (?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const rePublicMethod = /^(?<tabs>\s*)(?<method>[a-zA-Z0-9][_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reProtectedMethod = /^(?<tabs>\s*)(?<method>_[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const rePrivateMethod = /^(?<tabs>\s*)(?<method>#[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reMethodEnd = /^(?<tabs>\s*)}( \/\/ (?<return>.*))?/;

let current = null;
let currentMethod = null;

export const data = [];

export function process(line, module) {
	const classSearch = line.match(reClassDefine);
	if ( classSearch ) {
		console.assert(current === null);
		current = push(data, new Entity({
			name: classSearch.groups.class,
			extends: classSearch.groups.extends ?? '',
			tabs: classSearch.groups.tabs.length,
			description: classSearch.groups.description ?? '',
			
			staticMethods: [],
			publicMethods: [],
			protectedMethods: [],
			privateMethods: [],
			
			staticFields: [],
			publicFields: [],
			protectedFields: [],
			privateFields: [],
			
			module: module
		}));
		return;
	}
	if ( current ) {
		const mixins = line.match(reClassMixins);
		if ( current && mixins ) {
			current.extends = `mixins: ${mixins.groups.mixins}`;
			return;
		}
		const end = line.match(reClassEnd);
		if ( end && end.groups.tabs.length === current.tabs ) {
			current = null;
			return;
		}
		processFields(line);
		processMethods(line);
	}
}

function processFields(line) {
	const staticField = line.match(reStaticField);
	if ( staticField?.groups.tabs.length === current.tabs+1) {
		current.staticFields.push({
			name: staticField.groups.field,
			description: staticField.groups.description ?? ''
		});
		return;
	}
	const publicField = line.match(rePublicField);
	if ( publicField?.groups.tabs.length === current.tabs+1) {
		current.publicFields.push({
			name: publicField.groups.field,
			description: publicField.groups.description ?? ''
		});
		return;
	}
	const protectedField = line.match(reProtectedField);
	if ( protectedField?.groups.tabs.length === current.tabs+1) {
		current.protectedFields.push({
			name: protectedField.groups.field,
			description: protectedField.groups.description ?? ''
		});
		return;
	}
	const privateField = line.match(rePrivateField);
	if ( privateField?.groups.tabs.length === current.tabs+1) {
		current.privateFields.push({
			name: privateField.groups.field,
			description: privateField.groups.description ?? ''
		});
		return;
	}
}

function processMethods(line) {
	const declaredMethod = line.match(reDeclaredMethod);
	if ( declaredMethod ) {
		console.assert(currentMethod === null);
		let flags = line.match(reMethodFlags) ?? '';
		if ( flags !== '' ) {
			flags = methodFlags(flags.groups.flags);
		}
		let place = current.publicMethods;
		if ( declaredMethod.groups.method[0] === '#' ) {
			place = current.privateMethods;
		} else if ( declaredMethod.groups.method[0] === '_' ) {
			place = current.protectedMethods;
		}
		place.push({
			name: declaredMethod.groups.method,
			args: declaredMethod.groups.args,
			flags: flags,
			options: declaredMethod.groups.options ?? '',
			return: declaredMethod.groups.return ?? ''
		});
		return;
	}
	const staticMethod = line.match(reStaticMethod);
	if ( staticMethod?.groups.tabs.length === current.tabs+1) {
		console.assert(currentMethod === null);
		currentMethod = processMethod(line, staticMethod, current.staticMethods);
		return;
	}
	const publicMethod = line.match(rePublicMethod);
	if ( publicMethod?.groups.tabs.length === current.tabs+1) {
		console.assert(currentMethod === null);
		currentMethod = processMethod(line, publicMethod, current.publicMethods);
		return;
	}
	const protectedMethod = line.match(reProtectedMethod);
	if ( protectedMethod?.groups.tabs.length === current.tabs+1) {
		console.assert(currentMethod === null);
		currentMethod = processMethod(line, protectedMethod, current.protectedMethods);
		return;
	}
	const privateMethod = line.match(rePrivateMethod);
	if ( privateMethod?.groups.tabs.length === current.tabs+1) {
		console.assert(currentMethod === null);
		currentMethod = processMethod(line, privateMethod, current.privateMethods);
		return;
	}
	if ( currentMethod ) {
		const end = line.match(reMethodEnd);
		if ( end?.groups.tabs.length === currentMethod.tabs ) {
			currentMethod.return = end.groups.return ?? '';
			currentMethod = null;
		}
	}
}

function methodFlags(flags) {
	let string = flags;
	string = string.replace('V', ' virtual ');
	string = string.replace('O', ' overload ');
	string = string.replace('F', ' getter/setter ');
	if ( string ) {
		string = `{${string.trim()}}`;
	}
	return string;
}

function processMethod(line, method, currentClassMethods) {
	let flags = line.match(reMethodFlags) ?? '';
	if ( flags !== '' ) {
		flags = methodFlags(flags.groups.flags);
	}
	return push(currentClassMethods, {
		name: method.groups.method,
		args: method.groups.args,
		flags: flags,
		options: method.groups.options ?? '',
		tabs: method.groups.tabs.length,
		return: ''
	});
}


function fieldHtm(title, fields) {
	let htm = '';
	if ( fields.length > 0 ) {
		htm += `${title}<br>`;
		for ( const field of fields ) {
			htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
		}
		htm += '<br>';
	}
	return htm;
}

function methodHtm(title, methods) {
	let htm = '';
	if ( methods.length > 0 ) {
		htm += `${title}<br>`;
		for ( const method of methods ) {
			htm += `<span class='return'>${method.return}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
		}
		htm += '<br>';
	}
	return htm;
}

class Entity {
	
	constructor(base) {
		Object.assign(this, base);
	}
	
	html(value) {
		let htm = `<h1>
			${value.name}
			<span class='extends'>${value.extends? 'extends ' + value.extends :''}</span>
			<span class='description'>${value.description}</span>
			<br>
			<span class='classModule'>${value.module}</span><br>
		</h1>`;
		htm += methodHtm('STATIC METHODS', value.staticMethods);
		htm += methodHtm('PUBLIC METHODS', value.publicMethods);
		htm += methodHtm('PROTECTED METHODS', value.protectedMethods);
		htm += methodHtm('PRIVATE METHODS', value.privateMethods);
		htm += fieldHtm('STATIC FIELDS', value.staticFields);
		htm += fieldHtm('PUBLIC FIELDS', value.publicFields);
		htm += fieldHtm('PROTECTED FIELDS', value.protectedFields);
		htm += fieldHtm('PRIVATE FIELDS', value.privateFields);
		return htm;
	}
	
}
