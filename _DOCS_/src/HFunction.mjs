const reFunction = /^(?<tabs>\s*)(?<export>export )?function (?<function>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/ (?<options>.*))?/;
const reFunctionEnd = /^(?<tabs>\s*)}( \/\/ (?<return>.*))?/;

let current = null;

export const data = new Map(); // Module => HFunction

export function process(line, module) {
	const fn = line.match(reFunction);
	if ( fn ) {
		console.assert(current === null);
		// currentClass = null; ???
		if ( ! data.has(module) ) data.set(module, []);
		current = push(data.get(module), new Entity({
			name: fn.groups.function,
			export: fn.groups.export ?? '',
			options: fn.groups.options ?? '',
			args: fn.groups.args,
			tabs: fn.groups.tabs.length,
			module: module,
		}));
	}
	if ( current ) {
		const end = line.match(reFunctionEnd);
		if ( end && end.groups.tabs.length === current.tabs ) {
			current.return = end.groups.return ?? '';
			current = null;
		}
	}
}

class Entity {
	
	constructor(base) {
		Object.assign(this, base);
	}
	
	html(fn) {
		let htm = ``
		htm += `<span class='export'>${fn.export}</span>`
		htm += `<span class='return'>${fn.return}</span>`
		htm += ` <b>${fn.name}</b>`
		htm += `(${fn.args})`
		htm += ` <span class='description'>${fn.options}</span>`;
		htm += `<br>`;
		return htm;
	}
	
}
