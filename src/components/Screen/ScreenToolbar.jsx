import React from 'react';

if (process.env.BROWSER){
  require('../../styles/Screen/ScreenToolbar.styl');
}

class ScreenToolbar extends React.Component {
  static propTypes = {
    hasUnsavedChanges: React.PropTypes.bool.isRequired
  }

  render(){
    const {hasUnsavedChanges} = this.props;

    return (
      <div className="screen-toolbar">{hasUnsavedChanges ? 'Unsaved' : 'Saved'}</div>
    );
  }
}

export default ScreenToolbar;
