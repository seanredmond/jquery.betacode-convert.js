(function ($) {

	$.fn.betacode2utf8 = function (options) {
		options = $.extend({
			leaveUnconverted: 'true',
			optionTwo: { partOne: 'defaultValue' }
		}, options);

		var CAP = 1,
			BR_SMOOTH = 1 << 1,
			BR_ROUGH  = 1 << 2,
			ACC_ACUTE = 1 << 3,
			ACC_GRAVE = 1 << 4,
			ACC_CIRC  = 1 << 5,
			IOTA_SUB  = 1 << 6,
			DIAERESIS = 1 << 7,
			MACRON    = 1 << 8,
			BREVE     = 1 << 9,
			RE_LETTER = 1,
			RE_CAP    = 2,
			RE_BREATHING = 3,
			RE_ACCENT = 4, 
			RE_IOTA = 5, 
			RE_DIAERESIS = 6,
			RE_BAREQUOTE = 7,
			ACCENTS = {
				'/': ACC_ACUTE,
				'\\': ACC_GRAVE,
				'=': ACC_CIRC
			},
			BREATHINGS = {
				')': BR_SMOOTH,
				'(': BR_ROUGH
			},
			
			alphabet = {
				'a': {},
				'b': 'β',
				'g': 'γ',
				'd': 'δ',
				'e': {},
				'z': 'ζ',
				'h': {},
				'q': 'θ',
				'i': {},
				'k': 'κ',
				'l': 'λ',
				'm': 'μ',
				'n': 'ν',
				'c': 'ξ',
				'o': {},
				'p': 'π',
				'r': {0: 'ρ'},
				's': {0: 'σ'},
				't': 'τ',
				'u': {},
				'f': 'φ',
				'x': 'χ',
				'y': 'ψ',
				'v': 'ϝ',
				'w': {},
				';': {0: '\u037e'},
				'"': {0: '"'},
				"'": {0: '\u2019'}
			},
			punctuation = {
				':': ':',
				'.': '.',
				',': ','
			},
			accents = {undefined: 0, '/': ACC_ACUTE, '\\': ACC_GRAVE, '=': ACC_CIRC};
			breathings = {undefined: 0, '(': BR_ROUGH, ')': BR_SMOOTH};
			iotas = {undefined: 0, '|': IOTA_SUB};
			diaereses = {undefined: 0, '+': DIAERESIS};
			
			alphabet['a'][0] = '\u03b1';
			alphabet['a'][BR_SMOOTH] = '\u1f00';
			alphabet['a'][BR_ROUGH] = '\u1f01';
			alphabet['a'][BR_SMOOTH | ACC_GRAVE] = '\u1f02';
			alphabet['a'][BR_ROUGH | ACC_GRAVE] = '\u1f03';
			alphabet['a'][BR_SMOOTH | ACC_ACUTE] = '\u1f04';
			alphabet['a'][BR_ROUGH | ACC_ACUTE] = '\u1f05';
			alphabet['a'][BR_SMOOTH | ACC_CIRC] = '\u1f06';
			alphabet['a'][BR_ROUGH | ACC_CIRC] = '\u1f07';
			alphabet['a'][ACC_GRAVE] = '\u1f70';
			alphabet['a'][ACC_ACUTE] = '\u1f71';
			alphabet['a'][BR_SMOOTH | IOTA_SUB] = '\u1f80';
			alphabet['a'][BR_ROUGH | IOTA_SUB] = '\u1f81';
			alphabet['a'][BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1f82';
			alphabet['a'][BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1f83';
			alphabet['a'][BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1f84';
			alphabet['a'][BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1f85';
			alphabet['a'][BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1f86';
			alphabet['a'][BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1f87';
			alphabet['a'][BREVE] = '\u1fb0';
			alphabet['a'][MACRON] = '\u1fb1';
			alphabet['a'][ACC_GRAVE | IOTA_SUB] = '\u1fb2';
			alphabet['a'][IOTA_SUB] = '\u1fb3';
			alphabet['a'][ACC_ACUTE | IOTA_SUB] = '\u1fb4';
			alphabet['a'][ACC_CIRC] = '\u1fb6';
			alphabet['a'][ACC_CIRC | IOTA_SUB] = '\u1fb7';
			
			alphabet['e'][0] = '\u03b5';
			alphabet['e'][BR_SMOOTH] = '\u1f10';
			alphabet['e'][BR_ROUGH] = '\u1f11';
			alphabet['e'][BR_SMOOTH | ACC_GRAVE] = '\u1f12';
			alphabet['e'][BR_ROUGH | ACC_GRAVE] = '\u1f13';
			alphabet['e'][BR_SMOOTH | ACC_ACUTE] = '\u1f14';
			alphabet['e'][BR_ROUGH | ACC_ACUTE] = '\u1f15';
			alphabet['e'][ACC_GRAVE] = '\u1f72';
			alphabet['e'][ACC_ACUTE] = '\u1f73';
												
			alphabet['h'][0] = '\u03b7';
			alphabet['h'][BR_SMOOTH] = '\u1f20';
			alphabet['h'][BR_ROUGH] = '\u1f21';
			alphabet['h'][BR_SMOOTH | ACC_GRAVE] = '\u1f22';
			alphabet['h'][BR_ROUGH | ACC_GRAVE] = '\u1f23';
			alphabet['h'][BR_SMOOTH | ACC_ACUTE] = '\u1f24';
			alphabet['h'][BR_ROUGH | ACC_ACUTE] = '\u1f25';
			alphabet['h'][BR_SMOOTH | ACC_CIRC] = '\u1f26';
			alphabet['h'][BR_ROUGH | ACC_CIRC] = '\u1f27';
			alphabet['h'][ACC_GRAVE] = '\u1f74';
			alphabet['h'][ACC_ACUTE] = '\u1f75';
			alphabet['h'][BR_SMOOTH | IOTA_SUB] = '\u1f90';
			alphabet['h'][BR_ROUGH | IOTA_SUB] = '\u1f91';
			alphabet['h'][BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1f92';
			alphabet['h'][BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1f93';
			alphabet['h'][BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1f94';
			alphabet['h'][BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1f95';
			alphabet['h'][BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1f96';
			alphabet['h'][BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1f97';
			alphabet['h'][ACC_GRAVE | IOTA_SUB] = '\u1fc2';
			alphabet['h'][IOTA_SUB] = '\u1fc3';
			alphabet['h'][ACC_ACUTE | IOTA_SUB] = '\u1fc4';
			alphabet['h'][ACC_CIRC] = '\u1fc6';
			alphabet['h'][ACC_CIRC | IOTA_SUB] = '\u1fc7';
			
			alphabet['i'][0] = '\u03b9';
			alphabet['i'][DIAERESIS] = '\u03ca';
			alphabet['i'][BR_SMOOTH] = '\u1f30';
			alphabet['i'][BR_ROUGH] = '\u1f31';
			alphabet['i'][BR_SMOOTH | ACC_GRAVE] = '\u1f32';
			alphabet['i'][BR_ROUGH | ACC_GRAVE] = '\u1f33';
			alphabet['i'][BR_SMOOTH | ACC_ACUTE] = '\u1f34';
			alphabet['i'][BR_ROUGH | ACC_ACUTE] = '\u1f35';
			alphabet['i'][BR_SMOOTH | ACC_CIRC] = '\u1f36';
			alphabet['i'][BR_ROUGH | ACC_CIRC] = '\u1f37';
			alphabet['i'][ACC_GRAVE] = '\u1f76';
			alphabet['i'][ACC_ACUTE] = '\u1f77';
			alphabet['i'][BR_SMOOTH | IOTA_SUB] = '\u1f80';
			alphabet['i'][BR_ROUGH | IOTA_SUB] = '\u1f81';
			alphabet['i'][BREVE] = '\u1fd0';
			alphabet['i'][MACRON] = '\u1fd1';
			alphabet['i'][ACC_GRAVE | DIAERESIS] = '\u1fd2';
			alphabet['i'][ACC_ACUTE | DIAERESIS] = '\u1fd3';
			alphabet['i'][ACC_CIRC] = '\u1fd6';
			alphabet['i'][ACC_CIRC | DIAERESIS] = '\u1fd7';
			
			alphabet['o'][0] = '\u03bf';
			alphabet['o'][BR_SMOOTH] = '\u1f40';
			alphabet['o'][BR_ROUGH] = '\u1f41';
			alphabet['o'][BR_SMOOTH | ACC_GRAVE] = '\u1f42';
			alphabet['o'][BR_ROUGH | ACC_GRAVE] = '\u1f43';
			alphabet['o'][BR_SMOOTH | ACC_ACUTE] = '\u1f44';
			alphabet['o'][BR_ROUGH | ACC_ACUTE] = '\u1f45';
			alphabet['o'][ACC_GRAVE] = '\u1f78';
			alphabet['o'][ACC_ACUTE] = '\u1f79';

			alphabet['u'][0] = '\u03c5';
			alphabet['u'][DIAERESIS] = '\u03cb';
			alphabet['u'][BR_SMOOTH] = '\u1f50';
			alphabet['u'][BR_ROUGH] = '\u1f51';
			alphabet['u'][BR_SMOOTH | ACC_GRAVE] = '\u1f52';
			alphabet['u'][BR_ROUGH | ACC_GRAVE] = '\u1f53';
			alphabet['u'][BR_SMOOTH | ACC_ACUTE] = '\u1f54';
			alphabet['u'][BR_ROUGH | ACC_ACUTE] = '\u1f55';
			alphabet['u'][BR_SMOOTH | ACC_CIRC] = '\u1f56';
			alphabet['u'][BR_ROUGH | ACC_CIRC] = '\u1f57';
			alphabet['u'][ACC_GRAVE] = '\u1f7a';
			alphabet['u'][ACC_ACUTE] = '\u1f7b';
			alphabet['u'][BREVE] = '\u1fe0';
			alphabet['u'][MACRON] = '\u1fe1';
			alphabet['u'][ACC_GRAVE | DIAERESIS] = '\u1fe2';
			alphabet['u'][ACC_ACUTE | DIAERESIS] = '\u1fe3';
			alphabet['u'][ACC_CIRC] = '\u1fe6';
			alphabet['u'][ACC_CIRC | DIAERESIS] = '\u1fe7';
			
			alphabet['w'][0] = '\u03c9';
			alphabet['w'][BR_SMOOTH] = '\u1f60';
			alphabet['w'][BR_ROUGH] = '\u1f61';
			alphabet['w'][BR_SMOOTH | ACC_GRAVE] = '\u1f62';
			alphabet['w'][BR_ROUGH | ACC_GRAVE] = '\u1f63';
			alphabet['w'][BR_SMOOTH | ACC_ACUTE] = '\u1f64';
			alphabet['w'][BR_ROUGH | ACC_ACUTE] = '\u1f65';
			alphabet['w'][BR_SMOOTH | ACC_CIRC] = '\u1f66';
			alphabet['w'][BR_ROUGH | ACC_CIRC] = '\u1f67';
			alphabet['w'][ACC_GRAVE] = '\u1f7c';
			alphabet['w'][ACC_ACUTE] = '\u1f7d';
			alphabet['w'][BR_SMOOTH | IOTA_SUB] = '\u1fa0';
			alphabet['w'][BR_ROUGH | IOTA_SUB] = '\u1fa1';
			alphabet['w'][BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1fa2';
			alphabet['w'][BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1fa3';
			alphabet['w'][BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1fa4';
			alphabet['w'][BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1fa5';
			alphabet['w'][BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1fa6';
			alphabet['w'][BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1fa7';
			alphabet['w'][ACC_GRAVE | IOTA_SUB] = '\u1ff2';
			alphabet['w'][IOTA_SUB] = '\u1ff3';
			alphabet['w'][ACC_ACUTE | IOTA_SUB] = '\u1ff4';
			alphabet['w'][ACC_CIRC] = '\u1ff6';
			alphabet['w'][ACC_CIRC | IOTA_SUB] = '\u1ff7';

			alphabet['r'][BR_SMOOTH] = '\u1fe4';
			alphabet['r'][BR_ROUGH] = '\u1fe5';

		
		var consonants = /^(\*)?([abgdzqklmncptfxyv]|s[123]?)/i,
			dontconvert = /^([:,’‘\.\s])/,
			regexes = [
				[/^(\*)?([bgdzqklmncptfxyvs;\u0027])/i, [RE_CAP, RE_LETTER]],
				[/^(\*)?(r)([\)\(])?/i, [RE_CAP, RE_LETTER, RE_BREATHING]],
				[/^(\*)?([\)\(])?([aehiouw])([\)\(])?(\+)?([/\\=])?(\|)?(\+)?/i, 
					[RE_CAP, RE_BREATHING, RE_LETTER, RE_BREATHING, RE_DIAERESIS, RE_ACCENT, RE_IOTA, 
						RE_DIAERESIS]],
				[/^(\u0022)(?=[\d]+)?/, [RE_BAREQUOTE]]
			];

		findAtoms = function(greek) {
			var match = null,
				greek2 = '',
				pre = '';

			$.each(regexes, function (i, re) {
				match = re[0].exec(greek);
				if (match) {
					var is_capital = false,
						diacrits = 0, 
						letter = undefined;
					
					$.each(re[1], function (i, cat) {
						if (cat === RE_CAP) {
							if (typeof match[i+1] !== 'undefined') {
								is_capital = true;
							}
						} else if (cat === RE_LETTER) {
							letter = match[i+1];
						} else if (cat === RE_IOTA) {
							if (typeof match[i+1] !== 'undefined') {
								diacrits |= IOTA_SUB;
							}
						} else if (cat === RE_DIAERESIS) {
							if (typeof match[i+1] !== 'undefined') {
								diacrits |= DIAERESIS;
							}
						} else if (cat === RE_ACCENT) {
							diacrits |= ACCENTS[match[i+1]]
						} else if (cat === RE_BREATHING) {
							diacrits |= BREATHINGS[match[i+1]]
						} else if (cat === RE_BAREQUOTE) {
							letter = match[i+1];
						} else {
							diacrits = undefined;
						}
					});
					
					if (alphabet.hasOwnProperty(letter)) {
						if (alphabet[letter].hasOwnProperty(diacrits)) {
							greek2 = is_capital ? alphabet[letter][diacrits].toUpperCase() : alphabet[letter][diacrits];
						} else {
							greek2 = '⟦' + match[0] + '⟧';
						}
					}
					
					// greek2 = regexes[k][1](match);
					return false;
				}
			});

			if (match == null) {
				match = dontconvert.exec(greek);
				if (match) {
					greek2 = match[0]
				} else {
					return greek;
				}
			}

			pre = greek.substring(0, match.index);
			if (pre.length) {
				pre = '｢' + pre + '｣'
			}

			return  pre + greek2 + 
				findAtoms(greek.substring(match.index + match[0].length));
		};

		function checkSigmas(greek) {
				return greek.replace(/\u03c3([\s\.,;:]+)/g, "\u03c2$1");
		}

		$.fn.findBetaCode = function(options) {
			var lmnt = $(this);

			
			lmnt.contents().each(function (i, n) {
				if (n.nodeType === 3) {
					n.data = checkSigmas(findAtoms(n.data));
				} else {
					$(n).findBetaCode();
				}
			});
			
			
			//return Array(lmnt.html().length + 1).join('*');
		}

		$(this).each(function() {
				lmnt = $(this);
				
				lmnt.html(lmnt.findBetaCode());
				
				return lmnt;

		});
	}
})(jQuery);