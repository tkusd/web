import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import getTranslations from '../../utils/getTranslations';
import {Flux} from '../../flux';
import {ModalContainer} from '../modal';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

@connectToStores(['AppStore', 'LocaleStore'], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle()
}))
class Application extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.instanceOf(Flux).isRequired
  }

  static childContextTypes = {
    __: React.PropTypes.func.isRequired
  }

  getChildContext(){
    return {
      __: getTranslations(this.context.flux)
    };
  }

  componentDidUpdate(){
    document.title = this.state.pageTitle;
  }

  render(){
    return (
      <div>
        {this.props.children}
        <ModalContainer/>
      </div>
    );
  }
}

export default Application;
