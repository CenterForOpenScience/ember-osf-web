interface Validations {
    validations: any;
}

declare module 'ember-cp-validations' {
    export function buildValidations(validations: any, globalOptions?: any): Validations;
    export function validator(attrName: string, message: any): any;
}
