define(function() {

	// key = A14
	// value = 95
	function Metric(key, value) {
		this.key = key;
		this.value = value || 'N/A'
	}

	return Metric;
});