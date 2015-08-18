import React from 'react';
import cx from 'classnames';
import ElementTypes from '../../constants/ElementTypes';
import base62uuid from '../../utils/base62uuid';
import NoopContainer from './NoopContainer';

function getElementID(element){
  return 'e' + base62uuid(element.get('id'));
}

class View extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    Container: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    Container: NoopContainer
  }

  getChildElements(parent){
    return this.props.elements.filter(element => element.get('element_id') === parent);
  }

  render(){
    const {element} = this.props;
    const children = this.getChildElements(element.get('id'));

    switch (element.get('type')){
      case ElementTypes.screen:
        return this.renderPage(element);

      case ElementTypes.label:
        return (
          <div id={getElementID(element)}>{element.getIn(['attributes', 'text'])}</div>
        );

      case ElementTypes.button:
        return this.renderButton(element);

      case ElementTypes.buttonRow:
        return (
          <div id={getElementID(element)} className="buttons-row">
            {this.renderElements(children)}
          </div>
        );

      case ElementTypes.block:
        return this.renderBlock(element);

      case ElementTypes.list:
        return this.renderList(element);
    }

    return <div></div>;
  }

  renderElements(elements){
    const {Container} = this.props;

    return elements.map((element, i) => (
      <Container {...this.props} element={element} key={i}/>
    )).toArray();
  }

  renderPage(element){
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

    navbar.forEach((item, key) => {
      if (!content.length){
        return content.push(this.renderNavBar(item));
      }

      const children = this.getChildElements(key);

      content.push(
        <div id={getElementID(item)} className="subnavbar" key={key}>
          {this.renderElements(children)}
        </div>
      );
    });

    content.push(
      <div className="page-content" key={id}>
        {this.renderElements(children.filter(element => (
          element.get('type') !== ElementTypes.navbar &&
          element.get('type') !== ElementTypes.toolbar
        )))}
      </div>
    );

    toolbar.forEach((item, key) => {
      const children = this.getChildElements(key);

      content.push(
        <div id={getElementID(item)} className="toolbar" key={key}>
          <div className="toolbar-inner">
            {this.renderElements(children)}
          </div>
        </div>
      );
    });

    return (
      <div className={className} data-page={id}>
        {content}
      </div>
    );
  }

  renderNavBar(element){
    const id = element.get('id');
    const elements = this.getChildElements(id);

    return (
      <div id={getElementID(element)} className="navbar" key={id}>
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

  renderButton(element){
    const {elements} = this.props;
    const parent = elements.get(element.get('element_id'));
    let className = '';

    switch (parent.get('type')){
      case 'toolbar':
      case 'navbar':
      case 'card':
        className = 'link';
        break;

      default:
        className = cx('button', {
          active: element.getIn(['attributes', 'active']),
          'button-round': element.getIn(['attributes', 'round']),
          'button-fill': element.getIn(['attributes', 'fill']),
          'button-big': element.getIn(['attributes', 'big']),
          'button-raised': element.getIn(['attributes', 'raised'])
        });
    }

    return (
      <a
        id={getElementID(element)}
        href={element.getIn(['attributes', 'href'], '#')}
        className={className}
        onClick={this.handleButtonClick}>
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
        <div id={getElementID(element)} className="content-block">
          {this.renderElements(elements)}
        </div>
      </div>
    );
  }

  renderList(element){
    const elements = this.getChildElements(element.get('id'));
    const title = element.getIn(['attributes', 'title']);

    return (
      <div>
        {title && <div className="content-block-title">{title}</div>}
        <div id={getElementID(element)} className="list-block">
          <ul>
            {this.renderElements(elements)}
          </ul>
        </div>
      </div>
    );
  }

  handleButtonClick(e){
    e.preventDefault();
  }
}

export default View;