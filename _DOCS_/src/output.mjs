import * as fs from 'fs';
import * as HExportVars from './HExportVars.mjs';
import * as HFunction from './HFunction.mjs';
import * as HClass from './HClass.mjs';

export function output() {
	let htm = fs.readFileSync('src/index.template.htm').toString();
	let docs = '';
	docs += `<h1>CLASSES</h1><hr>`;
	/*
	for ( const classObj of info.classes ) {
		docs += outputClass(classObj);
	}
	*/
	
	for ( const entity of HClass.data ) {
		docs += entity.html(entity);
	}
	
	const data = new Map();
	
	for ( const entity of [HExportVars.data, HFunction.data] ) {
		for ( const [key, elements] of entity ) {
			if ( ! data.has(key) ) data.set(key, []);
			for ( const element of elements ) {
				data.get(key).push(element);
			}
		}
	}
	
	docs += `<hr><h1>FUNCTIONS AND VARIABLES</h1><hr>`;
	for ( const [key, entities] of data ) {
		docs += `<h1>${key}</h1>`;
		for ( const entity of entities ) {
			docs += entity.html(entity);
		}
	}
	htm = htm.replace('{DOCS}', docs);
	fs.writeFileSync('index.htm', htm);
}

