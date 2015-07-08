import React from 'react';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Screen/ScreenToolbar.styl');
}

class ScreenToolbar extends React.Component {
  static propTypes = {
    editable: React.PropTypes.bool.isRequired,
    updating: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="screen-toolbar">
        {this.renderStatus()}
      </div>
    );
  }

  renderStatus(){
    const {editable, updating} = this.props;
    if (!editable) return;

    return (
      <div className="screen-toolbar__status">
        {updating ? (
          <span>
            <FontAwesome icon="spinner" spin/>Saving...
          </span>
        ) : 'Saved'}
      </div>
    );
  }
}

export default ScreenToolbar;
