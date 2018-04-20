interface ValidateOptions {
    on?: string[];
    excludes?: string[];
}

interface Validations {
    validations: any;

    validate(options?: ValidateOptions, isAsync?: false): any;
    validate(options: ValidateOptions, isAsync: true): Promise<any>;

    validateSync(options?: ValidateOptions): any;

    validateAttribute(attribute: string, value: any): Promise<any>;
}

declare module 'ember-cp-validations' {
    export function buildValidations(validations: any, globalOptions?: any): Validations;
    export function validator(attrName: string, message: any): any;
}
