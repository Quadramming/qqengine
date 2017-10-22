QQ.Subject.DragAndDropMix = base => class DragAndDropMix extends base {
	
	constructor(options) {
		super(options);
		this._input      = null;
		this._dragAndDrop = {
			isDraging: false,
			point:     new QQ.Point(NaN)
		};
	}
	
	setWorld(world) {
		super.setWorld(world);
		this._input = this._world.getInput();
	}
	
	onClickDown(point) {
		super.onClickDown(point);
		this._dragAndDrop.isDraging = true;
		this._dragAndDrop.point.copy(
			this.worldToLocalPoint(point)
		);
	}
	
	onClickUp(point) {
		super.onClickUp(point);
		this.onDrop();
		this._dragAndDrop.isDraging = false;
	}
	
	onDrop() {
	}
	
	tick(delta) {
		super.tick(delta);
		if ( this._dragAndDrop.isDraging ) {
			if ( this._input.isClicked() ) {
				const DnD   = this._dragAndDrop;
				const point = this._input.getWorldPoint();
				this.setPosition( new QQ.Point(
					point.x() - DnD.point.x(),
					point.y() - DnD.point.y(),
				));
			} else {
				this.onClickUp();
				this._dragAndDrop.isDraging = false;
			}
		}
	}
	
};
