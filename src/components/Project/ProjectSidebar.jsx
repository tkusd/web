import React from 'react';
import ScreenPalette from './ScreenPalette';
import ComponentPalette from './ComponentPalette';
import SettingPalette from './SettingPalette';
import AssetPalette from './AssetPalette';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import {TabHost, TabPane} from '../tab';

if (process.env.BROWSER){
  require('../../styles/Project/ProjectSidebar.styl');
}

@pureRender
class ProjectSidebar extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="project-sidebar">
        <TabHost>
          <TabPane tab={<FontAwesome icon="mobile"/>}>
            <ScreenPalette {...this.props}/>
          </TabPane>
          {this.renderComponentPalette()}
          {this.renderAssetPalette()}
          {this.renderSettingPalette()}
        </TabHost>
        <div className="project-sidebar__links">
          <a href={this.makeDownloadHref()} className="project-sidebar__link" target="_blank" onClick={this.openDownloadWindow}>
            <FontAwesome icon="download"/>
          </a>
          <a href={this.makePreviewHref()} className="project-sidebar__link" target="_blank" onClick={this.openPreviewWindow}>
            <FontAwesome icon="eye"/>
          </a>
        </div>
      </div>
    );
  }

  renderComponentPalette(){
    if (!this.props.editable) return;

    return (
      <TabPane tab={<FontAwesome icon="cube"/>}>
        <ComponentPalette {...this.props}/>
      </TabPane>
    );
  }

  renderSettingPalette(){
    if (!this.props.editable) return;

    return (
      <TabPane tab={<FontAwesome icon="cog"/>}>
        <SettingPalette {...this.props}/>
      </TabPane>
    );
  }

  renderAssetPalette(){
    if (!this.props.editable) return;

    return (
      <TabPane tab={<FontAwesome icon="file-o"/>}>
        <AssetPalette {...this.props}/>
      </TabPane>
    );
  }

  makePreviewHref(){
    const {project} = this.props;
    return `/projects/${project.get('id')}/preview`;
  }

  makeDownloadHref(){
    const {project} = this.props;
    return `/projects/${project.get('id')}/download`;
  }

  openPreviewWindow = (e) => {
    e.preventDefault();

    const {project} = this.props;
    window.open(this.makePreviewHref(), project.get('id'), 'menubar=no, location=no, width=360, height=640, status=no');
  }

  openDownloadWindow = (e) => {
    e.preventDefault();
    window.location.href = this.makeDownloadHref();
  }
}

export default ProjectSidebar;
