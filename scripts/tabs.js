/*************************************************************************************
*																					 *
* FUNCTIONS - TABS - 9     											                 *
*																					 *
*************************************************************************************/

define(['metrics', 'helpers'], function(metrics, helpers) {
    // Updates which tab gets set to active (highlighted)
    function updateActive() {
        if (IN_CREATE_STATE) {
            var tabs = $(this).siblings();
            tabs.removeClass('active');
            $(this).addClass('active');

            // Changes the header based on the airline
            var currentSpan = $('.active span');
            var airlineCode = currentSpan.html();
            var airlineName = currentSpan.attr('name');
            $('#airline-header span').html(airlineName + ' (' + airlineCode + ')');
            metrics.switchMetrics(airlineCode);
            helpers.switchAirlineData(airlineCode);
        } else {
        	// alert('You are in edit mode. Cannot perform action');
        	helpers.createAndDisplayModal('editModeModal', 'Unable to switch tabs', 'You are currently in edit mode. Please save or cancel before continuing.');
        }
    }

    return {
        updateActive: updateActive
    }
});