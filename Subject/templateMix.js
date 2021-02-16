import * as QQ from '../QQ.js';

function fixOptions(options) {
} // void

export function nameMix(base) {
	return class nameMix extends base {
		
		_var; // Protected field
		#variable; // no "=" allowed. It Should be in reset method
		#point = new Point(); // But can be allocation
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		destructor() { // {O}
			super.destructor();
		} // void
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			// Do reset
		} // void
		
	}
}

/*
constructor
destructor
init
reset
#reset
[static]
restart
tick
draw
onSomeThing
is
get
set
add
clean
delete
...
#private
field {F}
*/
