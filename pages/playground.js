import React from 'react';
import DocumentTitle from 'react-document-title';
import PlaygroundWrapper from 'playground-wrapper';

class Playground extends React.Component {
  render() {
    return <DocumentTitle title="Playground - Graphene">
      <PlaygroundWrapper query={this.props.location.query} params={this.props.routeParams} pathname={this.props.location.pathname}/>
    </DocumentTitle>;
  }
}

module.exports = Playground;
