const fs = require('fs');
const reQQDOC = /\/\/.*QQDOC/;
const reClassDefine = /class (?<class>[a-zA-Z0-9]*)( extends (?<extends>[a-zA-Z0-9]*))?/;
const reClassMethod = /^(?<tabs>\s*)(?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassStaticMethod = /^(?<tabs>\s*)static (?<method>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reClassPrivateMethod = /^(?<tabs>\s*)(?<method>#[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/( {[^}]*})?( (?<options>.*))?)?/;
const reMethodFlags = /{(?<flags>[^{]*)}/;
const reMethodEnd = /^(?<tabs>\s*)} \/\/ (?<end>.*)/;
const rePrivateField = /^(?<tabs>\s*)(?<field>#[_a-zA-Z0-9]+)(;| )[^\/]*(\/\/ (?<description>.*))?/;

const info = {classes: []};

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
				processFile(lines);
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

function processFile(lines) {
	let currentClass = null;
	let currentMethod = null;
	for ( const line of lines ) {
		const classSearch = line.match(reClassDefine);
		if ( classSearch ) {
			currentClass = push(info.classes, {
				name: classSearch.groups.class,
				extends: classSearch.groups.extends || '',
				methods: [],
				staticMethods: [],
				privateMethods: [],
				privateFields: []
			});
		}
		if ( currentClass ) {
			const privateField = line.match(rePrivateField);
			if ( privateField ) {
				currentClass.privateFields.push({
					name: privateField.groups.field,
					description: privateField.groups.description || ''
				});
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
				let end = line.match(reMethodEnd);
				if ( end && end.groups.tabs.length === currentMethod.tabs ) {
					currentMethod.end = end.groups.end;
					currentMethod = null;
				}
			}
		}
	}
}

function outputClass(classObj) {
	let htm = `<h1>
		${classObj.name}
		<span class='extends'>${classObj.extends? 'extends ' + classObj.extends :''}</span>
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
	htm = htm.replace('{DOCS}', docs);
	fs.writeFileSync('index.htm', htm);
}

parse('..');
output();
