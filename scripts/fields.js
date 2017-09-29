/*************************************************************************************
*																					 *
* FUNCTIONS - FIELDS - 6      													     *
*																					 *
*************************************************************************************/

console.log(validation);

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
            if (validation.isEmoji(charStr) /*|| !pattern.test(charStr)*/) {
                return false;
            }
        },

        // Prevents pasting emojis
        paste: function (e) {
            var $currentTextArea = $(this);
            setTimeout(function () {
                var text = $currentTextArea.val();
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