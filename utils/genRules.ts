import { type RuleItem } from 'async-validator';

interface genRequiredRuleOption {
  min: number;
  max: number;
  required: boolean;
  type: string;
  pattern: string | RegExp;
}
export const genRequiredRule = (
  message: string,
  opt?: Partial<genRequiredRuleOption>,
): RuleItem => {
  const {
    min, max, pattern, type = 'string', required = true,
  } = opt || {};
  return {
    required,
    message,
    pattern,
    type,
    min,
    max,
    trigger: ['blur', 'change'],
    transform(value: string) {
      if (value === null || value === undefined) return '';
      return value.trim();
    },
  } as RuleItem;
};

interface genRulesType {
  key: string | symbol;
  message: string;
  rules: RuleItem[];
}

export const genRules = ({
  key,
  message,
  rules,
}: genRulesType): Record<string | symbol, RuleItem[]> => ({
  [key]: [genRequiredRule(message), ...rules],
});
