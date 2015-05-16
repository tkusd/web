import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class HtmlDocument extends React.Component {
  render(){
    const {script} = this.props.stats;

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
          <meta property="og:type" content="website"/>
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script dangerouslySetInnerHTML={{__html: this.props.state}}/>
          {script.map((src, key) => <script src={src} key={key}/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
