import availableLocales from './availableLocales';
import isLocaleSupported from 'intl-locales-supported';

if (global.Intl){
  if (!isLocaleSupported(availableLocales)){
    const IntlPolyfill = require('intl');
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  global.Intl = require('intl');
}
