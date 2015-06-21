import React from 'react';
import AppStore from '../stores/AppStore';
import LocaleStore from '../stores/LocaleStore';
import path from 'path';

function filterExtname(extname){
  return function(item){
    return path.extname(item) === '.' + extname;
  };
}

class HtmlDocument extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired,
    markup: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,
    stats: React.PropTypes.object.isRequired
  }

  render(){
    const {context, markup, state, stats} = this.props;
    const appStore = context.getStore(AppStore);
    const localeStore = context.getStore(LocaleStore);
    const lang = localeStore.getLanguage();

    let style = stats.main.filter(filterExtname('css'));
    let script = stats.main.filter(filterExtname('js'));

    // Web font
    style.push('//fonts.googleapis.com/css?family=Lato:400,300,700');

    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8"/>
          <title>{appStore.getPageTitle()}</title>
          {style.map((href, key) => <link rel="stylesheet" type="text/css" href={href} key={key}/>)}
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}}/>
          <script dangerouslySetInnerHTML={{__html: state}}/>
          {script.map((src, key) => <script src={src} key={key} defer/>)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
