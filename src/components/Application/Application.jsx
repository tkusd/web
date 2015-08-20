import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import {Flux} from '../../flux';
import {ModalContainer} from '../modal';
import * as AppAction from '../../actions/AppAction';
import bindActions from '../../utils/bindActions';
import cx from 'classnames';

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

  componentDidMount() {
    const {setFirstRender} = bindActions(AppAction, this.context.flux);
    setFirstRender(false);
  }

  componentDidUpdate(){
    document.title = this.state.pageTitle;
  }

  render(){
    const {isTransitioning} = this.props;

    let progressBarClassName = cx('application__progress-bar', {
      'application__progress-bar--active': isTransitioning
    });

    return (
      <div className="application">
        <div className={progressBarClassName}/>
        {this.props.children}
        <ModalContainer/>
      </div>
    );
  }
}

export default Application;
