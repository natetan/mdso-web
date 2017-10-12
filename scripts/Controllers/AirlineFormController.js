define(['Models/AirlineForm', 'Models/AirlineFormField', 'Views/AirlineFormView'], function(AirlineForm, AirlineFormField, AirlineFormView) {

	function displayFields(response) {
		if (response !== null && response !== 'null') {
			response = $.parseJSON(response);
			var latestDocument = result[result.length - 1];
			var airlines = latestDocument['data'];
			var milliseconds = latestDocument['_ts'];








			$('#option-headers .updated-date-time').html(helpers.getDate(milliseconds));
			FINAL_JSON_DOCUMENT['data'] = airlines;
			for (var i = 0; i < airlines.length; i++) {
				var currentAirline = airlines[i];
				var airlineCode = currentAirline['AirlineCode'];
				helpers.setGlobals(airlineCode, currentAirline);
			}
			helpers.switchAirlineData('AS');
		} else {
			helpers.createAndDisplayModal('noDocsModal', 'No data available', 'No documents found in the database. The default template will be used.');
			require('ajax').getTemplates();
		}
	}
});