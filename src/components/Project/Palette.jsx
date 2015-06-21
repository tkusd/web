import React from 'react';

if (process.env.BROWSER){
  require('../../styles/Project/Palette.styl');
}

class Palette extends React.Component {
  static propTypes = {
    title: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ])
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
