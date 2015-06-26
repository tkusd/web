import React from 'react';
import Palette from './Palette';
import ElementList from './ElementList';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Project/ElementPalette.styl');
}

class ElementPalette extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string
  }

  render(){
    const {elements, selectedElement, selectedScreen} = this.props;

    let content;

    if (selectedScreen){
      content = <ElementList elements={elements} selectedElement={selectedElement} parent={selectedScreen}/>;
    } else {
      content = (
        <div className="element-palette__empty">
          <Translation id="project.select_screen_hint"/>
        </div>
      );
    }

    return (
      <Palette title={<Translation id="project.elements"/>}>
        {content}
      </Palette>
    );
  }
}

export default ElementPalette;
