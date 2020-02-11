export interface ValidationResult {
    type?: string;
    value?: object;
    context: {
        type: string,
        translationArgs?: Record<string, string|number>,
    };
}

export interface RawValidationResult extends ValidationResult {
    message: string;
}

export default function buildMessage(key: tring, result: ValidationResult): string | RawValidationResult;
