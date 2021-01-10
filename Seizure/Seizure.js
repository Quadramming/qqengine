// QQDOC

import * as QQ from '../QQ.js';
import {ScrollMix} from './ScrollMix.js';
import {InputMix} from './InputMix.js';
import {SeizureBase} from './SeizureBase.js';

export class Seizure extends
	QQ.mixins(ScrollMix, InputMix, SeizureBase)
{
}
