import React from 'react';
import AttributePalette from './AttributePalette';
import ElementPalette from './ElementPalette';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementSidebar.styl');
}

@pureRender
class ElementSidebar extends React.Component {
  render(){
    return (
      <aside className="element-sidebar">
        <div className="element-sidebar__attribute-palette">
          <AttributePalette {...this.props}/>
        </div>
        <div className="element-sidebar__element-palette">
          <ElementPalette {...this.props}/>
        </div>
      </aside>
    );
  }
}

export default ElementSidebar;
