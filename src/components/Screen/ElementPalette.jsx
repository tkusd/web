import React from 'react';
import Palette from '../Project/Palette';
import ElementList from './ElementList';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementPalette.styl');
}

class ElementPalette extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    selectedScreen: React.PropTypes.string,
    selectElement: React.PropTypes.func.isRequired
  }

  render(){
    const {elements, activeElement, selectedScreen, selectElement} = this.props;
    const elementCount = elements.filter(item => item.get('element_id') === selectedScreen).count();
    let content;

    if (elementCount){
      content = (
        <ElementList
          elements={elements}
          activeElement={activeElement}
          parent={selectedScreen}
          selectElement={selectElement}/>
      );
    } else {
      content = (
        <div className="element-palette__empty">
          <Translation id="project.no_elements"/>
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
