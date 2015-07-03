import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';
import contextTypes from './contextTypes';
import Context from './Context';

class Container extends React.Component {
  static propTypes = {
    context: React.PropTypes.instanceOf(Context).isRequired
  }

  static childContextTypes = contextTypes

  getChildContext(){
    let {context} = this.props;

    return {
      executeAction: context.executeAction.bind(context),
      getStore: context.getStore.bind(context),
      dispatch: context.dispatch.bind(context)
    };
  }

  render(){
    return cloneWithProps(this.props.children, {
      context: this.props.context
    });
  }
}

export default Container;
