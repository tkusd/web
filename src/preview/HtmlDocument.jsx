import React from 'react';
import {Flux} from '../flux';
import generateScript from './generateScript';

class HtmlDocument extends React.Component {
  static propTypes = {
    flux: React.PropTypes.instanceOf(Flux).isRequired,
    stats: React.PropTypes.object.isRequired,
    projectID: React.PropTypes.string.isRequired
  }

  render(){
    const {flux, stats, projectID} = this.props;
    const {AppStore} = flux.getStore();

    let style = [].concat(
      stats.preview.css
    );

    let script = [].concat(
      stats.preview.js
    );

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{AppStore.getPageTitle()}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="mobile-web-app-capable" content="yes"/>
          {style.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          <div id="root"/>
          <script dangerouslySetInnerHTML={{__html: generateScript(flux, projectID)}}/>
          {script.map((src, key) => <script src={src} key={key} defer/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
