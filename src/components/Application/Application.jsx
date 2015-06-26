import React from 'react';
import AppStore from '../../stores/AppStore';
import LocaleStore from '../../stores/LocaleStore';
import {RouteHandler} from 'react-router';
import connectToStores from '../../decorators/connectToStores';
import getTranslations from '../../utils/getTranslations';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

@connectToStores([AppStore, LocaleStore], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle()
}))
class Application extends React.Component {
  static childContextTypes = {
    __: React.PropTypes.func.isRequired
  }

  getChildContext(){
    return {
      __: getTranslations(this.context)
    };
  }

  componentDidUpdate(){
    if (process.env.BROWSER){
      document.title = this.state.pageTitle;
    }
  }

  render(){
    return <RouteHandler/>;
  }
}

export default Application;
