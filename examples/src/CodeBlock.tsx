interface CodeBlockProps {
  source: string;
}

/** Collapsible source view so each example doubles as copy-pasteable documentation. */
export function CodeBlock({ source }: CodeBlockProps) {
  return (
    <details className="code-block">
      <summary>View source</summary>
      <pre>
        <code>{source.trim()}</code>
      </pre>
    </details>
  );
}
