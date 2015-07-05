import React from 'react';
import * as AppAction from '../../actions/AppAction';
import bindActions from '../../utils/bindActions';

class Home extends React.Component {
  static onEnter(state, transition){
    const {setPageTitle} = bindActions(AppAction, this);
    setPageTitle('App Studio');
  }

  render(){
    return <div>Home</div>;
  }
}

export default Home;
