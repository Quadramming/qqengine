QQ.Touch = class Touch {
	
	constructor(mouse) {
		const point = new QQ.Point();
		
		const options = {
			capture: true,
			passive: false
		};
		
		window.addEventListener('touchstart', (e) => {
			const touchobj = e.touches[0];
			if ( QQ.isNumbers(touchobj.clientX, touchobj.clientY) ) {
				point.set(touchobj.clientX, touchobj.clientY);
				mouse.emulate(point, true);
			}
			e.preventDefault();
			return false;
		}, options);
		
		window.addEventListener('touchmove', (e) => {
			const touchobj = e.touches[0];
			if ( QQ.isNumbers(touchobj.clientX, touchobj.clientY) ) {
				point.set(touchobj.clientX, touchobj.clientY);
				mouse.emulate(point, true);
			}
			e.preventDefault();
			return false;
		}, options);
		
		window.addEventListener('touchend', (e) => {
			point.set(NaN);
			mouse.emulate(point, false);
			e.preventDefault();
			return false;
		}, options);
	}
	
};
