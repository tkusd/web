import React from 'react';
import {assign} from 'lodash';

function connectToStores(Component, stores, getter){
  if (!Component){
    throw new TypeError('Component is required');
  }

  if (!Array.isArray(stores)){
    stores = [stores];
  }

  if (typeof getter !== 'function'){
    throw new TypeError('getter must be a function');
  }

  class StoreConnector extends Component {
    static contextTypes = assign({
      getStore: React.PropTypes.func.isRequired
    }, Component.contextTypes)

    static displayName = Component.displayName || Component.name

    constructor(props, context){
      super(props, context);

      this._handleStoreChange = this._handleStoreChange.bind(this);
      this.state = assign(this.getStateFromStores(), this.state);
    }

    componentDidMount(){
      stores.forEach(store => {
        this.context.getStore(store).addChangeListener(this._handleStoreChange);
      });

      if (typeof super.componentDidMount === 'function'){
        super.componentDidMount();
      }
    }

    componentWillUnmount(){
      stores.forEach(store => {
        this.context.getStore(store).removeChangeListener(this._handleStoreChange);
      });

      if (typeof super.componentWillUnmount === 'function'){
        super.componentWillUnmount();
      }
    }

    getStateFromStores(){
      let storeInstances = {};

      stores.forEach(store => {
        let storeName = store.storeName || store.name || store;
        storeInstances[storeName] = this.context.getStore(store);
      });

      return getter(storeInstances, this.props);
    }

    _handleStoreChange(){
      this.setState(this.getStateFromStores());
    }
  }

  return StoreConnector;
}

export default connectToStores;
