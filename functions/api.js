import { handelApiRequest, Response_ } from './_utils.js';

export async function onRequestPost(context) {
  try {
    const { lang, url } = await context.request.json();
    return handelApiRequest(url, lang);
  } catch (e) {
    console.error(e);
    return Response_.redirect('/api');
  }
}
