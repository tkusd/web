import React, {cloneElement} from 'react';
import connectToStores from '../../decorators/connectToStores';

@connectToStores(['ModalStore'], (stores, props) => ({
  modals: stores.ModalStore.getList()
}))
class ModalContainer extends React.Component {
  render(){
    const {modals} = this.state;

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
