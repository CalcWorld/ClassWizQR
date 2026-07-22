function renderValue(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'object' && 'type' in value && 'props' in value) return value;
  return String(value);
}

export default function PreviewTable({
                                       headers = [],
                                       rows = [],
                                       className = 'content preview-table',
                                       rowNumbers = false,
                                       transpose = false,
                                     }) {
  return (
    <div class="table-scroll">
      <table class={className}>
        {headers.length > 0 && (
          <thead>
          <tr>
            {headers.map((header, index) => <th key={index}>{renderValue(header)}</th>)}
          </tr>
          </thead>
        )}
        <tbody class={transpose ? 'transpose' : undefined}>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {rowNumbers && <td>{rowIndex + 1}</td>}
            {row.map((value, cellIndex) => <td key={cellIndex}>{renderValue(value)}</td>)}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
