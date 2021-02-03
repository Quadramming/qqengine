export const data = new Map(); // Module => HClass

const reClassDefine = /^\s*(return |export )?class (?<class>[a-zA-Z0-9]*)( extends (?<extends>[a-zA-Z0-9]*))?/;
const reClassMixins = /QQ\.mixins\((?<mixins>[,a-zA-Z0-9 ]*)\)/;
const reClassMethod = /^(?<tabs>\s*)(?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassStaticMethod = /^(?<tabs>\s*)static (?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassPrivateMethod = /^(?<tabs>\s*)(?<method>#[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reMethodFlags = /\/\/ {(?<flags>[^{]*)}/;
const reMethodEnd = /^(?<tabs>\s*)} \/\/ (?<end>.*)/;
const rePrivateField = /^(?<tabs>\s*)(?<field>#[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;
const reProtectedField = /^(?<tabs>\s*)(?<field>_[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;
const rePublicField = /^(?<tabs>\s*)(?<field>([a-zA-Z0-9][_a-zA-Z0-9]*))(;| )[^\/]*(\/\/ (?<description>.*))?/;

class Entity {
	
	constructor(base) {
		Object.assign(this, base);
	}
	
	html(value) {
		let htm = `<h1>
			${value.name}
			<span class='extends'>${value.extends? 'extends ' + value.extends :''}</span><br>
			<span class='classModule'>${value.module}</span><br>
		</h1>`;
		if ( value.staticMethods.length > 0 ) {
			htm += 'STATIC METHODS <br>';
			for ( const method of value.staticMethods ) {
				htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
			}
			htm += '<br>';
		}
		if ( value.methods.length > 0 ) {
			htm += 'METHODS <br>';
			for ( const method of value.methods ) {
				htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
			}
			htm += '<br>';
		}
		if ( value.privateMethods.length > 0 ) {
			htm += 'PRIVATE METHODS <br>';
			for ( const method of value.privateMethods ) {
				htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
			}
			htm += '<br>';
		}
		if ( value.publicFields.length > 0 ) {
			htm += 'PUBLIC FIELDS <br>';
			for ( const field of value.publicFields ) {
				htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
			}
			htm += '<br>';
		}
		if ( value.protectedFields.length > 0 ) {
			htm += 'PROTECTED FIELDS <br>';
			for ( const field of value.protectedFields ) {
				htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
			}
			htm += '<br>';
		}
		if ( value.privateFields.length > 0 ) {
			htm += 'PRIVATE FIELDS <br>';
			for ( const field of value.privateFields ) {
				htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
			}
			htm += '<br>';
		}
		htm += '<hr>';
		return htm;
	}
	
}

function methodFlags(flags) {
	let str = flags;
	str = str.replace('V', ' virtual ');
	str = str.replace('O', ' overload ');
	str = str.replace('F', ' getter/setter ');
	if ( str ) {
		str = `{${str.trim()}}`;
	}
	return str;
}

function processMethod(line, method, currentClassMethods) {
	let flags = line.match(reMethodFlags) || '';
	if ( flags !== '' ) {
		flags = methodFlags(flags.groups.flags);
	}
	return push(currentClassMethods, {
		name: method.groups.method,
		args: method.groups.args,
		flags: flags,
		options: method.groups.options || '',
		tabs: method.groups.tabs.length,
		end: ''
	});
}



	let currentClass = null;
	let currentMethod = null;
	for ( const line of lines ) {
		const classSearch = line.match(reClassDefine);
		if ( classSearch ) {
			currentFunction = null;
			currentClass = push(info.classes, {
				name: classSearch.groups.class,
				extends: classSearch.groups.extends || '',
				methods: [],
				staticMethods: [],
				privateMethods: [],
				privateFields: [],
				protectedFields: [],
				publicFields: [],
				module: module
			});
			continue;
		}
		if ( currentClass ) {
			const privateField = line.match(rePrivateField);
			if ( privateField ) {
				currentClass.privateFields.push({
					name: privateField.groups.field,
					description: privateField.groups.description || ''
				});
			}
			const protectedField = line.match(reProtectedField);
			if ( protectedField ) {
				currentClass.protectedFields.push({
					name: protectedField.groups.field,
					description: protectedField.groups.description || ''
				});
			}
			const publicField = line.match(rePublicField);
			if ( publicField && ! currentMethod ) {
				currentClass.publicFields.push({
					name: publicField.groups.field,
					description: publicField.groups.description || ''
				});
			}
			const mixins = line.match(reClassMixins);
			if ( mixins ) {
				currentClass.extends = `mixins: ${mixins.groups.mixins}`;
			}
			const method = line.match(reClassMethod);
			if ( method ) {
				currentMethod = processMethod(line, method, currentClass.methods);
			}
			const staticMethod = line.match(reClassStaticMethod);
			if ( staticMethod ) {
				currentMethod = processMethod(line, staticMethod, currentClass.staticMethods);
			}
			const privateMethod = line.match(reClassPrivateMethod);
			if ( privateMethod ) {
				currentMethod = processMethod(line, privateMethod, currentClass.privateMethods);
			}
			if ( currentMethod ) {
				const end = line.match(reMethodEnd);
				if ( end && end.groups.tabs.length === currentMethod.tabs ) {
					currentMethod.end = end.groups.end;
					currentMethod = null;
				}
			}
		}
	}
