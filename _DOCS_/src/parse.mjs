import * as fs from 'fs';

const reQQDOC = /\/\/.*QQDOC/;

export function parse(path, fn) {
	fs.readdirSync(path, {withFileTypes: true} ).forEach(file => {
		const entityPath = `${path}/${file.name}`;
		if ( file.isDirectory() ) {
			parse(entityPath, fn);
		} else {
			let content = fs.readFileSync(entityPath).toString();
			content = content.replace(/\r\n/g, '\n');
			const lines = content.split('\n');
			if ( reQQDOC.test(lines[0]) ) {
				fn(lines, entityPath.replace('../', ''));
			}
		}
	});
}
