QQ.ObjectPool = class ObjectPool {
	
		constructor(constructor, amount, increment = 10) {
			this._increment = increment;
			this._free = [];
			this._pool = [];
			this._constructor = constructor;
			this._grow(amount);
		}
		
		_grow(amount = this._increment) {
			const size = this._pool.length;
			for ( let i = 0; i < amount; ++i ) {
				this._free.push(size + i);
				const obj = this._constructor();
				this._pool.push(obj);
				if ( obj.construct ) {
					obj.construct();
				}
			}
		}
		
		get() {
			if ( this._free.length === 0 ) {
				this._grow();
			}
			const index = this._free.pop();
			return this._pool[index];
		}
		
		release(obj) {
			if ( obj.destruct ) {
				obj.destruct();
			}
			const index = this._pool.indexOf(obj);
			if ( index !== -1 ) {
				this._free.push(index);
			}
		}
		
		debug() {
			c(this._free);
			c(this._free.length);
			c(this._pool.length);
			c("================================");
		}
		
};
