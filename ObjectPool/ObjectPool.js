QQ.ObjectPool = class ObjectPool {
		
		constructor(options) {
			this._free = [];
			this._pool = [];
			this._amount = QQ.default(options.amount, 10);
			this._increment = QQ.default(options.increment, 10);
			this._doCreate = options.create;
			this._doInitialize = options.initialize;
			this._doRelease = options.release;
			this.reset();
		}
		
		clean() {
			if ( this._doRelease ) {
				for ( const i in this._pool ) {
					if ( this._free.indexOf(i) === -1 ) {
							this._doRelease(this._pool[i]);
					}
				}
			}
			this._free.length = 0;
			this._pool.length = 0;
		}
		
		reset() {
			this.clean();
			this._grow(this._amount);
		}
		
		_grow(amount = this._increment) {
			const size = this._pool.length;
			for ( let i = 0; i < amount; ++i ) {
				this._free.push(size + i);
				const obj = this._doCreate();
				this._pool.push(obj);
			}
		}
		
		get(options) {
			if ( this._free.length === 0 ) {
				this._grow();
			}
			const index = this._free.pop();
			const obj = this._pool[index];
			if ( this._doInitialize ) {
				this._doInitialize(obj, options);
			}
			return obj;
		}
		
		release(obj) {
			if ( this._doRelease ) {
				this._doRelease(obj);
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
