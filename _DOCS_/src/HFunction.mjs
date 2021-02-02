export class HFunction {
	
	static #reFunction = /^(?<tabs>\s*)(?<export>export )?function (?<function>[_a-zA-Z0-9]+)\((?<args>.*?)\) {( \/\/ (?<options>.*))?/;
	static #reFunctionEnd = /^(?<tabs>\s*)}( \/\/ (?<return>.*))?/;
	
	static data = new Map(); // Module => functions
	static #current = null;
	
	static html(fn) {
		let text = ``
		text += `<span class='export'>${fn.export}</span>`
		text += `<span class='return'>${fn.return}</span>`
		text += ` <b>${fn.name}</b>`
		text += `(${fn.args})`
		text += ` <span class='description'>${fn.options}</span>`;
		text += `<br>`;
		return text;
	}
	
	static process(line, module) {
		const fn = line.match(this.#reFunction);
		if ( fn ) {
			console.assert(this.#current === null);
			// currentClass = null; ???
			if ( ! this.data.has(module) ) this.data.set(module, []);
			this.#current = push(this.data.get(module), {
				type: 'function',
				name: fn.groups.function,
				export: fn.groups.export ?? '',
				options: fn.groups.options ?? '',
				args: fn.groups.args,
				tabs: fn.groups.tabs.length,
				module: module,
			});
		}
		if ( this.#current ) {
			const end = line.match(this.#reFunctionEnd);
			if ( end && end.groups.tabs.length === this.#current.tabs ) {
				this.#current.return = end.groups.return ?? '';
				this.#current = null;
			}
		}
	}
	
}
