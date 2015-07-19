import isLocaleSupported from 'intl-locales-supported';

function loadIntlPolyfill(lang) {
  if (window.Intl && isLocaleSupported(lang)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    require.ensure(['intl'], require => {
      require('intl');
      resolve();
    }, 'intl');
  });
}

function loadLocaleData(flux, lang) {
  const hasIntl = isLocaleSupported(lang);

  require('expose?ReactIntl!react-intl');

  function setLocaleData(data){
    flux.getStore().LocaleStore.setData(data);
  }

  return new Promise((resolve, reject) => {
    switch (lang){
      case 'zh-TW':
        if (hasIntl) {
          require.ensure([
            'react-intl/dist/locale-data/zh',
            '../../locales/zh-TW'
          ], require => {
            require('react-intl/dist/locale-data/zh');
            setLocaleData(require('../../locales/zh-TW'));
            resolve();
          }, 'locale-zh-TW');
        } else {
          require.ensure([
            'intl/locale-data/jsonp/zh-Hant-TW',
            'react-intl/dist/locale-data/zh',
            '../../locales/zh-TW'
          ], require => {
            require('intl/locale-data/jsonp/zh-Hant-TW');
            require('react-intl/dist/locale-data/zh');
            setLocaleData(require('../../locales/zh-TW'));
            resolve();
          }, 'locale-zh-TW-intl');
        }

        break;

      default:
        if (hasIntl){
          require.ensure(['../../locales/en'], require => {
            setLocaleData(require('../../locales/en'));
            resolve();
          }, 'locale-en');
        } else {
          require.ensure([
            'intl/locale-data/jsonp/en',
            '../../locales/en'
          ], require => {
            require('intl/locale-data/jsonp/en');
            setLocaleData(require('../../locales/en'));
            resolve();
          }, 'locale-en-intl');
        }
    }
  });
}

export default function loadIntl(flux, lang) {
  return loadIntlPolyfill(lang).then(() => {
    return loadLocaleData(flux, lang);
  });
}
