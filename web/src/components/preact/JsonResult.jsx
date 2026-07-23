import { useEffect, useRef } from 'preact/hooks';
import { copyToClipboard, elementSelection } from '../../scripts/downloads.js';
import { matchSupportedLocale } from '../../scripts/locales.js';

const JSONEDITOR_LANGUAGES = [
  'en',
  'es',
  'zh-CN',
  'pt-BR',
  'tr',
  'ja',
  'fr-FR',
  'de',
  'ru',
  'ko',
];

function formatJsonPath(path) {
  return path.reduce((result, segment) => {
    if (typeof segment === 'number') return `${result}[${segment}]`;
    return /^[A-Za-z_$][\w$]*$/.test(segment)
      ? `${result}.${segment}`
      : `${result}[${JSON.stringify(segment)}]`;
  }, 'cwqr');
}

function formatClipboardValue(value) {
  return value !== null && typeof value === 'object'
    ? JSON.stringify(value, null, 2)
    : String(value);
}

export default function JsonResult({ value, language }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const valueRef = useRef(value);
  const editorLanguage = matchSupportedLocale(language, JSONEDITOR_LANGUAGES);

  valueRef.current = value;

  useEffect(() => {
    let disposed = false;

    async function createEditor() {
      const { default: JSONEditor } = await import('jsoneditor/dist/jsoneditor-minimalist.js');
      if (disposed || !containerRef.current) return;

      const editor = new JSONEditor(containerRef.current, {
        mode: 'view',
        name: 'cwqr',
        language: editorLanguage,
        onEvent: async (node, event) => {
          if (event.type !== 'click') return;

          const isValueClick = event.target.closest('.jsoneditor-value');
          const nodeValue = Object.hasOwn(node, 'value')
            ? node.value
            : node.path.reduce((current, segment) => current[segment], editor.get());
          const text = isValueClick
            ? formatClipboardValue(nodeValue)
            : formatJsonPath(node.path);

          await copyToClipboard(text);
          elementSelection(event.target);
        },
        mainMenuBar: false,
      });

      editorRef.current = editor;
      editor.set(valueRef.current);
      editor.expandAll();
    }

    createEditor();

    return () => {
      disposed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [editorLanguage]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.set(value);
    editorRef.current.expandAll();
  }, [value]);

  return <div ref={containerRef}/>;
}
