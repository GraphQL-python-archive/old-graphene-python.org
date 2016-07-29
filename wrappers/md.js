import React from 'react';
import DocumentTitle from 'react-document-title';
import { config } from 'config'

var DOCS_BASEURL = "https://github.com/graphql-python/graphene/edit/master/docs/pages/";

export default class Markdown extends React.Component {
  render() {
    const post = this.props.route.page.data
    var pagePath = this.props.route.page.requirePath;
    var documentUrl = `${DOCS_BASEURL}${pagePath}`;
    var showTitle = post.title && this.props.main;
    return (
      <DocumentTitle title={`${post.title?post.title+' - ':''}${config.siteTitle}`}>
        <div key={pagePath}>
          {showTitle?<div className="page-title">
            <h1>{post.title}</h1>
          </div>:null}
          <div className="markdown">
            <div className={this.props.main?"wrapper":null} dangerouslySetInnerHTML={{__html: post.body}}/>
            <a href={documentUrl} className="improve-document-link">Edit page</a>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
