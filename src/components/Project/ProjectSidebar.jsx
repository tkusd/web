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
  render(){
    return (
      <TabHost className="project-sidebar">
        <TabPane tab={<FontAwesome icon="mobile"/>}>
          <ScreenPalette {...this.props}/>
        </TabPane>
        <TabPane tab={<FontAwesome icon="cube"/>}>
          <ComponentPalette {...this.props}/>
        </TabPane>
        <TabPane tab={<FontAwesome icon="cog"/>}>
          <SettingPalette {...this.props}/>
        </TabPane>
      </TabHost>
    );
  }
}

export default ProjectSidebar;
