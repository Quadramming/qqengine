const reOnelineVar = /^export (?<kind>const|let) (?<name>[_a-zA-Z0-9]+) (?<rest>.*?)( \/\/ (?<comment>.*))?$/;
const reMultilineVar = /^export (?<kind>const|let) (?<name>[_a-zA-Z0-9]+) = {$/;
const reVarEnd = /^};( \/\/ (?<comment>.*))?/;
let current = null;

export const data = new Map(); // Module => HExportVars

export function process(line, module) {
	// currentClass = null; ???
	
	const multi = line.match(reMultilineVar);
	const single = line.match(reOnelineVar);
	if ( multi || single ) {
		console.assert(current === null);
		if ( ! data.has(module) ) data.set(module, []);
		if ( multi ) {
			current = push(data.get(module), new Entity({
				kind: multi.groups.kind,
				name: multi.groups.name,
				info: [],
			}));
		} else { // single
			push(data.get(module), new Entity({
				kind: single.groups.kind,
				name: single.groups.name,
				rest: single.groups.rest,
				comment: single.groups.comment ?? ''
			}));
		}
	} else {
		const ending = line.match(reVarEnd);
		if ( ending && current ) {
			current.comment = ending.groups.comment ?? '';
			current = null;
		}
		current?.info.push(line);
	}
}

class Entity {
	
	constructor(base) {
		Object.assign(this, base);
	}
	
	html(value) {
		let htm = `<span class='export'>export</span> `;
		htm += `<span class='kind'>${value.kind}</span> `;
		htm += `<b>${value.name}</b> `;
		if ( value.info ) { // Multiline
			htm += ` = { <span class='description'>${value.comment}</span><br>`;
			for ( let line of value.info ) {
				htm += `&nbsp;&nbsp;${line}<br>`;
			}
			htm += `};`;
		} else {
			htm += `${value.rest}`;
			htm += ` <span class='description'>${value.comment}</span>`;
		}
		htm += `<br>`;
		return htm;
	}
	
}
