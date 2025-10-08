export default function stripImportAttributesLoader(source) {
  return source.replace(/with\s*\{[^}]+}/g, '');
}
