import React, {cloneElement} from 'react';

class ModalContainer extends React.Component {
  static propTypes = {
    modals: React.PropTypes.object.isRequired
  }

  render(){
    const {modals} = this.props;

    return (
      <div>
        {modals.map((modal, key) => (
          cloneElement(modal, {key})
        )).toArray()}
      </div>
    );
  }
}

export default ModalContainer;
