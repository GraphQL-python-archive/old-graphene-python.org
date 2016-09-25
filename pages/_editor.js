import React from 'react';
import ReactDOM from 'react-dom';
try {
    var CodeMirror = require('codemirror');
    require('codemirror/mode/python/python');
    require('codemirror/addon/lint/lint');
}
catch (e) {
    const CodeMirror = false;
}
// import AtvImg from 'react-atv-img';

const INITIAL_SCHEMA = `import graphene

class Query(graphene.ObjectType):
    hello = graphene.String()

    def resolve_hello(self, args, context, info):
        return 'World'


schema = graphene.Schema(query=Query)

schema.execute('''
  query {
    hello
  }
''')`

class Editor extends React.Component {
    componentDidMount() {
        console.log(CodeMirror);
        if (!CodeMirror) return;
        this.editor = CodeMirror(ReactDOM.findDOMNode(this.refs.schemaCode), {
            value: INITIAL_SCHEMA,
            mode:  "python",
            theme: "graphene",
            lineNumbers: true,
            readOnly: true,
            tabSize: 4,
            indentUnit: 4,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
            lint: {
                errors: [],
            },
        });
    }
    render() {
        // return (<AtvImg
        //   layers={[
        //     './code.png',
        //   ]}
        //   staticFallback="./code.png"
        //   isStatic={false}
        //   className={'main-editor'}
        //   style={{ width: 540, height: 360 }}
        // />);

        return  (
        <div className="main-editor">
            <div ref="schemaCode" />
        </div>);
    }
}
export default Editor;
