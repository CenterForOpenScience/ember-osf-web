declare module 'ember-cp-validations/validators/base' {
    import EmberObject from '@ember/object';
    import DS from 'ember-data';

    type validateResult = string | true;

    class BaseValidator extends EmberObject {
        createErrorMessage(type: string, value: any, options?: object): string;

        getDependentsFor(attribute: string, options?: object): string[];

        validate(...args: any[]): validateResult | Promise<validateResult>;
    }

    export = BaseValidator;
}
