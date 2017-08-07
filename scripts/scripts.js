$(document).ready(function () {

	// Global Variable representing the final document
	var finalJsonDocument = {
		'data': []
	};

	// Keeps track of the array index for the JSON
	var tabIndex = {
		'AS': 0,
		'VX': 1,
		'QX': 2,
		'OO': 3,
		'KS': 4
	};

	// Keeps track of verified forms
	var airlinesVerified = {
		'AS': false,
		'VX': false,
		'QX': false,
		'OO': false,
		'KS': false
	};

	// Fill in the data when a new tab is clicked
	var savedVerifiedData = {
		'AS': null,
		'VX': null,
		'QX': null,
		'OO': null,
		'KS': null
	};

    $('#verify-button').bind({

    	// Verifies the fields
    	click: verifyFields,
    });

    // Submit button
    $('#submit-button').on('click', submit);

    // Date for the date label
    $('#updated').html('Last updated: ' + getDate());

    // Updates which airline tab is selected
    $('.tab-item').on('click', updateActive);

    // Sets max character limit for text area
    $('textarea').prop('maxLength', 256);

    // Textarea events
    $('textarea').bind({

    	// Enables button when there is text input
    	input: function() {
    		$('#verify-button').prop('disabled', false);
    	},

    	// Prevents user typing in the character if it matches the regex
    	keypress: function(e) {
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
    	paste: function(e) {
    		console.log('inside paste');
    		var $currentTextArea = $(this);
    		setTimeout(function() {
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
		beforeunload: function(e) {
			if($('#form-group').serialize() != $('#form-group').data('serialize')) {
		    	return true;
		    } else {
		    	e = null; // i.e; if form state change show warning box, else don't show it.
	    	} 
		}
	});

    // Updates which tab gets set to active (highlighted)
    function updateActive() {
    	if (fieldsValidated()) {
	    	var tabs = $(this).siblings();
	    	tabs.removeClass('active');
	    	$(this).addClass('active');

	    	// Changes the header based on the airline
	    	var currentSpan = $('.active span');
	    	var airlineCode = currentSpan.html();
	    	var airlineName = currentSpan.attr('name');
	    	$('#airline-header').html(airlineName + ' (' + airlineCode + ') ' + 'DSO Data');

	    	fillInFields(airlineCode);
	    }
    }

    // Fills in the fields with the data they're verified with
    function fillInFields(airlineCode) {
    	var fields = savedVerifiedData[airlineCode];
    	if (fields != null) {
	    	for (var i = 0; i < fields.length; i++) {
	    		$('textarea[name=' + fields[i]['FieldKey']+ ']').prop('value', fields[i]['FieldValue']);
	    	}
	    } else {
	    	$('textarea').prop('value', '');
	    }
    }

    // Returns false when fields are not empty and user attempts to 
    function fieldsValidated() {
    	if (!fieldsAreEmpty() && $('#verify-button').is(':disabled') === false) {
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
    	console.log('Verify was clicked');
        var textareas = $('textarea');
        var date = new Date();
        var airlineCode = $('.active span').html();
        var jsonObject = {
        	'Status': 0,
        	'AirlineCode': airlineCode,
        	'Timestamp': date.toISOString().substring(0, 10) + ' ' + date.toLocaleTimeString(),
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
            var newJsonField = {};
            newJsonField['FieldName'] = $this.parent().find('label').html();
            newJsonField['FieldKey'] = name;
            newJsonField['FieldValue'] = value;
	        jsonObject['ManualDataList'].push(newJsonField);
        }
        if (!isValid) {
            alert('Not all fields are complete');
        } else {

	        // This ensures that the data is pushed to the right tab, and prevents duplicates by replacing the old data
	        finalJsonDocument['data'][tabIndex[airlineCode]] = jsonObject;

	        $('#verify-button').prop('disabled', true);

	        $('.active .airline-code').css({
	        	'color': '#48850b'
	        });

	        savedVerifiedData[airlineCode] = jsonObject['ManualDataList'];
	        console.log(JSON.stringify(savedVerifiedData, null, ' '));

	        // Enables submit button if everything is verified
	        airlinesVerified[airlineCode] = true;
	        if (everythingIsVerified()) {
	        	$('#submit-button').prop('disabled', false);
	        }
	        // console.log('AirlineStatus: ' + JSON.stringify(jsonObject, null, ' '));
	    }
    }

    // Checks if every airline is verified
    function everythingIsVerified() {
    	var verified = true;
    	for (var airline in airlinesVerified) {
    		if (airlinesVerified[airline] === false) {
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
    function getDate() {
        var date = new Date();
        return date.toDateString() + ' ' + date.toLocaleTimeString();
    }

    function getDocuments() {
        request('/RestClient/GetAllDocuments', getAllDocuments);
    }

    function submit() {
    	console.log(JSON.stringify(finalJsonDocument, null, ' '));
    	// postDocument(finalJsonDocument);
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

    // Gets all the documents from the database
    function getAllDocuments(response) {
        if (response !== null) {
            alert('Get data is logged into the console.');
            console.log('Response: ' + response);
        }
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