import React from 'react';
import MarkdownEditor from "@uiw/react-markdown-editor";

const FormattedText = (props) => {
    return <MarkdownEditor.Markdown
          source={props.text.replace(/\\n/g, "\n")}
          height="200px"
          rehypeRewrite={(node, index, parent) => {
            if (
              node.tagName === "a" &&
              parent &&
              /^h(1|2|3|4|5|6)/.test(parent.tagName)
            ) {
              parent.children = parent.children.slice(1);
            }
          }}
        />
}

export default FormattedText;