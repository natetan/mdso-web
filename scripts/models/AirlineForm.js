define(function() {

	function AirlineForm(fieldKey, fieldName, fieldValue) {
		this.fieldName = fieldName;
		this.fieldValue = fieldValue || '';
	}

	return AirlineForm;
});