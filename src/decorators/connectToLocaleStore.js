import React from 'react';
import connectToStores from './connectToStores';

function connectToLocaleStore(Component){
  @connectToStores(['LocaleStore'], ({LocaleStore}, props) => ({
    messages: LocaleStore.getMessages(),
    locales: LocaleStore.getLocales(),
    message: props.message ? LocaleStore.getMessage(props.message) : null
  }))
  class LocaleStoreConnector extends Component {
    render(){
      return React.createElement(Component, {
        ...this.props,
        locales: this.state.locales,
        messages: this.state.messages,
        message: this.state.message
      });
    }
  }

  return LocaleStoreConnector;
}

export default connectToLocaleStore;
