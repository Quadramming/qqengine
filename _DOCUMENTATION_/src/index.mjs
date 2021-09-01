import './global.mjs';
import {output} from './output.mjs';
import {parse} from './parse.mjs';
import {processFile} from './processFile.mjs';

// const info = {classes: [], functions: new Map()};

parse('..', processFile);
output();
