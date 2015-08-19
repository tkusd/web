import React from 'react';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';

if (process.env.BROWSER){
  require('../../styles/Screen/ScreenToolbar.styl');
}

@pureRender
class ScreenToolbar extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    hasUnsavedChanges: React.PropTypes.bool.isRequired,
    isSavingChanges: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="screen-toolbar">
        <div className="screen-toolbar__status">{this.renderStatus()}</div>
      </div>
    );
  }

  renderStatus(){
    const {isSavingChanges, hasUnsavedChanges} = this.props;

    if (isSavingChanges){
      return (
        <span className="screen-toolbar__loading">
          <FontAwesome icon="circle-o-notch" spin/>Saving...
        </span>
      );
    } else if (hasUnsavedChanges){
      return <a className="screen-toolbar__save-btn" onClick={this.saveNow}>Save now</a>;
    } else {
      return 'Saved';
    }
  }

  saveNow = (e) => {
    e.preventDefault();

    const {updateElementNow} = bindActions(ElementAction, this.context.flux);
    updateElementNow();
  }
}

export default ScreenToolbar;
