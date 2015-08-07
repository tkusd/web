import React from 'react';
import {Flux} from '../flux';

class HtmlDocument extends React.Component {
  static propTypes = {
    flux: React.PropTypes.instanceOf(Flux).isRequired,
    script: React.PropTypes.string.isRequired,
    stats: React.PropTypes.object.isRequired
  }

  render(){
    const {flux, script, stats} = this.props;
    const {AppStore} = flux.getStore();

    let styles = [].concat(
      stats.preview.css
    );

    let scripts = [].concat(
      'cordova.js',
      stats.preview.js
    );

    let scriptContent = 'window.$INIT = function($VENDOR){' + script + '}';

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{AppStore.getPageTitle()}</title>
          <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="mobile-web-app-capable" content="yes"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
          <meta name="msapplication-tap-highlight" content="no"/>
          {styles.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          <div id="root"/>
          <script dangerouslySetInnerHTML={{__html: scriptContent}}/>
          {scripts.map((src, key) => <script src={src} key={key}/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
