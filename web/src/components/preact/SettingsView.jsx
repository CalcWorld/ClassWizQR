import PreviewTable from './PreviewTable.jsx';

export default function SettingsView({ result, t }) {
  if (!result.setup) return null;

  return (
    <PreviewTable
      headers={[t('settings-key'), t('settings-value')]}
      rows={result.setup.map(item => [item.name, item.value])}
    />
  );
}
