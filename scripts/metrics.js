/*************************************************************************************
*																					 *
* FUNCTIONS - METRICS - 7     											             *
*																					 *
*************************************************************************************/

define(function() {
    // Switches the metrics based on the airlineCode provided
    function switchMetrics(airlineCode) {
        var metrics = AIRLINE_METRICS[airlineCode];
        if (metrics !== null && airlineCode !== 'KS') {
            $('#metrics-area').removeClass('hide');
            var metricsArea = $('#metrics-data');
            metricsArea.html('');
            var count = 0;
            for (metric in metrics) {
                var $metricsObjectDiv = $(document.createElement('div'));
                var $metricsTypeSpan = $(document.createElement('span'));
                var $metricsPercentSpan = $(document.createElement('span'));
                // var $metricsGoalSpan = $(document.createElement('span'));

                $metricsObjectDiv.addClass('metrics-object');
                $metricsTypeSpan.addClass('metric-type');
                $metricsPercentSpan.addClass('metric-percent');
                // $metricsGoalSpan.addClass('metric-goal');

                $metricsTypeSpan.html(Object.keys(metrics)[count]);
                $metricsPercentSpan.html(metrics[metric] + '%');
                // $metricsGoalSpan.data('goal', 75);
                // $metricsGoalSpan.html('(' + $metricsGoalSpan.data('goal') + '%)');

                $metricsObjectDiv.append($metricsTypeSpan);
                $metricsObjectDiv.append('<br>');
                $metricsObjectDiv.append($metricsPercentSpan);
                $metricsObjectDiv.append('<br>');
                // $metricsObjectDiv.append($metricsGoalSpan);

                metricsArea.append($metricsObjectDiv);
                count++;
            }
            var metricObjs = $('.metrics-object');
            var length = metricObjs.length;
            var width = Math.round(100 / length);
            metricObjs.css({
                'width': width + '%'
            });

            // colorTheMetrics();
        } else {
            $('#metrics-area').addClass('hide');
        }
        $('#metrics-header .loader').removeClass('loader');
    }

    // Colors the metrics green or red depending on the goal status
    function colorTheMetrics() {
        var metricObjects = $('#metrics-data .metrics-object');
        for (var i = 0; i < metricObjects.length; i++) {
            var currentMetric = $(metricObjects[i]);

            var metricPercentElement = currentMetric.find('.metric-percent');
            var text = metricPercentElement.html();
            var metricPercent = parseFloat(text);

            var goalPercent = parseFloat(currentMetric.find('.metric-goal').data('goal'));
            metricPercentElement.html(metricPercent + '%');

            if (metricPercent >= goalPercent) {
                metricPercentElement.css({
                    'color': '#48850b'
                });
            } else {
                metricPercentElement.css({
                    'color': '#cb391f'
                });
            }
        }
    }

    return {
        switchMetrics: switchMetrics
    }
});
