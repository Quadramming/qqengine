QQ.Debug     = {
	log(str) {
		console.log(str);
	}
};

let c = function(str) {
	QQ.Debug.log(str);
};

c('Using QQ.Debug:');
c('function c(str) - Quick log');

/* Get all created globals
<script>
	var start = Object.getOwnPropertyNames(window);
</script>
<script>
	console.log(
		Object.getOwnPropertyNames(window).filter( function(n) {
			return start.indexOf(n) === -1;
		})
	);
</script>
*/
