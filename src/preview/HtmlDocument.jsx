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
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
          <meta name="apple-mobile-web-app-title" content={AppStore.getPageTitle()}/>
          <meta name="mobile-web-app-capable" content="yes"/>
          <meta name="msapplication-tap-highlight" content="no"/>
          <meta name="format-detection" content="telephone=no"/>
          {styles.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body></div>
          <div id="root"/>
          <script dangerouslySetInnerHTML={{__html: scriptContent}}/>
          {scripts.map((src, key) => <script src={src} key={key} async/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
