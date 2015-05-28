import React from 'react';
import AppStore from '../../stores/AppStore';
import {RouteHandler} from 'react-router';
import {connectToStores} from '../../flux';
import Header from './Header';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

class Application extends React.Component {
  componentDidUpdate(){
    if (process.env.BROWSER){
      document.title = this.state.pageTitle;
    }
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
