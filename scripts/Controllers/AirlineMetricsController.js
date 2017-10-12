define(['Models/Metric', 'Models/AirlineMetrics','Views/AirlineMetricsView'], function(Metric, AirlineMetrics, AirlineMetricsView) {
	function displayMetrics(response, airlineCode) {
		if (response !== null && response !== 'null') {
			response = $.parseJSON(response);
			for (var i = 0; i < response.length; i++) {
				var currentMetric = response[i];
				var currentAirline = currentMetric['Airline'].trim();
				var airlineMetricsObject;
				if (currentAirline === airlineCode) {
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
					break;
				}
			}
		}
		airlineMetricsObject = JSON.parse(airlineMetricsObject);
		AirlineMetricsView.render(airlineMetricsObject, airlineCode);
	}

	return {
		displayMetrics: displayMetrics
	}
});