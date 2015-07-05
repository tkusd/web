import React from 'react';
import {assign} from 'lodash';
import {Flux} from '../flux';

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
        flux: React.PropTypes.instanceOf(Flux).isRequired
      }, Component.contextTypes)

      static displayName = Component.displayName || Component.name || 'StoreConnector'

      constructor(props, context){
        super(props, context);

        this.updateState = this.updateState.bind(this);
        this.state = assign(this.getStateFromStores(props), this.state);
      }

      componentDidMount(){
        const {flux} = this.context;

        stores.forEach(store => {
          flux.getStore()[store].addChangeListener(this.updateState);
        });

        if (typeof super.componentDidMount === 'function'){
          super.componentDidMount();
        }
      }

      componentWillUnmount(){
        const {flux} = this.context;

        stores.forEach(store => {
          flux.getStore()[store].removeChangeListener(this.updateState);
        });

        if (typeof super.componentWillUnmount === 'function'){
          super.componentWillUnmount();
        }
      }

      getStateFromStores(props = this.props){
        const {flux} = this.context;
        return getter(flux.getStore(), props);
      }

      updateState(){
        this.setState(this.getStateFromStores());
      }
    };
  };
}

export default connectToStores;
