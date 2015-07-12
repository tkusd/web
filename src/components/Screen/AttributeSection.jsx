import React from 'react';

class AttributeSection extends React.Component {
  static propTypes = {
    title: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ])
  }

  render() {
    return (
      <section>
        <h4>{this.props.title}</h4>
        {this.props.children}
      </section>
    );
  }
}

export default AttributeSection;
