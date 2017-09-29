/*************************************************************************************
*																					 *
* HTTP REQUESTS - 12     													         *
*																					 *
*************************************************************************************/

define(['helpers'], function(helpers) {


    // Default parameters not used because they're not supported in IE
    function getRequest(url, callback) {
    	getRequest(url, callback, null);
    }

    // Makes a request to the url and performs a callback function
    function getRequest(url, callback, passedData) {
        $.ajax({
            url: url,
            type: 'GET',
            success: callback,
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
                helpers.createAndDisplayModal('errorModal', 'Error loading data', JSON.parse(err));
            }
        });
    }

    return {
        getRequest: getRequest,
        postRequest: postRequest
    };
});