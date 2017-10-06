define(function() {

	// metrics is a json object
	function render(metrics, airlineCode) {
		if (metrics !== null && airlineCode !== 'KS') {
            $('#metrics-area').removeClass('hide');
            var metricsArea = $('#metrics-data');
            metricsArea.html('');
            var count = 0;
			for (metric in metrics) {
				var $metricsObjectDiv = $(document.createElement('div'));
	            var $metricsTypeSpan = $(document.createElement('span'));
	            var $metricsPercentSpan = $(document.createElement('span'));

	            $metricsObjectDiv.addClass('metrics-object');
	            $metricsTypeSpan.addClass('metric-type');
	            $metricsPercentSpan.addClass('metric-percent');

	            $metricsTypeSpan.html(metric.key);
	            $metricsPercentSpan.html(metric.value + '%');

	            $metricsObjectDiv.append($metricsTypeSpan);
	            $metricsObjectDiv.append('<br>');
	            $metricsObjectDiv.append($metricsPercentSpan);
	            $metricsObjectDiv.append('<br>');

	            metricsArea.append($metricsObjectDiv);
	            count++;
			}
			var metricObjs = $('.metrics-object');
            var length = metricObjs.length;
            var width = Math.round(100 / length);
            metricObjs.css({
                'width': width + '%'
            });
		} else {
			$('#metrics-area').addClass('hide');
		}
		$('#metrics-header .loader').removeClass('loader');
	}

	return {
		render: render
	}

});