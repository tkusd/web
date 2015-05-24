import React from 'react';
import AppStore from '../../stores/AppStore';
import {RouteHandler} from 'react-router';
import {connectToStores} from 'fluxible/addons';
import Header from './Header';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

class Application extends React.Component {
  componentDidUpdate(){
    document.title = this.props.pageTitle;
  }

  render(){
    return (
      <div id="app">
        <Header/>
        <RouteHandler/>
      </div>
    );
  }
}

Application = connectToStores(Application, [AppStore], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle()
}));

export default Application;
