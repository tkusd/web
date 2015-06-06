import React from 'react';
import Element from './Element';

class ElementList extends React.Component {
  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  render(){
    const {elements, selectedElement} = this.props;
    let list = [];

    elements.forEach(item => {
      list.push(<Element key={item.get('id')} element={item} selectedElement={selectedElement}/>);
    });

    return (
      <ul className="element-list">{list}</ul>
    );
  }
}

export default ElementList;
