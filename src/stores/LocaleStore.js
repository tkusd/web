import BaseStore from './BaseStore';

class LocaleStore extends BaseStore {
  constructor(context){
    super(context);

    this.locales = [];
    this.messages = {};
    this.language = 'en';
  }

  getLocales(){
    return this.locales;
  }

  getMessages(){
    return this.messages;
  }

  getMessage(key){
    const split = key.split('.');
    let message;

    try {
      message = split.reduce((messages, part) => messages[part], this.messages);
    } finally {
      if (message == null) {
        throw new ReferenceError('Could not find Intl message: ' + key);
      }
    }

    return message;
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
