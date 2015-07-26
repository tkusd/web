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

    let script = [].concat(
      stats.vendor.js,
      stats.preview.js
    );

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{AppStore.getPageTitle()}</title>
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
