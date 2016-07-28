import React from 'react';
import { Link } from 'react-router';
import _  from 'lodash';
import { config }  from 'config';

class Template extends React.Component {
  goToPage(event) {
    event.target.blur();
    var page = event.target.value;
    this.context.router.transitionTo(page);
  }
  render() {
    var docs = config.docs;
    var docs_index = _.keyBy(this.props.route.pages, 'path');
    var pages = [];
    var aside_links = Object.keys(docs).map((key) => {
        let group = docs[key];
        return <div className="docs-aside-group" key={key}>
            <h3>{group.name}</h3>
            {group.pages.map((page) => {
                pages.push(page)
                return <Link key={page} to={page} activeClassName="active">{docs_index[page].data.title}</Link>
            })}
        </div>;
    });
    var aside_options = Object.keys(docs).map((key) => {
        let group = docs[key];
        return <optgroup key={key} label={group.name}>
            {group.pages.map((page) => {
                return <option key={page} value={page}>{docs_index[page].data.title}</option>
            })}
        </optgroup>;
    });
    var next_page_index = pages.indexOf(this.props.route.path)+1;
    var next_page = pages[next_page_index];
    return (
      <div>
        <div className="page-title"><h1>Documentation</h1></div>
        <div className="docs">
          <aside className="docs-aside">
              {aside_links}
              <select className="docs-aside-navselect" value={this.props.route.path} onChange={this.goToPage.bind(this)}>
                  {aside_options}
              </select>
          </aside>
          <div className="docs-content">
              {React.cloneElement(this.props.children, {docs: true})}
              {next_page?<Link className="docs-next" to={next_page}>Next - {docs_index[next_page].data.title} →</Link>:null}
          </div>
        </div>
      </div>
    );
  }
}

Template.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Template;
