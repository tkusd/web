import {vsprintf} from 'sprintf-js';
import LocaleStore from '../stores/LocaleStore';

function getTranslations(context, lang){
  const localeStore = context.getStore(LocaleStore);
  if (!lang) lang = localeStore.getLanguage();

  const locales = localeStore.getData(lang);

  return (id, ...args) => {
    let str;

    if (locales && locales.has(id)){
      str = locales.get(id);
    } else {
      return id;
    }

    return vsprintf(str, args);
  };
}

export default getTranslations;
