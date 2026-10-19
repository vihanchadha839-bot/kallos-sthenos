export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const lbToKg = (lb: number) => lb * KG_PER_LB;

export function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / CM_PER_IN;
  let ft = Math.floor(totalIn / 12);
  let inch = Math.round((totalIn - ft * 12) * 10) / 10;
  if (inch >= 12) { ft += 1; inch = 0; }
  return { ft, inch };
}
export const ftInToCm = (ft: number, inch: number) => (ft * 12 + inch) * CM_PER_IN;

export const round1 = (n: number) => Math.round(n * 10) / 10;
