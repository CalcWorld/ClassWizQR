# ClassWiz QR

Standalone ClassWiz QR Code parser, no CASIO server needed.

GitHub: <https://github.com/CalcWorld/ClassWizQR>

Online Demo: <https://cwqr.pages.dev>

API Documentation: <https://cwqr.pages.dev/api>

[A detailed explanation of how QR works on ClassWiz (Chinese Only)](https://blog.ca510.com/classwiz-qr-feature-and-data-structure)

[ClassWiz QR 功能原理详解](https://blog.ca510.com/classwiz-qr-feature-and-data-structure)

## Installation

```bash
npm install classwiz-qr
```

```js
import { ClassWizQR, parseUrl } from 'classwiz-qr';
```

## Implemented Features

- Internationalization (i18n) implemented
- Optimized adaptations for specific calculator models, such as JP models
- Support for ClassWiz EX, ClassWiz CW and ClassWiz CW 2nd edition series calculators
- Detailed information on the calculator model, settings, and active modes or errors
- Natural display input and output rendered as LaTeX formulas in Calculate, Complex, Verify and other modes
- LaTeX and tabular representation of equations and results in Equation, Inequality, and Ratio modes
- LaTeX and tabular representation of vector and matrix data
- Data entered in Spreadsheet, Table, Distribution, and Statistics modes, with CSV export support
- Defined functions, table range and variables in Table mode
- Supports showing Algorithm mode commands in LaTeX, plain text, and Scratch block formats

## Wiki

See <https://github.com/CalcWorld/ClassWizQR/wiki>

## API

Send the decoded ClassWiz QR URL to the hosted API as JSON:

```bash
curl --request POST 'https://cwqr.pages.dev/api' \
  --header 'Content-Type: application/json' \
  --data '{
    "url": "http://wes.casio.com/math/index.php?q=I-234F+U-000000000000+M-X100000000+S-05099",
    "lang": "en"
  }'
```

The response uses a consistent envelope: `{"code":"success","data":{...}}` on success, or `{"code":"error","msg":"..."}` when parsing fails. The fields inside `data` depend on the calculator mode. Supported language codes include `en`, `zh`, `fr`, and `vi`.

You can also replace `http://wes.casio.com` in a QR URL with `https://cwqr.pages.dev` and request JSON directly:

```bash
curl 'https://cwqr.pages.dev/math/index.php?q=I-234F+U-000000000000+M-X100000000+S-05099' \
  --header 'Accept: application/json' \
  --header 'Accept-Language: en'
```

The `/math/`, `/ncal/`, and `/calc/` paths accept `GET` requests. Browsers normally send an `Accept` header beginning with `text/html`, so opening one directly redirects to the visual parser. Set `Accept: application/json` explicitly to receive JSON.

See the [API documentation](https://cwqr.pages.dev/api) for request parameters and response details.

## Reference

| Math Template                                                | Code                                   |
|--------------------------------------------------------------|----------------------------------------|
| $${XX}   \dfrac {YY} {ZZ} $$                                 | 18 1F 1D 1A XX 1B 1A YY 1B 1A ZZ 1B 1E |
| $$\dot{X}\dot{X} \ \ \overline{XX} \ \ \_(XX\_)$$            | 2F 1A XX 1B                            |
| $$\displaystyle \sum_{x=YY}^{ZZ}{(XX)} $$                    | 50 1A XX 1C YY 1C ZZ 1B                |
| $$\displaystyle \int_{YY}^{ZZ}{XX}\mathrm{d}x $$             | 51 1A XX 1C YY 1C ZZ 1B                |
| $$\dfrac{\mathrm{d}}{\mathrm{d}x}{(XX)}\Bigg\vert\_{x=YY} $$ | 52 1A XX 1C YY 1B                      |
| $$\displaystyle \prod_{x=YY}^{ZZ}{(XX)} $$                   | 53 1A XX 1C YY 1C ZZ 1B                |
| $$\left \vert XX \right \vert $$                             | 68 1A XX 1B                            |
| $$e^{XX} $$                                                  | 72 1A XX 1B                            |
| $$10^{XX} $$                                                 | 73 1A XX 1B                            |
| $$\sqrt{XX} $$                                               | 74 1A XX 1B                            |
| $$\log_{XX}{(YY)} $$                                         | 7D 1A XX 1C YY 1B                      |
| $$\dfrac{XX} {YY} $$                                         | C8 1D 1A XX 1B 1A YY 1B 1E             |
| $$\square^{XX} $$                                            | $\square$ C9 1A XX 1B                  |
| $$\sqrt[XX]{YY} $$                                           | CA 1D 1A XX 1B 1A YY 1B 1E             |

## License

- [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0.html)
