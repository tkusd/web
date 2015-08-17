import React from 'react';
import View from './View';

class NoopContainer extends React.Component {
  render(){
    return <View {...this.props}/>;
  }
}

export default NoopContainer;
