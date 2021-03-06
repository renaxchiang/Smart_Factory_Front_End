'use strict';

var $ = window.jQuery = require('jquery');
var _ = require('lodash');
var header = require('../includes/header');
var config = require('../config/url');
var token = require('../config/auth').getToken();
var switchBtn = require('../alarm/components/switch-button');
var alarmTypeDropdown = require('../alarm/components/alarm-type-dropdown');
var alarmSlider = require('../alarm/components/alarm-slider');
var loadingSpin = require('../lib/component/loading-spin');

/* DOM */
var $alarmBlock = $('#alarm-setting-block');
var $alarmSaveBtn = $('#alarm-save-btn');
var $alarmCancelBtn = $('#alarm-cancel-btn');
var $alarmDateGroup = $('.alarm-date');

var data = {};
var spinner;

initialize();

function initialize() {
	header.include();
	initializeLoadingSpinner();
	bindEvents();
	getAlarmSettingsAndInitComponents();
}

function initializeLoadingSpinner() {
	spinner = loadingSpin();
	spinner.init( $('#alarm-panel')[0] );
}

function bindEvents() {
	bindUpdateAlarmSettingsOnButton();
	bindResetAlarmSettingsOnButton();
	bindUpdateAlarmDateOnInput();
}

function bindUpdateAlarmSettingsOnButton() {
	$alarmSaveBtn.on('click', updateAlarmSettings);
}

function bindResetAlarmSettingsOnButton() {
	$alarmCancelBtn.on('click', function(){ window.location.reload() });
}

function bindUpdateAlarmDateOnInput() {
	$alarmDateGroup.on('change', updateAlarmDateOnInput);
}

function updateAlarmSettings() {
	$('*[data-key]').each( function(){
		var key = $(this).data('key');
		var value = $(this).data('value');

		data[key] = value;
	})

	data['_token'] = token;

	$.post(config.APIUrl + 'alarm', data)
	 .done( function(){ window.location.reload() });
}

function getAlarmSettingsAndInitComponents() {

	spinner.start();

	$.get(config.APIUrl + 'alarm/list')
	 .done( function(res){
	 	_.forEach(res, function(value, key){
	 		data[key] = value;

	 		var $el = $('*[data-key="' + key + '"]');
	 		$el.data('value', value);
	 		initComponents($el);
	 	})
	 })
	 .always(function(){ spinner.stop() });
}

function initComponents($el) {

	var type = $el.data('type');

	switch(type){
		case "enable":
			switchBtn.init( $el.attr('id') );
		break;
		case "date":
			$el.val( $el.data('value') );
		break;
		case "type":
			alarmTypeDropdown.init( $el.attr('id') );
		break;
		case "percentage":
			alarmSlider.init( $el.data('id'), $el.data('value') );
		break;
	}
}

function updateAlarmDateOnInput() {
	$(this).data('value', $(this).val());
}