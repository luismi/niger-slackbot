// Description:
//   Provides details about the Ingress septicycle
//
// Dependencies:
//   moment-timezone
//
// Configuration:
//   Install moment-timezone. If needed, update the default timezone values (see script comments).
//
// Commands:
//   [timezone (optional)] checkpoints|cycle [date (optional)]
//
// Author:
//   snotrocket

// Copyright (C) 2015  J Daniel Lewis
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

web: bin/hubot --adapter slack

/* global module*/
module.exports = function(robot) {

	// Set the default timezone below. To see available timezones,
	// see: http://momentjs.com/timezone/docs/#/data-loading/checking-if-a-zone-exists/
	// Shortcuts can be used in place of the full timezone name to make things
	// easier for teams that span timezones.

	var DEFAULT_LOCALE = 'en',
		DEFAULT_TIMEZONE = 'America/New_York',
		TIMEZONE_SHORTCUTS = {
			'central': 'America/Chicago',
			'eastern': 'America/New_York'
		};

	// calculate checkpoints
	robot.respond(/(\S+)?\s?(checkpoint|cycle)s?\s*(.*)?/i, function(msg) {
		var checkpoints, cycles, hours,
			i, locale, moment, parsed,
			now, start, t, t0, timezone;

		// moment is amazing
		moment = require('moment-timezone');
		// set locale
		moment.locale(DEFAULT_LOCALE);
		// default time zone
		timezone = DEFAULT_TIMEZONE;

		// override default timezone with user preference
		if (msg.match[1]) {
			timezone = msg.match[1];
			if (TIMEZONE_SHORTCUTS.hasOwnProperty(timezone)) {
				timezone = TIMEZONE_SHORTCUTS[timezone];
			}
			if (moment.tz.zone(timezone) === null) {
				msg.send('Unknown timezone.');
				return;
			}
		}
		// parse user-provided date
		if (msg.match[3]) {
			parsed = Date.parse(msg.match[3]);
			if (!parsed) {
				msg.send('Invalid date');
				return;
			}
			t = new Date(parsed);
		} else {
			// if no parameter, use the current date
			t = new Date();
		}
		t = t.getTime();
		// get a starting point
		t0 = new Date(1404918000000);  // July 9, 2014, 11:00 AM, EST
		t0 = t0.getTime();
		// calculate the cycle start for the specified date
		cycles = Math.floor((t - t0) / (175 * 60 * 60 * 1000));
		start = t0 + (cycles * 175 * 60 * 60 * 1000);
		// calculate checkpoint times
		checkpoints = [];
		for (hours = 0; hours < 175; hours += 5) {
			checkpoints.push(start + hours * 60 * 60 * 1000);
		}
		// current time
		now = (new Date()).getTime();
		// make it purdy
		msg.send(checkpoints.map(function(t, i) {
			var line = '',
				m = moment.tz(t, timezone);
			if (now > t) {
				// mark past checkpoints
				line += '> ';
			}
			if (i < 9) {
				line += ' ';
			}
			line += (i + 1);
			line += '   ';
			line += m.format('ddd, MMM D, YYYY @ ha z');
			return line;
		}).join('\n'));
	});

};
