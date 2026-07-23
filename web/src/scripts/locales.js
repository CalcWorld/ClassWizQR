function normalizeLocale(locale) {
  return String(locale || '').trim().replaceAll('_', '-');
}

function getLocaleCandidate(code) {
  try {
    return {
      code,
      locale: new Intl.Locale(normalizeLocale(code)).maximize(),
    };
  } catch {
    return null;
  }
}

export function matchSupportedLocale(requestedLocale, supportedLocales, fallback = 'en') {
  const normalizedRequest = normalizeLocale(requestedLocale);
  const normalizedRequestLower = normalizedRequest.toLocaleLowerCase();
  const exactMatch = supportedLocales.find(
    code => normalizeLocale(code).toLocaleLowerCase() === normalizedRequestLower,
  );
  if (exactMatch) return exactMatch;

  const requestedCandidate = getLocaleCandidate(normalizedRequest);
  const supportedCandidates = supportedLocales
    .map(getLocaleCandidate)
    .filter(Boolean);

  if (requestedCandidate) {
    const regionalMatch = supportedCandidates.find(({ locale }) => (
      locale.language === requestedCandidate.locale.language
      && locale.region === requestedCandidate.locale.region
    ));
    if (regionalMatch) return regionalMatch.code;

    const languageMatch = supportedCandidates.find(
      ({ locale }) => locale.language === requestedCandidate.locale.language,
    );
    if (languageMatch) return languageMatch.code;
  }

  return supportedLocales.find(
    code => normalizeLocale(code).toLocaleLowerCase() === normalizeLocale(fallback).toLocaleLowerCase(),
  ) || fallback;
}
