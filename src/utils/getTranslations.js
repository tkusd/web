import {vsprintf} from 'sprintf-js';
import LocaleStore from '../stores/LocaleStore';

function getTranslations(context, lang){
  const localeStore = context.getStore(LocaleStore);
  if (!lang) lang = localeStore.getLanguage();

  const locales = localeStore.getData(lang);
  const engLocales = localeStore.getData('en');

  return (id, ...args) => {
    let str;

    if (locales.has(id)){
      str = locales.get(id);
    } else if (lang !== 'en' && engLocales.has(id)){
      str = engLocales.get(id);
    } else {
      return id;
    }

    return vsprintf(str, args);
  };
}

export default getTranslations;
