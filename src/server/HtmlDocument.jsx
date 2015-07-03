import React from 'react';
import serialize from 'serialize-javascript';

class HtmlDocument extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired,
    markup: React.PropTypes.string.isRequired,
    stats: React.PropTypes.object.isRequired
  }

  render(){
    const {context, markup, stats} = this.props;
    const {AppStore, LocaleStore} = context.getStore();
    const lang = LocaleStore.getLanguage();
    const dehydratedState = 'window.$STATE=' + serialize(context.dehydrate());

    let style = [].concat(
      stats.main.css,
      '//fonts.googleapis.com/css?family=Lato:400,300,700'
    );

    let script = [].concat(
      stats['common.js'].js,
      stats.main.js
    );

    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8"/>
          <title>{AppStore.getPageTitle()}</title>
          {style.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}}/>
          <script dangerouslySetInnerHTML={{__html: dehydratedState}}/>
          {script.map((src, key) => <script src={src} key={key} defer/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
