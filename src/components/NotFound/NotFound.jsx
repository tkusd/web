import React from 'react';
import * as AppAction from '../../actions/AppAction';
import bindActions from '../../utils/bindActions';

class NotFound extends React.Component {
  static onEnter(state, transition){
    const {setPageTitle, setStatusCode} = bindActions(AppAction, this);

    setPageTitle('Not found');
    setStatusCode(404);
  }

  render(){
    return <div>Not fonud</div>;
  }
}

export default NotFound;
