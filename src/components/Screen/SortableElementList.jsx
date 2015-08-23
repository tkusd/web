import React from 'react';
import {DropTarget} from 'react-dnd';
import Immutable from 'immutable';
import bindActions from '../../utils/bindActions';
import * as ElementAction from '../../actions/ElementAction';

const spec = {
  drop(){
    //
  }
};

export default function SortableElementList(type){
  return Component => {
    @DropTarget(type, spec, connect => ({
      connectDropTarget: connect.dropTarget()
    }))
    class SortableElementList extends React.Component {
      static contextTypes = {
        flux: React.PropTypes.object.isRequired
      }

      static propTypes = {
        elements: React.PropTypes.object.isRequired,

        // React DnD
        connectDropTarget: React.PropTypes.func.isRequired
      }

      constructor(props, context){
        super(props, context);

        this.state = {
          elements: this.props.elements,
          movingElement: null
        };

        this.moveElement = this.moveElement.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
      }

      componentWillReceiveProps(nextProps){
        if (!Immutable.is(this.props.elements, nextProps.elements)){
          this.setState({
            elements: nextProps.elements
          });
        }
      }

      render(){
        const {connectDropTarget} = this.props;

        return connectDropTarget(
          <Component {...this.props}
            elements={this.state.elements}
            moveElement={this.moveElement}
            updateIndex={this.updateIndex}/>
        );
      }

      moveElement(id, atIndex){
        const {elements} = this.state;
        const element = elements.get(id);
        const parent = element.get('element_id');
        let index = 1;

        let siblings = elements
          .filter(element => element.get('element_id') === parent)
          .remove(id);

        siblings = siblings.slice(0, atIndex - 1)
          .set(id, element)
          .concat(siblings.slice(atIndex - 1))
          .map(element => element.set('index', index++));

        let newElements = elements
          .filter(element => element.get('element_id') !== parent)
          .concat(siblings);

        this.setState({
          elements: newElements,
          movingElement: id
        });
      }

      updateIndex(){
        const {elements, movingElement} = this.state;
        if (!movingElement) return;

        const oldElements = this.props.elements;
        const element = elements.get(movingElement);
        const parentID = element.get('element_id');
        const {updateElementIndex} = bindActions(ElementAction, this.context.flux);

        let currentIndex = oldElements.filter(element => element.get('element_id') === parentID)
          .map(element => element.get('id'));

        let newIndex = elements.filter(element => element.get('element_id') === parentID)
          .map(element => element.get('id'));

        if (Immutable.is(currentIndex, newIndex)) return;

        updateElementIndex(parentID, newIndex.toArray());

        this.setState({
          movingElement: null
        });
      }
    }

    return SortableElementList;
  };
}
