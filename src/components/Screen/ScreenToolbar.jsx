import React from 'react';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Screen/ScreenToolbar.styl');
}

const SCALE_OPTIONS = [0.5, 0.7, 0.9, 1, 1.1, 1.3, 1.5];

const SIZE_OPTIONS = {
  '320x480': 'iPhone 4',
  '320x568': 'iPhone 5',
  '375x667': 'iPhone 6',
  '414x736': 'iPhone 6 Plus',
  '384x640': 'Nexus 4',
  '360x640': 'Nexus 5',
  '412x732': 'Nexus 6'
};

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
    updateScreenScale: React.PropTypes.func.isRequired,
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
          <FontAwesome icon="circle-o-notch" spin/>
          <FormattedMessage message="project.saving"/>
        </span>
      );
    } else if (hasUnsavedChanges){
      return (
        <a className="screen-toolbar__save-btn" onClick={this.saveNow}>
          <FormattedMessage message="project.save_now"/>
        </a>
      );
    } else {
      return <FormattedMessage message="project.saved"/>;
    }
  }

  renderResizeSelect(){
    const {screenSize, screenScale} = this.props;

    return (
      <div className="screen-toolbar__resize">
        <select value={screenScale} onChange={this.handleScreenScale}>
          {SCALE_OPTIONS.map((scale, i) => (
            <option key={i} value={scale}>{Math.floor(scale * 100) + '%'}</option>
          ))}
        </select>
        <select value={screenSize} onChange={this.handleScreenResize}>
          {Object.keys(SIZE_OPTIONS).map((size, i) => (
            <option value={size} key={i}>{`${SIZE_OPTIONS[size]} (${size})`}</option>
          ))}
        </select>
        <button className="screen-toolbar__swap-btn" onClick={this.swapScreenDimension}>
          <FontAwesome icon="refresh"/>
        </button>
      </div>
    );
  }

  handleScreenScale = (e) => {
    const {updateScreenScale} = this.props;
    updateScreenScale(+e.target.value);
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
