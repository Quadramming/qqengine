// QQDOC

export class FpsCounter {
	
	#details = false;
	#accumDelta = 0;
	#accumFps = 0;
	#fpsToShow = 0;
	#iSlot = 0;
	#maxSlots = 10;
	#font = '10px defaultFont';
	#slots = [];
	
	toggleShow() {
		this.#details = ! this.#details;
	}
	
	tick(delta) {
		this.#slots[this.#iSlot] = Math.floor(1/delta);
		this.#iSlot = (this.#iSlot+1) % this.#maxSlots;
		++this.#accumFps;
		this.#accumDelta += delta;
		if ( this.#accumDelta > 1 ) {
			this.#fpsToShow = this.#accumFps;
			this.#accumFps = 0;
			this.#accumDelta = 0;
		}
	}
	
	show(ctx) {
		if ( this.#details ) {
			ctx.setTransform(1, 0, 0, 1, 0, 0, 0);
			ctx.font = this.#font;
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'center';
			let i = 0;
			for ( const slot of this.#slots ) {
				ctx.fillStyle = 'green';
				if ( slot > 60 ) {
					ctx.fillStyle = 'white';
				}
				if ( slot < 25 ) {
					ctx.fillStyle = 'yellow';
				}
				if ( slot < 15 ) {
					ctx.fillStyle = 'red';
				}
				ctx.fillText( slot + ' FPS', 20, 20 + 15*i);
				++i;
			}
			// document.title = this.#fpsToShow + ' FPS';
		}
	}
	
}
