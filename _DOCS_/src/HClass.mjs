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

function outputClass(classObj) {
	let htm = `<h1>
		${classObj.name}
		<span class='extends'>${classObj.extends? 'extends ' + classObj.extends :''}</span><br>
		<span class='classModule'>${classObj.module}</span><br>
	</h1>`;
	if ( classObj.staticMethods.length > 0 ) {
		htm += 'STATIC METHODS <br>';
		for ( const method of classObj.staticMethods ) {
			htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
		}
		htm += '<br>';
	}
	if ( classObj.methods.length > 0 ) {
		htm += 'METHODS <br>';
		for ( const method of classObj.methods ) {
			htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
		}
		htm += '<br>';
	}
	if ( classObj.privateMethods.length > 0 ) {
		htm += 'PRIVATE METHODS <br>';
		for ( const method of classObj.privateMethods ) {
			htm += `<span class='end'>${method.end}</span> <b>${method.name}</b>(${method.args}) ${method.flags} <span class='description'>${method.options}</span><br>`;
		}
		htm += '<br>';
	}
	if ( classObj.publicFields.length > 0 ) {
		htm += 'PUBLIC FIELDS <br>';
		for ( const field of classObj.publicFields ) {
			htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
		}
		htm += '<br>';
	}
	if ( classObj.protectedFields.length > 0 ) {
		htm += 'PROTECTED FIELDS <br>';
		for ( const field of classObj.protectedFields ) {
			htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
		}
		htm += '<br>';
	}
	if ( classObj.privateFields.length > 0 ) {
		htm += 'PRIVATE FIELDS <br>';
		for ( const field of classObj.privateFields ) {
			htm += `<b>${field.name}</b> <span class='description'>${field.description}</span><br>`;
		}
		htm += '<br>';
	}
	htm += '<hr>';
	return htm;
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


class HFunction {
	
	static #reFunction = /^(?<tabs>\s*)(export )?function (?<function>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
	static #reFunctionEnd = /^(?<tabs>\s*)} \/\/ (?<end>.*)/;
	
	static #data = new Map(); // Module => functions
	static #current = null;
	
	static html(fn) {
		const text = `<span class='end'>${fn.end}</span> <b>${fn.name}</b>(${fn.args}) <span class='description'>${fn.options}</span><br>`;
		return text;
	}
	
	static process(line, module) {
		if ( this.#current ) {
			const end = line.match(this.#reFunctionEnd);
			if ( end && end.groups.tabs.length === this.#current.tabs ) {
				this.#current.end = end.groups.end;
				this.#current = null;
			}
			return;
		}
		
		const fn = line.match(this.#reFunction);
		if ( fn ) {
			// currentClass = null; ???
			if ( ! this.#data.has(module) ) this.#data.set(module, []);
			this.#current = push(this.#data.get(module), {
				name: fn.groups.function,
				options: fn.groups.options || '',
				args: fn.groups.args,
				tabs: fn.groups.tabs.length,
				module: module,
				end: ''
			});
		}
	}
	
}
