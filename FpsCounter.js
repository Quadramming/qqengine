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
	} // void
	
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
	} // void
	
	show(context) {
		if ( ! this.#details ) return;
		context.setTransform(1, 0, 0, 1, 0, 0, 0);
		context.font = this.#font;
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		let i = 0;
		for ( const slot of this.#slots ) {
			context.fillStyle = 'green';
			if ( slot > 60 ) {
				context.fillStyle = 'white';
			}
			if ( slot < 50 ) {
				context.fillStyle = 'yellow';
			}
			if ( slot < 40 ) {
				context.fillStyle = 'red';
			}
			if ( slot < 15 ) {
				context.fillStyle = 'black';
			}
			context.fillText( slot + ' FPS', 20, 20 + 15*i);
			++i;
		}
		document.title = `${this.#fpsToShow} FPS`;
	} // void
	
}
