import React from 'react';
import ScreenPalette from './ScreenPalette';
import ComponentPalette from './ComponentPalette';
import SettingPalette from './SettingPalette';
import pureRender from '../../utils/pureRender';
import FontAwesome from '../common/FontAwesome';
import {TabHost, TabPane} from '../tab';

if (process.env.BROWSER){
  require('../../styles/Project/ProjectSidebar.styl');
}

@pureRender
class ProjectSidebar extends React.Component {
  static propTypes = {
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <TabHost className="project-sidebar">
        <TabPane tab={<FontAwesome icon="mobile"/>}>
          <ScreenPalette {...this.props}/>
        </TabPane>
        {this.renderComponentPalette()}
        {this.renderSettingPalette()}
      </TabHost>
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
}

export default ProjectSidebar;
