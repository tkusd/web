import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import cloneWithProps from 'react/lib/cloneWithProps';

@connectToStores(['ModalStore'], (stores, props) => ({
  modals: stores.ModalStore.getList()
}))
class ModalContainer extends React.Component {
  render(){
    const {modals} = this.state;

    return (
      <div>
        {modals.map((modal, key) => (
          cloneWithProps(modal, {key})
        )).toArray()}
      </div>
    );
  }
}

export default ModalContainer;
