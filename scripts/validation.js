/*************************************************************************************
*																					 *
* FUNCTIONS - VALIDATION - 4      													 *
*																					 *
*************************************************************************************/

define(function() {

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

    return {
        everythingIsVerified: everythingIsVerified,
        fieldsValidated: fieldsValidated,
        fieldsAreEmpty: fieldsAreEmpty,
        isEmoji: isEmoji
    }
});