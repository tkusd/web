import React from 'react';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Screen/ScreenToolbar.styl');
}

class ScreenToolbar extends React.Component {
  static propTypes = {
    editable: React.PropTypes.bool.isRequired,
    updating: React.PropTypes.bool.isRequired,
    changed: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="screen-toolbar">
        {this.renderStatus()}
      </div>
    );
  }

  renderStatus(){
    const {editable, updating, changed} = this.props;
    if (!editable) return;

    let status = 'Saved';

    if (updating){
      status = (
        <span>
          <FontAwesome icon="spinner" spin/>Saving...
        </span>
      );
    } else if (changed){
      status = 'Unsaved';
    }

    return (
      <div className="screen-toolbar__status">
        {status}
      </div>
    );
  }
}

export default ScreenToolbar;
