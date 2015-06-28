import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import Translation from '../i18n/Translation';
import cx from 'classnames';
import {createChildElement} from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Project/ComponentItem.styl');
}

function collectInitialProps(obj={}){
  let props = {};

  Object.keys(obj).forEach(key => {
    let prop = obj[key];

    if (prop.hasOwnProperty('initialValue')){
      props[key] = prop.initialValue;
    }
  });

  return props;
}

const spec = {
  beginDrag(props){
    return props.component.toObject();
  },

  endDrag(props, monitor, {context}){
    if (!monitor.didDrop()) return;

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (!dropResult) return;

    const initialAttributes = collectInitialProps(item.attributes);
    const initialStyles = collectInitialProps(item.styles);

    context.executeAction(createChildElement, dropResult.id, {
      name: context.__('project.' + item.type),
      type: item.type,
      attributes: initialAttributes,
      styles: initialStyles
    });
  }
};

@DragSource(ItemTypes.CONTAINER, spec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class ComponentItem extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired
  }

  static propTypes = {
    component: React.PropTypes.object.isRequired,
    components: React.PropTypes.object.isRequired,

    // React DnD
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  }

  render(){
    const {component, connectDragSource, isDragging} = this.props;

    let className = cx('component-item', {
      'component-item--dragging': isDragging
    });

    return connectDragSource(
      <div className={className}>
        <Translation id={'project.' + component.get('type')}/>
      </div>
    );
  }
}

export default ComponentItem;
