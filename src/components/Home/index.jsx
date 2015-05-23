import React from 'react';
import {setPageTitle} from '../../actions/AppAction';

class Home extends React.Component {
  render(){
    return <div>Home</div>;
  }
}

Home.onEnter = function(transition, params, query, callback){
  this.context.executeAction(setPageTitle, 'App Studio', callback);
};

export default Home;
