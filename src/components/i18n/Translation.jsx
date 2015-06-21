import React from 'react';

class Translation extends React.Component {
  static contextTypes = {
    __: React.PropTypes.func.isRequired
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    args: React.PropTypes.array
  }

  static defaultProps = {
    args: []
  }

  render(){
    const {id, args} = this.props;
    return <span>{this.context.__(id, args)}</span>;
  }
}

export default Translation;
