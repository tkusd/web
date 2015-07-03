import {vsprintf} from 'sprintf-js';

function getTranslations(context, lang){
  const {LocaleStore} = context.getStore();
  if (!lang) lang = LocaleStore.getLanguage();

  const locales = LocaleStore.getData(lang);

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
