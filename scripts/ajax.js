/*************************************************************************************
*																					 *
* AJAX CALLS - 11     												  	             *
*																					 *
*************************************************************************************/

define(['requests', 'callbacks'], function(requests, callbacks) {
	// Gets all the documents in the database
	function getAllDocuments(callback) {
	    requests.getRequest('/RestClient/GetAllDocuments', callback);
	}

	// Gets the most recent document
	function getLastUpdatedDocument() {
		requests.getRequest('/RestClient/GetAllDocuments', callbacks.fillManualData);
	}

	// Gets historical documents based on date
	function getHistoricalDocument() {
		$('#option-headers div').addClass('loader');
		var date = $('#datepicker').val();
		var filter = '&filter=all';
		getMostRecentDocument('date=' + date + filter);
	}

	// Gets the document by date
	function getMostRecentDocument(date) {
		requests.getRequest('/RestClient/GetMostRecentDocument', callbacks.fillSpecifiedAirline, date);
	}

	// Gets the airline metrics
	function getAirlineMetrics() {
	    requests.getRequest('/RestClient/GetAirlineMetrics', callbacks.fillMetrics);
	}

	// Gets the templates
	function getTemplates() {
		requests.getRequest('/RestClient/GetTemplates', callbacks.useInitialTemplate);
	}

	// Posts the document to the database
	function postDocument(jsonData) {
		requests.postRequest('RestClient/Post', jsonData);
	}

	return {
		getAllDocuments: getAllDocuments,
		getLastUpdatedDocument: getLastUpdatedDocument,
		getHistoricalDocument: getHistoricalDocument,
		getMostRecentDocument: getMostRecentDocument,
		getAirlineMetrics: getAirlineMetrics,
		getTemplates: getTemplates,
		postDocument: postDocument
	};
});
