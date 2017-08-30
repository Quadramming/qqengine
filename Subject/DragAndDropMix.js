QQ.Subject.DragAndDropMix = base => class DragAndDropMix extends base {
	
	constructor(app, options = {}) {
		super(app, options);
		this._sz         = app.getSz();
		this._camera     = this._sz.getCamera();
		this.dragAndDrop = {
			isDraging: false,
			x:         0,
			y:         0
		};
	}
	
	onClickDown(x, y) {
		super.onClickDown();
		let subjPoint              = this.worldToLocalPoint(x, y);
		this.dragAndDrop.isDraging = true;
		this.dragAndDrop.x         = subjPoint.x;
		this.dragAndDrop.y         = subjPoint.y;
	}
	
	onClickUp() {
		super.onClickUp();
		this.onDrop();
		this.dragAndDrop.isDraging = false;
	}
	
	onDrop() {
	}
	
	tick() {
		super.tick();
		if ( this.dragAndDrop.isDraging ) {
			if ( this._app.isMouseInCanvas() && this._sz.isClicked() ) {
				let mouse    = this._app.getMouseXY();
				let position = this._camera.getWorldPoint(mouse.x, mouse.y);
				let subjPos  = this.getPosition();
				let deltaX   = position.x - subjPos.x - this.dragAndDrop.x;
				let deltaY   = position.y - subjPos.y - this.dragAndDrop.y;
				this.addPosition(deltaX, deltaY);
			} else {
				this.onClickUp();
				this.dragAndDrop.isDraging = false;
			}
		}
	}
	
};
