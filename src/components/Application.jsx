import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores, provideContext} from 'fluxible/addons';
import {handleHistory} from 'fluxible-router';

class Application extends React.Component {
  static contextTypes = {
    getStore: React.PropTypes.func,
    executeAction: React.PropTypes.func
  }

  constructor(props, context){
    super(props, context);
  }

  componentDidUpdate(prevProps){
    let newProps = this.props;

    if (newProps.ApplicationStore.pageTitle === prevProps.ApplicationStore.pageTitle){
      return;
    }

    document.title = newProps.ApplicationStore.pageTitle;
  }

  render(){
    let Handler = this.props.currentRoute.get('handler');

    return <Handler/>;
  }
}

Application = connectToStores(Application, [ApplicationStore], (stores, props) => {
  return {
    ApplicationStore: stores.ApplicationStore.getState()
  };
});

Application = handleHistory(Application);

Application = provideContext(Application);

export default Application;
