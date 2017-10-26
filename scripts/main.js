/*************************************************************************************
*                                                                                    *
* GLOBAL VARIABLES - 1                                                               *
*                                                                                    *
*************************************************************************************/

// Disabling ajax caching on internet explorer
$.ajaxSetup({ cache: false });

// Global Variable representing the final document
var FINAL_JSON_DOCUMENT = {
    'data': []
};

var AIRLINE_MANUAL_DATA = {
    'AS': null,
    'VX': null,
    'QX': null,
    'OO': null,
    'KS': null
};

// Keeps track of the array index for the JSON
var TAB_INDEX = {
    'AS': 0,
    'VX': 1,
    'QX': 2,
    'OO': 3,
    'KS': 4
};

// Keeps track of verified forms
var AIRLINES_VERIFIED = {
    'AS': false,
    'VX': false,
    'QX': false,
    'OO': false,
    'KS': false
};

// Fill in the data when a new tab is clicked
var SAVED_VERIFIED_DATA = {
    'AS': null,
    'VX': null,
    'QX': null,
    'OO': null,
    'KS': null
};

// Airline Metrics
var AIRLINE_METRICS = {
    'AS': null,
    'VX': null,
    'QX': null,
    'OO': null,
    'KS': null
}

var AIRLINE_TIMESTAMP = {
    'AS': null,
    'VX': null,
    'QX': null,
    'OO': null,
    'KS': null
}

var CURRENT_TEMPLATE = {
    'AS': '0500',
    'VX': '0500',
    'QX': '0500',
    'OO': '0500',
    'KS': '0500'
}

var CURRENT_DATE = {
    'AS': null,
    'VX': null,
    'QX': null,
    'OO': null,
    'KS': null
}

// Keeps track of the state of the positive button and fields
var IN_CREATE_STATE = true;

var CURRENT_INITIAL_TEMPLATE = '0500';

var CURRENT_ACTIVE_AIRLINE = 'AS';

// Change to true to post to database
// Otherwise, log posted document to console
var REAL_POST = true;

// True if using live data
var USE_LIVE_DATA = true;


require(['init'], function(init) {
    init.init();
    init.loadInitialFunctions();
});