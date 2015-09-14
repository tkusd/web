import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ProjectAction from '../../actions/ProjectAction';
import * as AppAction from '../../actions/AppAction';
import NotFound from '../NotFound';
import pureRender from '../../decorators/pureRender';
import bindActions from '../../utils/bindActions';
import qr from 'qr-image';

if (process.env.BROWSER){
  require('../../styles/Preview/Preview.styl');
}

@connectToStores(['ProjectStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID)
}))
@pureRender
class Preview extends React.Component {
  static onEnter(state, transition){
    const {AppStore, ProjectStore} = this.getStore();
    const {getProject} = bindActions(ProjectAction, this);
    const {setPageTitle, setStatusCode} = bindActions(AppAction, this);
    const {projectID} = state.params;
    let promise;

    if (AppStore.isFirstRender()){
      const project = ProjectStore.getProject(projectID);
      promise = Promise.resolve(project.toJS());
    } else {
      promise = getProject(projectID);
    }

    return promise.then(project => {
      setPageTitle(project.title);
    }).catch(err => {
      if (err.response && err.response.status === 404){
        setPageTitle('Not found');
        setStatusCode(404);
      } else {
        throw err;
      }
    });
  }

  render(){
    const {params} = this.props;
    const {project} = this.state;

    if (!project) return <NotFound/>;

    const url = `/projects/${params.projectID}/embed`;
    const svgPath = qr.svgObject(url);

    return (
      <div className="preview__container">
        <iframe className="preview__frame" src={url + '?t=' + Date.now()}/>
        <svg className="preview__qrcode" viewBox={`0 0 ${svgPath.size} ${svgPath.size}`}>
          <path d={svgPath.path}/>
        </svg>
      </div>
    );
  }
}

export default Preview;
