$(document).ready(function () {

    // Global Variable representing the final document
    var FINAL_JSON_DOCUMENT = {
        'data': []
    };

    var AIRLINE_MANUAL_DATA = {
    	'AS': null,
        'VX': null,
        'QX': null,
        'OO': null,
        'KS': null
    };

    // Keeps track of the array index for the JSON
    var TAB_INDEX = {
        'AS': 0,
        'VX': 1,
        'QX': 2,
        'OO': 3,
        'KS': 4
    };

    // Keeps track of verified forms
    var AIRLINES_VERIFIED = {
        'AS': false,
        'VX': false,
        'QX': false,
        'OO': false,
        'KS': false
    };

    // Fill in the data when a new tab is clicked
    var SAVED_VERIFIED_DATA = {
        'AS': null,
        'VX': null,
        'QX': null,
        'OO': null,
        'KS': null
    };

    // Airline Metrics
    var AIRLINE_METRICS = {
        'AS': null,
        'VX': null,
        'QX': null,
        'OO': null,
        'KS': null
    }

    var AIRLINE_TIMESTAMP = {
    	'AS': null,
        'VX': null,
        'QX': null,
        'OO': null,
        'KS': null
    }

    // Keeps track of the state of the positive button and fields
    var IN_CREATE_STATE = true;

    // Change to true to post to database
    // Otherwise, log posted document to console
    var REAL_POST = true;

    var USE_LIVE_DATA = true;

    getAirlineMetrics();
    getMostRecentDocument();
    disableFields();

    // Sets the date to today on start
    document.getElementById('date-dropdown').valueAsDate = new Date();

    $('#positive-button').bind({

        // Verifies the fields
        click: verifyFields
    });

    $('#negative-button').on('click', function() {
    	$('#positive-button span').html('CREATE NEW');
    	$('#positive-button').prop('disabled', false);
		IN_CREATE_STATE = true;
		$('textarea').prop('disabled', true);
		$(this).prop('disabled', true);
		fillInFields($('.active span').html());
    });

    // Submit button
    $('#submit-button').on('click', submit);

    // Date for the date label
    $('#updated-date-time').html(getDate());

    // Updates which airline tab is selected
    $('.tab-item').on('click', updateActive);

    // Sets max character limit for text area
    $('textarea').prop('maxLength', 256);

    // Textarea events
    $('textarea').bind({

        // Enables button when there is text input
        input: function () {
            $('#positive-button').prop('disabled', false);
        },

        // Prevents user typing in the character if it matches the regex
        keypress: function (e) {
            console.log('key press');
            e = e || window.event;
            var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
            var charStr = String.fromCharCode(charCode);

            // Regex here
            // var pattern = /^[a-zA-Z0-9!~`@#\$%\^\&*\)\(+=._-]+$/;
            if (isEmoji(charStr) /*|| !pattern.test(charStr)*/) {
                return false;
            }
        },

        // Prevents pasting emojis
        paste: function (e) {
            console.log('inside paste');
            var $currentTextArea = $(this);
            setTimeout(function () {
                var text = $currentTextArea.val();
                console.log('is emoji? ' + isEmoji(text));
                text = replaceEmojis(text, '\ufffd');
                $currentTextArea.prop('value', text);
            }, 10);

            // This prevents the user from pasting
            // e.preventDefault();

        }
    });

    // Alerts the user when they reload to see if they want to reload
    $('#form-group').data('serialize', $('#form-group').serialize()); // On load save form current state
    $(window).bind({
        beforeunload: function (e) {
            if ($('#form-group').serialize() != $('#form-group').data('serialize')) {
                return true;
            } else {
                e = null; // i.e; if form state change show warning box, else don't show it.
            }
        }
    });

    // Disables the textarea fields
    function disableFields() {
    	$('textarea').prop('disabled', true);
    }

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

            switchMetrics(airlineCode);
            switchTimeStamp(airlineCode);
            fillInFields(airlineCode);
        } else {
        	alert('You are in edit mode. Cannot perform action');
        }
    }

    // Fills in the fields with the data they're verified with
    function fillInFields(airlineCode) {
    	var fields = null;

    	if (USE_LIVE_DATA) {
    		fields = AIRLINE_MANUAL_DATA[airlineCode];
    	} else {
        	fields = SAVED_VERIFIED_DATA[airlineCode];
        }

        if (fields != null) {
            for (var i = 0; i < fields.length; i++) {
                $('textarea[name=' + fields[i]['FieldKey'] + ']').prop('value', fields[i]['FieldValue']);
            }
        } else {
            $('textarea').prop('value', '');
        }
        $('#option-headers .loader').removeClass('loader');
    }

    // Returns false when fields are not empty and user attempts to 
    function fieldsValidated() {
        if (!fieldsAreEmpty() && $('#positive-button').is(':disabled') === false) {
            alert('You have not validated your data yet.');
            return false;
        } else {
            return true;
        }
    }

    // Checks if any fields are empty
    function fieldsAreEmpty() {
        var textareas = $('textarea');
        var result = '';
        for (var i = 0; i < textareas.length; i++) {
            result += textareas[i].value;
        }
        return result === '';
    }

    // Checks if fields are verified
    function verifyFields() {
    	var textareas = $('textarea');

    	// If the create button is enabled, textfields should still be disabled
    	if (IN_CREATE_STATE) {
    		$(this).prop('disabled', true);
    		$('#positive-button span').html('SAVE');
    		IN_CREATE_STATE = false;
    		textareas.prop('disabled', false);
    		console.log('verify clicked');
    		$('#negative-button').prop('disabled', false);
    	} else {
    		$('#positive-button span').html('CREATE NEW');
    		IN_CREATE_STATE = true;
    		textareas.prop('disabled', true);

	        var date = new Date();
	        var airlineCode = $('.active span').html();
	        var jsonObject = {
	            'Status': 0,
	            'AirlineCode': airlineCode,
	            'Timestamp': getDate(),
	            'UserId': 'BATCH',
	            'ManualDataList': []
	        };
	        var errorMessage = 'Fields not verified:\n\n';
	        var isValid = true;
	        for (var i = 0; i < textareas.length; i++) {
	            var $this = $(textareas[i]);
	            var name = $this.attr('name');
	            var value = $this.val();
	            if (value === null || value === '' || value === undefined) {
	                errorMessage += name + '\n';
	                isValid = false;
	            }
	            AIRLINES_VERIFIED[airlineCode] = true;
	            var newJsonField = {};
	            newJsonField['FieldName'] = $this.parent().find('label').html();
	            newJsonField['FieldKey'] = name;
	            newJsonField['FieldValue'] = value;
	            jsonObject['ManualDataList'].push(newJsonField);
	        }
	        // if (!isValid) {
	        //     alert('Not all fields are complete');
	        // } else {

	            // This ensures that the data is pushed to the right tab, and prevents duplicates by replacing the old data
	            FINAL_JSON_DOCUMENT['data'][TAB_INDEX[airlineCode]] = jsonObject;

	            $('.active div').addClass('check-mark-image');

	            if (USE_LIVE_DATA) {
	            	AIRLINE_MANUAL_DATA[airlineCode] = jsonObject['ManualDataList'];
	            } else {
	            	SAVED_VERIFIED_DATA[airlineCode] = jsonObject['ManualDataList'];
	            }

	            // console.log(JSON.stringify(SAVED_VERIFIED_DATA, null, ' '));

	            // Enables submit button if everything is verified
	            // if (everythingIsVerified()) {
	                $('#submit-button').prop('disabled', false);
	            // }
	            // console.log('AirlineStatus: ' + JSON.stringify(jsonObject, null, ' '));
	        // }
	    }
    }

    // Checks if every airline is verified
    function everythingIsVerified() {
        var verified = true;
        for (var airline in AIRLINES_VERIFIED) {
            if (AIRLINES_VERIFIED[airline] === false) {
                verified = false;
            }
        }
        return verified;
    }

    // Checks if the text is an emoji
    function isEmoji(text) {
        var unifiedEmojiRanges = [
            '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
        ];
        var reg = new RegExp(unifiedEmojiRanges.join('|'), 'g');

        return reg.test(text);
    }

    // Replaces the emojis with the given replacer
    function replaceEmojis(text, replacer) {
        var unifiedEmojiRanges = [
            '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
        ];
        var reg = new RegExp(unifiedEmojiRanges.join('|'), 'g');
        return text.replace(reg, replacer);
    }

    // Returns a string representation of the date in the format [day month year hh:mm:ss AM/PM]
    function getDate(milliseconds = null) {
    	var formattedDate;
    	if (milliseconds == null) {
        	formattedDate = new Date();
        } else {
        	formattedDate = new Date(0);
        	formattedDate.setUTCSeconds(milliseconds);
        }
        return formattedDate.toDateString() + ' ' + formattedDate.toLocaleTimeString();
    }

    // Submits the document as a whole to the database
    function submit() {
    	if (REAL_POST) {
    		postDocument(FINAL_JSON_DOCUMENT);
    		removeCheckMarks();
    	} else {
	        console.log(JSON.stringify(FINAL_JSON_DOCUMENT, null, ' '));
	        alert('Posted document is in the console');
	    }
        $(this).prop('disabled', true);
    }

    function removeCheckMarks() {
    	for (var airline in AIRLINES_VERIFIED) {
        	AIRLINES_VERIFIED[airline] = false;
        	var id = '#check-mark-' + airline;
			$(id).removeClass('check-mark-image');
        }
    }

    // Makes a request to the url and performs a callback function
    function request(url, callback) {
        $.ajax({
            url: url,
            type: 'GET',
            success: callback,
            error: function (req, err) {
                console.log('Error: ' + JSON.parse(err));
            }
        })
            .done(function () {
                console.log('done');
            })
            .always(function () {
                console.log('complete');
            });
    }

    function switchTimeStamp(airlineCode) {
    	$('#updated-date-time').html(AIRLINE_TIMESTAMP[airlineCode]);
    }

    // Switches the metrics based on the airlineCode provided
    function switchMetrics(airlineCode) {
        var metrics = AIRLINE_METRICS[airlineCode];
        if (metrics !== null) {
	        var metricsArea = $('#metrics-data');
	        metricsArea.html('');
	        var count = 0;
	        for (metric in metrics) {
	            var $metricsObjectDiv = $(document.createElement('div'));
	            var $metricsTypeSpan = $(document.createElement('span'));
	            var $metricsPercentSpan = $(document.createElement('span'));
	            var $metricsGoalSpan = $(document.createElement('span'));

	            $metricsObjectDiv.addClass('metrics-object');
	            $metricsTypeSpan.addClass('metric-type');
	            $metricsPercentSpan.addClass('metric-percent');
	            $metricsGoalSpan.addClass('metric-goal');

	            $metricsTypeSpan.html(Object.keys(metrics)[count]);
	            $metricsPercentSpan.html(metrics[metric]);
	            $metricsGoalSpan.data('goal', 87);
	            $metricsGoalSpan.html('(' + $metricsGoalSpan.data('goal') + '%)');

	            $metricsObjectDiv.append($metricsTypeSpan);
	            $metricsObjectDiv.append('<br>');
	            $metricsObjectDiv.append($metricsPercentSpan);
	            $metricsObjectDiv.append('<br>');
	            $metricsObjectDiv.append($metricsGoalSpan);

	            metricsArea.append($metricsObjectDiv);
	            count++;
	        }
	        var metricObjs = $('.metrics-object');
	        var length = metricObjs.length;
	        var width = Math.round(100 / length);
	        metricObjs.css({
	        	'width': width + '%'
	        });

	        colorTheMetrics();
	    }
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
        $('#metrics-header .loader').removeClass('loader');
    }

    /*************************************************************************************
    *																					 *
    * HTTP REQUESTS        													             *
    *																					 *
    *************************************************************************************/

    // Gets all the documents in the database
    function getDocuments() {
        request('/RestClient/GetAllDocuments', getAllDocuments);
    }

    // Gets the most recent document
    function getMostRecentDocument() {
    	request('/RestClient/GetAllDocuments', fillManualData);
    }

    // Gets the airline metrics
    function getAirlineMetrics() {
        request('/RestClient/getAirlineMetrics', fillMetrics);
    }

    /*************************************************************************************
    *																					 *
    * HTTP REQUEST CALLBACKS        													 *
    *																					 *
    *************************************************************************************/

    // Gets all the documents from the database
    function getAllDocuments(response) {
        if (response !== null) {
            alert('Get data is logged into the console.');
            console.log('Response: ' + response);
        }
    }

    // Gets the most recent document
    function fillManualData(response) {
    	if (response != null) {
    		var result = $.parseJSON(response);
    		var latestDocument = result[result.length - 1];
    		var airlines = latestDocument['data'];
    		var milliseconds = latestDocument['_ts'];
    		$('#updated-date-time').html(getDate(milliseconds))
    		FINAL_JSON_DOCUMENT['data'] = airlines;
    		for (var i = 0; i < airlines.length; i++) {
    			var currentAirline = airlines[i];
    			var airlineCode = currentAirline['AirlineCode'];

    			AIRLINE_TIMESTAMP[airlineCode] = currentAirline['Timestamp'];
    			AIRLINE_MANUAL_DATA[airlineCode] = currentAirline['ManualDataList'];

    			// var boolString = currentAirline['Verified'];
    			// var bool = false;
    			// if (boolString == 'True') {
    			// 	bool = true;
    			// }
    			// AIRLINES_VERIFIED[airlineCode] = bool;
    		}
    	}
    	// for (airline in AIRLINES_VERIFIED) {
    	// 	console.log(AIRLINES_VERIFIED[airline]);
    	// 	if (AIRLINES_VERIFIED[airline]) {
    	// 		var id = '#check-mark-' + airline;
    	// 		$(id).addClass('check-mark-image');
    	// 	}
    	// }
    	switchTimeStamp('AS');
    	fillInFields('AS');
    }

    // Fills in the global metrics object
    function fillMetrics(response) {
        if (response !== null) {
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
            }
        }
        switchMetrics('AS');
    }

    // Posts a new document into the database
    function postDocument(jsonObject) {
        console.log('Post was clicked');
        $.ajax({
            type: 'POST',
            url: '/RestClient/Post',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(jsonObject),
            success: function (data) {
                alert('Document posted!');
            },
            error: function (req, err) {
                console.log('Error: ' + JSON.parse(err));
            }
        });
    }
});
