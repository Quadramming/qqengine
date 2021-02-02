export class HExportVars {
	
	static #reOnelineVar = /^export (?<kind>const|let) (?<name>[_a-zA-Z0-9]+) (?<rest>.*?)( \/\/ (?<comment>.*))?$/;
	static #reMultilineVar = /^export (?<kind>const|let) (?<name>[_a-zA-Z0-9]+) = {$/;
	static #reVarEnd = /^};( \/\/ (?<comment>.*))?/;
	
	static data = new Map(); // Module => functions
	static #current = null;
	
	static html(value) {
		let text = `<span class='export'>export</span> `
		text += `<span class='kind'>${value.kind}</span> `;
		text += `<b>${value.name}</b> `;
		if ( value.info ) { // Multiline
			text += ` = { <span class='description'>${value.comment}</span>`;
			text += `<br>`;
			for ( let line of value.info ) {
				text += `&nbsp;&nbsp;${line}<br>`;
			}
			text += `};`;
		} else {
			text += `${value.rest}`;
			text += ` <span class='description'>${value.comment}</span>`;
		}
		text += `<br>`;
		return text;
	}
	
	static process(line, module) {
		// currentClass = null; ???
		
		const multi = line.match(this.#reMultilineVar);
		const single = line.match(this.#reOnelineVar);
		if ( multi || single ) {
			console.assert(this.#current === null);
			if ( ! this.data.has(module) ) this.data.set(module, []);
			if ( multi ) {
				this.#current = push(this.data.get(module), {
					type: 'var',
					kind: multi.groups.kind,
					name: multi.groups.name,
					info: [],
				});
			} else { // single
				push(this.data.get(module), {
					type: 'var',
					kind: single.groups.kind,
					name: single.groups.name,
					rest: single.groups.rest,
					comment: single.groups.comment ?? ''
				});
			}
		} else {
			const ending = line.match(this.#reVarEnd);
			if ( ending && this.#current ) {
				this.#current.comment = ending.groups.comment ?? '';
				this.#current = null;
			}
			this.#current?.info.push(line);
		}
	}
	
}
