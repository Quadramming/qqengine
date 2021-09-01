import * as HExportVars from './HExportVars.mjs';
import * as HFunction from './HFunction.mjs';
import * as HClass from './HClass.mjs';

const reBeginComment = /^.*?\/\*(.(?!\*\/))*$/;
const reEndComment = /^.*?\*\/(.(?!\/\*))*$/;
let comment = false;

export function processFile(lines, module) {
	for ( const line of lines ) {
		if ( line.match(reBeginComment) ) comment = true;
		if ( line.match(reEndComment) ) comment = false;
		if ( ! comment ) {
			HFunction.process(line, module);
			HExportVars.process(line, module);
			HClass.process(line, module);
		}
	}
}
