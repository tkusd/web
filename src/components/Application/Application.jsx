import React from 'react';
import {RouteHandler} from 'react-router';
import connectToStores from '../../decorators/connectToStores';
import getTranslations from '../../utils/getTranslations';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

@connectToStores(['AppStore', 'LocaleStore'], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle()
}))
class Application extends React.Component {
  static contextTypes = {
    getStore: React.PropTypes.func.isRequired
  }

  static childContextTypes = {
    __: React.PropTypes.func.isRequired
  }

  getChildContext(){
    return {
      __: getTranslations(this.context)
    };
  }

  componentDidUpdate(){
    document.title = this.state.pageTitle;
  }

  render(){
    return <RouteHandler/>;
  }
}

export default Application;
