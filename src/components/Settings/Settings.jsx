import React from 'react';
import {setPageTitle} from '../../actions/AppAction';
import ProfileForm from './ProfileForm';
import DeleteUser from './DeleteUser';
import ChangePassword from './ChangePassword';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import Translation from '../i18n/Translation';
import NotFound from '../NotFound';

if (process.env.BROWSER){
  require('../../styles/Settings/Settings.styl');
}

@connectToStores(['UserStore'], (stores, props) => ({
  user: stores.UserStore.getCurrentUser()
}))
@pureRender
class Settings extends React.Component {
  static onEnter(transition, params, query){
    const {TokenStore} = this.context.getStore();

    if (TokenStore.isLoggedIn()){
      this.context.executeAction(setPageTitle, 'Settings');
    } else {
      transition.redirect('login');
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
