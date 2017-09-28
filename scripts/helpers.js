/*************************************************************************************
*																					 *
* FUNCTIONS - GENERIC HELPERS - 10    												 *
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

// Converts date to a string in the format of mm/dd/yyyy
function convertToDisplayDate(date) {
	// return date.toLocaleDateString();
	return formatFromISODate(date.toISOString().substring(0, 10));
}

// Returns the locale date string of a date string formatted in yyyy-MM-dd
function formatFromISODate(dateString) {
	var dateArray = dateString.split('-');
	var month = dateArray[1];
	if (month.length == 2 && month[0] == '0') {
		month = month.substring(1);
	}
	return month + '/' + dateArray[2] + '/' + dateArray[0];
}

// Converts the date to a string in the format of yyyy-mm-dd
function convertToAPIAcceptedDate(date) {
	// Removes the timezone from the ISO string
	isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
	return isoDate.substring(0, 10);
}

// Enables dropdowns if true and false otherwise
function enableDropdowns(enabled) {
	var $templateDropdown = $('#template-dropdown');
	var $datePicker = $('#datepicker');
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
	var template = CURRENT_TEMPLATE[airlineCode];
	if (template == null) {
		template = CURRENT_INITIAL_TEMPLATE;
	}
	$('#template-dropdown').val(template);
}

// Switches the date for the given airline
function switchDateValue(airlineCode) {
	var date = CURRENT_DATE[airlineCode];
	if (date == null) {
		date = new Date().toISOString().substring(0, 10);
	}
	$('#datepicker').val(formatFromISODate(date));
}

// Gets historical documents based on date
function getHistoricalDocument() {
	$('#option-headers div').addClass('loader');
	var date = $('#datepicker').val();
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
function createAndDisplayModal(id, title, body, callback) {
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
    		closeModal(id, callback);
    	});

    	$modalFooterButton.prop({
    		type: 'button',
    		class: 'btn btn-default',
    	});
    	$modalFooterButton.data('dismiss', 'modal');
    	$modalFooterButton.html('Close');
    	$modalFooterButton.click(function() {
    		closeModal(id, callback);
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
function closeModal(id, callback) {
	var $currentModal = $('#' + id);
	$currentModal.modal('hide');
	if (callback) {
		callback();
	}
}

// Sets some common global variables for the given airline
function setGlobals(airlineCode, currentAirlineObject) {
	AIRLINE_TIMESTAMP[airlineCode] = currentAirlineObject['Timestamp'];
	AIRLINE_MANUAL_DATA[airlineCode] = currentAirlineObject['ManualDataList'];
	CURRENT_TEMPLATE[airlineCode] = currentAirlineObject['Template'];
	CURRENT_DATE[airlineCode] = convertToAPIAcceptedDate(new Date(currentAirlineObject['Timestamp']));
}