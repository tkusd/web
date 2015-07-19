import React from 'react';
import connectToStores from './connectToStores';

function connectToIntlStore(Component){
  @connectToStores(['LocaleStore'], ({LocaleStore}, props) => ({
    messages: LocaleStore.getMessages(),
    locales: LocaleStore.getLocales(),
    message: props.message ? LocaleStore.getMessage(props.message) : null
  }))
  class IntlStoreConnector extends Component {
    render(){
      return React.createElement(Component, {
        ...this.props,
        locales: this.state.locales,
        messages: this.state.messages,
        message: this.state.message
      });
    }
  }

  return IntlStoreConnector;
}

export default connectToIntlStore;
