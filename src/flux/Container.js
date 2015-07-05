import React from 'react';
import Flux from './Flux';

const fluxType = React.PropTypes.instanceOf(Flux);

class Container extends React.Component {
  static propTypes = {
    flux: fluxType.isRequired
  }

  static childContextTypes = {
    flux: fluxType
  }

  getChildContext(){
    const {flux} = this.props;
    return {flux};
  }

  render(){
    return this.props.children;
  }
}

export default Container;
