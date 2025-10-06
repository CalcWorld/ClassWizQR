import { ClassWizQR } from '../src/index.js';

export class Response_ {
  static html(data) {
    return new Response(data, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
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

export const handelRequest = (context) => {
  try {
    const qr = new ClassWizQR();
    const res = qr.setUrl(context.request.url).getResult();
    return Response_.jsonSuccess(res);
  } catch (e) {
    return Response_.jsonError(e.message);
  }
}
