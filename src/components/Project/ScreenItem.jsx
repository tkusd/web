import React from 'react';
import cx from 'classnames';
import {selectScreen} from '../../actions/ElementAction';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenItem.styl');
}

class ScreenItem extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    const {element, selectedScreen} = this.props;

    let classname = cx('screen-item', {
      'screen-item--selected': selectedScreen === element.get('id')
    });

    return (
      <div className={classname} onClick={this.handleClick}>
        <strong className="screen-item__name">{element.get('name')}</strong>
      </div>
    );
  }

  handleClick(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(selectScreen, element.get('id'));
  }
}

export default ScreenItem;
