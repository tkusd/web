import bindActions from '../utils/bindActions';
import * as TokenAction from '../actions/TokenAction';
import * as UserAction from '../actions/UserAction';

export default function checkCurrentUser(req){
  if (!req.session.token) return Promise.resolve();

  const flux = req.flux;
  const {checkToken} = bindActions(TokenAction, flux);
  const {loadCurrentUser} = bindActions(UserAction, flux);

  return checkToken(req.session.token).catch(() => {
    req.session.token = null;
  }).then(() => {
    return loadCurrentUser();
  });
}
