export const WEIGHTS = {
  intercept: -1.2,
  income: 0.0008,
  age: 0.01,
  loan_amount: -0.0009,
  debt_ratio: -2.5
};

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function scoreApplicant(features) {
  const linear =
    WEIGHTS.intercept +
    WEIGHTS.income * features.income +
    WEIGHTS.age * features.age +
    WEIGHTS.loan_amount * features.loan_amount +
    WEIGHTS.debt_ratio * features.debt_ratio;

  const prob = sigmoid(linear);

  const contributions = [
    { name: 'income', weight: WEIGHTS.income, value: features.income, contrib: WEIGHTS.income * features.income },
    { name: 'age', weight: WEIGHTS.age, value: features.age, contrib: WEIGHTS.age * features.age },
    { name: 'loan_amount', weight: WEIGHTS.loan_amount, value: features.loan_amount, contrib: WEIGHTS.loan_amount * features.loan_amount },
    { name: 'debt_ratio', weight: WEIGHTS.debt_ratio, value: features.debt_ratio, contrib: WEIGHTS.debt_ratio * features.debt_ratio }
  ];

  return { prob, linear, contributions };
}
