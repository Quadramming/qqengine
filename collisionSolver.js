import * as CONST from '../../qqengine/CONST/index.js';

export function collisionSolver(a, b, value) {
	const aType = a.getSolidType();
	const bType = b.getSolidType();
	if ( aType === CONST.SOLID.SLIM || bType === CONST.SOLID.SLIM ) {
		// Nothing
	} else if ( aType === CONST.SOLID.STATIC ) {
		b.addPosition(value);
	} else if ( bType === CONST.SOLID.STATIC ) {
		a.addPosition(value.oposite());
	} else if ( aType === CONST.SOLID.DYNAMIC ) {
		const ratio = a.getSolidWeight()/(a.getSolidWeight() + b.getSolidWeight());
		
		const aOffset = value.clone();
		aOffset.x( aOffset.x()*ratio );
		aOffset.y( aOffset.y()*ratio );
		b.addPosition(aOffset);
		
		const bOffset = value.cloneInverted();
		bOffset.x( bOffset.x()*(1-ratio) );
		bOffset.y( bOffset.y()*(1-ratio) );
		a.addPosition(bOffset);
	}
}
