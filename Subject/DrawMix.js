// QQDOC

export function DrawMix(base) {
	return class DrawMix extends base {
		
		#bgColor; // Background color
		#doDebugDraw; // Draw debug shapes
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#bgColor = options.bgColor ?? null;
			this.#doDebugDraw = options.doDebugDraw ?? false;
		} // void
		
		draw(wcontext) {
			if ( this.#bgColor ) {
				this.#drawBgColor(wcontext);
			}
			this.forSubjects( subj => subj.draw(wcontext) );
			if ( this.#doDebugDraw ) {
				this.drawWorldBorder(wcontext);
				this.drawLocalBorder(wcontext);
				this.drawCenter(wcontext);
			}
		} // void
		
		drawWorldBorder(wcontext) {
			wcontext.cleanTransform();
			const rect = this.getBounds();
			const context = wcontext.get();
			context.beginPath();
			context.rect(
				rect.x(),
				rect.y(),
				rect.w(),
				rect.h()
			);
			context.lineWidth = 0.1;
			context.strokeStyle = '#FF00FF';
			context.stroke();
		} // void
		
		drawLocalBorder(wcontext) {
			wcontext.transform( this.getMatrix() );
			const rect = this.getLocalRect();
			const context = wcontext.get();
			context.beginPath();
			context.rect(
				rect.x(),
				rect.y(),
				rect.w(),
				rect.h()
			);
			context.lineWidth = 0.1;
			context.strokeStyle = '#0000FF';
			context.stroke();
		} // void
		
		drawCenter(wcontext) {
			wcontext.cleanTransform();
			let point = this.localToWorld(Point.ZERO());
			const context = wcontext.get();
			context.beginPath();
			context.arc(point.x(), point.y(), 0.1, 0, 2 * Math.PI);
			context.lineWidth = 0.05;
			context.strokeStyle = '#0000FF';
			context.stroke();
		} // void
		
		#drawBgColor(wcontext) {
			wcontext.transform( this.getMatrix() );
			const context = wcontext.get();
			const rect = this.getLocalRect();
			context.fillStyle = this.#bgColor;
			context.fillRect(rect.x(), rect.y(), rect.w(), rect.h());
		} // void
		
		bgColor(color) { // {F} Set background color
			if ( color !== undefined ) {
				this.#bgColor = color;
			}
			return this.#bgColor;
		} // string
		
	}
}
