import React from 'react';
import * as AppAction from '../../actions/AppAction';
import ProfileForm from './ProfileForm';
import DeleteUser from './DeleteUser';
import ChangePassword from './ChangePassword';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Translation from '../i18n/Translation';
import NotFound from '../NotFound';
import bindActions from '../../utils/bindActions';

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
            <Translation id="common.settings"/>
          </h1>
          <div className="settings__content">
            <section className="settings__section">
              <h2 className="settings__section-title">
                <Translation id="settings.profile"/>
              </h2>
              <div className="settings__section-content">
                <ProfileForm user={user}/>
              </div>
            </section>
            <section className="settings__section">
              <h2 className="settings__section-title">
                <Translation id="settings.change_password"/>
              </h2>
              <div className="settings__section-content">
                <ChangePassword user={user}/>
              </div>
            </section>
            <section className="settings__section">
              <h2 className="settings__section-title">
                <Translation id="settings.delete_account"/>
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
