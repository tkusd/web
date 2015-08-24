import BaseStore from './BaseStore';

class LocaleStore extends BaseStore {
  constructor(context){
    super(context);

    this.locales = [];
    this.formats = {};
    this.messages = {};
    this.language = 'en';
  }

  getLocales(){
    return this.locales;
  }

  getFormats(){
    return this.formats;
  }

  getMessages(){
    return this.messages;
  }

  getMessage(key){
    const split = key.split('.');
    let result = this.messages;
    let len = split.length;

    if (!result) return key;

    for (let i = 0; i < len; i++){
      if (!result.hasOwnProperty(split[i])){
        return key;
      }

      result = result[split[i]];
    }

    return result;
  }

  getLanguage(){
    return this.language;
  }

  setLanguage(lang){
    this.language = lang;
    this.emitChange();
  }

  setData(data){
    this.locales = data.locales;
    this.formats = data.formats;
    this.messages = data.messages;
  }

  dehydrate(){
    return {
      language: this.language
    };
  }

  rehydrate(state){
    this.language = state.language;
  }
}

export default LocaleStore;
