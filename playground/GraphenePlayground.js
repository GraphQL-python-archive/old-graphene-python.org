import React from 'react';
import ReactDOM from 'react-dom';
import CodeMirror from 'codemirror';
import { graphql } from 'graphql';
import {introspectionQuery, buildClientSchema } from 'graphql';
import GraphiQL from 'graphiql';
import schema from './schema';
import pypyjs_vm from 'pypyjs';

import { Link } from 'react-router';

// import pothon from './pothon';
import Logo from '../pages/_logo';
import 'codemirror/mode/python/python';
import 'codemirror/addon/lint/lint';
import '../css/playground.styl';

if (typeof PUBLIC_PATH === "undefined") {
  var PUBLIC_PATH = '';
}

pypyjs_vm.rootURL = `${PUBLIC_PATH}/playground/lib/`;
// pypyjs_vm.cacheKey = 'graphene';

CodeMirror.registerHelper('lint', 'python', function (text, options, editor) {
  return (options.errors || []).map((error) => {
    var tokens = editor.getLineTokens(error.line);
    tokens = tokens.filter((token, pos) => {
      return !!token.type || token.string.trim().length > 0;
    });
    if (!tokens) return [];
    return {
      message: `${error.name}: ${error.message}`,
      severity: 'error',
      type: 'syntax',
      from: CodeMirror.Pos(error.line, tokens[0].start),
      to: CodeMirror.Pos(error.line, tokens[tokens.length-1].end),
    };
  });
});

function badSchemaFetcher(graphQLParams) {
  return new Promise((resolve)=>resolve({'errors': ["The provided schema is invalid."]}));
}

var default_interpreter;
export default class Playground extends React.Component {
  constructor() {
    super();
    this.state = {pypyjs: false, stdout: '', response:'', schema: null};
  }
  stdout() {
    console.log('stdout', arguments);
  }
  componentDidMount() {
    if (default_interpreter) {
      this.pypy_interpreter = default_interpreter;
      this.pypy_interpreter.stdout = this.stdout.bind(this);
    }
    else {
      this.pypy_interpreter = new pypyjs_vm({
        stdin: function(){},
        stdout: this.stdout.bind(this),
        stderr: function(){},
        rootURL: `${PUBLIC_PATH}/playground/lib/`
      });
      default_interpreter = this.pypy_interpreter;
    }

    this.pypyjs = this.pypy_interpreter.ready().then(() => {
      return this.pypy_interpreter.exec(`
import graphene
import js
from graphql.execution.executors.sync import SyncExecutor
from graphql.error import GraphQLError, format_error

def get_wrapped(f):
    if hasattr(f, 'func_closure') and f.func_closure:
        return get_wrapped(f.func_closure[0].cell_contents)
    return f

class TrackResolver(SyncExecutor):
    @staticmethod
    def execute(fn, *args, **kwargs):
        if fn.__module__ == '__main__':
            line = get_wrapped(fn).func_code.co_firstlineno
            js.globals.markLine(line-2)
        return fn(*args, **kwargs)

__graphene_executor = TrackResolver()
`);
    }).then(() => {
      this.setState({pypyjs: true});
      this.createSchema(this.props.initialSchema);
    }).then(() => {
      this.setState({response:'"Execute the query for see the results"'});
    });

    window.markLine = (lineNo) => {
      this.markLine(lineNo);
    }

    this.editor = CodeMirror(ReactDOM.findDOMNode(this.refs.schemaCode), {
      value: this.props.initialSchema,
      mode:  "python",
      theme: "graphene",
      lineNumbers: true,
      tabSize: 4,
      indentUnit: 4,
      gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
      lint: {
        errors: [],
      },
    });
    this.editor.on("change", this.onEditorChange.bind(this));
  }
  onEditorChange() {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
    }

    this.changeTimeout = setTimeout(() =>
      this.updateSchema()
    , 500);
  }
  updateSchema() {
    var value = this.editor.getValue();

    if (this.props.onEditSchema) {
      if (value != this.props.initialSchema) {
        this.props.onEditSchema(value);
      }
    }

    this.createSchema(value);
  }
  createSchema(code) {
    if (this.previousCode == code) return;
    console.log('createSchema');
    this.validSchema = null;
    this.pypyjs.then(() => {
      return this.pypy_interpreter.exec(`
schema = None
${code}
assert schema, 'You have to define a schema'
`)
    }).then(() => {
      console.log('NO ERRORS');
      this.removeErrors();
      this.validSchema = true;
    }, (err) => {
      this.editor.options.lint.errors = [];
      console.log('ERRORS', err);
      this.logError(err);
      this.validSchema = false;
      this.setState({schema: schema})
    }).then(this.updateGraphiQL.bind(this));
    this.previousCode = code;
  }
  updateGraphiQL() {
    if (this.validSchema) {
      const fetch = this.fetcher({ query: introspectionQuery });
      fetch.then( result => {
        const schema = buildClientSchema(result.data);
        this.setState({schema});
      })
    }
  }
  logError(error) {
    var lines = error.trace.split('\n');
    var file_errors = lines.map((errorLine) => {
      return errorLine.match(/File "<string>", line (\d+)/);
    }).filter((x) => !! x);
    if (!file_errors.length) return;
    var line = parseInt(file_errors[file_errors.length-1][1]);
    error.line = line-3;
    this.editor.options.lint.errors.push(error);
    CodeMirror.signal(this.editor, 'change', this.editor);
  }
  removeErrors() {
    this.editor.options.lint.errors = [];
    CodeMirror.signal(this.editor, 'change', this.editor);
  }
  fetcher (graphQLParams) {
    if (!this.validSchema) {
      return badSchemaFetcher(arguments);
    }
    return this.execute(graphQLParams.query, graphQLParams.variables);
  }
  execute(query, variables) {
    // console.log('execute', query);
    return this.pypyjs.then(() => {
      var x = `
import json
variables = json.loads('''${variables || "{}"}''')
result = schema.execute('''${query}''', variable_values=variables, executor=__graphene_executor)
result_dict = {};
if result.errors:
  result_dict['errors'] = [format_error(e) for e in result.errors]
if result.data:
  result_dict['data'] = result.data
result_json = json.dumps(result_dict)
`;
      // console.log(x)
      return this.pypy_interpreter.exec(x)
    }
    ).then(() =>
      this.pypy_interpreter.get(`result_json`)
    ).then((data) => {
      var json_data = JSON.parse(data);
      return json_data;
    });
  }
  markLine(lineNo) {
    console.log(lineNo, this.editor);
    var hlLine = this.editor.addLineClass(lineNo, "text", "activeline");
    // var mark = this.editor.markText({line: lineNo, ch: 0}, {line: lineNo, ch: 10}, {className: "called-function"});
    setTimeout(() => {
        this.editor.removeLineClass(lineNo, "text", "activeline");
    }, 1200);
  }
  render() {
    console.log('render', this.state.pypyjs);
    return (
      <div className="playground">
        {!this.state.pypyjs?<div className="loading" />:null}
        <div className="playground-schema">
          <header className="playground-schema-header">
            <Link to="/" className="editor-graphene-logo">
              <Logo />
            </Link>
          </header>
          <div className="playground-schema-editor" ref="schemaCode" />
        </div>
        <div className="playground-graphiql">
          <GraphiQL ref="graphiql" fetcher={this.fetcher.bind(this)} schema={this.state.schema} response={this.state.response} onEditQuery={this.props.onEditQuery} query={this.props.query}/>
        </div>
      </div>
    );
  }
}
