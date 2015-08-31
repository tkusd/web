import React from 'react';
import cx from 'classnames';
import ElementTypes from '../../constants/ElementTypes';
import NoopContainer from './NoopContainer';
import pureRender from '../../decorators/pureRender';

function getElementID(element){
  return 'e' + element.get('id');
}

function noop(){}

function getDirectURL(url){
  return url;
}

function renderMultiLineString(str){
  let result = [];
  let lines = str.split('\n');

  // Return the string directly if it has only one line
  if (lines.length === 1) return str;

  // Append <br> to every line
  lines.forEach((line, i) => {
    result.push(
      <span key={i * 2}>{line}</span>,
      <br key={i * 2 + 1}/>
    );
  });

  // Remove last <br>
  result.pop();

  return result;
}

function filterTrue(s){
  return s;
}

@pureRender
class View extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    Container: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    onScroll: React.PropTypes.func.isRequired,
    getAssetURL: React.PropTypes.func.isRequired,
    getElementID: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    Container: NoopContainer,
    onClick: noop,
    onScroll: noop,
    getAssetURL: getDirectURL,
    getElementID
  }

  getChildElements(parent){
    return this.props.elements.filter(element => element.get('element_id') === parent)
      .filter(element => element.get('is_visible'));
  }

  render(){
    const {element} = this.props;
    const children = this.getChildElements(element.get('id'));

    switch (element.get('type')){
    case ElementTypes.screen:
      return this.renderPage(element);

    case ElementTypes.navbar:
      return this.renderNavBar(element);

    case ElementTypes.toolbar:
      return this.renderToolbar(element);

    case ElementTypes.label:
      return (
        <div {...this.makeElementProps(element)} onClick={this.props.onClick}>
          {renderMultiLineString(element.getIn(['attributes', 'text']))}
        </div>
      );

    case ElementTypes.button:
      return this.renderButton(element);

    case ElementTypes.buttonRow:
      return (
        <div {...this.makeElementProps(element)} className="buttons-row" onClick={this.props.onClick}>
          {this.renderElements(children)}
        </div>
      );

    case ElementTypes.block:
      return this.renderBlock(element);

    case ElementTypes.list:
      return this.renderList(element);

    case ElementTypes.listItem:
      return this.renderListItem(element);

    case ElementTypes.listDivider:
      return this.renderListDivider(element);

    case ElementTypes.listGroup:
      return this.renderListGroup(element);

    case ElementTypes.card:
      return this.renderCard(element);

    case ElementTypes.image:
      return this.renderImage(element);

    case ElementTypes.accordion:
      return this.renderAccordion(element);
    }

    return <div/>;
  }

  renderElements(elements){
    const {Container} = this.props;

    return elements.map((element, i) => (
      <Container {...this.props} element={element} key={i}/>
    )).toArray();
  }

  renderPage(element){
    const {Container, onScroll} = this.props;
    const id = element.get('id');
    const children = this.getChildElements(id);
    let content = [];

    let navbar = children
      .filter(element => element.get('type') === ElementTypes.navbar);

    let toolbar = children
      .filter(element => element.get('type') === ElementTypes.toolbar);

    let className = cx('page', {
      'navbar-fixed': navbar.count(),
      'toolbar-fixed': toolbar.count()
    });

    if (element.getIn(['attributes', 'theme'])){
      className = cx(className, 'theme-' + element.getIn(['attributes', 'theme']));
    }

    navbar.forEach((item, key) => {
      content.push(
        <Container {...this.props}
          element={item}
          key={key}/>
      );
    });

    content.push(
      <div className="page-content" key={id} onScroll={onScroll}>
        {this.renderElements(children.filter(element => (
          element.get('type') !== ElementTypes.navbar &&
          element.get('type') !== ElementTypes.toolbar
        )))}
      </div>
    );

    toolbar.forEach((item, key) => {
      content.push(
        <Container {...this.props} element={item} key={key}/>
      );
    });

    return (
      <div {...this.makeElementProps(element)}
        className={className}
        data-page={id}>
        {content}
      </div>
    );
  }

  renderNavBar(element){
    const elements = this.getChildElements(element.get('id'));

    return (
      <div {...this.makeElementProps(element)} className="navbar" onClick={this.props.onClick}>
        <div className="navbar-inner">
          <div className="left">
            {this.renderElements(elements.filter(element => (
              element.getIn(['attributes', 'position']) === 'left'
            )))}
          </div>
          <div className="center">
            {element.getIn(['attributes', 'title'])}
          </div>
          <div className="right">
            {this.renderElements(elements.filter(element => (
              element.getIn(['attributes', 'position']) === 'right'
            )))}
          </div>
        </div>
      </div>
    );
  }

  renderToolbar(element){
    const elements = this.getChildElements(element.get('id'));

    return (
      <div {...this.makeElementProps(element)} className="toolbar" onClick={this.props.onClick}>
        <div className="toolbar-inner">
          {this.renderElements(elements)}
        </div>
      </div>
    );
  }

  renderButton(element){
    const {elements} = this.props;
    const parent = elements.get(element.get('element_id'));
    let className = '';

    switch (parent.get('type')){
    case 'toolbar':
    case 'navbar':
      className = 'link';
      break;

    case 'card':
      let position = element.getIn(['attributes', 'position']);

      if (position === 'header' || position === 'footer'){
        className = 'link';
        break;
      }
    }

    if (!className){
      className = cx('button', {
        active: element.getIn(['attributes', 'active']),
        'button-round': element.getIn(['attributes', 'round']),
        'button-fill': element.getIn(['attributes', 'fill']),
        'button-big': element.getIn(['attributes', 'big']),
        'button-raised': element.getIn(['attributes', 'raised'])
      });
    }

    return (
      <a {...this.makeElementProps(element)}
        href={element.getIn(['attributes', 'href'], '#')}
        className={className}
        onClick={this.props.onClick}>
        {element.getIn(['attributes', 'text'])}
      </a>
    );
  }

  renderBlock(element){
    const elements = this.getChildElements(element.get('id'));
    const title = element.getIn(['attributes', 'title']);

    return (
      <div>
        {title && <div className="content-block-title">{title}</div>}
        <div id={getElementID(element)} className="content-block" onClick={this.props.onClick}>
          {this.renderElements(elements)}
        </div>
      </div>
    );
  }

  renderList(element){
    const elements = this.getChildElements(element.get('id'));
    const title = element.getIn(['attributes', 'title']);

    let className = cx('list-block', {
      inset: element.getIn(['attributes', 'inset']),
      'accordion-list': elements.filter(element => element.get('type') === ElementTypes.accordion).count()
    });

    return (
      <div>
        {title && <div className="content-block-title">{title}</div>}
        <div {...this.makeElementProps(element)} className={className} onClick={this.props.onClick}>
          <ul>
            {this.renderElements(elements)}
          </ul>
        </div>
      </div>
    );
  }

  renderListItem(element){
    let className = 'item-content';
    let media;

    if (element.getIn(['attributes', 'media'])){
      media = (
        <div className="item-media">{element.getIn(['attributes', 'media'])}</div>
      );
    }

    let content = (
      <div className="item-inner">
        <div className="item-title">{element.getIn(['attributes', 'title'])}</div>
        <div className="item-after">
          {this.renderElements(this.getChildElements(element.get('id')))}
        </div>
      </div>
    );

    if (element.getIn(['attributes', 'link'])){
      className = cx(className, 'item-link');

      return (
        <li>
          <a {...this.makeElementProps(element)} className={className} onClick={this.props.onClick}>
            {media}
            {content}
          </a>
        </li>
      );
    } else {
      return (
        <li>
          <div {...this.makeElementProps(element)} className={className} onClick={this.props.onClick}>
            {media}
            {content}
          </div>
        </li>
      );
    }
  }

  renderListDivider(element){
    return (
      <li {...this.makeElementProps(element)} className="item-divider" onClick={this.props.onClick}>
        {element.getIn(['attributes', 'title'])}
      </li>
    );
  }

  renderListGroup(element){
    return (
      <div {...this.makeElementProps(element)} className="list-group" onClick={this.props.onClick}>
        <ul>
          <li className="list-group-title">{element.getIn(['attributes', 'title'])}</li>
          {this.renderElements(this.getChildElements(element.get('id')))}
        </ul>
      </div>
    );
  }

  renderCard(element){
    const elements = this.getChildElements(element.get('id'));
    let header;
    let footer;

    if (element.getIn(['attributes', 'header'])){
      header = elements.filter(element => element.getIn(['attributes', 'position']) === 'header');
    }

    if (element.getIn(['attributes', 'footer'])){
      footer = elements.filter(element => element.getIn(['attributes', 'position']) === 'footer');
    }

    return (
      <div {...this.makeElementProps(element)} className="card" onClick={this.props.onClick}>
        {header && (
          <div className="card-header">{this.renderElements(header)}</div>
        )}
        <div className="card-content">
          <div className="card-content-inner">
            {this.renderElements(elements.filter(element => (
              element.getIn(['attributes', 'position']) !== 'header' &&
              element.getIn(['attributes', 'position']) !== 'footer'
            )))}
          </div>
        </div>
        {footer && (
          <div className="card-footer">{this.renderElements(footer)}</div>
        )}
      </div>
    );
  }

  renderImage(element){
    const {getAssetURL} = this.props;
    const src = element.getIn(['attributes', 'src']);

    return (
      <img {...this.makeElementProps(element)}
        src={getAssetURL(src)}
        onClick={this.props.onClick}/>
    );
  }

  renderAccordion(element){
    let className = cx('accordion-item', {
      'accordion-item-expanded': element.getIn(['attributes', 'expanded'])
    });

    return (
      <li {...this.makeElementProps(element)} className={className} onClick={this.props.onClick}>
        <a href="#" className="item-content item-link">
          <div className="item-inner">
            <div className="item-title">{element.getIn(['attributes', 'title'])}</div>
          </div>
        </a>
        <div className="accordion-item-content">
          {this.renderElements(this.getChildElements(element.get('id')))}
        </div>
      </li>
    );
  }

  makeElementProps(element){
    let styles = element.get('styles');

    if (styles.has('textShadow')){
      const textShadow = styles.get('textShadow');

      styles = styles.set('textShadow', [
        textShadow.get('offsetX', '0'),
        textShadow.get('offsetY', '0'),
        textShadow.get('blur', '0'),
        textShadow.get('color', '')
      ].join(' '));
    }

    if (styles.has('boxShadow')){
      const boxShadow = styles.get('boxShadow');

      styles = styles.set('boxShadow', [
        boxShadow.get('inset') ? 'inset' : '',
        boxShadow.get('offsetX', '0'),
        boxShadow.get('offsetY', '0'),
        boxShadow.get('blur', '0'),
        boxShadow.get('spread', '0'),
        boxShadow.get('color', '')
      ].join(' '));
    }

    return {
      id: this.props.getElementID(element),
      style: styles.filter(filterTrue).toJS()
    };
  }
}

export default View;
