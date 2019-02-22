interface ValidationError {
    attribute: string;
    message: string;
    parentAttribute: string;
    type: string;
}

interface GlobalValidations {
    attrs: {
        [attrName: string]: ResultCollection;
    };
    validatableAttributes: string[];
}

export interface ResultCollection {
    attribute: string;
    error?: ValidationError;
    errors: ValidationError[];
    hasWarnings: boolean;
    isAsync: boolean;
    isDirty: boolean;
    isInvalid: boolean;
    isTruelyInvalid: boolean;
    isValid: boolean;
    isValidating: boolean;
    message?: string;
    messages: string[];
    options: any;
    warning?: ValidationError;
    warningMessage?: string;
    warningMessages: string[];
    warnings: ValidationError[];
}

interface ValidateOptions {
    on?: string[];
    excludes?: string[];
}

interface Validations {
    validations: GlobalValidations & ResultCollection;

    validate(options?: ValidateOptions, isAsync?: false): any;
    validate(options: ValidateOptions, isAsync: true): Promise<any>;

    validateSync(options?: ValidateOptions): any;

    validateAttribute(attribute: string, value: any): Promise<any>;
}

export function buildValidations(validations: any, globalOptions?: any): Validations;
export function validator(attrName: string, options?: any): any;
