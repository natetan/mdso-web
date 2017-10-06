define(function() {

	function AirlineFormField(fieldKey, fieldName, fieldValue) {
		this.fieldKey = fieldKey;
		this.fieldName = fieldName;
		this.fieldValue = fieldValue || '';
	}

	return AirlineFormField;
});