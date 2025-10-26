# ClassWiz QR

Standalone ClassWiz QR Code parser, no CASIO server needed.

GitHub: <https://github.com/CalcWorld/ClassWizQR>

Online Demo: <https://cwqr.pages.dev>

[A detailed explanation of how QR works on ClassWiz (Chinese Only)](https://blog.ca510.com/classwiz-qr-feature-and-data-structure)

[ClassWiz QR 功能原理详解](https://blog.ca510.com/classwiz-qr-feature-and-data-structure)

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

## Todo

- [x] ~~Algorithm mode~~
- [x] ~~MathBox mode~~
- [ ] `W` data in Graph mode
- [x] ~~Refactor i18n~~
- [ ] Optimized adaptations for FR, DE, CE, SP, and other models

## License

- [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
