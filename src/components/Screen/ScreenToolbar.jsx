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
    isSavingChanges: React.PropTypes.bool.isRequired,
    screenSize: React.PropTypes.string.isRequired,
    updateScreenSize: React.PropTypes.func.isRequired,
    updateScreenDimension: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="screen-toolbar">
        <div className="screen-toolbar__status">{this.renderStatus()}</div>
        {this.renderResizeSelect()}
      </div>
    );
  }

  renderStatus(){
    const {isSavingChanges, hasUnsavedChanges, editable} = this.props;
    if (!editable) return;

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

  renderResizeSelect(){
    const {screenSize} = this.props;

    return (
      <div className="screen-toolbar__resize">
      <select value={screenSize} onChange={this.handleScreenResize}>
        <option value="320x480">Apple iPhone 4 (320x480)</option>
        <option value="320x568">Apple iPhone 5 (320x568)</option>
        <option value="375x667">Apple iPhone 6 (375x667)</option>
        <option value="414x736">Apple iPhone 6 Plus (414x736)</option>
        <option value="384x640">Google Nexus 4 (384x640)</option>
        <option value="360x640">Google Nexus 5 (360x640)</option>
        <option value="412x732">Google Nexus 6 (412x732)</option>
      </select>
        <button className="screen-toolbar__swap-btn" onClick={this.swapScreenDimension}>
          <FontAwesome icon="refresh"/>
        </button>
      </div>
    );
  }

  handleScreenResize = (e) => {
    const {updateScreenSize} = this.props;
    updateScreenSize(e.target.value);
  }

  swapScreenDimension = (e) => {
    const {updateScreenDimension, screenDimension} = this.props;

    if (screenDimension === 'landscape'){
      updateScreenDimension('horizontal');
    } else {
      updateScreenDimension('landscape');
    }
  }

  saveNow = (e) => {
    e.preventDefault();

    const {updateElementNow} = bindActions(ElementAction, this.context.flux);
    updateElementNow();
  }
}

export default ScreenToolbar;
