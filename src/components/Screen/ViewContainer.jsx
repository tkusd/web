import React from 'react';

import View from '../preview/View';

class ViewContainer extends React.Component {
  render(){
    return (
      <div>
        <View {...this.props}/>
      </div>
    );
  }
}

export default ViewContainer;
