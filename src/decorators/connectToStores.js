import React from 'react';
import {assign} from 'lodash';

function connectToStores(stores, getter){
  if (!Array.isArray(stores)){
    stores = [stores];
  }

  if (typeof getter !== 'function'){
    throw new TypeError('getter must be a function');
  }

  return function(Component){
    return class extends Component {
      static contextTypes = assign({
        getStore: React.PropTypes.func.isRequired
      }, Component.contextTypes)

      static displayName = Component.displayName || Component.name || 'StoreConnector'

      constructor(props, context){
        super(props, context);

        this.updateState = this.updateState.bind(this);
        this.state = assign(this.getStateFromStores(props), this.state);
      }

      componentDidMount(){
        stores.forEach(store => {
          this.context.getStore(store).addChangeListener(this.updateState);
        });

        if (typeof super.componentDidMount === 'function'){
          super.componentDidMount();
        }
      }

      componentWillUnmount(){
        stores.forEach(store => {
          this.context.getStore(store).removeChangeListener(this.updateState);
        });

        if (typeof super.componentWillUnmount === 'function'){
          super.componentWillUnmount();
        }
      }

      getStateFromStores(props=this.props){
        let storeInstances = {};

        stores.forEach(store => {
          let storeName = store.storeName || store.name || store;
          storeInstances[storeName] = this.context.getStore(store);
        });

        return getter(storeInstances, props);
      }

      updateState(){
        this.setState(this.getStateFromStores());
      }
    };
  };
}

export default connectToStores;
