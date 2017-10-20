/*************************************************************************************
*                                                                                    *
* FUNCTIONS - GENERIC HELPERS - 10                                                   *
*                                                                                    *
*************************************************************************************/

define(['validation'], function(validation) {


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
        var options = { hour12: false };
        return cleanDateString(formattedDate.toDateString() + ' ' + formattedDate.toLocaleTimeString('en-US', options));
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

    // Switches airline data for the given airline
    function switchAirlineData(airlineCode) {
        switchTimeStamp(airlineCode);
        switchDateValue(airlineCode);
        switchTemplateValue(airlineCode);
        fillInFields(airlineCode);
    }

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
        CURRENT_DATE[airlineCode] = convertToAPIAcceptedDate(new Date(cleanDateString(currentAirlineObject['Timestamp'])));
    }

    function cleanDateString(dateString) {
        return dateString.replace(/\u200e/g, '');
    }

    // Disables the textarea fields
    function disableFields() {
        $('textarea').prop('disabled', true);
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

    // Generates and fills in the fields for the specified airline
    function fillInFields(airlineCode) {
        console.log('fill fields is called');
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

    return {
        getDate: getDate,
        convertToDisplayDate: convertToDisplayDate,
        convertToAPIAcceptedDate: convertToAPIAcceptedDate,
        formatFromISODate: formatFromISODate,
        enableDropdowns: enableDropdowns,
        switchTemplateValue: switchTemplateValue,
        switchDateValue: switchDateValue,
        switchAirlineData: switchAirlineData,
        removeCheckMarks: removeCheckMarks,
        switchTimeStamp: switchTimeStamp,
        createAndDisplayModal: createAndDisplayModal,
        closeModal: closeModal,
        setGlobals: setGlobals,
        disableFields: disableFields,
        fillInFields: fillInFields
    }
});