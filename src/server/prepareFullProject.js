import bindActions from '../utils/bindActions';
import * as ProjectAction from '../actions/ProjectAction';
import checkCurrentUser from './checkCurrentUser';

export default function prepareFullProject(req){
  const flux = req.flux;
  const {getFullProject} = bindActions(ProjectAction, flux);
  const {AppStore, ProjectStore} = flux.getStore();
  const projectID = req.params.id;

  return checkCurrentUser(req).then(() => {
    return getFullProject(projectID);
  }).then(() => {
    const project = ProjectStore.getProject(projectID);
    AppStore.setPageTitle(project.get('title'));
  });
}
