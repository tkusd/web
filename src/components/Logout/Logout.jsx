import React from 'react';
import * as TokenAction from '../../actions/TokenAction';
import bindActions from '../../utils/bindActions';

class Logout extends React.Component {
  static onEnter(state, transition){
    const {logout} = bindActions(TokenAction, this);

    return logout().then(() => {
      transition.to('/');
    });
  }

  render(){
    return <div></div>;
  }
}

export default Logout;
