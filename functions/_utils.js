import { ClassWizQR } from '../src/index.js';

export class Response_ {
  static redirect(url) {
    return new Response('', {
      status: 302,
      headers: {
        Location: url,
      },
    });
  }

  static json(data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }

  static jsonSuccess(data) {
    return this.json({
      code: 'success',
      data,
    });
  }

  static jsonError(msg) {
    return this.json({
      code: 'error',
      msg,
    });
  }
}

export const handelApiRequest = (url, lang) => {
  try {
    const qr = new ClassWizQR();
    const res = qr.setUrl(url).setLanguage(lang).getResult();
    return Response_.jsonSuccess(res);
  } catch (e) {
    return Response_.jsonError(e.message);
  }
}

export const handelRequest = (context) => {
  const headers = context.request.headers;
  const url = context.request.url;
  const accept = headers.get('accept');
  if (accept.startsWith('text/html')) {
    return Response_.redirect(`/#${url}`);
  }
  const lang = headers.get('accept-language')?.slice(0, 2) || 'en';
  return handelApiRequest(url, lang);
}
