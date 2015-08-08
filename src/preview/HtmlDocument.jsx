import React from 'react';
import Views from './Views';
import connectToStores from '../decorators/connectToStores';

@connectToStores(['AppStore'], (stores, props) => ({
  pageTitle: stores.AppStore.getPageTitle()
}))
class HtmlDocument extends React.Component {
  static propTypes = {
    stats: React.PropTypes.object.isRequired,
    projectID: React.PropTypes.string.isRequired
  }

  render(){
    const {stats, projectID} = this.props;
    const {pageTitle} = this.state;

    let styles = [].concat(
      stats.preview.css
    );

    let scripts = [].concat(
      stats.preview.js
    );

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
          {scripts.map((src, key) => <script src={src} key={key} async/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
