import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import {ModalContainer} from '../modal';
import cx from 'classnames';

if (process.env.BROWSER){
  require('../../styles/Application/Application.styl');
}

@connectToStores(['AppStore', 'ModalStore'], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle(),
  modals: stores.ModalStore.getList()
}))
class Application extends React.Component {
  componentDidUpdate(){
    document.title = this.state.pageTitle;
  }

  render(){
    const {isTransitioning} = this.props;
    const {modals} = this.state;

    let progressBarClassName = cx('application__progress-bar', {
      'application__progress-bar--active': isTransitioning
    });

    return (
      <div className="application">
        <div className={progressBarClassName}/>
        {this.props.children}
        <ModalContainer modals={modals}/>
      </div>
    );
  }
}

export default Application;
