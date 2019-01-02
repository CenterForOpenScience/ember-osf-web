import OsfSerializer from './osf-serializer';

export default class <%= classifiedModuleName %>Serializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName %>Serializer;
    } // eslint-disable-line semi
}
