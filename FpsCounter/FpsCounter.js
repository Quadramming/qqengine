QQ.FpsCounter = class FpsCounter {
	
	constructor() {
		this._accumDelta  = 0;
		this._accumFps    = 0;
		this._fpsToShow   = 0;
		this._iSlot       = 0;
		this._maxSlots    = 10;
		this._details     = false;
		this._slots       = [];
		this._font        = '10px defaultFont';
	}

	showDetails() {
		this._details = ! this._details;
	}
	
	tick(delta) {
		this._slots[this._iSlot] = Math.floor(1/delta);
		this._iSlot = (this._iSlot+1) % this._maxSlots;
		++this._accumFps;
		this._accumDelta += delta;
		if ( this._accumDelta > 1 ) {
			this._fpsToShow  = this._accumFps;
			this._accumFps   = 0;
			this._accumDelta = 0;
		}
	}
	
	show(ctx) {
		if ( this._details ) {
			ctx.setTransform(1, 0, 0, 1, 0, 0, 0);
			ctx.font         = this._font;
			ctx.textBaseline = 'middle'; 
			ctx.textAlign    = 'center'; 
			let i = 0;
			for ( let slot of this._slots ) {
				ctx.fillStyle = 'green';
				if ( slot > 99 ) {
					ctx.fillStyle = 'white';
				}
				if ( slot < 55 ) {
					ctx.fillStyle = 'yellow';
				}
				if ( slot < 50 ) {
					ctx.fillStyle = 'red';
				}
				ctx.fillText( slot + ' FPS', 20, 20 + 15*i);
				++i;
			}
			document.title = this._fpsToShow + ' FPS';
		}
	}
	
};
