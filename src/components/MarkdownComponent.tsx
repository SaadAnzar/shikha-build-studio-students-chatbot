import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeKatex from "rehype-katex"

import "katex/dist/katex.min.css"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

type MCtype = {
  content: string
}

const MarkdownComponent = ({ content }: MCtype) => {
  return (
    <Markdown
      remarkPlugins={[[remarkGfm], [remarkMath]]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || "")
          return match ? (
            <SyntaxHighlighter
              // {...rest}
              PreTag="div"
              language={match[1]}
              style={atomDark}
              // {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </Markdown>
  )
}

export default MarkdownComponent
