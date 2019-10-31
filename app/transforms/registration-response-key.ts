import DS from 'ember-data';

const { Transform } = DS;

export default class RegistrationResponseKeyTransform extends Transform {
    deserialize(value: any) {
        if (value) {
            return value.replace(/\./g, '|');
        }
        return value;
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'registration-response-key': {};
    } // eslint-disable-line semi
}
