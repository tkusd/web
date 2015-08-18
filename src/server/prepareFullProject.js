import {Flux} from '../flux';
import bindActions from '../utils/bindActions';
import * as stores from '../stores';
import * as ProjectAction from '../actions/ProjectAction';
import * as TokenAction from '../actions/TokenAction';
import * as UserAction from '../actions/UserAction';

export default function prepareFullProject(req){
  const flux = new Flux(stores);
  const {checkToken} = bindActions(TokenAction, flux);
  const {loadCurrentUser} = bindActions(UserAction, flux);
  const {getFullProject} = bindActions(ProjectAction, flux);
  const {AppStore, ProjectStore} = flux.getStore();
  const projectID = req.params.id;

  return checkToken(req.session.token).catch(() => {
    req.session.token = null;
  }).then(() => {
    return loadCurrentUser();
  }).then(() => {
    return getFullProject(projectID);
  }).then(() => {
    const project = ProjectStore.getProject(projectID);

    AppStore.setPageTitle(project.get('title'));
    return flux;
  });
}
