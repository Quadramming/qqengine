import {HExportVars} from './HExportVars.mjs';
import {HFunction} from './HFunction.mjs';

export function processFile(lines, module) {
	for ( const line of lines ) {
		HFunction.process(line, module);
		HExportVars.process(line, module);
	}
}
