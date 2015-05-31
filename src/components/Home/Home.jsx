import React from 'react';
import {setPageTitle} from '../../actions/AppAction';

class Home extends React.Component {
  static onEnter(transition, params, query){
    this.context.executeAction(setPageTitle, 'App Studio');
  }

  render(){
    return <div>Home</div>;
  }
}

export default Home;
