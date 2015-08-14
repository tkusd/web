import React from 'react';
import Views from './Views';
import connectToStores from '../decorators/connectToStores';

@connectToStores(['AppStore', 'ProjectStore'], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle(),
  project: stores.ProjectStore.getProject(props.projectID)
}))
class HtmlDocument extends React.Component {
  static propTypes = {
    stats: React.PropTypes.object.isRequired,
    projectID: React.PropTypes.string.isRequired
  }

  render(){
    const {stats, projectID} = this.props;
    const {pageTitle, project} = this.state;
    const theme = project.get('theme');

    let styles = [].concat(
      // stats.preview.css
    );

    let scripts = [].concat(
      // stats.preview.js
    );

    if (theme === 'material'){
      styles.push(stats.preview_material.css);
      scripts.push(stats.preview_material.js);
    } else {
      styles.push(stats.preview_ios.css);
      scripts.push(stats.preview_ios.js);
    }

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{pageTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
          <meta name="apple-mobile-web-app-title" content={pageTitle}/>
          <meta name="mobile-web-app-capable" content="yes"/>
          {styles.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          {/* Status bar overlay for full screen mode (PhoneGap) */}
          <div className="statusbar-overlay"/>
          {/* Panels overlay */}
          <div className="panel-overlay"/>
          {/* Views */}
          <Views projectID={projectID}/>
          {scripts.map((src, key) => <script src={src} key={key}/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
