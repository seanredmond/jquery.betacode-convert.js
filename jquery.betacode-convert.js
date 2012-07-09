/*
 * jQuery BetaCode Converter: jQuery plugin to convert BetaCode to Unicode
 *
 * © 2012 Sean Redmond.
 *
 * This file is part of jQuery BetaCode Converter.
 * 
 * jQuery BetaCode Converter is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * 
 * jQuery BetaCode Converter is distributed in the hope that it will be 
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General 
 * Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along
 * with jQuery BetaCode Converter.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

(function ($) {
  "use strict";

  var RE_LETTER = 1,
    RE_CAP       = 2,
    RE_BREATHING = 3,
    RE_ACCENT    = 4,
    RE_IOTA      = 5,
    RE_DIAERESIS = 6,
    RE_BAREQUOTE = 7,
    regexes = [
      [/^(\*)?([bgdzqklmncptfxyvs;\u0027])/i, [RE_CAP, RE_LETTER]],
      [/^(\*)?(r)([\)\(])?/i, [RE_CAP, RE_LETTER, RE_BREATHING]],
      [/^(\*)?([\)\(])?([aehiouw])([\)\(])?(\+)?([\/\\=])?(\|)?(\+)?/i,
        [RE_CAP, RE_BREATHING, RE_LETTER, RE_BREATHING, RE_DIAERESIS,
          RE_ACCENT, RE_IOTA, RE_DIAERESIS]],
      [/^(\u0022)(?=[\d]+)?/, [RE_BAREQUOTE]]
    ],

    // Components of diacritical flag
    BR_SMOOTH = 1 << 1,
    BR_ROUGH  = 1 << 2,
    ACC_ACUTE = 1 << 3,
    ACC_GRAVE = 1 << 4,
    ACC_CIRC  = 1 << 5,
    IOTA_SUB  = 1 << 6,
    DIAERESIS = 1 << 7,
    MACRON    = 1 << 8,
    BREVE     = 1 << 9,

    // Conversion hashes for categories of diacriticals
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
    dontconvert = /^([:,’‘\.\s])/,

    methods = {
      init: function (options) {
        var x = 1;
        // console.log('Init!');
        return this.each(function () {
          var lmnt = $(this); //.betacode2utf8(options);
            // lmnt.html(lmnt.findBetaCode());
            // $(this).betacode2utf8(options);
            // return this;
        });
      },

      convert: function () {
        var lmnt = this;
        lmnt.contents().each(function (i, n) {
          if (n.nodeType === 3) {
            n.data = methods._atoms(n.data);
            // n.data = checkSigmas(findAtoms(n.data));
          } else {
            $(n).betacode2utf8('convert');
          }
        });
      },

      _atoms: function (betacode) {
        var match = null,
          greek = '',
          pre = '';

        $.each(regexes, function (i, re) {
          match = re[0].exec(betacode);
          // console.log(match);
          if (match) {
            var is_capital = false,
              diacrits = 0,
              letter;

            $.each(re[1], function (i, cat) {
              if (cat === RE_CAP) {
                if (typeof match[i + 1] !== 'undefined') {
                  is_capital = true;
                }
              } else if (cat === RE_LETTER) {
                letter = match[i + 1];
              } else if (cat === RE_IOTA) {
                if (typeof match[i + 1] !== 'undefined') {
                  diacrits |= IOTA_SUB;
                }
              } else if (cat === RE_DIAERESIS) {
                if (typeof match[i + 1] !== 'undefined') {
                  diacrits |= DIAERESIS;
                }
              } else if (cat === RE_ACCENT) {
                diacrits |= ACCENTS[match[i + 1]];
              } else if (cat === RE_BREATHING) {
                diacrits |= BREATHINGS[match[i + 1]];
              } else if (cat === RE_BAREQUOTE) {
                letter = match[i + 1];
              } else {
                diacrits = undefined;
              }
            });

            if (alphabet.hasOwnProperty(letter)) {
              if (alphabet[letter].hasOwnProperty(diacrits)) {
                greek = is_capital ?
                    alphabet[letter][diacrits].toUpperCase() :
                    alphabet[letter][diacrits];
              } else {
                greek = '⟦' + match[0] + '⟧';
              }
            }

            return false;
          }
        });

        if (match === null) {
          match = dontconvert.exec(betacode);
          if (match) {
            greek = match[0];
          } else {
            return greek;
          }
        }

        pre = betacode.substring(0, match.index);
        if (pre.length) {
          pre = '｢' + pre + '｣';
        }

        return pre + greek +
          methods._atoms(betacode.substring(match.index + match[0].length));

      }
    };

  alphabet.a[0] = '\u03b1';
  alphabet.a[BR_SMOOTH] = '\u1f00';
  alphabet.a[BR_ROUGH] = '\u1f01';
  alphabet.a[BR_SMOOTH | ACC_GRAVE] = '\u1f02';
  alphabet.a[BR_ROUGH | ACC_GRAVE] = '\u1f03';
  alphabet.a[BR_SMOOTH | ACC_ACUTE] = '\u1f04';
  alphabet.a[BR_ROUGH | ACC_ACUTE] = '\u1f05';
  alphabet.a[BR_SMOOTH | ACC_CIRC] = '\u1f06';
  alphabet.a[BR_ROUGH | ACC_CIRC] = '\u1f07';
  alphabet.a[ACC_GRAVE] = '\u1f70';
  alphabet.a[ACC_ACUTE] = '\u1f71';
  alphabet.a[BR_SMOOTH | IOTA_SUB] = '\u1f80';
  alphabet.a[BR_ROUGH | IOTA_SUB] = '\u1f81';
  alphabet.a[BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1f82';
  alphabet.a[BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1f83';
  alphabet.a[BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1f84';
  alphabet.a[BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1f85';
  alphabet.a[BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1f86';
  alphabet.a[BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1f87';
  alphabet.a[BREVE] = '\u1fb0';
  alphabet.a[MACRON] = '\u1fb1';
  alphabet.a[ACC_GRAVE | IOTA_SUB] = '\u1fb2';
  alphabet.a[IOTA_SUB] = '\u1fb3';
  alphabet.a[ACC_ACUTE | IOTA_SUB] = '\u1fb4';
  alphabet.a[ACC_CIRC] = '\u1fb6';
  alphabet.a[ACC_CIRC | IOTA_SUB] = '\u1fb7';

  alphabet.e[0] = '\u03b5';
  alphabet.e[BR_SMOOTH] = '\u1f10';
  alphabet.e[BR_ROUGH] = '\u1f11';
  alphabet.e[BR_SMOOTH | ACC_GRAVE] = '\u1f12';
  alphabet.e[BR_ROUGH | ACC_GRAVE] = '\u1f13';
  alphabet.e[BR_SMOOTH | ACC_ACUTE] = '\u1f14';
  alphabet.e[BR_ROUGH | ACC_ACUTE] = '\u1f15';
  alphabet.e[ACC_GRAVE] = '\u1f72';
  alphabet.e[ACC_ACUTE] = '\u1f73';

  alphabet.h[0] = '\u03b7';
  alphabet.h[BR_SMOOTH] = '\u1f20';
  alphabet.h[BR_ROUGH] = '\u1f21';
  alphabet.h[BR_SMOOTH | ACC_GRAVE] = '\u1f22';
  alphabet.h[BR_ROUGH | ACC_GRAVE] = '\u1f23';
  alphabet.h[BR_SMOOTH | ACC_ACUTE] = '\u1f24';
  alphabet.h[BR_ROUGH | ACC_ACUTE] = '\u1f25';
  alphabet.h[BR_SMOOTH | ACC_CIRC] = '\u1f26';
  alphabet.h[BR_ROUGH | ACC_CIRC] = '\u1f27';
  alphabet.h[ACC_GRAVE] = '\u1f74';
  alphabet.h[ACC_ACUTE] = '\u1f75';
  alphabet.h[BR_SMOOTH | IOTA_SUB] = '\u1f90';
  alphabet.h[BR_ROUGH | IOTA_SUB] = '\u1f91';
  alphabet.h[BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1f92';
  alphabet.h[BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1f93';
  alphabet.h[BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1f94';
  alphabet.h[BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1f95';
  alphabet.h[BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1f96';
  alphabet.h[BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1f97';
  alphabet.h[ACC_GRAVE | IOTA_SUB] = '\u1fc2';
  alphabet.h[IOTA_SUB] = '\u1fc3';
  alphabet.h[ACC_ACUTE | IOTA_SUB] = '\u1fc4';
  alphabet.h[ACC_CIRC] = '\u1fc6';
  alphabet.h[ACC_CIRC | IOTA_SUB] = '\u1fc7';

  alphabet.i[0] = '\u03b9';
  alphabet.i[DIAERESIS] = '\u03ca';
  alphabet.i[BR_SMOOTH] = '\u1f30';
  alphabet.i[BR_ROUGH] = '\u1f31';
  alphabet.i[BR_SMOOTH | ACC_GRAVE] = '\u1f32';
  alphabet.i[BR_ROUGH | ACC_GRAVE] = '\u1f33';
  alphabet.i[BR_SMOOTH | ACC_ACUTE] = '\u1f34';
  alphabet.i[BR_ROUGH | ACC_ACUTE] = '\u1f35';
  alphabet.i[BR_SMOOTH | ACC_CIRC] = '\u1f36';
  alphabet.i[BR_ROUGH | ACC_CIRC] = '\u1f37';
  alphabet.i[ACC_GRAVE] = '\u1f76';
  alphabet.i[ACC_ACUTE] = '\u1f77';
  alphabet.i[BR_SMOOTH | IOTA_SUB] = '\u1f80';
  alphabet.i[BR_ROUGH | IOTA_SUB] = '\u1f81';
  alphabet.i[BREVE] = '\u1fd0';
  alphabet.i[MACRON] = '\u1fd1';
  alphabet.i[ACC_GRAVE | DIAERESIS] = '\u1fd2';
  alphabet.i[ACC_ACUTE | DIAERESIS] = '\u1fd3';
  alphabet.i[ACC_CIRC] = '\u1fd6';
  alphabet.i[ACC_CIRC | DIAERESIS] = '\u1fd7';

  alphabet.o[0] = '\u03bf';
  alphabet.o[BR_SMOOTH] = '\u1f40';
  alphabet.o[BR_ROUGH] = '\u1f41';
  alphabet.o[BR_SMOOTH | ACC_GRAVE] = '\u1f42';
  alphabet.o[BR_ROUGH | ACC_GRAVE] = '\u1f43';
  alphabet.o[BR_SMOOTH | ACC_ACUTE] = '\u1f44';
  alphabet.o[BR_ROUGH | ACC_ACUTE] = '\u1f45';
  alphabet.o[ACC_GRAVE] = '\u1f78';
  alphabet.o[ACC_ACUTE] = '\u1f79';

  alphabet.u[0] = '\u03c5';
  alphabet.u[DIAERESIS] = '\u03cb';
  alphabet.u[BR_SMOOTH] = '\u1f50';
  alphabet.u[BR_ROUGH] = '\u1f51';
  alphabet.u[BR_SMOOTH | ACC_GRAVE] = '\u1f52';
  alphabet.u[BR_ROUGH | ACC_GRAVE] = '\u1f53';
  alphabet.u[BR_SMOOTH | ACC_ACUTE] = '\u1f54';
  alphabet.u[BR_ROUGH | ACC_ACUTE] = '\u1f55';
  alphabet.u[BR_SMOOTH | ACC_CIRC] = '\u1f56';
  alphabet.u[BR_ROUGH | ACC_CIRC] = '\u1f57';
  alphabet.u[ACC_GRAVE] = '\u1f7a';
  alphabet.u[ACC_ACUTE] = '\u1f7b';
  alphabet.u[BREVE] = '\u1fe0';
  alphabet.u[MACRON] = '\u1fe1';
  alphabet.u[ACC_GRAVE | DIAERESIS] = '\u1fe2';
  alphabet.u[ACC_ACUTE | DIAERESIS] = '\u1fe3';
  alphabet.u[ACC_CIRC] = '\u1fe6';
  alphabet.u[ACC_CIRC | DIAERESIS] = '\u1fe7';

  alphabet.w[0] = '\u03c9';
  alphabet.w[BR_SMOOTH] = '\u1f60';
  alphabet.w[BR_ROUGH] = '\u1f61';
  alphabet.w[BR_SMOOTH | ACC_GRAVE] = '\u1f62';
  alphabet.w[BR_ROUGH | ACC_GRAVE] = '\u1f63';
  alphabet.w[BR_SMOOTH | ACC_ACUTE] = '\u1f64';
  alphabet.w[BR_ROUGH | ACC_ACUTE] = '\u1f65';
  alphabet.w[BR_SMOOTH | ACC_CIRC] = '\u1f66';
  alphabet.w[BR_ROUGH | ACC_CIRC] = '\u1f67';
  alphabet.w[ACC_GRAVE] = '\u1f7c';
  alphabet.w[ACC_ACUTE] = '\u1f7d';
  alphabet.w[BR_SMOOTH | IOTA_SUB] = '\u1fa0';
  alphabet.w[BR_ROUGH | IOTA_SUB] = '\u1fa1';
  alphabet.w[BR_SMOOTH | ACC_GRAVE | IOTA_SUB] = '\u1fa2';
  alphabet.w[BR_ROUGH | ACC_GRAVE | IOTA_SUB] = '\u1fa3';
  alphabet.w[BR_SMOOTH | ACC_ACUTE | IOTA_SUB] = '\u1fa4';
  alphabet.w[BR_ROUGH | ACC_ACUTE | IOTA_SUB] = '\u1fa5';
  alphabet.w[BR_SMOOTH | ACC_CIRC | IOTA_SUB] = '\u1fa6';
  alphabet.w[BR_ROUGH | ACC_CIRC | IOTA_SUB] =  '\u1fa7';
  alphabet.w[ACC_GRAVE | IOTA_SUB] = '\u1ff2';
  alphabet.w[IOTA_SUB] = '\u1ff3';
  alphabet.w[ACC_ACUTE | IOTA_SUB] = '\u1ff4';
  alphabet.w[ACC_CIRC] = '\u1ff6';
  alphabet.w[ACC_CIRC | IOTA_SUB] = '\u1ff7';

  alphabet.r[BR_SMOOTH] = '\u1fe4';
  alphabet.r[BR_ROUGH] = '\u1fe5';

  $.fn.betacode2utf8 = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }

    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }

    $.error('Method ' +  method + ' does not exist on jQuery.tooltip');
  };
}(jQuery));