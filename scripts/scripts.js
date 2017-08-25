$(document).ready(function () {

	/*************************************************************************************
    *																					 *
    * GLOBAL VARIABLES       													         *
    *																					 *
    *************************************************************************************/

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

    var CURRENT_TEMPLATE = {
    	'AS': 0930,
        'VX': 0930,
        'QX': 0930,
        'OO': 0930,
        'KS': 0930
    }

    var CURRENT_DATE = {
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

    // True if using live data
    var USE_LIVE_DATA = true;

    /*************************************************************************************
    *																					 *
    * INITIAL ONLOAD FUNCTIONS       													 *
    *																					 *
    *************************************************************************************/

    getAirlineMetrics();
    getLastUpdatedDocument();
    disableFields();

    /*************************************************************************************
    *																					 *
    * EVENT HANDLERS        													         *
    *																					 *
    *************************************************************************************/

    // Alerts the user when they reload to see if they want to reload
    $('#form-group').data('serialize', $('#form-group').serialize()); // On load save form current state
    $(window).on('beforeunload', function(e) {
    	if ($('#form-group').serialize() != $('#form-group').data('serialize')) {
            return true;
        } else {
            e = null; // i.e; if form state change show warning box, else don't show it.
        }
    });

    // Sets the date to today on start


    // Date for the current metrics
    $('#metrics-header .updated-date-time').html(getDate());

    // Date for the date label
    $('#option-headers .updated-date-time').html(getDate());

    // Verify the fields
    $('#positive-button').on('click', verifyFields);

    // Sets positive button into original state
    $('#negative-button').on('click', cancel);

    // Submit button
    $('#submit-button').on('click', submit);

    $('#template-dropdown').on('change', getHistoricalDocument);

    // Changes the document based on the selected date
    $('#date-picker').on('change', getHistoricalDocument);
    $('#date-picker').datepicker();

    // Updates which airline tab is selected
    $('.tab-item').on('click', updateActive);

    // Sets max character limit for text area
    $('textarea').prop('maxLength', 256);



    /*************************************************************************************
    *																					 *
    * FUNCTIONS - VALIDATION        													 *
    *																					 *
    *************************************************************************************/

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

    /*************************************************************************************
    *																					 *
    * FUNCTIONS - BUTTONS        													     *
    *																					 *
    *************************************************************************************/

    // Cancel button functionality
    function cancel() {
    	$('#positive-button span').html('CREATE NEW');
    	$('#positive-button').prop('disabled', false);
		IN_CREATE_STATE = true;
		$('textarea').prop('disabled', true);
		$(this).prop('disabled', true);

		var airlineCode = $('.active span').html();
		fillInFields(airlineCode);
		enableDropdowns(true);
		$('#date-picker').val(CURRENT_DATE[airlineCode]);
    }

    // Submits the document as a whole to the database
    function submit() {
    	if (REAL_POST) {
    		postDocument(FINAL_JSON_DOCUMENT);
    		removeCheckMarks();
    	} else {
	        console.log(JSON.stringify(FINAL_JSON_DOCUMENT, null, ' '));
	        alert('Posted document is in the console');
	        createModal('submitModal', 'Success!', 'Document successfully posted to database');
	    }
        $(this).prop('disabled', true);
    }

    // Checks if fields are verified
    function verifyFields() {
    	var textareas = $('textarea');
    	document.getElementById('date-picker').valueAsDate = new Date();
    	// If the create button is enabled, textfields should still be disabled
    	if (IN_CREATE_STATE) {
    		$(this).prop('disabled', true);
    		$('#positive-button span').html('SAVE');
    		IN_CREATE_STATE = false;

    		textareas.prop('disabled', false);
    		$('#negative-button').prop('disabled', false);
    		$('.radio-button').prop('disabled', false);

    		enableDropdowns(false);
    	} else {
    		$('#positive-button span').html('CREATE NEW');

    		textareas.prop('disabled', true);
    		$('#negative-button').prop('disabled', true);
    		$('.radio-button').prop('disabled', true);

    		enableDropdowns(true);
    		IN_CREATE_STATE = true;

	        var date = new Date();
	        var airlineCode = $('.active span').html();
	        CURRENT_DATE[airlineCode] = $('#date-picker').val();
	        var jsonObject = {
	            'Status': 0,
	            'AirlineCode': airlineCode,
	            'Timestamp': getDate(),
	            'UserId': 'BATCH',
	            'Template': $('#template-dropdown').val(),
	            'ManualDataList': []
	        };

	        // Add radio button to json
	        var $greenRadio = $('#green-radio');
	        var $redRadio = $('#red-radio');
	        if ($greenRadio.length !== 0 || $redRadio.length !== 0) {
	        	var manualDataFields = {};
	        	manualDataFields['FieldName'] = $greenRadio.parent().find('label').first().html();
	        	manualDataFields['FieldKey'] = 'itss';
	        	manualDataFields['FieldValue'] = $greenRadio.is(':checked') ? $greenRadio.val() : $redRadio.val();
	        	jsonObject['ManualDataList'].push(manualDataFields);
	        }
	        for (var i = 0; i < textareas.length; i++) {
	            var $this = $(textareas[i]);
	            var name = $this.attr('name');
	            var value = $this.val();
	            AIRLINES_VERIFIED[airlineCode] = true;
	            var manualDataFields = {};
	            manualDataFields['FieldName'] = $this.parent().find('label').html();
	            manualDataFields['FieldKey'] = name;
	            manualDataFields['FieldValue'] = value;
	            jsonObject['ManualDataList'].push(manualDataFields);
	        }
            FINAL_JSON_DOCUMENT['data'][TAB_INDEX[airlineCode]] = jsonObject;

            $('.active div').addClass('check-mark-image');

            if (USE_LIVE_DATA) {
            	AIRLINE_MANUAL_DATA[airlineCode] = jsonObject['ManualDataList'];
            } else {
            	SAVED_VERIFIED_DATA[airlineCode] = jsonObject['ManualDataList'];
            }
            $('#submit-button').prop('disabled', false);
	    }
    }

    /*************************************************************************************
    *																					 *
    * FUNCTIONS - FIELDS        													     *
    *																					 *
    *************************************************************************************/

    // Disables the textarea fields
    function disableFields() {
    	$('textarea').prop('disabled', true);
    }

    // Fills in the fields with the data they're verified with
    function fillInFields(airlineCode) {
    	var fields = null;

    	if (USE_LIVE_DATA) {
    		fields = AIRLINE_MANUAL_DATA[airlineCode];
    	} else {
        	fields = SAVED_VERIFIED_DATA[airlineCode];
        }

        // Old style when there was already a predetermined amount of fields
        // This would find the fields by name and set their data dynamically
        // if (fields != null) {
        //     for (var i = 0; i < fields.length; i++) {
        //         $('textarea[name=' + fields[i]['FieldKey'] + ']').prop('value', fields[i]['FieldValue']);
        //     }
        // } else {
        //     $('textarea').prop('value', '');
        // }

        if (fields != null) {
        	var $formGroup = $('.form-group');
        	$formGroup.html('');
        	for (var i = 0; i < fields.length; i++) {
        		var currentField = fields[i];
        		var fieldName = currentField['FieldName'];
        		var fieldKey = currentField['FieldKey'];
        		var fieldValue = currentField['FieldValue'];

        		var $formSectionDiv = $(document.createElement('div'));
        		var $nameLabel = $(document.createElement('label'));

        		$nameLabel.addClass('labels');
        		$nameLabel.html(fieldName);

        		$formSectionDiv.addClass('form-sections');
        		$formSectionDiv.append($nameLabel);

        		// If it is it system status, use radio button instead
        		if (fieldKey.toLowerCase().trim() == 'itss' || fieldName.toLowerCase().trim() == 'it system status') {
        			var $br1 = $(document.createElement('br'));
        			var $br2 = $(document.createElement('br'));

        			var $inputGreen = $(document.createElement('input'));
        			var $inputRed = $(document.createElement('input'));

        			var $labelGreen = $(document.createElement('label'));
        			var $labelRed = $(document.createElement('label'));

        			var isGreen = false;
        			var isRed = false;

        			if (fieldValue.toLowerCase() == 'green') {
        				isGreen = true;
        			} else {
        				isRed = true;
        			}

        			$inputGreen.prop({
        				id: 'green-radio',
        				class: 'radio-button',
        				type: 'radio',
        				name: 'status',
        				value: 'green',
        				disabled: true,
        				checked: isGreen
        			});

        			$inputRed.prop({
        				id: 'red-radio',
        				class: 'radio-button',
        				type: 'radio',
        				name: 'status',
        				value: 'red',
        				disabled: true,
        				checked: isRed
        			});

        			$labelGreen.prop({
        				class: 'radio-label',
        				for: 'green-radio'
        			});
        			$labelGreen.html('Green');

        			$labelRed.prop({
        				class: 'radio-label',
        				for: 'red-radio'
        			});
        			$labelRed.html('Red');

        			$formSectionDiv.append($br1);
        			$formSectionDiv.append($inputGreen);
        			$formSectionDiv.append($labelGreen);
        			$formSectionDiv.append($br2);
        			$formSectionDiv.append($inputRed);
        			$formSectionDiv.append($labelRed);

        		} else {
	        		var $textarea = $(document.createElement('textarea'));
	        		$textarea.prop({
	        			rows: '3',
	        			name: fieldKey,
	        			disabled: true,
	        			maxLength: 256,
	        			value: fieldValue
	        		});
	        		$textarea.addClass('form-control text-area');
	        		$formSectionDiv.append($textarea);
	        	}

        		$formGroup.append($formSectionDiv);
        	}
        }

        // Radio label events
        $('.radio-button').on('change', function() {
        	$('#positive-button').prop('disabled', false);
        });

        // Textarea events
	    $('textarea').bind({

	        // Enables button when there is text input
	        input: function () {
	            $('#positive-button').prop('disabled', false);
	        },

	        // Prevents user typing in the character if it matches the regex
	        keypress: function (e) {
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

        $('#option-headers .loader').removeClass('loader');
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

    /*************************************************************************************
    *																					 *
    * FUNCTIONS - METRICS       											             *
    *																					 *
    *************************************************************************************/

    // Switches the metrics based on the airlineCode provided
    function switchMetrics(airlineCode) {
        var metrics = AIRLINE_METRICS[airlineCode];
        if (metrics !== null && airlineCode !== 'KS') {
        	$('#metrics-area').css({
	    		'display': 'initial'
	    	});
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
	            $metricsGoalSpan.data('goal', 75);
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
	    } else {
	    	$('#metrics-area').css({
	    		'display': 'none'
	    	});
	    }
	    $('#metrics-header .loader').removeClass('loader');
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
    }

    /*************************************************************************************
    *																					 *
    * FUNCTIONS - LABELS AND TABS       											     *
    *																					 *
    *************************************************************************************/

    // Removes the verified check marks from the tabs
    function removeCheckMarks() {
    	for (var airline in AIRLINES_VERIFIED) {
        	AIRLINES_VERIFIED[airline] = false;
        	var id = '#check-mark-' + airline;
			$(id).removeClass('check-mark-image');
        }
    }

    // Switches the timestamp for the given airline
    function switchTimeStamp(airlineCode) {
    	$('#option-headers .updated-date-time').html(AIRLINE_TIMESTAMP[airlineCode]);
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
            switchAirlineData(airlineCode);
        } else {
        	// alert('You are in edit mode. Cannot perform action');
        	createModal('editModeModal', 'Unable to switch tabs', 'You are currently in edit mode. Please save or cancel before continuing.');
        }
    }

    /*************************************************************************************
    *																					 *
    * FUNCTIONS - GENERIC HELPERS      													 *
    *																					 *
    *************************************************************************************/

    // Not using default parameters for functions for IE usability
    function getDate() {
    	getDate(null);
    }

    // Returns a string representation of the date in the format [day month year hh:mm:ss AM/PM]
    function getDate(milliseconds) {
    	var formattedDate;
    	if (milliseconds == null) {
        	formattedDate = new Date();
        } else {
        	formattedDate = new Date(0);
        	formattedDate.setUTCSeconds(milliseconds);
        }
        return formattedDate.toDateString() + ' ' + formattedDate.toLocaleTimeString('en-GB');
    }

    // Enables dropdowns if true and false otherwise
    function enableDropdowns(enabled) {
    	var $templateDropdown = $('#template-dropdown');
    	var $datePicker = $('#date-picker');
    	if (enabled) {
    		$templateDropdown.prop('disabled', false);
    		$datePicker.prop('disabled', false);
    	} else {
    		$templateDropdown.prop('disabled', true);
    		$datePicker.prop('disabled', true);
    	}
    }

    // Switches the template for the given airline
    function switchTemplateValue(airlineCode) {
    	$('#template-dropdown').val(CURRENT_TEMPLATE[airlineCode]);
    }

    // Switches the date for the given airline
    function switchDateValue(airlineCode) {
    	$('#date-picker').val(CURRENT_DATE[airlineCode]);
    }

    // Gets historical documents based on date
    function getHistoricalDocument() {
    	$('#option-headers div').addClass('loader');
    	var date = $('#date-picker').val();
    	var filter = '&filter=all';
    	getMostRecentDocument('date=' + date + filter);
    }

    // Switches airline data for the given airline
    function switchAirlineData(airlineCode) {
    	switchTimeStamp(airlineCode);
    	switchDateValue(airlineCode);
    	switchTemplateValue(airlineCode);
    	fillInFields(airlineCode);
    }

    // Creates a bootstrap modal with the given id, title, and body and then displays it
    function createModal(id, title, body) {
    	// Only create if it doesnt exist
    	if ($('#' + id).length === 0) {
	     	$modalContainer = $('.modalContainer');

	    	// Create
	    	var $modalType = $(document.createElement('div'));
	    	var $modalDialog = $(document.createElement('div'));
	    	var $modalContent = $(document.createElement('div'));
	    	var $modalHeader = $(document.createElement('div'));
	    	var $modalBody = $(document.createElement('div'));
	    	var $modalFooter = $(document.createElement('div'));

	    	var $modalHeaderButton = $(document.createElement('button'));
	    	var $modalFooterButton = $(document.createElement('button'));

	    	var $modalHeaderTitle = $(document.createElement('h4'));

	    	var $modalBodyParagraph = $(document.createElement('p'));

	    	// Change
	    	$modalType.prop({
	    		class: 'modal fade',
	    		id: id,
	    		role: 'dialog'
	    	});
	    	$modalDialog.addClass('modal-dialog');
	    	$modalContent.addClass('modal-content');
	    	$modalHeader.addClass('modal-header');
	    	$modalBody.addClass('modal-body');
	    	$modalFooter.addClass('modal-footer');

	    	$modalHeaderButton.prop({
	    		type: 'button',
	    		class: 'close',
	    	});
	    	$modalHeaderButton.data('dismiss', 'modal');
	    	$modalHeaderButton.html('&times;');
	    	$modalHeaderButton.click(function() {
	    		closeModal(id);
	    	});

	    	$modalFooterButton.prop({
	    		type: 'button',
	    		class: 'btn btn-default',
	    	});
	    	$modalFooterButton.data('dismiss', 'modal');
	    	$modalFooterButton.html('Close');
	    	$modalFooterButton.click(function() {
	    		closeModal(id);
	    	});

	    	$modalHeaderTitle.addClass('modal-title');
	    	$modalHeaderTitle.html(title);

	    	$modalBodyParagraph.html(body);

	    	// Append
	    	$modalHeader.append($modalHeaderButton);
	    	$modalHeader.append($modalHeaderTitle);

	    	$modalBody.append($modalBodyParagraph);

	    	$modalFooter.append($modalFooterButton);

	    	$modalContent.append($modalHeader);
	    	$modalContent.append($modalBody);
	    	$modalContent.append($modalFooter);

	    	$modalDialog.append($modalContent);

	    	$modalType.append($modalDialog);

	    	$modalContainer.append($modalType);
	    	$('#main-container').append($modalContainer);
	    }
	    $('#' + id).modal();
    }

    // Closes the modal on close
    function closeModal(id) {
    	var $currentModal = $('#' + id);
    	$currentModal.modal('hide');
    }

    // Sets some common global variables for the given airline
    function setGlobals(airlineCode, withObject) {
    	AIRLINE_TIMESTAMP[airlineCode] = withObject['Timestamp'];
		AIRLINE_MANUAL_DATA[airlineCode] = withObject['ManualDataList'];
		CURRENT_TEMPLATE[airlineCode] = withObject['Template'];
		CURRENT_DATE[airlineCode] = new Date(withObject['Timestamp']).toISOString().substring(0, 10);
    }

    /*************************************************************************************
    *																					 *
    * AJAX CALLS       													                 *
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

    function postDocument(jsonData) {
    	postRequest('RestClient/Post', jsonData);
    }

    /*************************************************************************************
    *																					 *
    * HTTP REQUESTS       													             *
    *																					 *
    *************************************************************************************/

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
                console.log('Error: ' + JSON.parse(err));
            }
        });
    }

    // Posts a new document into the database
    function postRequest(url, jsonObject) {
        console.log('Post was clicked');
        $.ajax({
            type: 'POST',
            url: url,
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

    /*************************************************************************************
    *																					 *
    * HTTP REQUEST CALLBACKS        													 *
    *																					 *
    *************************************************************************************/

    // Fills the manual data for the given airline with the template and date selected
    function fillSpecifiedAirline(response) {
    	var airlineCode = $('.active span').html();
    	var template = $('#template-dropdown').val();
		var date = $('#date-picker').val();
    	if (response !== null && response !== 'null') {
    		var documents = $.parseJSON(response);
    		var keepGoing = true;
    		for (var i = documents.length - 1; i >= 0 && keepGoing; i--) {
    			var currentDocument = documents[i];
    			var airlines = currentDocument['data'];
    			for (var j = 0; j < airlines.length; j++) {
    				var currentAirline = airlines[j];
    				if (currentAirline['AirlineCode'] == airlineCode && currentAirline['Template'] == template) {
    					var milliseconds = currentDocument['_ts'];
    					$('#option-headers .updated-date-time').html(getDate(milliseconds));
    					setGlobals(airlineCode, currentAirline);
    					keepGoing = false;
    				}
    			}
    		}
    		switchAirlineData(airlineCode);
    		// Sets the values of the dropdowns, so user can switch again from that state
    		if (keepGoing) {
    			$('#template-dropdown').prop('value', template);
    			$('#date-picker').prop('value', date);
    			createModal('noTempModal', 'No data available', 'Data for this template on selected date has not yet been created. Most recent submission of selected template will display.');
    			// Calls this function again, but with different data
    			getAllDocuments(fillSpecifiedAirline);

    		}
    	} else {
    		// alert('No documents found on ' + date + ' for ' + airlineCode);
    		createModal('noDocsModal', 'No data available', 'No documents found on ' + date);
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
    	} else {
    		alert('No documents posted on ' + $('#date-picker').val());
    	}
    	switchAirlineData('AS');
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
});
