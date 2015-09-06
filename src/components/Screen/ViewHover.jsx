import React from 'react';

if (process.env.BROWSER){
  require('../../styles/Screen/ViewHover.styl');
}

class ViewHover extends React.Component {
  static propTypes = {
    hoverElements: React.PropTypes.object.isRequired
  }

  render(){
    const {hoverElements} = this.props;
    let node;

    if (hoverElements.count()){
      node = document.getElementById('e' + hoverElements.last());
    }

    if (!node) return <div/>;

    const rect = node.getBoundingClientRect();

    return (
      <div className="view-hover"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }}/>
    );
  }
}

export default ViewHover;