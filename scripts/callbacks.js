/*************************************************************************************
*																					 *
* HTTP REQUEST CALLBACKS - 13      													 *
*																					 *
*************************************************************************************/

// Fills the manual data for the given airline with the template and date selected
function fillSpecifiedAirline(response) {
	var airlineCode = $('.active span').html();
	var template = $('#template-dropdown').val();
	CURRENT_TEMPLATE[airlineCode] = template;
	CURRENT_INITIAL_TEMPLATE = template;
	var date = $('#datepicker').val();
	if (response !== null && response !== 'null' && KEEP_GOING) {
		var documents = $.parseJSON(response);
		for (var i = documents.length - 1; i >= 0 && KEEP_GOING; i--) {
			var currentDocument = documents[i];
			var airlines = currentDocument['data'];
			for (var j = 0; j < airlines.length; j++) {
				var currentAirline = airlines[j];
				if (currentAirline['AirlineCode'] == airlineCode && currentAirline['Template'] == template) {
					var milliseconds = currentDocument['_ts'];
					$('#option-headers .updated-date-time').html(getDate(milliseconds));
					setGlobals(airlineCode, currentAirline);
					KEEP_GOING = false;
				}
			}
		}
		switchAirlineData(airlineCode);
		// Sets the values of the dropdowns, so user can switch again from that state
		if (KEEP_GOING) {
			KEEP_GOING = false;
			$('#template-dropdown').prop('value', template);
			$('#datepicker').prop('value', date);
			createAndDisplayModal('noTempModal', 'No data available', 'Data for this template on selected date has not yet been created. Most recent submission of selected template will display.', function() {
				getAllDocuments(fillSpecifiedAirline);
			});
		} else {
			KEEP_GOING = true;
		}
	} else {
		KEEP_GOING = true;
		$('#datepicker').val(convertToDisplayDate(new Date($('#datepicker').val())));
		createAndDisplayModal('noDocsModal', 'No data available', 'No documents found. The default template will be used.', getTemplates);
	}
	$('#option-headers div').removeClass('loader');
}

// Gets the most recent document
function fillManualData(response) {
	if (response !== null && response !== 'null') {
		var result = $.parseJSON(response);
		var latestDocument = result[result.length - 1];
		var airlines = latestDocument['data'];
		var milliseconds = latestDocument['_ts'];
		$('#option-headers .updated-date-time').html(getDate(milliseconds));
		FINAL_JSON_DOCUMENT['data'] = airlines;
		for (var i = 0; i < airlines.length; i++) {
			var currentAirline = airlines[i];
			var airlineCode = currentAirline['AirlineCode'];
			setGlobals(airlineCode, currentAirline);
		}
		switchAirlineData('AS');
	} else {
		createAndDisplayModal('noDocsModal', 'No data available', 'No documents found in the database. The default template will be used.');
		getTemplates();
	}
}

// Fills in the global metrics object
function fillMetrics(response) {
    if (response !== null && response !== 'null') {
        var metrics = $.parseJSON(response);
        for (var i = 0; i < metrics.length; i++) {
            var metricArray = {};
            var metric = metrics[i];
            var airlineCode = metric['Airline'].trim(); // OO
            metricArray['A0'] = metric['A0'];
            metricArray['A4'] = metric['A4'];
            metricArray['A14'] = metric['A14'];
            metricArray['A30'] = metric['A30'];
            metricArray['D0'] = metric['D0'];
            metricArray['D14'] = metric['D14'];
            metricArray['B0'] = metric['B0'];
            metricArray['B4'] = metric['B4'];
            metricArray['B14'] = metric['B14'];
            AIRLINE_METRICS[airlineCode] = metricArray;
            $('#metrics-header .updated-date-time').html(getDate());
        }
        switchMetrics('AS');
    }
}

// Loads the initial template into the page if there is no previous data
function useInitialTemplate(response) {
	response = $.parseJSON(response); // response is an array of size 1
	var templates = response[0]['templates'];
	var airlinesInSelectedTemplate = templates[CURRENT_INITIAL_TEMPLATE];
	var airlineCode = $('.active span').html();
	for (airline in airlinesInSelectedTemplate) {
		if (AIRLINE_MANUAL_DATA[airline] == null) {
			AIRLINE_MANUAL_DATA[airline] = airlinesInSelectedTemplate[airline];
		}
	}
		AIRLINE_MANUAL_DATA[airlineCode] = airlinesInSelectedTemplate[airlineCode];
	fillInFields(airlineCode);
}