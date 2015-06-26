import React from 'react';
import ElementItem from './ElementItem';

if (process.env.BROWSER){
  require('../../styles/Project/ElementList.styl');
}

class ElementList extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string,
    parent: React.PropTypes.string.isRequired
  }

  render(){
    const {elements, parent, selectedElement} = this.props;

    const list = elements
      .filter(item => item.get('element_id') === parent)
      .map((item, id) => (
        <ElementItem key={id} elements={elements} element={item} selectedElement={selectedElement}/>
      )).toArray();

    return (
      <ul className="element-list">{list}</ul>
    );
  }
}

export default ElementList;
