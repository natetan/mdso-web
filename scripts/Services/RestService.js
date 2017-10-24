define(['helpers'], function(helpers) {
	// Default parameters not used because they're not supported in IE
    function getRequest(url) {
    	getRequest(url, null);
    }

    // Makes a request to the url and performs a callback function
    function getRequest(url, passedData) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
            	return response;
            },
            data: passedData,
            error: function (req, err) {
                helpers.createAndDisplayModal('errorModal', 'Error loading data', JSON.parse(err));
            }
        });
    }

    // Posts a new document into the database
    function postRequest(url, jsonObject) {
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(jsonObject),
            success: function (data) {
                helpers.createAndDisplayModal('submitModal', 'Success!', 'Document successfully posted to database');
            },
            error: function (req, err) {
                helpers.createAndDisplayModal('errorModal', 'Error posting to database', JSON.parse(err));
            }
        });
    }

    // Gets all the documents in the database
	function getAllDocuments() {
	    return getRequest('/RestClient/GetAllDocuments');
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
		return getRequest('/RestClient/GetMostRecentDocument', date);
	}

	// Gets the airline metrics
	function getAirlineMetrics() {
	    return getRequest('/RestClient/GetAirlineMetrics');
	}

	// Gets the templates
	function getTemplates() {
		return getRequest('/RestClient/GetTemplates');
	}

	// Posts the document to the database
	function postDocument(jsonData) {
		postRequest('RestClient/Post', jsonData);
	}

    return {
        getAllDocuments: getAllDocuments,
		getHistoricalDocument: getHistoricalDocument,
		getMostRecentDocument: getMostRecentDocument,
		getAirlineMetrics: getAirlineMetrics,
		getTemplates: getTemplates,
		postDocument: postDocument
    };
});