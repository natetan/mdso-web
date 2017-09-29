/*************************************************************************************
*																					 *
* INITIAL ONLOAD FUNCTIONS - 2     													 *
*																					 *
*************************************************************************************/
define(['metrics', 'callbacks', 'helpers'], function(m ,c, h) {
	m.getAirlineMetrics();
	c.getLastUpdatedDocument();
	h.disableFields();
});