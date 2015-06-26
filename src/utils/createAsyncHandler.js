import React from 'react';

// https://gist.github.com/gaearon/fbd581089255cd529e62
function createAsyncHandler(getHandlerAsync){
  let Handler = null;

  return class AsyncComponent extends React.Component {
    static onEnter(transition, params, query){
      return getHandlerAsync().then(resolvedHandler => {
        Handler = resolvedHandler;

        if (typeof Handler.onEnter !== 'function'){
          return;
        }

        return Handler.onEnter.call(this, transition, params, query);
      });
    }

    static onLeave(transition){
      if (Handler && typeof Handler.onLeave === 'function'){
        return Handler.onLeave.call(this, transition);
      }
    }

    render(){
      return <Handler {...this.props}/>;
    }
  };
}

export default createAsyncHandler;
