var logging_handle;
var just_refreshed = false;

Session.set("mouseover_log_entry", null);

Template.protlog.rendered = function() {
	var tmpl = this;
	Log.info("protlog rendered");
};

Template.protlog.helpers({
	protocol: function() {
		return Protdef.findOne({
			_id: Session.get("protocol_selected")
		});
	},

	// protlog_ready: function() {
	//	return Session.get("protlog_ready");
	// },

	direction_from: function(direction) {
		var from = direction.substr(0, 1).toUpperCase();
		var color = from == "P" ? "blue": from == "I" ? "green": "red";
		return '<span class="label" style="background-color: ' + color + ';">' + from + '</span>';
	},

	direction_to: function(direction) {
		var from = direction.substr(1, 1).toUpperCase();
		var color = from == "P" ? "blue": from == "I" ? "green": "red";
		return '<span class="label" style="background-color: ' + color + ';">' + from + '</span>';
	},

	logging_active: function() {
		return Session.get("logging_active");
	},

	protlog: function() {
		return Protlog.find();
	},

	protlog_protocol: function() {
		var protlog_entry = this;
		return Protdef.findOne({_id: protlog_entry.protocol_id}).name;
	},

	protlog_telegram: function() {
		var protlog_entry = this;
		var protocol = Protdef.findOne({_id: protlog_entry.protocol_id});
		return protocol.findTelegramById(protlog_entry.telegram_id);
	},

	mouseover_log_entry: function() {
		return Protlog.findOne(Session.get("mouseover_log_entry"));
	},

	timestamp_formatted: function(timestamp) {
		return moment(timestamp).format('DD.MM.YYYY HH:mm:ss.SSS');
	}
});

Template.protlog.events({
	'click #start_logging': function(evt, tmpl) {
		var protocol = this;

		Meteor.call("startLogging", protocol);
		Session.set("logging_active", true);
		Log.info("start logging");
	},

	'click #stop_logging': function(evt, tmpl) {
		var protocol = this;

		Meteor.call("stopLogging", protocol);
		Session.set("logging_active", false);
		Log.info("stop logging");
	},

	'click #clear_log': function(evt, tmpl) {
		Meteor.call("clearLog");
	},

	'mouseover .log_entry': function(evt, tmpl) {
		var log_entry_id = evt.currentTarget.id;

		if(tmpl.timeout_id) {
			Meteor.clearTimeout(tmpl.timeout_id);
		}
		tmpl.timeout_id = Meteor.setTimeout(function() {
			Session.set("mouseover_log_entry", log_entry_id);
		}, 100);
	},

	'mouseout .log_entry': function(evt, tmpl) {
		if(tmpl.timeout_id) {
			Meteor.clearTimeout(tmpl.timeout_id);
		}
		Session.set("mouseover_log_entry", null);
	}
});