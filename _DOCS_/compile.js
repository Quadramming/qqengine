const fs = require('fs');

const reQQDOC = /\/\/.*QQDOC/;
const reClassDefine = /^\s*(return |export )?class (?<class>[a-zA-Z0-9]*)( extends (?<extends>[a-zA-Z0-9]*))?/;
const reClassMixins = /QQ\.mixins\((?<mixins>[,a-zA-Z0-9 ]*)\)/;
const reClassMethod = /^(?<tabs>\s*)(?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassStaticMethod = /^(?<tabs>\s*)static (?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassPrivateMethod = /^(?<tabs>\s*)(?<method>#[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reMethodFlags = /{(?<flags>[^{]*)}/;
const reMethodEnd = /^(?<tabs>\s*)} \/\/ (?<end>.*)/;
const rePrivateField = /^(?<tabs>\s*)(?<field>#[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;
const rePublicField = /^(?<tabs>\s*)(?<field>[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;

const reFunction = /^(?<tabs>\s*)(export )?function (?<function>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reFunctionEnd = /^(?<tabs>\s*)} \/\/ (?<end>.*)/;

const info = {classes: [], functions: new Map()};

function c(x) {
	console.log(x);
}

function push(array, element) {
	array.push(element);
	return array[array.length-1];
}

function parse(path) {
	fs.readdirSync(path, {withFileTypes: true} ).forEach(file => {
		const entityPath = `${path}/${file.name}`;
		if ( file.isDirectory() ) {
			parse(entityPath);
		} else {
			const content = fs.readFileSync(entityPath).toString();
			const lines = content.split('\n');
			if ( reQQDOC.test(lines[0]) ) {
				processFile(lines, entityPath);
			}
		}
	});
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

function processFile(lines, module) {
	let currentFunction = null;
	let currentClass = null;
	let currentMethod = null;
	for ( const line of lines ) {
		const functionSearch = line.match(reFunction);
		if ( functionSearch ) {
			if ( ! info.functions.has(module) ) {
				info.functions.set(module, []);
			}
			currentClass = null;
			currentFunction = push(info.functions.get(module), {
				name: functionSearch.groups.function,
				options: functionSearch.groups.options || '',
				args: functionSearch.groups.args,
				tabs: functionSearch.groups.tabs.length,
				module: module,
				end: ''
			});
		}
		if ( currentFunction ) {
			const end = line.match(reFunctionEnd);
			if ( end && end.groups.tabs.length === currentFunction.tabs ) {
				currentFunction.end = end.groups.end;
				currentFunction = null;
			}
		}
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
}

function outputFunction(functionObj) {
	const htm = `<span class='end'>${functionObj.end}</span> <b>${functionObj.name}</b>(${functionObj.args}) <span class='description'>${functionObj.options}</span><br>`;
	return htm;
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

function output() {
	let htm = fs.readFileSync('index.template.htm').toString();
	let docs = '';
	for ( const classObj of info.classes ) {
		docs += outputClass(classObj);
	}
	docs += `<hr><h1>FUNCTIONS</h1><hr>`;
	for ( const [key, module] of info.functions ) {
		docs += `<h1>${key}</h1>`;
		for ( const fn of module ) {
			docs += outputFunction(fn);
		}
	}
	htm = htm.replace('{DOCS}', docs);
	fs.writeFileSync('index.htm', htm);
}

parse('..');
output();
