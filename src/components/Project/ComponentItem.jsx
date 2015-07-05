import React from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../../constants/ItemTypes';
import Translation from '../i18n/Translation';
import cx from 'classnames';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';

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

  endDrag(props, monitor, component){
    if (!monitor.didDrop()) return;

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (!dropResult) return;

    const initialAttributes = collectInitialProps(item.attributes);
    const initialStyles = collectInitialProps(item.styles);
    const {createChildElement} = bindActions(ElementAction, component.context.flux);

    createChildElement(dropResult.id, {
      name: component.context.__('project.' + item.type),
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
    flux: React.PropTypes.object.isRequired,
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
    , 'copy');
  }
}

export default ComponentItem;
