import React from 'react';
import cx from 'classnames';
import connectToStores from '../decorators/connectToStores';

@connectToStores(['ProjectStore', 'ElementStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.projectID)
}))
class Views extends React.Component {
  static propTypes = {
    projectID: React.PropTypes.string.isRequired
  }

  getChildElements(parent){
    return this.state.elements.filter(element => element.get('element_id') === parent);
  }

  render(){
    let pages = this.getChildElements(null)
      .map(this.renderPage.bind(this))
      .toArray();

    return (
      <div className="views">
        <div className="view view-main">
          <div className="pages">{pages}</div>
        </div>
      </div>
    );
  }

  renderPage(screen){
    const id = screen.get('id');
    const elements = this.getChildElements(id);

    let navbar = elements
      .filter(element => element.get('type') === 'navbar')
      .toArray()
      .map((element, i) => {
        if (i){
          return (
            <div className="subnavbar">
              {this.renderChildElements(element)}
            </div>
          );
        } else {
          return this.renderNavBar(element);
        }
      });

    let toolbar = elements
      .filter(element => element.get('type') === 'toolbar')
      .map(this.renderToolbar.bind(this))
      .toArray();

    let content = elements
      .filter(element => element.get('type') !== 'navbar' && element.get('type') !== 'toolbar')
      .map(this.renderElement.bind(this))
      .toArray();

    let className = cx('page', {
      'navbar-fixed': navbar.length,
      'toolbar-fixed': toolbar.length
    });

    return (
      <div className={className} data-page={id}>
        {navbar}
        <div className="page-content">
          {content}
        </div>
        {toolbar}
      </div>
    );
  }

  renderChildElements(element){
    return this.getChildElements(element.get('id'))
      .map(this.renderElement.bind(this))
      .toArray();
  }

  renderElement(element){
    switch (element.get('type')){
      case 'label':
        return <div>{element.getIn(['attributes', 'text'])}</div>;

      case 'card':
        return this.renderCard(element);

      case 'button':
        let className = cx('button', {
          active: element.getIn(['attributes', 'active']),
          'button-round': element.getIn(['attributes', 'round']),
          'button-fill': element.getIn(['attributes', 'fill']),
          'button-big': element.getIn(['attributes', 'big']),
          'button-raised': element.getIn(['attributes', 'raised'])
        });

        return (
          <a href={element.getIn(['attributes', 'href'])} className={className}>{element.getIn(['attributes', 'text'])}</a>
        );

      case 'block':
        const title = element.getIn(['attributes', 'title']);

        if (title){
          return [
             <div className="content-block-title">{title}</div>,
             <div className="content-block">
               {this.renderChildElements(element)}
             </div>
          ];
        }

        return (
          <div className="content-block">
            {this.renderChildElements(element)}
          </div>
        );

      case 'buttonRow':
        return (
          <div className="buttons-row">
            {this.renderChildElements(element)}
          </div>
        );
    }
  }

  renderNavBar(element){
    const children = this.getChildElements(element.get('id'));

    return (
      <div className="navbar">
        <div className="navbar-inner">
          <div className="left">
            {children.filter(element => element.getIn(['attributes', 'position']) === 'left')
              .map(this.renderElement.bind(this))}
          </div>
          <div className="center">
            {element.getIn(['attributes', 'title'])}
          </div>
          <div className="right">
            {children.filter(element => element.getIn(['attributes', 'position']) === 'right')
              .map(this.renderElement.bind(this))}
          </div>
        </div>
      </div>
    );
  }

  renderCard(element){
    const children = this.getChildElements(element.get('id'));

    let header = children
      .filter(element => element.get('type') === 'header')
      .map(element => (
        <div className="card-header">
          {this.renderChildElements(element)}
        </div>
      ))
      .toArray();

    let footer = children
      .filter(element => element.get('type') === 'footer')
      .map(element => (
        <div className="card-footer">
          {this.getChildElements(element.get('id')).map(element => {
            if (element.get('type') === 'button'){
              return <a href={element.getIn(['attributes', 'href'])} className="link">{element.getIn(['attributes', 'text'])}</a>;
            } else {
              return this.renderElement(element);
            }
          }).toArray()}
        </div>
      ))
      .toArray();

    let content = children
      .filter(element => element.get('type') !== 'header' && element.get('type') !== 'footer')
      .map(this.renderElement.bind(this))
      .toArray();

    return (
      <div className="card">
        {header}
        <div className="card-content">
          <div className="card-content-inner">
            {content}
          </div>
        </div>
        {footer}
      </div>
    );
  }

  renderToolbar(element){
    const children = this.getChildElements(element.get('id'));

    return (
      <div className="toolbar">
        <div className="toolbar-inner">
          {children.map(element => {
            if (element.get('type') === 'button'){
              return <a href={element.getIn(['attributes', 'href'])} className="link">{element.getIn(['attributes', 'text'])}</a>;
            } else {
              return this.renderElement(element);
            }
          }).toArray()}
        </div>
      </div>
    );
  }
}

export default Views;
