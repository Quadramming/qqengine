QQ.Subject.DragAndDropMix = base => class DragAndDropMix extends base {
	
	constructor(sz, width, height) {
		super(sz.getApp(), width, height);
		this._sz     = sz;
		this._camera = sz.getCamera();
		this.dragAndDrop = {
			isDraging: false,
			x:         0,
			y:         0
		};
	}
	
	onClickDown(x, y) {
		super.onClickDown();
		let subjPoint = this.worldToLocalPoint(x, y);
		this.dragAndDrop.isDraging = true;
		this.dragAndDrop.x = subjPoint.x;
		this.dragAndDrop.y = subjPoint.y;
	}
	
	onClickUp() {
		super.onClickUp();
		this.dragAndDrop.isDraging = false;
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
				this.dragAndDrop.isDraging = false;
			}
		}
	}
	
};
