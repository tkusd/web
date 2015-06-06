import React from 'react';
import {setPageTitle, setStatusCode} from '../../actions/AppAction';

class NotFound extends React.Component {
  static onEnter(transition, params, query){
    this.context.executeAction(setPageTitle, 'Not found');
    this.context.executeAction(setStatusCode, 404);
  }

  render(){
    return <div>Not fonud</div>;
  }
}

export default NotFound;
