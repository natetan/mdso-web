define(['Models/Metric', 'Models/AirlineMetrics','Views/AirlineMetricsView'], function(Metric, AirlineMetrics, AirlineMetricsView) {
	function fillMetricsObject(response, airlineCode) {
		if (response !== null && response !== 'null') {
			response = $.parseJSON(response);
			for (var i = 0; i < response.length; i++) {
				var currentMetric = response[i];
				var currentAirline = currentMetric['Airline'].trim();
				var airlineMetricsObject;
				var metricsArray = [
					new Metric('A0', currentMetric['A0']),
					new Metric('A4', currentMetric['A4']),
		            new Metric('A14', currentMetric['A14']),
		            new Metric('A30', currentMetric['A30']),
		            new Metric('D0', currentMetric['D0']),
		            new Metric('D14', currentMetric['D14']),
		            new Metric('B0', currentMetric['B0']),
		            new Metric('B4', currentMetric['B4']),
		            new Metric('B14', currentMetric['B14'])
				];
				airlineMetricsObject = new AirlineMetrics(metricsArray);
				CURRENT_METRICS[currentAirline] = airlineMetricsObject;
			}
		}
		var metricsToShow = $.parseJSON(CURRENT_METRICS[airlineCode]);
		AirlineMetricsView.render(metricsToShow, airlineCode);
	}

	return {
		fillMetricsObject: fillMetricsObject
	}
});