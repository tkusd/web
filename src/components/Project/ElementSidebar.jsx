import React from 'react';
// import AttributePalette from './AttributePalette';
// import StylePalette from './StylePalette';
import ElementPalette from './ElementPalette';

if (process.env.BROWSER){
  require('../../styles/Project/ElementSidebar.styl');
}

class ElementSidebar extends React.Component {
  render(){
    return (
      <aside className="element-sidebar">
        <ElementPalette {...this.props}/>
      </aside>
    );
  }
}

export default ElementSidebar;
