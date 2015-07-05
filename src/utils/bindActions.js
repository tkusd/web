import mapValues from './mapValues';

export default function bindActions(actions, flux){
  return mapValues(actions, act => {
    return function(){
      return act.apply(flux, arguments);
    };
  });
}
