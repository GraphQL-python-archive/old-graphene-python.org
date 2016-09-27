import React from 'react';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames';
import docsTemplate from './pages/_docs_template.html';
import { config } from 'config';

import { prefixLink } from 'gatsby-helpers'

export default class Html extends React.Component {
  render() {
    var title = this.props.title || DocumentTitle.rewind();
    var pathname = this.props.location && this.props.location.pathname;
    var isDocs = pathname && pathname.indexOf('/docs') == 0;

    return (
      <html lang={this.props.lang}>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name='viewport' content='width=device-width, initial-scale=1.0 maximum-scale=1.0'/>
          <title>{title}</title>
          <link rel="shortcut icon" href={prefixLink("/favicon.png")} />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" type='text/css' />
          <link href={prefixLink('/app.css')} rel='stylesheet' type='text/css' />
        </head>
        <body className={classnames({'body--docs':isDocs})}>
          <div id="react-mount" dangerouslySetInnerHTML={{__html: this.props.body}} />
          <script src={prefixLink("/bundle.js")}/>
          {isDocs?<script dangerouslySetInnerHTML={{__html: `window.isDocs = true;`}} />:null}
          {isDocs?<div id="docs" dangerouslySetInnerHTML={{__html: docsTemplate.body}} />:null}
          {config.ga?<script dangerouslySetInnerHTML={{__html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', '${config.ga}', 'auto');
            ga('send', 'pageview');
            `}}
          />:null}
        </body>
      </html>
    );
  }
}
