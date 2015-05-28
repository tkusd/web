import React from 'react';

class Container extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired
  }

  static childContextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getStore: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
  }

  getChildContext(){
    let {context} = this.props;

    return {
      executeAction: context.executeAction.bind(context),
      getStore: context.getStore.bind(context),
      dispatch: context.dispatch.bind(context)
    };
  }

  render(){
    return React.createElement(this.props.children.type, {
      context: this.props.context
    });
  }
}

export default Container;
