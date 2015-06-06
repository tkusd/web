import React from 'react';

class Palette extends React.Component {
  static propTypes = {
    title: React.PropTypes.string
  }

  render(){
    return (
      <div className="palette">
        <h3 className="palette__title">{this.props.title}</h3>
        <div className="palette__content">{this.props.children}</div>
      </div>
    );
  }
}

export default Palette;
