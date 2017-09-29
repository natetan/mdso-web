/*************************************************************************************
*																					 *
* FUNCTIONS - BUTTONS - 5      													     *
*																					 *
*************************************************************************************/

define(['fields', 'helpers', 'ajax'], function(fields, helpers, ajax) {


    // Cancel button functionality
    function cancel() {
    	$('#positive-button span').html('CREATE NEW');
    	$('#positive-button').prop('disabled', false);
    	IN_CREATE_STATE = true;
    	$('textarea').prop('disabled', true);
    	$(this).prop('disabled', true);

    	var airlineCode = $('.active span').html();
    	fields.fillInFields(airlineCode);
    	helpers.enableDropdowns(true);
    	$('#datepicker').val(helpers.formatFromISODate(CURRENT_DATE[airlineCode]));
    }

    // Submits the document as a whole to the database
    function submit() {
    	if (REAL_POST) {
    		ajax.postDocument(FINAL_JSON_DOCUMENT);
    		helpers.removeCheckMarks();
    	} else {
            console.log(JSON.stringify(FINAL_JSON_DOCUMENT, null, ' '));
        }
        $(this).prop('disabled', true);
    }

    // Checks if fields are verified
    function verify() {
    	var textareas = $('textarea');
    	$('#datepicker').val(helpers.convertToDisplayDate(new Date()));
    	// If the create button is enabled, textfields should still be disabled
    	if (IN_CREATE_STATE) {
    		$(this).prop('disabled', true);
    		$('#positive-button span').html('SAVE');
    		IN_CREATE_STATE = false;

    		textareas.prop('disabled', false);
    		$('#negative-button').prop('disabled', false);
    		$('.radio-button').prop('disabled', false);

    		helpers.enableDropdowns(false);
    	} else {
    		$('#positive-button span').html('CREATE NEW');

    		textareas.prop('disabled', true);
    		$('#negative-button').prop('disabled', true);
    		$('.radio-button').prop('disabled', true);

    		helpers.enableDropdowns(true);
    		IN_CREATE_STATE = true;

            var date = new Date();
            var airlineCode = $('.active span').html();
            CURRENT_DATE[airlineCode] = helpers.convertToAPIAcceptedDate(new Date($('#datepicker').val()));
            console.log(CURRENT_DATE[airlineCode]);
            var jsonObject = {
                'Status': 0,
                'AirlineCode': airlineCode,
                'Timestamp': helpers.getDate(),
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

    return {
        cancel: cancel,
        submit: submit,
        verify: verify
    }
});