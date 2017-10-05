define(function() {

	function AirlineFormField(fieldKey, fieldName, fieldValue) {
		this.fieldName = fieldName;
		this.fieldValue = fieldValue || '';
	}

	return AirlineFormField;
});