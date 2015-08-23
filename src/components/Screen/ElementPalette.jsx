import React from 'react';
import Palette from '../Project/Palette';
import ElementList from './ElementList';
import {FormattedMessage} from '../intl';
import pureRender from '../../decorators/pureRender';
import SortableElementList from './SortableElementList';
import ItemTypes from '../../constants/ItemTypes';

if (process.env.BROWSER){
  require('../../styles/Screen/ElementPalette.styl');
}

@SortableElementList(ItemTypes.ELEMENT_ITEM)
@pureRender
class ElementPalette extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string
  }

  render(){
    const {elements, selectedScreen} = this.props;
    const elementCount = elements.filter(item => item.get('element_id') === selectedScreen).count();
    let content;

    if (elementCount){
      content = (
        <ElementList {...this.props}
          parent={selectedScreen}/>
      );
    } else {
      content = (
        <div className="element-palette__empty">
          <FormattedMessage message="project.no_elements"/>
        </div>
      );
    }

    return (
      <Palette title={<FormattedMessage message="project.elements"/>}>
        {content}
      </Palette>
    );
  }
}

export default ElementPalette;
