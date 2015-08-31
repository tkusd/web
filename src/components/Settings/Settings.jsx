import React from 'react';
import * as AppAction from '../../actions/AppAction';
import ProfileForm from './ProfileForm';
import DeleteUser from './DeleteUser';
import ChangePassword from './ChangePassword';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import NotFound from '../NotFound';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Settings/Settings.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  user: stores.UserStore.getCurrentUser()
}))
@pureRender
class Settings extends React.Component {
  static onEnter(state, transition){
    const {TokenStore} = this.getStore();
    const {setPageTitle} = bindActions(AppAction, this);

    if (TokenStore.isLoggedIn()){
      setPageTitle('Settings');
    } else {
      transition.to('/login');
    }
  }

  render(){
    const {user} = this.state;

    if (user){
      return (
        <div className="settings">
          <h1 className="settings__title">
            <FormattedMessage message="common.settings"/>
          </h1>
          <div className="settings__content">
            <section className="settings__section">
              <h2 className="settings__section-title">
                <FormattedMessage message="settings.profile"/>
              </h2>
              <div className="settings__section-content">
                <ProfileForm user={user}/>
              </div>
            </section>
            <section className="settings__section">
              <h2 className="settings__section-title">
                <FormattedMessage message="settings.changePassword"/>
              </h2>
              <div className="settings__section-content">
                <ChangePassword user={user}/>
              </div>
            </section>
            <section className="settings__section">
              <h2 className="settings__section-title">
                <FormattedMessage message="settings.deleteAccount"/>
              </h2>
              <div className="settings__section-content">
                <DeleteUser user={user}/>
              </div>
            </section>
          </div>
        </div>
      );
    } else {
      return <NotFound/>;
    }
  }
}

export default Settings;
