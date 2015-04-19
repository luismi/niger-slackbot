// Description:
//   Generates random passcodes
//
// Dependencies:
//   deferred
//
// Configuration:
//   Install the deferred package
//
// Commands:
//   passcode
//   passcode [count]
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

	var MAX_PASSCODES = 10,
		RANDOM_WORD_URL = 'http://randomword.setgetgo.com/get.php';

	robot.respond(/passcode\s*([0-9]+)?/i, function(msg) {

		var deferred = require('deferred'),
			count = +msg.match[1] || 1;

		// limit # passcodes
		if (count > MAX_PASSCODES) {
			count = MAX_PASSCODES;
		}
			
		function randInt(a, b) {
			return Math.floor(Math.random() * (b - a + 1) + a);
		}

		function randIntString(a, b) {
			return '' + randInt(a, b);
		}

		function randChar(a, b) {
			return String.fromCharCode(
				randInt(a.charCodeAt(0), b.charCodeAt(0))
			);
		}

		function randWord(cb) {
			robot.http(RANDOM_WORD_URL).get()(function(err, res, body) {
				if (err) {
					throw err;
				}
				cb(body.trim());
			});
		}

		function getPasscode() {
			var d = deferred();
			try {
				randWord(function(word) {
					var passcode =  //[2-9][p-z][p-z][a-h][2-9]keyword[p-z][2-9][2-9][2-9][p-z]     
						randIntString(2, 9) +
						randChar('p', 'z') +
						randChar('p', 'z') +
						randChar('a', 'h') +
						randIntString(2, 9) +
						word +
						randChar('p', 'z') +
						randIntString(2, 9) +
						randIntString(2, 9) +
						randIntString(2, 9) +
						randChar('p', 'z');
					d.resolve(passcode);
				});
			} catch (e) {
				d.reject(e);
			}
			return d.promise;
		}

		// create an array with `count` elements, each undefined
		// we'll map these to the getPasscode function
		var args = Array.apply(null, new Array(count));
		deferred.map(args, getPasscode)(function(passcodes) {
			msg.send(passcodes.join('\n'));
		}, function(err) {
			msg.send('Something went wrong. :/');
		});

	});

};
