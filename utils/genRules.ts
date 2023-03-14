import { type RuleItem } from 'async-validator';
export const genRequiredRule = (message: string): RuleItem => {
    return {
        required: true,
        message,
        trigger: ['blur','change'],
        transform(value: string) {
            if (!value) return false;
            return value.trim();
        }
    } as RuleItem
}

interface genRulesType {
    key: string | symbol,
    message: string,
    rules: RuleItem[]
}

export const genRules = ({ key, message, rules }: genRulesType): Record<string | symbol, RuleItem[]> => ({
    [key]: [
        genRequiredRule(message),
        ...rules
    ]
})