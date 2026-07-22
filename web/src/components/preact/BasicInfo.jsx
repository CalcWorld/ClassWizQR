import PreviewTable from './PreviewTable.jsx';

export default function BasicInfo({ result, t }) {
  const { model, mode, format } = result;
  if (!model || !mode) return null;

  const rows = [
    [t('mode-main'), mode.mainName],
    [t('mode-sub'), mode.subName || t('mode-na')],
    ...(format ? [
      [t('format-display'), format.displayName],
      [t('format-store'), format.storeName],
    ] : []),
    [t('model-series'), model.type],
    [t('model-key'), model.name],
    [t('model-diag'), `${model.prefix}-${model.id} Ver${model.version}`],
    [t('model-sn'), model.serialNumber],
  ];

  return <PreviewTable rows={rows} className="preview-table" transpose/>;
}
