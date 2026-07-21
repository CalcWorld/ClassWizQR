const escapeElement = document.createElement('div');

export function escapeHtml(value) {
  escapeElement.textContent = String(value ?? '');
  return escapeElement.innerHTML;
}

export function renderTable(
  {
    headers = [],
    rows = [],
    classes = 'content preview-table',
    rowNumbers = false,
    transpose = false,
    renderCell = escapeHtml,
  }
) {
  const head = headers.length
    ? `<thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`
    : '';
  const body = rows.map((row, rowIndex) => `<tr>${
    rowNumbers ? `<td>${rowIndex + 1}</td>` : ''
  }${row.map(value => `<td>${renderCell(value)}</td>`).join('')}</tr>`).join('');

  return `<div class="table-scroll"><table class="${classes}">${head}<tbody${transpose ? ' class="transpose"' : ''}>${body}</tbody></table></div>`;
}

export function renderCalcSection(id, title, content) {
  return `<div class="calc-result" id="${id}"><div class="title">${escapeHtml(title)}</div>${content}</div>`;
}

export function renderDownloadButton(key, label) {
  return `<button class="download" data-download="${key}">${escapeHtml(label)}</button>`;
}

