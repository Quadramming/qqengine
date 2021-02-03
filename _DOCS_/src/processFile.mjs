import * as HExportVars from './HExportVars.mjs';
import * as HFunction from './HFunction.mjs';

export function processFile(lines, module) {
	for ( const line of lines ) {
		HFunction.process(line, module);
		HExportVars.process(line, module);
	}
}
