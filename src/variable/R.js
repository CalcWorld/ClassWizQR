import { ParseVariable } from "./index.js";

export const ParseAns = (ans) => {
  const ans1 = ans.slice(0, ans.length / 2);
  const ans2 = ans.slice(ans.length / 2);
  const [ans1Latex, ans1Decimal] = new ParseVariable(ans1).get();
  const [ans2Latex, ans2Decimal] = new ParseVariable(ans2).get();
  return [
    { name: 'AnsPart1', latex: ans1Latex, decimal: ans1Decimal },
    { name: 'AnsPart2', latex: ans2Latex, decimal: ans2Decimal }
  ];
  // if (ans2Decimal.eq(0)) {
  //   return { result: ans1Latex, ans1Latex, realDec: ans1Decimal };
  // } else if (ans2Decimal.gt(0)) {
  //   return { result: `${ans1Latex} +${ans2Latex}i`, ans1Latex, ans2Latex, ans1Decimal, ans2Decimal };
  // } else {
  //   return { result: `${ans1Latex} ${ans2Latex}i`, ans1Latex, ans2Latex, ans1Decimal, ans2Decimal };
  // }
}
