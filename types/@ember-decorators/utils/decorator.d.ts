declare module '@ember-decorators/utils/decorator' {
    export function decoratorWithParams(fn: (...params: any[]) => any): any;
    export function decoratorWithRequiredParams(fn: (...params: any[]) => any): any;
}
