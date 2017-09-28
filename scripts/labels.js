/*************************************************************************************
*																					 *
* FUNCTIONS - LABELS - 8     											             *
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
	var timestamp = AIRLINE_TIMESTAMP[airlineCode];
	if (timestamp == null) {
		timestamp = 'No report found';
	}
	$('#option-headers .updated-date-time').html(timestamp);
}