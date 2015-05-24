import React from 'react';
import AppStore from '../stores/AppStore';

class HtmlDocument extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired,
    markup: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,
    script: React.PropTypes.arrayOf(React.PropTypes.string),
    style: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  static defaultProps = {
    script: [],
    style: []
  }

  render(){
    let {context, markup, state, script, style} = this.props;
    let appStore = context.getStore(AppStore);

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>{appStore.getPageTitle()}</title>
          {style.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}}></div>
          <script dangerouslySetInnerHTML={{__html: state}}/>
          {script.map((src, key) => <script src={src} key={key}/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
