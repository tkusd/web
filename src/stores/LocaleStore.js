import BaseStore from './BaseStore';
import {Map} from 'immutable';

function toMap(data, payload, prefix=''){
  Object.keys(payload).forEach(key => {
    if (typeof payload[key] === 'object'){
      toMap(data, payload[key], prefix + key + '.');
    } else {
      data.set(prefix + key, payload[key]);
    }
  });
}

class LocaleStore extends BaseStore {
  static storeName = 'LocaleStore'

  constructor(context){
    super(context);

    this.data = {};
    this.language = 'en';
  }

  getData(lang){
    return this.data[lang];
  }

  setData(lang, payload){
    if (!this.data.hasOwnProperty(lang)) this.data[lang] = Map();

    this.data[lang] = this.data[lang].withMutations(data => {
      toMap(data, payload);
    });

    this.emitChange();
  }

  getLanguage(){
    return this.language;
  }

  setLanguage(lang){
    this.language = lang;
    this.emitChange();
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
