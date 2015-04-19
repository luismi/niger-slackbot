// Description:
//   Calculates MU needed to win a cycle
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   mu [ENL score] [RES score] [current checkpoint # (optional)]
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

/* global module*/
module.exports = function(robot) {

	// calculate mu
	robot.respond(/mu\s+(\S+)\s+(\S+)(\s+(\S+))?/i, function(msg) {
		var e = msg.match[1],  // enl score
			r = msg.match[2],  // res score
			n = msg.match[4],  // checkpoint number
			leader, underdog,  // winning/losing faction name
			m,  // mu needed
			s,  // response string
			t;  // temp variable

		// parse numbers from a string, handling things like "33k" and "24,323"
		function getNum(s) {
			// strip commas
			s = s.replace(',', '');
			// check for trailing 'k'
			if (s.slice(-1) === 'k' || s.slice(-1) === 'K') {
				return +s.slice(0, -1) * 1000;
			}
			return +s;
		}

		// get the current checkpoint
		function currentCheckpoint() {
			var t0,  // time zero, a cycle start in the past
				t;   // current time
			t0 = new Date(1404918000000);  // July 9, 2014, 11:00 AM, EST
			t = new Date();
			return Math.floor((t - t0) / (1000 * 60 * 60 * 5)) % 35 + 1;
		}

		// convert a number to a string with commas
		function numberWithCommas(x) {
			// see: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		// assume current checkpoint number if none is given
		if (n === undefined) {
			n = currentCheckpoint();
		}

		// convert strings to numbers
		e = getNum(e);
		r = getNum(r);
		n = +n;

		// sanity check
		if (isNaN(e) || isNaN(r) || isNaN(n) || e < 0 || r < 0 || n < 0 || n >= 35) {
			msg.send('Usage: mu [enl score] [res score] [current checkpoint # (optional)]');
			return;
		}

		// summarize input
		s = 'Current ENL score: ' + numberWithCommas(e) + '\n' +
			'Current RES score: ' + numberWithCommas(r) + '\n' +
			'Current checkpoint: #' + n + '\n';

		// figure out who is in the lead, swapping input if needed
		if (e <= r) {
			leader = 'RES';
			underdog = 'ENL';
		} else {
			leader = 'ENL';
			underdog = 'RES';
			// swap e and r
			t = e; e = r; r = t;
		}

		// calculate mu needed
		m = r * (n + 1) - e * (n);
		s += underdog + ' needs ' + numberWithCommas(m) + ' total MU to tie next checkpoint, ' +
			'assuming ' + leader + ' score doesn\'t change.';

		// send response
		msg.send(s);
	});

};
