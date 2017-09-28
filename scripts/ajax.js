/*************************************************************************************
*																					 *
* AJAX CALLS - 11     												  	             *
*																					 *
*************************************************************************************/

// Gets all the documents in the database
function getAllDocuments(callback) {
    getRequest('/RestClient/GetAllDocuments', callback);
}

// Gets the most recent document
function getLastUpdatedDocument() {
	getRequest('/RestClient/GetAllDocuments', fillManualData);
}

// Gets the document by date
function getMostRecentDocument(date) {
	getRequest('/RestClient/GetMostRecentDocument', fillSpecifiedAirline, date);
}

// Gets the airline metrics
function getAirlineMetrics() {
    getRequest('/RestClient/GetAirlineMetrics', fillMetrics);
}

// Gets the templates
function getTemplates() {
	getRequest('/RestClient/GetTemplates', useInitialTemplate);
}

// Posts the document to the database
function postDocument(jsonData) {
	postRequest('RestClient/Post', jsonData);
}