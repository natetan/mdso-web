/*************************************************************************************
*																					 *
* EVENT HANDLERS - 3       													         *
*																					 *
*************************************************************************************/

define(['helpers', 'buttons', 'tabs', 'ajax'], function(helpers, buttons, tabs, ajax) {

	function init() {
		// Alerts the user when they reload to see if they want to reload
		$('#form-group').data('serialize', $('#form-group').serialize()); // On load save form current state
		$(window).on('beforeunload', function(e) {
			if ($('#form-group').serialize() != $('#form-group').data('serialize')) {
		        return 'Changes you make can be lost';
		    } else {
		        e = null; // i.e; if form state change show warning box, else don't show it.
		    }
		});

		// Date for the current metrics
		$('#metrics-header .updated-date-time').html(helpers.getDate());

		// Date for the date label
		$('#option-headers .updated-date-time').html('No report found');

		// Verify the fields
		$('#positive-button').on('click', buttons.verify);

		// Sets positive button into original state
		$('#negative-button').on('click', buttons.cancel);

		// Submit button
		$('#submit-button').on('click', buttons.submit);

		$('#template-dropdown').on('change', helpers.getHistoricalDocument);

		// Changes the document based on the selected date
		$('#datepicker').on('change', helpers.getHistoricalDocument);
		// Sets the jqueryui datepicker to the input
		var datepicker = $('#datepicker').datepicker();
		// $('#datepicker').datepicker('option', 'dateFormat', 'm/dd/yy');
		$('#datepicker').val(helpers.convertToDisplayDate(new Date()));
		// Sets the datepicker input area to be readonly
		$('#datepicker').prop('readOnly', true);

		// Updates which airline tab is selected
		$('.tab-item').on('click', tabs.updateActive);

		// Sets max character limit for text area
		$('textarea').prop('maxLength', 256);
	}

	function loadInitialFunctions() {
		ajax.getAirlineMetrics();
		ajax.getLastUpdatedDocument();
		helpers.disableFields();
	}
	
	return {
		init: init,
		loadInitialFunctions: loadInitialFunctions
	}
});