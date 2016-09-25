import React from 'react';
import DocumentTitle from 'react-document-title';

export default class HTML extends React.Component {
  render() {
    const page = this.props.route.page.data;
    return (
      <div>
        <div dangerouslySetInnerHTML={{__html: page.body}}/>
      </div>
    );
  }
}
