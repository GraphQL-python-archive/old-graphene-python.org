import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

import {stack as Menu} from 'react-burger-menu';

import Editor from './_editor'
import Header from './_header'
import Logo from './_logo'
import styles from '../css/main.styl'
import playgroundStyles from '../css/playground.styl'

if (!process.env.BROWSER) {
  global.window = {};
}

const ADOM = (props) =>
    <a href={`http://graphene-python.org/${props.to}`} {...props} />

class Template extends React.Component {
  render() {
    var path = this.props.location.pathname;
    var isIndex = path == '/';
    var windowIsDocs = false;
    try {
        windowIsDocs = window.isDocs;
    }
    catch (e) {
        windowIsDocs = false;
    }
    var isDocs = path.indexOf('/docs')==0 || windowIsDocs;
    var isPlayground = path == '/playground/';
    let LinkComponent = isDocs?ADOM:Link;
    return (
      <div className={classnames({'documentation-page':isDocs, 'playground-page': isPlayground})}>
        <Menu width={200} right>
            <span><LinkComponent to="/" activeClassName="active">Homepage</LinkComponent></span>
            <span><LinkComponent to="/playground/" activeClassName="active">Try it live</LinkComponent></span>
            <span><a href="http://docs.graphene-python.org/en/latest/" className={isDocs?"active":null}>Documentation</a></span>
            <span><LinkComponent to="/blog/" activeClassName="active">Blog</LinkComponent></span>
            <a href="https://github.com/graphql-python/graphene/">Github</a>
        </Menu>
        {!isPlayground?
        <header className={classnames("header", {"header--index": isIndex})}>
            <div className="header-wrapper">
                <LinkComponent className="header-logo" to="/">
                    <Logo />
                </LinkComponent>
                <nav className="header-nav">
                    <LinkComponent to="/playground/" activeClassName="active">Try it live</LinkComponent>
                    <a href="http://docs.graphene-python.org" className={isDocs?"active":null}>Documentation</a>
                    <LinkComponent to="/blog/" activeClassName="active">Blog</LinkComponent>
                    <a className="github-icon" href="https://github.com/graphql-python/graphene/">Github</a>
                </nav>
            </div>
            {isIndex?
            <div className="header-extended">
                <h1>
                    GraphQL in Python<br />
                    made <strong>simple</strong>
                </h1>
                <a href="http://docs.graphene-python.org/en/latest/quickstart/" className="get-started">Get Started</a>
                <Editor />
            </div>:null}
        </header>:null}
        {!isDocs?React.cloneElement(this.props.children, {main: true, wrap: !isIndex, isDocs}):null}
        <div className="footer">
        </div>
      </div>
    );
  }
}

module.exports = Template;
