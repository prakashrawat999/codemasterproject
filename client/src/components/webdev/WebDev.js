import React from 'react'
import { NavLink } from 'react-router-dom'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/moxer.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/comment/continuecomment.js'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/css-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import './web.css';


export default function Editor(props) {
  const {
    language,
    displayName,
    value,
    onChange
  } = props

  function handleChange(editor, data, value) {
    onChange(value)
  }

  return (
    <div className="editor-container">
      <div className="editor-title">
        {displayName}
        <h4>
        <NavLink to="/rooms">
        🏠
        </NavLink>
        </h4>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: 'moxer',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          javascripthint: true,
          htmlhint: true,
          csshint: true,
          comment: true,
          continuecomment: true,
        }}
      />
    </div>
  )
}
