// Description:
//   Provides details about portal linkability
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   link help
//   link [intel link] [intel link]
//   link [intel link] [intel link] [intel link]
//   link [intel draw link or field]
//   link 87665544
//   link 88877766 2 la
//   link 88888888 2 la 1 vrla
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

	// Generates the linkability info message for a given distance (in meters)
	function buildLinkabilityMessage(distance) {
		var build,  // anchor build
			message = '';  // message string
		build = getPortalBuild(distance);
		if (!build) {
			return null;
		}
		message += 'Distance: ' + metersToKilometers(distance) + ' km' + '\n';
		message += 'Agents Required: ' + build.agents + '\n';
		message += 'Build: ' + getPortalBuildString(build);
		message += '\n';
		return message;
	}

	// Given a msg object and 3 portals, calculates and sends the link info
	// Optional ll and z parameters allow custom latlng and zoom levels for draw links
	function calculatePortalLinkInfo(msg, p1, p2, p3, ll, z) {
		var distance,  // distance between portals
			message = '',  // message string
			str;  // temporary message string

		p1.name = 'Portal A';
		p2.name = 'Portal B';
		if (p3) {
			p3.name = 'Portal C';
		}

		message += p1.name + ': ' + getPortalLink(p1.lat, p1.lng) + '\n';
		message += p2.name + ': ' + getPortalLink(p2.lat, p2.lng) + '\n';

		if (p3) {
			message += p3.name + ': ' + getPortalLink(p3.lat, p3.lng) + '\n';
			message += 'Draw: ' + getDrawLink([p1, p2, p3, p1], ll, z) + '\n';
			message += '\nPortal A to Portal B:\n';
		} else {
			message += 'Draw: ' + getDrawLink([p1, p2], ll, z) + '\n';
		}

		// p1 to p2
		distance = getDistanceInMeters(p1, p2);
		str = buildLinkabilityMessage(distance);
		if (str === null) {
			sendLinkabilityError(msg, p1, p2, distance);
			return;
		}
		message += str;

		if (p3) {
			// p1 to p3
			message += '\nPortal A to Portal C:\n';
			distance = getDistanceInMeters(p1, p3);
			str = buildLinkabilityMessage(distance);
			if (str === null) {
				sendLinkabilityError(msg, p1, p3, distance);
				return;
			}
			message += str;
			// p2 to p3
			message += '\nPortal B to Portal C:\n';
			distance = getDistanceInMeters(p2, p3);
			str = buildLinkabilityMessage(distance);
			if (str === null) {
				sendLinkabilityError(msg, p2, p3, distance);
				return;
			}
			message += str;
		}

		msg.send(message.trim());
	}

	// Returns the distance (in meters) between two points
	// Each point is an object containing lat and lng keys
	function getDistanceInMeters(p1, p2) {
		// From http://stackoverflow.com/a/1502821
		var rad, R, dLat, dLng, a, c, d;
		rad = function(x) {
			return x * Math.PI / 180;
		};
		// Earth’s mean radius in meter, according to Ingress
		// see https://github.com/jonatkins/ingress-intel-total-conversion/commit/522ef34f77c86c54cc7586a298d5a6f74f75aef4
		R = 6367000;
		dLat = rad(p2.lat - p1.lat);
		dLng = rad(p2.lng - p1.lng);
		a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		d = R * c;
		return d; // returns the distance in meters
	}

	// Returns an intel draw link
	// portals: array of objects with lat and lng keys
	// ll: optional lat lng query parameter
	// z: optional zoom level query parameter
	function getDrawLink(portals, ll, z) {
		var a = [], p1, p2, url;
		if (!ll) {
			ll = portals[0].lat + ',' + portals[0].lng;
		}
		if (!z) {
			z = 10;
		}
		url = 'https://www.ingress.com/intel?ll=' + ll + '&z=' + z + '&pls=';
		// create pls
		p1 = portals.shift();
		while (portals.length) {
			p2 = portals.shift();
			a.push([p1.lat, p1.lng, p2.lat, p2.lng].join(','));
			p1 = p2;
		}
		url += a.join('_');
		return url;
	}

	// Calculates agents needed to create a link of a given distance (in meters)
	// Returns an object with details about the anchor:
	// {
	// 	agents: /* number of agents */
	// 	level: /* portal level */
	// 	resos: /* string of resos */
	// 	la: /* number of link amps */
	// 	vrla: /* number of vrlas */
	// }
	// Returns null if it's unlinkable.
	function getPortalBuild(distance) {
		var agents,  // number of agents required
			config,  // portal build configurations
			la,  // number of link amps
			level,  // portal level
			range,  // distance a portal can link
			resos,  // resos string
			vrla;  // number of very rare link amps
		// build configuration, keyed by number of agents required
		// yes, we could hard code distances here, but this seems more maintainable
		config = {
			1: '87665544',
			2: '88776666',
			3: '88877766',
			4: '88887777',
			5: '88888777',
			6: '88888877',
			7: '88888887',
			8: '88888888'
		};
		// calculate portal build
		//  - prefer link amps over more agents
		//  - prefer more agents over very rare link amps
		for (vrla = 0; vrla <= 4; ++vrla) {
			for (agents = 1; agents <= 8; ++agents) {
				for (la = 0; la <= 4; ++la) {
					if (vrla + la <= 4) {
						resos = config[agents];
						level = getPortalLevelFromResos(resos);
						range = portalRange(level, la, vrla);
						if (range >= distance) {
							return {
								agents: agents,
								level: level,
								resos: resos,
								la: la,
								vrla: vrla
							};
						}
					}
				}
			}
		}
		// too far
		return null;
	}

	// Returns a portal build string for a given portal build:
	// {
	// 	level: /* portal level */
	// 	resos: /* string of resos */
	// 	la: /* optional number of link amps */
	// 	vrla: /* optional number of vrlas */
	// }
	function getPortalBuildString(build) {
		var str = 'P' + Math.floor(build.level) + ' (' + build.resos + ')';
		if (build.la) {
			str += ' with ' + pluralize(build.la, 'link amp');
			if (build.vrla) {
				str += ' and ' + pluralize(build.vrla, 'vrla');
			}
		} else if (build.vrla) {
			str += ' with ' + pluralize(build.vrla, 'vrla');
		}
		return str;
	}

	// Parse a portal lat lng from a query string
	// Returns an object containing lat and lng keys
	function getPortalFromQuery(q) {
		var a, ll, params;
		if (!q) {
			return null;
		}
		params = parseQueryString(q);
		// the pll query parameter takes precendence over the ll parameter
		ll = params.pll || params.ll;
		if (!ll) {
			return null;
		}
		a = ll.split(',');
		return {
			lat: +a[0],
			lng: +a[1]
		};
	}

	// Convert a string of resonators (e.g. '88888888') to a portal level
	// Returns the portal level
	function getPortalLevelFromResos(resos) {
		var sum = 0, i;
		for (i = 0; i < resos.length; ++i) {
			sum += +resos[i];
		}
		return sum / 8;
	}

	// Returns a portal intel link for a given lat and lng
	function getPortalLink(lat, lng) {
		return 'https://www.ingress.com/intel?ll=' + lat + ',' + lng + '&z=17&pll=' + lat + ',' + lng;
	}

	// Converts meters to kilometers, fixed to 3 decimal places, as a string
	function metersToKilometers(meters) {
		// for regex explanation, see:
		// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
		return (meters / 1000).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Parses a query string, returning a dict of keys and values
	function parseQueryString(q) {
		var amp = '&',
			map = {},
			parts;
		// handle converted ampersands
		if (q.indexOf('&amp;') !== -1) {
			amp = '&amp;';
		}
		parts = q.split(amp);
		parts.forEach(function(part) {
			var kv = part.split('=');
			map[kv[0]] = kv[1];
		});
		return map;
	}

	function pluralize(count, str) {
		if (count === 1) {
			return count + ' ' + str;
		}
		return count + ' ' + str + 's';
	}

	// Calculates portal link distance in meters for a given portal level,
	// with optional number of link amps and very rare link amps
	function portalRange(level, la, vrla) {
		var d = 160.0 * Math.pow(level, 4),  // base portal range
			factors = [1, 0.25, 0.125, 0.125],  // multiplier factors
			mods = 0,  // mods used
			multiplier = 0;  // initial multiplier
		// convert undefined parameters to zeros
		la = la || 0;
		vrla = vrla || 0;
		// sanity check
		if (la + vrla > 4) {
			// nope
			return 0;
		}
		// compute link amp multiplier
		while (vrla-- > 0) {
			multiplier += factors[mods++] * 7;
		}
		while (la-- > 0) {
			multiplier += factors[mods++] * 2;
		}
		if (multiplier) {
			d *= multiplier;
		}
		return d;
	}

	// Send a linkability error
	function sendLinkabilityError(msg, p1, p2, distance) {
		msg.send(metersToKilometers(distance) + ' km is too far. Linking to the moon, yo?');
	}

	// Responds with help text
	robot.respond(/link\s+help/i, function(msg) {
		msg.send(
			'Calculate distances between portals:\n' +
			'   link [intel link] [intel link]\n' +
			'   link [intel link] [intel link] [intel link]\n' +
			'   link [intel draw link field]\n' +
			'Calculate portal ranges:\n' +
			'   link 87665544\n' +
			'   link 88877766 2 la\n' +
			'   link 88888888 2 la 1 vrla'
		);
	});

	// Responds to portal distance requests with intel links
	robot.respond(/link\s+https:\/\/www.ingress.com\/intel\?(\S+)\s+https:\/\/www.ingress.com\/intel\?(\S+)(\s+https:\/\/www.ingress.com\/intel\?(\S+))?/i, function(msg) {
		var p1, p2, p3;  // portal objects
		function samePortal(a, b) {
			return (a.lat === b.lat) && (a.lng === b.lng);
		}
		p1 = getPortalFromQuery(msg.match[1]);
		p2 = getPortalFromQuery(msg.match[2]);
		p3 = getPortalFromQuery(msg.match[4]);
		if (p1 && p2) {
			if (samePortal(p1, p2) || (p3 && (samePortal(p2, p3) || samePortal(p1, p3)))) {
				msg.send('Only Chuck Norris can link a portal to itself, yo.');
				return;
			}
			calculatePortalLinkInfo(msg, p1, p2, p3);
		}
	});

	// Responds to portal distance requests with a draw link
	robot.respond(/link\s+https:\/\/www.ingress.com\/intel\?(\S+)\s*$/i, function(msg) {
		var p1, p2, p3,  // portal objects
			params,  // query parameters
			portals=[];  // portal objects

		// parse 2 latlng pairs and add them to a portal list
		function parsePortals(part) {
			var latlngs;
			// ensures unique portals in the list of portals
			function addPortal(lat, lng) {
				var i, portal;
				for (i = 0; i < portals.length; ++i) {
					portal = portals[i];
					if (portal.lat === lat && portal.lng === lng) {
						return;
					}
				}
				portals.push({
					lat: lat,
					lng: lng
				});
			}
			latlngs = part.split(',');
			addPortal(latlngs[0], latlngs[1]);
			addPortal(latlngs[2], latlngs[3]);
		}

		params = parseQueryString(msg.match[1]);
		if (!params.pls) {
			return;
		}
		params.pls.split('_').forEach(parsePortals);
		if (portals.length !== 2 && portals.length !== 3) {
			msg.send('Draw link should be a single link or a single field.');
			return;
		}
		p1 = portals.shift();
		p2 = portals.shift();
		p3 = portals.shift();
		calculatePortalLinkInfo(msg, p1, p2, p3, params.ll, params.z);
	});

	// Responds to requests to calculate portal distance for a portal build
	robot.respond(/link\s+(\d+)(\s+(with|and))?(\s+([1-4])\s?(la|link amp)s?)?(\s+(with|and))?(\s+([1-4])\s?(vrla|very rare link amp)s?)?(\s+(with|and))?(\s+([1-4])\s?(la|link amp)s?)?/i, function(msg) {
		var distance,  // link range
			la,  // number of link amps
			level,  // portal level
			message,  // message string
			resos,  // resonator string
			vrla;  // number of very rare link amps

		resos = msg.match[1];
		// sanity check
		if (!resos.match(/^[1-8]{8}$/)) {
			if (resos.length !== 8) {
				msg.send('Needs 8 resos, yo.');
				return;
			}
			// has a level 0 or 9 reso
			msg.send('That\'s a weird portal, yo.');
			return;
		}
		// a weird regex, but allows la before or after vrla
		la = +(msg.match[5] || msg.match[15] || 0);
		vrla = +(msg.match[10] || 0);
		// sanity check
		if (la + vrla > 4) {
			msg.send('Out of mod slots, yo.');
			return;
		}
		level = getPortalLevelFromResos(resos);
		distance = portalRange(level, la, vrla);
		message = getPortalBuildString({
			level: level, 
			resos: resos, 
			la: la, 
			vrla: vrla
		});
		message += ' can link ' + metersToKilometers(distance) + ' km';

		msg.send(message);
	});

};
