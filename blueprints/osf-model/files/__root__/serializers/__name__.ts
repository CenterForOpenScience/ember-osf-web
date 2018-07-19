import OsfSerializer from './osf-serializer';

export default class <%= classifiedModuleName %>Serializer extends OsfSerializer {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName %>Serializer;
    }
}
