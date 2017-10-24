/*************************************************************************************
*																					 *
* AJAX CALLS - 11     												  	             *
*																					 *
*************************************************************************************/

define(['services/RestService'], function(client) {

	// Gets all the documents in the database
	function getAllDocuments(callback) {
	    var documents = client.getRequest('/RestClient/GetAllDocuments');
	    return $.parseJSON(documents);
	}

	// Gets historical documents based on date
	function getHistoricalDocument() {
		$('#option-headers div').addClass('loader');
		var date = $('#datepicker').val();
		var filter = '&filter=all';
		return getMostRecentDocument('date=' + date + filter);
	}

	// Gets the document by date
	function getMostRecentDocument(date) {
		var documents = client.getRequest('/RestClient/GetMostRecentDocument', date);
		return $.parseJSON(documents);
	}

	// Gets the airline metrics
	function getAirlineMetrics() {
	    var documents = client.getRequest('/RestClient/GetAirlineMetrics');
	    return $.parseJSON(documents);
	}

	// Gets the templates
	function getTemplates() {
		var documents = client.getRequest('/RestClient/GetTemplates');
		return $.parseJSON(documents);
	}

	// Posts the document to the database
	function postDocument(jsonData) {
		client.postRequest('RestClient/Post', jsonData);
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
