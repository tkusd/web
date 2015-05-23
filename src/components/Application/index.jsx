import React from 'react';
import AppStore from '../../stores/AppStore';
import {RouteHandler} from 'react-router';
import {connectToStores} from 'fluxible/addons';
import Header from './Header';

if (process.env.BROWSER){
  require('../../styles/Application.css');
}

class Application extends React.Component {
  componentDidUpdate(){
    document.title = this.props.pageTitle;
  }

  render(){
    return (
      <div>
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
