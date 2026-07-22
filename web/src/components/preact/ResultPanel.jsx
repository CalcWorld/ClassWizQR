export default function ResultPanel({ title, children }) {
  return (
    <details open>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
